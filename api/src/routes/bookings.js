import { Router } from 'express';
import pool from '../db.js';
import { BOOKING_SOURCES, BOOKING_STATUSES, canAccessAdminPanel } from '../constants.js';
import { optionalAuthenticate } from '../middleware/auth.js';
import {
  assertTechnicianAvailableForServices,
  assertSlotAvailable,
  generateReferenceCode,
  getAvailableSlots,
  getBookingById,
  getBookingByReference,
  getServicesSnapshot,
  getTotalDurationMinutes,
  getTotalServicePrice,
  insertBookingServices,
  listQualifiedTechnicians,
  lockTechnicianSchedule,
  normalizeServiceIds,
  parseServiceIdsFromQuery,
} from '../services/bookings.js';
import { getBookingSettings } from '../services/bookingSettings.js';
import { resolveCustomerForBooking, lookupClientByEmail } from '../services/customers.js';
import { sendBookingConfirmationEmail } from '../services/email.js';
import { notifyBookingCreated } from '../services/notifications.js';

const router = Router();

router.get('/catalog', async (_req, res) => {
  const [servicesResult, locationsResult] = await Promise.all([
    pool.query(
      `SELECT c.id AS category_id, c.name AS category_name, c.sort_order AS category_sort,
              s.id, s.name, s.description, s.duration_minutes, s.price, s.sort_order
       FROM service_categories c
       JOIN services s ON s.category_id = c.id
       ORDER BY c.sort_order, s.sort_order, s.name`
    ),
    pool.query(
      `SELECT l.id, l.region, l.name, l.parent_id, l.sort_order,
              p.name AS parent_name
       FROM service_locations l
       LEFT JOIN service_locations p ON p.id = l.parent_id
       ORDER BY l.region, COALESCE(p.sort_order, l.sort_order), l.sort_order, l.name`
    ),
  ]);

  const categoriesMap = new Map();
  for (const row of servicesResult.rows) {
    if (!categoriesMap.has(row.category_id)) {
      categoriesMap.set(row.category_id, {
        id: row.category_id,
        name: row.category_name,
        sortOrder: row.category_sort,
        services: [],
      });
    }
    categoriesMap.get(row.category_id).services.push({
      id: row.id,
      name: row.name,
      description: row.description,
      durationMinutes: row.duration_minutes,
      price: row.price != null ? Number(row.price) : 0,
      sortOrder: row.sort_order,
    });
  }

  const locations = { gta: [], nearby: [] };
  for (const row of locationsResult.rows) {
    const item = {
      id: row.id,
      name: row.name,
      parentId: row.parent_id,
      parentName: row.parent_name,
      sortOrder: row.sort_order,
      label: row.parent_name ? `${row.name} (${row.parent_name})` : row.name,
    };
    if (row.region === 'gta') locations.gta.push(item);
    if (row.region === 'nearby') locations.nearby.push(item);
  }

  return res.json({
    categories: Array.from(categoriesMap.values()),
    locations,
    bookingSettings: await getBookingSettings(),
  });
});

router.get('/settings', async (_req, res) => {
  const settings = await getBookingSettings();
  return res.json({ settings });
});

