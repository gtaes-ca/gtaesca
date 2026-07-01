import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Offcanvas } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import {
  formatNotificationTime,
  notificationIcon,
  useInAppNotifications,
} from '@/context/useInAppNotifications';

const NotificationItem = ({ notification, onOpen }) => (
  <button
    type="button"
    className={`w-100 text-start border-0 border-bottom px-3 py-3 ${
      notification.isRead ? 'bg-body' : 'bg-primary-subtle'
    }`}
    onClick={() => onOpen(notification)}
  >
    <div className="d-flex">
      <div className="flex-shrink-0">
        <div className={`avatar-sm me-2 ${notification.isRead ? 'bg-soft-secondary' : 'bg-soft-primary'}`}>
          <span className={`avatar-title ${notification.isRead ? 'text-secondary' : 'text-primary'} fs-18 rounded-circle`}>
            <IconifyIcon icon={notificationIcon(notification.type)} />
          </span>
        </div>
      </div>
      <div className="flex-grow-1 min-w-0">
        <div className="d-flex justify-content-between gap-2 mb-1">
          <p className="mb-0 fw-semibold text-truncate">{notification.title}</p>
          <small className="text-muted flex-shrink-0">{formatNotificationTime(notification.createdAt)}</small>
        </div>
        <p className="mb-0 text-wrap text-muted">{notification.body}</p>
      </div>
    </div>
  </button>
);

const Notifications = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { notifications, unreadCount, loading, refresh, markAsRead, markAllAsRead } = useInAppNotifications();

  const handleOpen = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    if (notification.link) {
      setShow(false);
      navigate(notification.link);
    }
  };

  const openSheet = () => {
    setShow(true);
    refresh();
  };

  return (
    <>
      <div className="topbar-item">
        <button
          type="button"
          className="content-none topbar-button position-relative"
          aria-label="Notifications"
          onClick={openSheet}
        >
          <IconifyIcon icon="iconamoon:notification-duotone" className="fs-24 align-middle" />
          {unreadCount > 0 && (
            <span className="position-absolute topbar-badge fs-10 translate-middle badge bg-danger rounded-pill">
              {unreadCount > 99 ? '99+' : unreadCount}
              <span className="visually-hidden">unread notifications</span>
            </span>
          )}
        </button>
      </div>

      <Offcanvas show={show} onHide={() => setShow(false)} placement="end" className="border-0" style={{ width: 380 }}>
        <Offcanvas.Header closeButton className="border-bottom">
          <div className="d-flex align-items-center justify-content-between w-100 pe-2">
            <Offcanvas.Title className="fw-semibold mb-0">Notifications</Offcanvas.Title>
            <button
              type="button"
              className="btn btn-link btn-sm text-decoration-underline p-0"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </button>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 d-flex flex-column">
          <SimplebarReactClient className="flex-grow-1" style={{ maxHeight: 'calc(100vh - 140px)' }}>
            {loading && notifications.length === 0 && (
              <div className="p-3 text-muted small">Loading notifications...</div>
            )}
            {!loading && notifications.length === 0 && (
              <div className="p-4 text-center text-muted small">No notifications yet.</div>
            )}
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onOpen={handleOpen} />
            ))}
          </SimplebarReactClient>
          <div className="text-center py-3 border-top mt-auto">
            <Button size="sm" variant="light" onClick={refresh} disabled={loading}>
              Refresh
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Notifications;
