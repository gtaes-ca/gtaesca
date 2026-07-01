import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuthContext } from '@/context/useAuthContext';
import httpClient from '@/helpers/httpClient';

const InAppNotificationsContext = createContext(undefined);

const POLL_INTERVAL_MS = 45000;

export function useInAppNotifications() {
  const context = useContext(InAppNotificationsContext);
  if (!context) {
    throw new Error('useInAppNotifications must be used within InAppNotificationsProvider');
  }
  return context;
}

export function InAppNotificationsProvider({ children }) {
  const { user, sessionChecked } = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef(null);

  const canLoad = Boolean(user?.token && sessionChecked);

  const refresh = useCallback(async () => {
    if (!canLoad) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    try {
      const res = await httpClient.get('/api/notifications', { params: { limit: 20 } });
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount ?? 0);
    } catch {
      // Keep existing state on transient failures.
    } finally {
      setLoading(false);
    }
  }, [canLoad]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!canLoad) return undefined;

    pollRef.current = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [canLoad, refresh]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      const res = await httpClient.patch(`/api/notifications/${notificationId}/read`);
      const updated = res.data.notification;
      setNotifications((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setUnreadCount(res.data.unreadCount ?? 0);
      return updated;
    } catch {
      return null;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await httpClient.post('/api/notifications/read-all');
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true, readAt: item.readAt || new Date().toISOString() })));
      setUnreadCount(0);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      refresh,
      markAsRead,
      markAllAsRead,
    }),
    [notifications, unreadCount, loading, refresh, markAsRead, markAllAsRead]
  );

  return (
    <InAppNotificationsContext.Provider value={value}>
      {children}
    </InAppNotificationsContext.Provider>
  );
}

export function formatNotificationTime(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
}

export function notificationIcon(type) {
  switch (type) {
    case 'booking_created':
      return 'iconamoon:calendar-1-duotone';
    case 'booking_assigned':
    case 'booking_reassigned':
      return 'iconamoon:profile-circle-duotone';
    case 'booking_unassigned':
      return 'iconamoon:arrow-left-2-duotone';
    case 'booking_completed':
      return 'iconamoon:check-circle-1-duotone';
    case 'booking_cancelled':
      return 'iconamoon:close-circle-1-duotone';
    default:
      return 'iconamoon:notification-duotone';
  }
}