router.get('/technicians', async (req, res) => {
  let serviceIds;
  try {
    serviceIds = parseServiceIdsFromQuery(req.query);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const technicians = await listQualifiedTechnicians(serviceIds, { requireOnboarding: true });
  return res.json({ technicians });
});

router.get('/client-lookup', async (req, res) => {
  const { email } = req.query;
  if (!email?.trim()) {
    return res.status(400).json({ error: 'email is required' });
  }

  try {
    const result = await lookupClientByEmail(email);
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/availability', async (req, res) => {
  const { technicianUserId, date } = req.query;
  if (!technicianUserId || !date) {
    return res.status(400).json({ error: 'technicianUserId and date are required' });
  }

  let serviceIds;
  try {
    serviceIds = parseServiceIdsFromQuery(req.query);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    const { slots, durationMinutes } = await getAvailableSlots(technicianUserId, date, serviceIds);
    return res.json({ slots, durationMinutes });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/', optionalAuthenticate, async (req, res) => {
  const {
    serviceIds: serviceIdsBody,
    serviceId,
    serviceLocationId,
    technicianUserId,
    scheduledAt,
    clientFirstName,
    clientLastName,
    clientEmail,
    clientPhone,
    clientAddress,
    notes,
  } = req.body;

  let serviceIds;
  try {
    serviceIds = normalizeServiceIds(serviceIdsBody ?? (serviceId != null ? [serviceId] : []));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  if (!serviceLocationId || !technicianUserId || !scheduledAt) {
    return res.status(400).json({ error: 'Service area, technician, and schedule are required' });
  }
  if (!clientFirstName?.trim() || !clientLastName?.trim() || !clientEmail?.trim()) {
    return res.status(400).json({ error: 'Client first name, last name, and email are required' });
  }

  const email = clientEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid client email is required' });
  }

  let servicesSnapshot;
  try {
    servicesSnapshot = await getServicesSnapshot(serviceIds);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const locationCheck = await pool.query('SELECT id FROM service_locations WHERE id = $1', [serviceLocationId]);
  if (locationCheck.rowCount === 0) {
    return res.status(400).json({ error: 'Invalid service area selected' });
  }

  try {
    await assertTechnicianAvailableForServices(technicianUserId, serviceIds);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const durationMinutes = await getTotalDurationMinutes(serviceIds);
  const servicePrice = await getTotalServicePrice(serviceIds);
  const primaryServiceId = serviceIds[0];
  const bookingSource = req.user && canAccessAdminPanel(req.user)
    ? BOOKING_SOURCES.ADMIN
    : BOOKING_SOURCES.WEB;

  let referenceCode = generateReferenceCode();
  let attempts = 0;
  while (attempts < 5) {
    const existing = await pool.query('SELECT id FROM bookings WHERE reference_code = $1', [referenceCode]);
    if (existing.rowCount === 0) break;
    referenceCode = generateReferenceCode();
    attempts += 1;
  }

  let customerResolution;
  let bookingId;

  await pool.query('BEGIN');
  try {
    await lockTechnicianSchedule(technicianUserId, pool);
    await assertSlotAvailable(technicianUserId, scheduledAt, serviceIds, pool);

    customerResolution = await resolveCustomerForBooking({
      email,
      firstName: clientFirstName,
      lastName: clientLastName,
      phone: clientPhone,
    });

    const result = await pool.query(
      `INSERT INTO bookings (
        reference_code, status, service_id, service_location_id, technician_user_id,
        customer_user_id, scheduled_at, duration_minutes, service_price, total_price,
        client_first_name, client_last_name, client_email, client_phone, client_address, notes,
        booking_source
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id`,
      [
        referenceCode,
        BOOKING_STATUSES.PENDING,
        primaryServiceId,
        serviceLocationId,
        technicianUserId,
        customerResolution.customerUserId,
        new Date(scheduledAt).toISOString(),
        durationMinutes,
        servicePrice,
        clientFirstName.trim(),
        clientLastName.trim(),
        email,
        clientPhone?.trim() || null,
        clientAddress?.trim() || null,
        notes?.trim() || null,
        bookingSource,
      ]
    );

    bookingId = result.rows[0].id;
    await insertBookingServices(bookingId, servicesSnapshot, pool);
    await pool.query('COMMIT');
  } catch (error) {
    await pool.query('ROLLBACK');
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Could not create customer account for this booking' });
    }
    if (
      error.message === 'Selected time slot is no longer available' ||
      error.message === 'Scheduled time must be in the future' ||
      error.message === 'At least one service is required' ||
      error.message === 'One or more selected services are invalid'
    ) {
      return res.status(400).json({ error: error.message });
    }
    throw error;
  }

  let booking = await getBookingByReference(referenceCode);
  if (!booking) {
    booking = await getBookingById(bookingId);
  }

  if (!booking) {
    return res.status(500).json({ error: 'Booking was created but could not be loaded' });
  }

  try {
    await sendBookingConfirmationEmail({
      booking,
      activationUrl: customerResolution.needsActivation ? customerResolution.activationUrl : null,
    });
  } catch (emailError) {
    console.error('[bookings] confirmation email failed:', emailError.message);
  }

  try {
    await notifyBookingCreated(booking);
  } catch (notificationError) {
    console.error('[bookings] notification failed:', notificationError.message);
  }

  return res.status(201).json({
    message: 'Booking submitted successfully',
    booking,
    bookingId,
    customerAccountCreated: customerResolution.needsActivation,
  });
});

router.get('/:referenceCode', async (req, res) => {
  const booking = await getBookingByReference(req.params.referenceCode);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  return res.json({ booking });
});

export default router;
