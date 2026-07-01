import { Router } from 'express';
import pool from '../../db.js';
import { authenticate, requirePageAccess } from '../../middleware/auth.js';
import {
  BOOKING_STATUSES,
  VALID_BOOKING_TRANSITIONS,
} from '../../constants.js';
import {
  BOOKING_SELECT,
  assertTechnicianAvailableForServices,
  attachServicesToBookings,
  getBookingById,
  listQualifiedTechnicians,
  parseServiceIdsFromQuery,
} from '../../services/bookings.js';
import {
  computeLineTotal,
  formatBookingMaterial,
  parseQuantity,
  recomputeBookingTotals,
  resolveMaterialInput,
} from '../../services/bookingMaterials.js';
import { parsePrice } from '../../utils/currency.js';
import { sendBookingConfirmationEmail, sendBookingStatusEmail } from '../../services/email.js';
import { getActivationUrlForCustomerUser } from '../../services/customers.js';
import { getSuggestedMaterialsForServiceIds } from '../../services/serviceMaterialDefaults.js';
import {
  notifyBookingStatusChanged,
  notifyBookingTechnicianAssigned,
} from '../../services/notifications.js';

const router = Router();

router.get('/', authenticate, requirePageAccess('management.bookings'), async (req, res) => {
  const { status, search, page = '1', limit = '20' } = req.query;
  const pageNum = Math.max(1, Number(page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(limit) || 20));
  const offset = (pageNum - 1) * pageSize;

  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (status) {
    conditions.push(`b.status = $${paramIndex++}`);
    params.push(status);
  }

  if (search?.trim()) {
    conditions.push(`(
      b.reference_code ILIKE $${paramIndex}
      OR b.client_email ILIKE $${paramIndex}
      OR b.client_first_name ILIKE $${paramIndex}
      OR b.client_last_name ILIKE $${paramIndex}
      OR s.name ILIKE $${paramIndex}
      OR l.name ILIKE $${paramIndex}
      OR EXISTS (
        SELECT 1
        FROM booking_services bs
        JOIN services sx ON sx.id = bs.service_id
        WHERE bs.booking_id = b.id AND sx.name ILIKE $${paramIndex}
      )
    )`);
    params.push(`%${search.trim()}%`);
    paramIndex++;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(DISTINCT b.id)::int AS total
     FROM bookings b
     JOIN services s ON s.id = b.service_id
     JOIN service_locations l ON l.id = b.service_location_id
     ${where}`,
    params
  );

  const total = countResult.rows[0].total;
  const listParams = [...params, pageSize, offset];

  const result = await pool.query(
    `${BOOKING_SELECT}
     ${where}
     ORDER BY b.created_at DESC
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams
  );

  return res.json({
    bookings: await attachServicesToBookings(result.rows),
    pagination: {
      page: pageNum,
      limit: pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
});

router.get('/technicians', authenticate, requirePageAccess('management.bookings'), async (req, res) => {
  let serviceIds;
  try {
    serviceIds = parseServiceIdsFromQuery(req.query);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const technicians = await listQualifiedTechnicians(serviceIds, { requireOnboarding: false });
  return res.json({ technicians });
});

router.get('/:id', authenticate, requirePageAccess('management.bookings'), async (req, res) => {
  const booking = await getBookingById(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  const serviceIds = booking.services?.map((service) => service.serviceId) || [booking.serviceId];
  const suggestedMaterials = await getSuggestedMaterialsForServiceIds(serviceIds);
  return res.json({ booking, suggestedMaterials });
});

router.patch('/:id/technician', authenticate, requirePageAccess('management.bookings'), async (req, res) => {
  const { technicianUserId } = req.body;

  if (!technicianUserId) {
    return res.status(400).json({ error: 'technicianUserId is required' });
  }

  const existing = await pool.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
  if (existing.rowCount === 0) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const booking = existing.rows[0];
  if (![BOOKING_STATUSES.PENDING, BOOKING_STATUSES.TECHNICIAN_ASSIGNED].includes(booking.status)) {
    return res.status(400).json({
      error: 'Technician can only be changed for pending or assigned bookings',
    });
  }

  if (booking.technician_user_id === technicianUserId) {
    return res.status(400).json({ error: 'This technician is already assigned to the booking' });
  }

  const fullBooking = await getBookingById(req.params.id);
  const serviceIds = fullBooking.services?.map((service) => service.serviceId) || [fullBooking.serviceId];

  try {
    await assertTechnicianAvailableForServices(technicianUserId, serviceIds, {
      requireOnboarding: false,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const newStatus =
    booking.status === BOOKING_STATUSES.PENDING
      ? BOOKING_STATUSES.TECHNICIAN_ASSIGNED
      : booking.status;

  await pool.query(
    `UPDATE bookings
     SET technician_user_id = $1,
         status = $2,
         assigned_by = $3,
         assigned_at = NOW(),
         updated_at = NOW()
     WHERE id = $4`,
    [technicianUserId, newStatus, req.user.id, req.params.id]
  );

  const updated = await getBookingById(req.params.id);

  try {
    await sendBookingStatusEmail({
      booking: updated,
      status: BOOKING_STATUSES.TECHNICIAN_ASSIGNED,
    });
  } catch (emailError) {
    console.error('[admin/bookings] reassignment email failed:', emailError.message);
  }

  try {
    await notifyBookingTechnicianAssigned(updated, {
      actorUserId: req.user.id,
      previousTechnicianId: booking.technician_user_id,
    });
  } catch (notificationError) {
    console.error('[admin/bookings] reassignment notification failed:', notificationError.message);
  }

  return res.json({ message: 'Technician updated', booking: updated });
});

router.patch('/:id/status', authenticate, requirePageAccess('management.bookings'), async (req, res) => {
  const { status, technicianUserId } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const existing = await pool.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
  if (existing.rowCount === 0) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const booking = existing.rows[0];
  const allowed = VALID_BOOKING_TRANSITIONS[booking.status] || [];
  if (!allowed.includes(status)) {
    return res.status(400).json({
      error: `Cannot change status from ${booking.status} to ${status}`,
    });
  }

  let resolvedTechnicianId = technicianUserId || booking.technician_user_id;

  if (status === BOOKING_STATUSES.TECHNICIAN_ASSIGNED) {
    if (!resolvedTechnicianId) {
      return res.status(400).json({ error: 'A technician must be assigned for this status' });
    }
    const fullBooking = await getBookingById(req.params.id);
    const serviceIds = fullBooking.services?.map((service) => service.serviceId) || [fullBooking.serviceId];
    try {
      await assertTechnicianAvailableForServices(resolvedTechnicianId, serviceIds, {
        requireOnboarding: false,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  const assignedAt = status === BOOKING_STATUSES.TECHNICIAN_ASSIGNED ? new Date() : booking.assigned_at;
  const completedAt = status === BOOKING_STATUSES.COMPLETED ? new Date() : booking.completed_at;
  const assignedBy = status === BOOKING_STATUSES.TECHNICIAN_ASSIGNED ? req.user.id : booking.assigned_by;

  await pool.query(
    `UPDATE bookings
     SET status = $1,
         technician_user_id = COALESCE($2, technician_user_id),
         assigned_by = $3,
         assigned_at = $4,
         completed_at = $5,
         updated_at = NOW()
     WHERE id = $6`,
    [status, resolvedTechnicianId, assignedBy, assignedAt, completedAt, req.params.id]
  );

  const updated = await getBookingById(req.params.id);

  try {
    await sendBookingStatusEmail({ booking: updated, status });
  } catch (emailError) {
    console.error('[admin/bookings] status email failed:', emailError.message);
  }

  try {
    await notifyBookingStatusChanged(updated, {
      previousStatus: booking.status,
      actorUserId: req.user.id,
    });
  } catch (notificationError) {
    console.error('[admin/bookings] status notification failed:', notificationError.message);
  }

  return res.json({ message: 'Booking status updated', booking: updated });
});

router.post('/:id/materials', authenticate, requirePageAccess('management.bookings'), async (req, res) => {
  const bookingCheck = await pool.query('SELECT id FROM bookings WHERE id = $1', [req.params.id]);
  if (bookingCheck.rowCount === 0) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  let resolved;
  try {
    resolved = await resolveMaterialInput(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const { materialId, name, unit, quantity, unitPrice, lineTotal, notes } = {
    ...resolved,
    notes: req.body.notes?.trim() || null,
  };

  const result = await pool.query(
    `INSERT INTO booking_materials (
       booking_id, material_id, name, unit, quantity, unit_price, line_total, notes, added_by
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [req.params.id, materialId, name, unit, quantity, unitPrice, lineTotal, notes, req.user.id]
  );

  await recomputeBookingTotals(req.params.id);
  const booking = await getBookingById(req.params.id);

  return res.status(201).json({
    material: formatBookingMaterial(result.rows[0]),
    booking,
  });
});

router.patch('/:id/materials/:lineId', authenticate, requirePageAccess('management.bookings'), async (req, res) => {
  const existing = await pool.query(
    'SELECT * FROM booking_materials WHERE id = $1 AND booking_id = $2',
    [req.params.lineId, req.params.id]
  );
  if (existing.rowCount === 0) {
    return res.status(404).json({ error: 'Booking material not found' });
  }

  const row = existing.rows[0];
  const { materialId, name, unit, quantity, unitPrice, notes } = req.body;

  let resolvedName = name?.trim() || row.name;
  let resolvedUnit = unit?.trim() || row.unit;
  let resolvedQuantity = row.quantity;
  let resolvedUnitPrice = row.unit_price;

  if (quantity !== undefined) {
    try {
      resolvedQuantity = parseQuantity(quantity);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (unitPrice !== undefined) {
    try {
      resolvedUnitPrice = parsePrice(unitPrice);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if (materialId !== undefined && materialId !== row.material_id) {
    try {
      const fromCatalog = await resolveMaterialInput({
        materialId,
        name: resolvedName,
        unit: resolvedUnit,
        quantity: resolvedQuantity,
        unitPrice: resolvedUnitPrice,
      });
      resolvedName = fromCatalog.name;
      resolvedUnit = fromCatalog.unit;
      resolvedQuantity = fromCatalog.quantity;
      resolvedUnitPrice = fromCatalog.unitPrice;
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  const lineTotal = computeLineTotal(Number(resolvedQuantity), Number(resolvedUnitPrice));

  const result = await pool.query(
    `UPDATE booking_materials
     SET material_id = COALESCE($1, material_id),
         name = $2,
         unit = $3,
         quantity = $4,
         unit_price = $5,
         line_total = $6,
         notes = COALESCE($7, notes)
     WHERE id = $8 AND booking_id = $9
     RETURNING *`,
    [
      materialId !== undefined ? materialId : row.material_id,
      resolvedName,
      resolvedUnit,
      resolvedQuantity,
      resolvedUnitPrice,
      lineTotal,
      notes !== undefined ? (notes?.trim() || null) : null,
      req.params.lineId,
      req.params.id,
    ]
  );

  await recomputeBookingTotals(req.params.id);
  const booking = await getBookingById(req.params.id);

  return res.json({
    material: formatBookingMaterial(result.rows[0]),
    booking,
  });
});

router.delete('/:id/materials/:lineId', authenticate, requirePageAccess('management.bookings'), async (req, res) => {
  const result = await pool.query(
    'DELETE FROM booking_materials WHERE id = $1 AND booking_id = $2 RETURNING id',
    [req.params.lineId, req.params.id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Booking material not found' });
  }

  await recomputeBookingTotals(req.params.id);
  const booking = await getBookingById(req.params.id);

  return res.json({ message: 'Material removed from booking', booking });
});

router.post('/:id/resend-email', authenticate, requirePageAccess('management.bookings'), async (req, res) => {
  const booking = await getBookingById(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  try {
    if (booking.status === BOOKING_STATUSES.PENDING) {
      const activationUrl = await getActivationUrlForCustomerUser(booking.customerUserId);
      await sendBookingConfirmationEmail({ booking, activationUrl });
      return res.json({
        message: 'Booking confirmation email resent',
        emailType: 'confirmation',
        sentTo: booking.clientEmail,
      });
    }

    if ([BOOKING_STATUSES.TECHNICIAN_ASSIGNED, BOOKING_STATUSES.COMPLETED, BOOKING_STATUSES.CANCELLED].includes(booking.status)) {
      await sendBookingStatusEmail({ booking, status: booking.status });
      return res.json({
        message: 'Booking status email resent',
        emailType: 'status',
        sentTo: booking.clientEmail,
      });
    }

    return res.status(400).json({ error: 'No email template available for this booking status' });
  } catch (error) {
    console.error('[admin/bookings] resend email failed:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to resend email' });
  }
});

export default router;
