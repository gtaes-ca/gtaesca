import { verifyAccessToken, validateSession } from '../services/sessions.js';
import { canAccessAdminPanel, isSuperAdmin } from '../constants.js';
import { getAllowedPagesForUser } from '../services/pageAccess.js';
import {
  BOOKING_SYSTEM_PAGE_KEYS,
  getBookingSettings,
  isWhatsAppBookingMode,
} from '../services/bookingSettings.js';

export async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await validateSession(payload.sid, token);

    if (!user) {
      return res.status(401).json({ error: 'Session expired or revoked' });
    }

    req.user = user;
    req.sessionId = payload.sid;
    req.token = token;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export async function optionalAuthenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await validateSession(payload.sid, token);

    if (user) {
      req.user = user;
      req.sessionId = payload.sid;
      req.token = token;
    }
  } catch {
    // Public routes may proceed without a valid session.
  }

  next();
}

export function requireSuperAdmin(req, res, next) {
  if (!isSuperAdmin(req.user)) {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  next();
}

export function requireAdminPanelAccess(req, res, next) {
  if (!canAccessAdminPanel(req.user)) {
    return res.status(403).json({ error: 'Admin panel access required' });
  }
  next();
}

export function requirePageAccess(pageKey) {
  return async (req, res, next) => {
    if (isSuperAdmin(req.user)) {
      return next();
    }

    if (BOOKING_SYSTEM_PAGE_KEYS.includes(pageKey)) {
      const settings = await getBookingSettings();
      if (isWhatsAppBookingMode(settings)) {
        return res.status(403).json({ error: 'Booking system is disabled' });
      }
    }

    const allowedPages = await getAllowedPagesForUser(req.user);
    if (!allowedPages.includes(pageKey)) {
      return res.status(403).json({ error: 'You do not have access to this page' });
    }

    next();
  };
}
