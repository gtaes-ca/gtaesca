import { Router } from 'express';
import { authenticate, requirePageAccess } from '../../middleware/auth.js';
import { getBookingSettings, updateBookingSettings } from '../../services/bookingSettings.js';

const router = Router();

router.get('/', authenticate, requirePageAccess('management.booking-settings'), async (_req, res) => {
  const settings = await getBookingSettings();
  return res.json({ settings });
});

router.patch('/', authenticate, requirePageAccess('management.booking-settings'), async (req, res) => {
  try {
    const settings = await updateBookingSettings(req.body);
    return res.json({ settings });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

export default router;
