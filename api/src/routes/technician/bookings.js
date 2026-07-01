import { Router } from 'express';
import pool from '../../db.js';
import { authenticate, requireAdminPanelAccess } from '../../middleware/auth.js';
import {
  BOOKING_STATUSES,
  USER_TYPES,
  VALID_BOOKING_TRANSITIONS,
} from '../../constants.js';
import {
  attachServicesToBookings,
  getBookingById,
} from '../../services/bookings.js';
import {
  formatBookingMaterial,
  recomputeBookingTotals,
  resolveMaterialInput,
} from '../../services/bookingMaterials.js';
import { getSuggestedMaterialsForServiceIds } from '../../services/serviceMaterialDefaults.js';
import { sendBookingStatusEmail } from '../../services/email.js';
import { notifyBookingStatusChanged } from '../../services/notifications.js';

const router = Router();

async function assertTechnicianBooking(bookingId, technicianUserId) {
  const result = await pool.query(
    'SELECT id, status, technician_user_id FROM bookings WHERE id = $1',
    [bookingId]
  );
  if (result.rowCount === 0) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }
  const booking = result.rows[0];
  if (booking.technician_user_id !== technicianUserId) {
    const error = new Error('You are not assigned to this booking');
    error.status = 403;
    throw error;
  }
  return booking;
}

function requireTechnician(req, res, next) {
  if (req.user?.userType !== USER_TYPES.TECHNICIAN) {
    return res.status(403).json({ error: 'Technician access required' });
  }
  next();
}

router.get('/materials', authenticate, requireAdminPanelAccess, requireTechnician, async (_req, res) => {
  const result = await pool.query(
    `SELECT id, name, unit, default_unit_price AS default_unit_price, description
     FROM materials
     WHERE is_active = TRUE
     ORDER BY name`
  );
  return res.json({
    materials: result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      unit: row.unit,
      defaultUnitPrice: row.default_unit_price != null ? Number(row.default_unit_price) : 0,
      description: row.description,
    })),
  });
});

router.get('/bookings', authenticate, requireAdminPanelAccess, requireTechnician, async (req, res) => {
  const { status } = req.query;
  const conditions = ['b.technician_user_id = $1'];
  const params = [req.user.id];

  if (status) {
    params.push(status);
    conditions.push(`b.status = $${params.length}`);
  } else {
    conditions.push(`b.status = ANY($${params.length + 1}::text[])`);
    params.push([BOOKING_STATUSES.TECHNICIAN_ASSIGNED, BOOKING_STATUSES.COMPLETED]);
  }

  const result = await pool.query(
    `SELECT b.*,
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
     WHERE ${conditions.join(' AND ')}
     ORDER BY b.scheduled_at ASC`,
    params
  );

  return res.json({ bookings: await attachServicesToBookings(result.rows) });
});

router.get('/bookings/:id', authenticate, requireAdminPanelAccess, requireTechnician, async (req, res) => {
  await assertTechnicianBooking(req.params.id, req.user.id);
  const booking = await getBookingById(req.params.id);
  const serviceIds = booking.services?.map((service) => service.serviceId) || [booking.serviceId];
  const suggestedMaterials = await getSuggestedMaterialsForServiceIds(serviceIds);
  return res.json({ booking, suggestedMaterials });
});

router.post('/bookings/:id/materials', authenticate, requireAdminPanelAccess, requireTechnician, async (req, res) => {
  const bookingRow = await assertTechnicianBooking(req.params.id, req.user.id);
  if (bookingRow.status === BOOKING_STATUSES.CANCELLED) {
    return res.status(400).json({ error: 'Cannot add materials to a cancelled booking' });
  }

  let resolved;
  try {
    resolved = await resolveMaterialInput(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  const { materialId, name, unit, quantity, unitPrice, lineTotal } = resolved;
  const notes = req.body.notes?.trim() || null;

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

router.delete('/bookings/:id/materials/:lineId', authenticate, requireAdminPanelAccess, requireTechnician, async (req, res) => {
  const bookingRow = await assertTechnicianBooking(req.params.id, req.user.id);
  if (bookingRow.status === BOOKING_STATUSES.COMPLETED) {
    return res.status(400).json({ error: 'Completed bookings cannot be edited by technicians' });
  }

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

router.post('/bookings/:id/complete', authenticate, requireAdminPanelAccess, requireTechnician, async (req, res) => {
  const bookingRow = await assertTechnicianBooking(req.params.id, req.user.id);
  const allowed = VALID_BOOKING_TRANSITIONS[bookingRow.status] || [];
  if (!allowed.includes(BOOKING_STATUSES.COMPLETED)) {
    return res.status(400).json({ error: `Cannot complete booking from status ${bookingRow.status}` });
  }

  await pool.query(
    `UPDATE bookings
     SET status = $1, completed_at = NOW(), updated_at = NOW()
     WHERE id = $2`,
    [BOOKING_STATUSES.COMPLETED, req.params.id]
  );

  const booking = await getBookingById(req.params.id);

  try {
    await sendBookingStatusEmail({ booking, status: BOOKING_STATUSES.COMPLETED });
  } catch (emailError) {
    console.error('[technician/bookings] completion email failed:', emailError.message);
  }

  try {
    await notifyBookingStatusChanged(booking, {
      previousStatus: bookingRow.status,
      actorUserId: req.user.id,
    });
  } catch (notificationError) {
    console.error('[technician/bookings] completion notification failed:', notificationError.message);
  }

  return res.json({ message: 'Booking marked as completed', booking });
});

router.use((err, _req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  return next(err);
});

export default router;
