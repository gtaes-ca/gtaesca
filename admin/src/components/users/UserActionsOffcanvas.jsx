import { useEffect, useState } from 'react';
import { Badge, Button, Form, Offcanvas } from 'react-bootstrap';
import UserAvatar from '@/components/UserAvatar';

const UserActionsOffcanvas = ({
  show,
  user,
  isOperationTab,
  operationRoles,
  saving = false,
  onHide,
  onChangePassword,
  onChangeRole,
  onRevokeSessions,
  onUpdateStatus,
  onManageServices,
}) => {
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (!show || !user) return;
    setPassword('');
    setRole(user.role || '');
  }, [show, user]);

  const handleClose = () => {
    if (saving) return;
    onHide();
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) return;
    await onChangePassword(password);
    setPassword('');
  };

  const handleRoleChange = async (newRole) => {
    setRole(newRole);
    if (user?.role !== newRole) {
      await onChangeRole(newRole);
    }
  };

  const userName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : '';

  return (
    <Offcanvas
      placement="end"
      show={show}
      onHide={handleClose}
      backdrop={saving ? 'static' : true}
      style={{ width: 'min(480px, 100vw)' }}
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title>Manage User</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column">
        {user && (
          <>
            <div className="bg-light-subtle rounded p-3 mb-4 d-flex align-items-center gap-3">
              <UserAvatar user={user} size="md" />
              <div className="min-w-0 flex-grow-1">
                <div className="fw-medium text-truncate">{userName}</div>
                <small className="text-muted text-truncate d-block">{user.email}</small>
              </div>
              <Badge bg={user.status === 'active' ? 'success' : 'danger'}>{user.status}</Badge>
            </div>

            {isOperationTab && (
              <Form.Group className="mb-4">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  disabled={saving}
                >
                  {operationRoles.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Changing the role logs the user out of all active sessions.
                </Form.Text>
              </Form.Group>
            )}

            {!isOperationTab && onManageServices && (
              <div className="mb-4">
                <Form.Label className="d-block">Service Expertise</Form.Label>
                <Button
                  variant="outline-secondary"
                  onClick={() => onManageServices(user)}
                  disabled={saving}
                >
                  Manage Services
                </Button>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="mb-4">
              <Form.Label>Change Password</Form.Label>
              <p className="text-muted small">
                Set a new password for this user. All active sessions will be revoked.
              </p>
              <Form.Control
                type="password"
                placeholder="New password (min 8 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={saving}
                className="mb-3"
              />
              <Button type="submit" disabled={saving || password.length < 8}>
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </form>

            <div className="border-top pt-4 mt-auto">
              <Form.Label className="d-block mb-3">Account Actions</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                <Button
                  variant="outline-warning"
                  onClick={() => onRevokeSessions(user)}
                  disabled={saving}
                >
                  Logout All Sessions
                </Button>
                {user.status === 'active' ? (
                  <Button
                    variant="outline-danger"
                    onClick={() => onUpdateStatus(user, 'blocked')}
                    disabled={saving}
                  >
                    Block User
                  </Button>
                ) : (
                  <Button
                    variant="outline-success"
                    onClick={() => onUpdateStatus(user, 'active')}
                    disabled={saving}
                  >
                    Unblock User
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default UserActionsOffcanvas;
