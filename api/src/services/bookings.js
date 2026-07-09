import pool from '../db.js';
import { getBookingSettings } from './bookingSettings.js';
import { loadBookingMaterialsMap } from './bookingMaterials.js';
import {
  addDaysToDateStr,
  getTodayDateStr,
  getWeekdayInTimezone,
  zonedTimeToUtc,
} from '../utils/timezone.js';

export function generateReferenceCode() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GTA-${date}-${random}`;
}

export function normalizeServiceIds(input) {
  const raw = Array.isArray(input) ? input : input != null ? [input] : [];
  const ids = [...new Set(raw.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0))];
  if (ids.length === 0) {
    throw new Error('At least one service is required');
  }
  return ids;
}

function formatBookingService(row) {
  return {
    serviceId: row.service_id,
    serviceName: row.service_name,
    categoryName: row.category_name,
    durationMinutes: row.duration_minutes,
    price: row.price != null ? Number(row.price) : 0,
    sortOrder: row.sort_order,
  };
}

function serviceSummary(services) {
  if (!services?.length) return '';
  return services.map((service) => service.serviceName).join(', ');
}

export function formatBooking(row, services = [], materials = []) {
  if (!row) return null;
  const lineItems = services.length
    ? services
    : row.service_id
      ? [{
          serviceId: row.service_id,
          serviceName: row.service_name,
          categoryName: row.category_name,
          durationMinutes: row.duration_minutes,
          price: row.service_price != null ? Number(row.service_price) : 0,
          sortOrder: 0,
        }]
      : [];

  const servicePrice = row.service_price != null ? Number(row.service_price) : 0;
  const materialsTotal = row.materials_total != null ? Number(row.materials_total) : 0;
  const totalPrice = row.total_price != null ? Number(row.total_price) : servicePrice + materialsTotal;

  return {
    id: row.id,
    referenceCode: row.reference_code,
    status: row.status,
    serviceId: lineItems[0]?.serviceId ?? row.service_id,
    serviceName: serviceSummary(lineItems) || row.service_name,
    categoryName: lineItems[0]?.categoryName ?? row.category_name,
    services: lineItems,
    materials,
    serviceLocationId: row.service_location_id,
    locationName: row.location_name,
    locationRegion: row.location_region,
    locationParentName: row.location_parent_name,
    technicianUserId: row.technician_user_id,
    customerUserId: row.customer_user_id,
    technicianFirstName: row.technician_first_name,
    technicianLastName: row.technician_last_name,
    scheduledAt: row.scheduled_at,
    durationMinutes: row.duration_minutes,
    servicePrice,
    materialsTotal,
    totalPrice,
    clientFirstName: row.client_first_name,
    clientLastName: row.client_last_name,
    clientEmail: row.client_email,
    clientPhone: row.client_phone,
    clientAddress: row.client_address,
    notes: row.notes,
    bookingSource: row.booking_source || 'web',
    assignedAt: row.assigned_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const BOOKING_SELECT = `
  SELECT b.*,
         s.name AS service_name,
         sc.name AS category_name,
         l.name AS location_name,
         l.region AS location_region,
         pl.name AS location_parent_name,
         u.first_name AS technician_first_name,
         u.last_name AS technician_last_name
  FROM bookings b
  JOIN services s ON s.id = b.service_id
  JOIN service_categories sc ON sc.id = s.category_id
  JOIN service_locations l ON l.id = b.service_location_id
  LEFT JOIN service_locations pl ON pl.id = l.parent_id
  LEFT JOIN users u ON u.id = b.technician_user_id
