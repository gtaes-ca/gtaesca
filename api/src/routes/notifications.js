import { Router } from 'express';
import { authenticate, requireAdminPanelAccess } from '../middleware/auth.js';
import {
  getUnreadNotificationCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notifications.js';

const router = Router();

router.get('/', authenticate, requireAdminPanelAccess, async (req, res) => {
  const limit = Number(req.query.limit) || 20;
  const unreadOnly = req.query.unreadOnly === 'true';

  const notifications = await listNotifications(req.user.id, { limit, unreadOnly });
  const unreadCount = await getUnreadNotificationCount(req.user.id);

  return res.json({ notifications, unreadCount });
});

router.get('/unread-count', authenticate, requireAdminPanelAccess, async (req, res) => {
  const unreadCount = await getUnreadNotificationCount(req.user.id);
  return res.json({ unreadCount });
});

router.patch('/:id/read', authenticate, requireAdminPanelAccess, async (req, res) => {
  const notification = await markNotificationRead(req.user.id, req.params.id);
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  const unreadCount = await getUnreadNotificationCount(req.user.id);
  return res.json({ notification, unreadCount });
});

router.post('/read-all', authenticate, requireAdminPanelAccess, async (_req, res) => {
  const marked = await markAllNotificationsRead(_req.user.id);
  return res.json({ message: 'All notifications marked as read', marked, unreadCount: 0 });
});

export default router;
