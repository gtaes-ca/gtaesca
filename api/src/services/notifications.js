import pool from '../db.js';
import { BOOKING_STATUS_LABELS, USER_TYPES } from '../constants.js';
import { getBookingSettings } from './bookingSettings.js';

export const NOTIFICATION_TYPES = {
  BOOKING_CREATED: 'booking_created',
  BOOKING_ASSIGNED: 'booking_assigned',
  BOOKING_REASSIGNED: 'booking_reassigned',
  BOOKING_UNASSIGNED: 'booking_unassigned',
  BOOKING_STATUS_CHANGED: 'booking_status_changed',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_CANCELLED: 'booking_cancelled',
};

function formatNotification(row) {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    body: row.body,
    link: row.link,
    entityType: row.entity_type,
    entityId: row.entity_id,
    metadata: row.metadata || {},
    readAt: row.read_at,
    createdAt: row.created_at,
    isRead: Boolean(row.read_at),
  };
}

async function formatScheduledLabel(scheduledAt) {
  const { timezone } = await getBookingSettings();
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) return 'scheduled time TBD';
  return date.toLocaleString('en-CA', {
    timeZone: timezone,
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function bookingLink(referenceCode) {
  return `/management/bookings?search=${encodeURIComponent(referenceCode)}`;
}

export async function getActiveAdminUserIds(excludeUserId = null) {
  const params = [[USER_TYPES.SUPER_ADMIN, USER_TYPES.OPERATION_TEAM]];
  let query = `
    SELECT id FROM users
    WHERE user_type = ANY($1::text[])
      AND status = 'active'
  `;
  if (excludeUserId) {
    params.push(excludeUserId);
    query += ` AND id != $2`;
  }
  const result = await pool.query(query, params);
  return result.rows.map((row) => row.id);
}

export async function createNotification({
  userId,
  type,
  title,
  body,
  link = null,
  entityType = null,
  entityId = null,
  metadata = {},
}) {
  const result = await pool.query(
    `INSERT INTO notifications (user_id, type, title, body, link, entity_type, entity_id, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [userId, type, title, body, link, entityType, entityId, metadata]
  );
  return formatNotification(result.rows[0]);
}

export async function createNotificationsForUsers(userIds, payload) {
  const uniqueIds = [...new Set(userIds.filter(Boolean))];
  if (!uniqueIds.length) return [];

  const created = [];
  for (const userId of uniqueIds) {
    created.push(await createNotification({ ...payload, userId }));
  }
  return created;
}

export async function notifyAdminUsers(payload, { excludeUserId = null } = {}) {
  const userIds = await getActiveAdminUserIds(excludeUserId);
  return createNotificationsForUsers(userIds, payload);
}

export async function listNotifications(userId, { limit = 20, unreadOnly = false } = {}) {
  const params = [userId];
  let query = `
    SELECT * FROM notifications
    WHERE user_id = $1
  `;
  if (unreadOnly) {
    query += ' AND read_at IS NULL';
  }
  params.push(Math.min(100, Math.max(1, Number(limit) || 20)));
  query += ` ORDER BY created_at DESC LIMIT $${params.length}`;

  const result = await pool.query(query, params);
  return result.rows.map(formatNotification);
}

export async function getUnreadNotificationCount(userId) {
  const result = await pool.query(
    `SELECT COUNT(*)::int AS count
     FROM notifications
     WHERE user_id = $1 AND read_at IS NULL`,
    [userId]
  );
  return result.rows[0].count;
}

export async function markNotificationRead(userId, notificationId) {
  const result = await pool.query(
    `UPDATE notifications
     SET read_at = COALESCE(read_at, NOW())
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [notificationId, userId]
  );
  if (result.rowCount === 0) return null;
  return formatNotification(result.rows[0]);
}

export async function markAllNotificationsRead(userId) {
  const result = await pool.query(
    `UPDATE notifications
     SET read_at = NOW()
     WHERE user_id = $1 AND read_at IS NULL
     RETURNING id`,
    [userId]
  );
  return result.rowCount;
}

export async function notifyBookingCreated(booking, { actorUserId = null } = {}) {
  const ref = booking.referenceCode;
  const client = [booking.clientFirstName, booking.clientLastName].filter(Boolean).join(' ');
  const service = booking.serviceName;
  const scheduledLabel = await formatScheduledLabel(booking.scheduledAt);

  await notifyAdminUsers(
    {
      type: NOTIFICATION_TYPES.BOOKING_CREATED,
      title: 'New booking received',
      body: `${ref} — ${client} booked ${service}`,
      link: bookingLink(ref),
      entityType: 'booking',
      entityId: booking.id,
      metadata: { referenceCode: ref, status: booking.status },
    },
    { excludeUserId: actorUserId }
  );

  if (booking.technicianUserId && booking.technicianUserId !== actorUserId) {
    await createNotification({
      userId: booking.technicianUserId,
      type: NOTIFICATION_TYPES.BOOKING_ASSIGNED,
      title: 'New job scheduled',
      body: `${ref} — ${service} on ${scheduledLabel}`,
      link: '/technician/jobs',
      entityType: 'booking',
      entityId: booking.id,
      metadata: { referenceCode: ref, status: booking.status },
    });
  }
}

export async function notifyBookingTechnicianAssigned(booking, { actorUserId = null, previousTechnicianId = null } = {}) {
  const ref = booking.referenceCode;
  const scheduledLabel = await formatScheduledLabel(booking.scheduledAt);
  const statusLabel = BOOKING_STATUS_LABELS[booking.status] || booking.status;

  if (booking.technicianUserId && booking.technicianUserId !== actorUserId) {
    const isReassignment = previousTechnicianId && previousTechnicianId !== booking.technicianUserId;
    await createNotification({
      userId: booking.technicianUserId,
      type: isReassignment ? NOTIFICATION_TYPES.BOOKING_REASSIGNED : NOTIFICATION_TYPES.BOOKING_ASSIGNED,
      title: isReassignment ? 'Job reassigned to you' : 'Job assigned to you',
      body: `${ref} — ${booking.serviceName} on ${scheduledLabel}`,
      link: '/technician/jobs',
      entityType: 'booking',
      entityId: booking.id,
      metadata: { referenceCode: ref, status: booking.status },
    });
  }

  if (previousTechnicianId && previousTechnicianId !== booking.technicianUserId && previousTechnicianId !== actorUserId) {
    await createNotification({
      userId: previousTechnicianId,
      type: NOTIFICATION_TYPES.BOOKING_UNASSIGNED,
      title: 'Job reassigned',
      body: `${ref} has been reassigned to another technician`,
      link: '/technician/jobs',
      entityType: 'booking',
      entityId: booking.id,
      metadata: { referenceCode: ref, status: booking.status },
    });
  }

  await notifyAdminUsers(
    {
      type: NOTIFICATION_TYPES.BOOKING_STATUS_CHANGED,
      title: 'Booking updated',
      body: `${ref} is now ${statusLabel}`,
      link: bookingLink(ref),
      entityType: 'booking',
      entityId: booking.id,
      metadata: { referenceCode: ref, status: booking.status },
    },
    { excludeUserId: actorUserId }
  );
}

export async function notifyBookingStatusChanged(booking, { previousStatus, actorUserId = null } = {}) {
  const ref = booking.referenceCode;
  const statusLabel = BOOKING_STATUS_LABELS[booking.status] || booking.status;
  const previousLabel = BOOKING_STATUS_LABELS[previousStatus] || previousStatus;

  if (booking.status === 'completed') {
    await notifyAdminUsers(
      {
        type: NOTIFICATION_TYPES.BOOKING_COMPLETED,
        title: 'Job completed',
        body: `${ref} — ${booking.serviceName} marked complete`,
        link: bookingLink(ref),
        entityType: 'booking',
        entityId: booking.id,
        metadata: { referenceCode: ref, status: booking.status, previousStatus },
      },
      { excludeUserId: actorUserId }
    );
    return;
  }

  if (booking.status === 'cancelled') {
    await notifyAdminUsers(
      {
        type: NOTIFICATION_TYPES.BOOKING_CANCELLED,
        title: 'Booking cancelled',
        body: `${ref} — ${booking.serviceName} was cancelled`,
        link: bookingLink(ref),
        entityType: 'booking',
        entityId: booking.id,
        metadata: { referenceCode: ref, status: booking.status, previousStatus },
      },
      { excludeUserId: actorUserId }
    );

    if (booking.technicianUserId && booking.technicianUserId !== actorUserId) {
      await createNotification({
        userId: booking.technicianUserId,
        type: NOTIFICATION_TYPES.BOOKING_CANCELLED,
        title: 'Job cancelled',
        body: `${ref} — ${booking.serviceName} is no longer scheduled`,
        link: '/technician/jobs',
        entityType: 'booking',
        entityId: booking.id,
        metadata: { referenceCode: ref, status: booking.status },
      });
    }
    return;
  }

  if (booking.status === 'technician_assigned') {
    await notifyBookingTechnicianAssigned(booking, { actorUserId, previousTechnicianId: null });
    return;
  }

  await notifyAdminUsers(
    {
      type: NOTIFICATION_TYPES.BOOKING_STATUS_CHANGED,
      title: 'Booking status updated',
      body: `${ref} changed from ${previousLabel} to ${statusLabel}`,
      link: bookingLink(ref),
      entityType: 'booking',
      entityId: booking.id,
      metadata: { referenceCode: ref, status: booking.status, previousStatus },
    },
    { excludeUserId: actorUserId }
  );
}
