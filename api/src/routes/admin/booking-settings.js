import { Router } from 'express';
import { authenticate, requirePageAccess, requireSuperAdmin } from '../../middleware/auth.js';
import { getAllowedPagesForUser } from '../../services/pageAccess.js';
import {
  BOOKING_MODES,
  getBookingSettings,
  isWhatsAppBookingMode,
  updateBookingSettings,
} from '../../services/bookingSettings.js';

const router = Router();

async function requireBookingSettingsPageAccess(req, res, next) {
  if (req.user?.userType === 'super_admin') {
    return next();
  }

  const settings = await getBookingSettings();
  if (isWhatsAppBookingMode(settings)) {
    return res.status(403).json({ error: 'Booking settings are not available in WhatsApp mode' });
  }

  return requirePageAccess('management.booking-settings')(req, res, next);
}

router.get('/', authenticate, requireBookingSettingsPageAccess, async (_req, res) => {
  const settings = await getBookingSettings();
  return res.json({ settings });
});

router.patch('/', authenticate, async (req, res) => {
  const { bookingMode, companyWhatsappNumber, ...scheduleFields } = req.body;
  const hasModeFields = bookingMode !== undefined || companyWhatsappNumber !== undefined;

  if (hasModeFields && req.user?.userType !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin access required to change booking mode' });
  }

  const hasScheduleFields = Object.keys(scheduleFields).length > 0;
  if (hasScheduleFields) {
    const settings = await getBookingSettings();
    const isSuperAdmin = req.user?.userType === 'super_admin';
    if (!isSuperAdmin && isWhatsAppBookingMode(settings)) {
      return res.status(403).json({ error: 'Booking settings are not available in WhatsApp mode' });
    }
    if (!isSuperAdmin) {
      const allowed = await getAllowedPagesForUser(req.user);
      if (!allowed.includes('management.booking-settings')) {
        return res.status(403).json({ error: 'You do not have access to this page' });
      }
    }
  }

  if (!hasModeFields && !hasScheduleFields) {
    return res.status(400).json({ error: 'No settings to update' });
  }

  try {
    const settings = await updateBookingSettings(req.body);
    return res.json({ settings });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/mode', authenticate, requireSuperAdmin, async (_req, res) => {
  const settings = await getBookingSettings();
  return res.json({
    bookingMode: settings.bookingMode,
    companyWhatsappNumber: settings.companyWhatsappNumber,
    modes: BOOKING_MODES,
  });
});

export default router;
