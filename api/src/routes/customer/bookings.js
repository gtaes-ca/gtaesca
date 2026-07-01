import { Router } from 'express';
import pool from '../../db.js';
import { authenticate } from '../../middleware/auth.js';
import { USER_TYPES } from '../../constants.js';
import {
  BOOKING_SELECT,
  attachServicesToBookings,
  getBookingById,
} from '../../services/bookings.js';

const router = Router();

function requireCustomer(req, res, next) {
  if (req.user?.userType !== USER_TYPES.CUSTOMER) {
    return res.status(403).json({ error: 'Customer access required' });
  }
  next();
}

async function assertCustomerBooking(bookingId, customerUserId) {
  const result = await pool.query(
    'SELECT id FROM bookings WHERE id = $1 AND customer_user_id = $2',
    [bookingId, customerUserId]
  );
  if (result.rowCount === 0) {
    return null;
  }
  return getBookingById(bookingId);
}

router.get('/', authenticate, requireCustomer, async (req, res) => {
  const result = await pool.query(
    `${BOOKING_SELECT}
     WHERE b.customer_user_id = $1
     ORDER BY b.scheduled_at DESC`,
    [req.user.id]
  );

  return res.json({ bookings: await attachServicesToBookings(result.rows) });
});

router.get('/:id', authenticate, requireCustomer, async (req, res) => {
  const booking = await assertCustomerBooking(req.params.id, req.user.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  return res.json({ booking });
});

export default router;