`;

async function loadBookingServicesMap(bookingIds) {
  if (!bookingIds.length) return new Map();

  const result = await pool.query(
    `SELECT bs.booking_id, bs.service_id, bs.duration_minutes, bs.price, bs.sort_order,
            s.name AS service_name, sc.name AS category_name
     FROM booking_services bs
     JOIN services s ON s.id = bs.service_id
     JOIN service_categories sc ON sc.id = s.category_id
     WHERE bs.booking_id = ANY($1::uuid[])
     ORDER BY bs.sort_order, bs.id`,
    [bookingIds]
  );

  const map = new Map();
  for (const row of result.rows) {
    if (!map.has(row.booking_id)) map.set(row.booking_id, []);
    map.get(row.booking_id).push(formatBookingService(row));
  }
  return map;
}

export async function attachServicesToBookings(rows) {
  const bookingIds = rows.map((row) => row.id);
  const [servicesMap, materialsMap] = await Promise.all([
    loadBookingServicesMap(bookingIds),
    loadBookingMaterialsMap(bookingIds),
  ]);
  return rows.map((row) =>
    formatBooking(row, servicesMap.get(row.id) || [], materialsMap.get(row.id) || [])
  );
}

export async function getBookingById(id) {
  const result = await pool.query(`${BOOKING_SELECT} WHERE b.id = $1`, [id]);
  if (!result.rows[0]) return null;
  const [servicesMap, materialsMap] = await Promise.all([
    loadBookingServicesMap([id]),
    loadBookingMaterialsMap([id]),
  ]);
  return formatBooking(
    result.rows[0],
    servicesMap.get(id) || [],
    materialsMap.get(id) || []
  );
}

export async function getBookingByReference(referenceCode) {
  const result = await pool.query(`${BOOKING_SELECT} WHERE b.reference_code = $1`, [referenceCode]);
  if (!result.rows[0]) return null;
  const bookingId = result.rows[0].id;
  const [servicesMap, materialsMap] = await Promise.all([
    loadBookingServicesMap([bookingId]),
    loadBookingMaterialsMap([bookingId]),
  ]);
  return formatBooking(
    result.rows[0],
    servicesMap.get(bookingId) || [],
    materialsMap.get(bookingId) || []
  );
}

export async function getServicesSnapshot(serviceIds) {
  const result = await pool.query(
    `SELECT s.id, s.name, s.duration_minutes, s.price, sc.name AS category_name
     FROM services s
     JOIN service_categories sc ON sc.id = s.category_id
     WHERE s.id = ANY($1::int[])
     ORDER BY array_position($1::int[], s.id)`,
    [serviceIds]
  );

  if (result.rowCount !== serviceIds.length) {
    throw new Error('One or more selected services are invalid');
  }

  return result.rows.map((row) => ({
    serviceId: row.id,
    serviceName: row.name,
    categoryName: row.category_name,
    durationMinutes: row.duration_minutes,
    price: row.price != null ? Number(row.price) : 0,
  }));
}

export async function getTotalDurationMinutes(serviceIds) {
  const snapshot = await getServicesSnapshot(serviceIds);
  return snapshot.reduce((sum, service) => sum + service.durationMinutes, 0);
}

export async function getTotalServicePrice(serviceIds) {
  const snapshot = await getServicesSnapshot(serviceIds);
  return snapshot.reduce((sum, service) => sum + service.price, 0);
}

export async function getServiceDurationMinutes(serviceId) {
  return getTotalDurationMinutes([serviceId]);
}

export async function getServicePrice(serviceId) {
  return getTotalServicePrice([serviceId]);
}

function buildSlotTimes(dateStr, settings, durationMinutes) {
  const slots = [];
  const startMinutes = settings.startHour * 60;
  const endMinutes = settings.endHour * 60;

  for (let minute = startMinutes; minute + durationMinutes <= endMinutes; minute += durationMinutes) {
    const hour = Math.floor(minute / 60);
    const min = minute % 60;
    slots.push(zonedTimeToUtc(dateStr, hour, min, settings.timezone));
  }

  return slots;
}

function slotsOverlap(startA, durationA, startB, durationB) {
  const endA = new Date(startA.getTime() + durationA * 60000);
  const endB = new Date(startB.getTime() + durationB * 60000);
  return startA < endB && startB < endA;
}

const BLOCKING_STATUSES = ['pending', 'technician_assigned'];

async function findOverlappingBookings(technicianUserId, slotStart, durationMinutes, client = pool) {
  const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);
  const result = await client.query(
    `SELECT reference_code, status, scheduled_at, duration_minutes
     FROM bookings
     WHERE technician_user_id = $1
       AND status = ANY($2::text[])
       AND scheduled_at < $4::timestamptz
       AND (scheduled_at + (duration_minutes * INTERVAL '1 minute')) > $3::timestamptz`,
    [
      technicianUserId,
      BLOCKING_STATUSES,
      slotStart.toISOString(),
      slotEnd.toISOString(),
    ]
  );
  return result.rows;
}

export async function assertNoSchedulingConflict(
  technicianUserId,
  scheduledAt,
  durationMinutes,
  client = pool
) {
  const slotStart = new Date(scheduledAt);
  if (Number.isNaN(slotStart.getTime())) {
    throw new Error('Invalid scheduled time');
  }

  const conflicts = await findOverlappingBookings(technicianUserId, slotStart, durationMinutes, client);
  if (conflicts.length > 0) {
    throw new Error('Selected time slot is no longer available');
  }
}

async function lockTechnicianSchedule(technicianUserId, client = pool) {
  await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [technicianUserId]);
}

function isDateInBookingRange(dateStr, settings) {
  const todayStr = getTodayDateStr(settings.timezone);
  const maxDateStr = addDaysToDateStr(todayStr, settings.lookaheadDays, settings.timezone);
  return dateStr >= todayStr && dateStr <= maxDateStr;
}

export async function getAvailableSlots(technicianUserId, dateStr, serviceIds) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error('Invalid date');
  }

  const normalizedServiceIds = normalizeServiceIds(serviceIds);
  const settings = await getBookingSettings();
  const durationMinutes = await getTotalDurationMinutes(normalizedServiceIds);

  if (!isDateInBookingRange(dateStr, settings)) {
    return { slots: [], durationMinutes, settings };
  }

  const weekday = getWeekdayInTimezone(dateStr, settings.timezone);
  if (!settings.workingDays.includes(weekday)) {
    return { slots: [], durationMinutes, settings };
  }

  const dayStart = zonedTimeToUtc(dateStr, 0, 0, settings.timezone);
  const nextDateStr = addDaysToDateStr(dateStr, 1, settings.timezone);
  const dayEnd = zonedTimeToUtc(nextDateStr, 0, 0, settings.timezone);

  const bookingsResult = await pool.query(
    `SELECT scheduled_at, duration_minutes
     FROM bookings
     WHERE technician_user_id = $1
       AND status = ANY($2::text[])
       AND scheduled_at < $4::timestamptz
       AND (scheduled_at + (duration_minutes * INTERVAL '1 minute')) > $3::timestamptz`,
    [technicianUserId, BLOCKING_STATUSES, dayStart.toISOString(), dayEnd.toISOString()]
  );

  const existing = bookingsResult.rows.map((row) => ({
    start: new Date(row.scheduled_at),
    duration: row.duration_minutes,
  }));

  const now = new Date();
  const slots = buildSlotTimes(dateStr, settings, durationMinutes)
    .filter((slotStart) => {
      if (slotStart <= now) return false;
      return !existing.some((booking) =>
        slotsOverlap(slotStart, durationMinutes, booking.start, booking.duration)
      );
    })
    .map((slotStart) => slotStart.toISOString());

  return { slots, durationMinutes, settings };
}

export function parseServiceIdsFromQuery(query) {
  if (query.serviceIds) {
    return normalizeServiceIds(String(query.serviceIds).split(','));
  }
  if (query.serviceId) {
    return normalizeServiceIds(query.serviceId);
  }
  throw new Error('serviceIds is required');
}

function formatTechnicianRow(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    profileImageUrl: row.profile_image_url,
    yearsExperience: row.years_experience,
    bio: row.bio,
    expertiseCount: row.expertise_count,
    onboardingCompleted: row.onboarding_completed,
  };
}

export async function listQualifiedTechnicians(serviceIds, { requireOnboarding = true } = {}) {
  const normalizedServiceIds = normalizeServiceIds(serviceIds);
  const onboardingClause = requireOnboarding ? 'AND lp.onboarding_completed = true' : '';

  const result = await pool.query(
    `SELECT u.id, u.first_name, u.last_name, u.phone, u.profile_image_url,
            lp.years_experience, lp.bio, lp.onboarding_completed,
            COUNT(DISTINCT le.service_id)::int AS expertise_count
     FROM users u
     JOIN technician_profiles lp ON lp.user_id = u.id
     JOIN technician_expertise le ON le.user_id = u.id
     WHERE u.user_type = 'technician'
       AND u.status = 'active'
       ${onboardingClause}
       AND le.service_id = ANY($1::int[])
     GROUP BY u.id, lp.years_experience, lp.bio, lp.onboarding_completed
     HAVING COUNT(DISTINCT le.service_id) = $2
     ORDER BY lp.onboarding_completed DESC, u.first_name, u.last_name`,
    [normalizedServiceIds, normalizedServiceIds.length]
  );

  return result.rows.map(formatTechnicianRow);
}

export async function assertTechnicianAvailableForServices(
  technicianUserId,
  serviceIds,
  { requireOnboarding = true } = {}
) {
  const normalizedServiceIds = normalizeServiceIds(serviceIds);
  const result = await pool.query(
    `SELECT u.id, u.status, lp.onboarding_completed,
            COUNT(DISTINCT le.service_id)::int AS matched_services
     FROM users u
     JOIN technician_profiles lp ON lp.user_id = u.id
     JOIN technician_expertise le ON le.user_id = u.id AND le.service_id = ANY($2::int[])
     WHERE u.id = $1 AND u.user_type = 'technician' AND u.status = 'active'
     GROUP BY u.id, lp.onboarding_completed`,
    [technicianUserId, normalizedServiceIds]
  );

  if (result.rowCount === 0) {
    throw new Error('Selected technician is not available for these services');
  }
  if (!result.rows[0].onboarding_completed && requireOnboarding) {
    throw new Error('Selected technician has not completed onboarding');
  }
  if (result.rows[0].matched_services !== normalizedServiceIds.length) {
    throw new Error('Selected technician is not qualified for all selected services');
  }
}

export async function assertTechnicianAvailableForService(technicianUserId, serviceId) {
  return assertTechnicianAvailableForServices(technicianUserId, [serviceId]);
}

export async function assertSlotAvailable(technicianUserId, scheduledAt, serviceIds, client = pool) {
  const normalizedServiceIds = normalizeServiceIds(serviceIds);
  const slotStart = new Date(scheduledAt);
  if (Number.isNaN(slotStart.getTime()) || slotStart <= new Date()) {
    throw new Error('Scheduled time must be in the future');
  }

  const durationMinutes = await getTotalDurationMinutes(normalizedServiceIds);
  await assertNoSchedulingConflict(technicianUserId, slotStart, durationMinutes, client);

  const settings = await getBookingSettings();
  const dateStr = slotStart.toLocaleDateString('en-CA', { timeZone: settings.timezone });
  const { slots } = await getAvailableSlots(technicianUserId, dateStr, normalizedServiceIds);
  const slotTime = slotStart.getTime();
  if (!slots.some((iso) => new Date(iso).getTime() === slotTime)) {
    throw new Error('Selected time slot is no longer available');
  }
}

export async function insertBookingServices(bookingId, services, client = pool) {
  for (const [index, service] of services.entries()) {
    await client.query(
      `INSERT INTO booking_services (booking_id, service_id, duration_minutes, price, sort_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [bookingId, service.serviceId, service.durationMinutes, service.price, index]
    );
  }
}

export { BOOKING_SELECT, lockTechnicianSchedule, BLOCKING_STATUSES };
