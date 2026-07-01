import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Form, Modal, Nav, Tab, Table } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import TechnicianExpertiseOffcanvas from '@/components/technician/TechnicianExpertiseOffcanvas';
import UserAvatar from '@/components/UserAvatar';
import PageMetaData from '@/components/PageTitle';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const OPERATION_TAB = 'operation_team';
const TECHNICIAN_TAB = 'technician';
const operationRoles = ['admin', 'support', 'viewer'];

const UserManagementPage = () => {
  const { showNotification } = useNotificationContext();
  const [activeTab, setActiveTab] = useState(OPERATION_TAB);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [expertiseUser, setExpertiseUser] = useState(null);
  const [expandedExpertiseUsers, setExpandedExpertiseUsers] = useState(() => new Set());

  const loadUsers = useCallback(async (userType) => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/users', { params: { userType } });
      setUsers(res.data.users || []);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load users',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadUsers(activeTab);
  }, [activeTab, loadUsers]);

  const updateStatus = async (user, status) => {
    try {
      const res = await httpClient.patch(`/api/admin/users/${user.id}/status`, { status });
      const sessionsRevoked = res.data?.sessionsRevoked;
      if (status === 'blocked') {
        showNotification({
          message: sessionsRevoked
            ? `User blocked and logged out from ${sessionsRevoked} session(s)`
            : 'User blocked and all sessions revoked',
          variant: 'success',
        });
      } else {
        showNotification({ message: 'User activated', variant: 'success' });
      }
      loadUsers(activeTab);
    } catch (e) {
      showNotification({ message: e.response?.data?.error || 'Action failed', variant: 'danger' });
    }
  };

  const revokeSessions = async (user) => {
    try {
      const res = await httpClient.post(`/api/admin/users/${user.id}/revoke-sessions`);
      const count = res.data?.sessionsRevoked ?? 0;
      showNotification({
        message: count > 0
          ? `Logged out from ${count} active session(s)`
          : 'No active sessions to revoke',
        variant: 'success',
      });
    } catch (e) {
      showNotification({ message: e.response?.data?.error || 'Action failed', variant: 'danger' });
    }
  };

  const changePassword = async () => {
    if (!selectedUser || password.length < 8) return;
    try {
      await httpClient.patch(`/api/admin/users/${selectedUser.id}/password`, { password });
      showNotification({ message: 'Password updated and sessions revoked', variant: 'success' });
      setSelectedUser(null);
      setPassword('');
    } catch (e) {
      showNotification({ message: e.response?.data?.error || 'Password update failed', variant: 'danger' });
    }
  };

  const changeRole = async (user, newRole) => {
    if (user.role === newRole) return;
    try {
      const res = await httpClient.patch(`/api/admin/users/${user.id}/role`, { role: newRole });
      const sessionsRevoked = res.data?.sessionsRevoked ?? 0;
      showNotification({
        message: sessionsRevoked > 0
          ? `Role updated and user logged out from ${sessionsRevoked} session(s)`
          : 'Role updated',
        variant: 'success',
      });
      loadUsers(activeTab);
    } catch (e) {
      showNotification({ message: e.response?.data?.error || 'Role update failed', variant: 'danger' });
    }
  };

  const handleExpertiseSaved = (userId, expertise) => {
    setUsers((prev) => prev.map((user) =>
      user.id === userId ? { ...user, expertise } : user
    ));
    showNotification({ message: 'Service expertise updated', variant: 'success' });
  };

  const toggleExpertiseExpanded = (userId) => {
    setExpandedExpertiseUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const renderExpertiseCell = (user) => {
    const expertise = user.expertise || [];
    if (expertise.length === 0) {
      return <span className="text-muted">None assigned</span>;
    }

    const expanded = expandedExpertiseUsers.has(user.id);
    const visibleServices = expanded ? expertise : expertise.slice(0, 3);
    const hiddenCount = expertise.length - 3;

    return (
      <div className="d-flex flex-wrap gap-1" style={{ maxWidth: 320 }}>
        {visibleServices.map((service) => (
          <Badge key={service.id} bg="primary-subtle" text="primary" className="fw-normal">
            {service.name}
          </Badge>
        ))}
        {hiddenCount > 0 && (
          <Badge
            bg="light"
            text="primary"
            className="fw-normal"
            role="button"
            style={{ cursor: 'pointer' }}
            onClick={() => toggleExpertiseExpanded(user.id)}
          >
            {expanded ? 'Show less' : `+${hiddenCount} more`}
          </Badge>
        )}
      </div>
    );
  };

  const isOperationTab = activeTab === OPERATION_TAB;
  const emptyMessage = isOperationTab
    ? 'No operation team users found.'
    : 'No technicians found.';

  const renderUsersTable = () => {
    if (loading) {
      return <p className="text-muted">Loading...</p>;
    }

    return (
      <Table responsive hover>
        <thead>
          <tr>
            <th style={{ width: 56 }} />
            <th>Name</th>
            <th>Email</th>
            {!isOperationTab && <th>Expertise</th>}
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <UserAvatar user={user} size="sm" />
              </td>
              <td>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || '-'}</td>
              <td>{user.email}</td>
              {!isOperationTab && <td>{renderExpertiseCell(user)}</td>}
              <td>
                {isOperationTab ? (
                  <Form.Select
                    size="sm"
                    value={user.role}
                    onChange={(e) => changeRole(user, e.target.value)}
                  >
                    {operationRoles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </Form.Select>
                ) : (
                  'Technician'
                )}
              </td>
              <td>
                <Badge bg={user.status === 'active' ? 'success' : 'danger'}>{user.status}</Badge>
              </td>
              <td className="d-flex gap-2 flex-wrap">
                {!isOperationTab && (
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => setExpertiseUser(user)}
                  >
                    Manage Services
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => {
                    setSelectedUser(user);
                    setPassword('');
                  }}
                >
                  Change Password
                </Button>
                <Button size="sm" variant="outline-warning" onClick={() => revokeSessions(user)}>
                  Logout All Sessions
                </Button>
                {user.status === 'active' ? (
                  <Button size="sm" variant="outline-danger" onClick={() => updateStatus(user, 'blocked')}>
                    Block
                  </Button>
                ) : (
                  <Button size="sm" variant="outline-success" onClick={() => updateStatus(user, 'active')}>
                    Unblock
                  </Button>
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={isOperationTab ? 6 : 7} className="text-muted">{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <PageMetaData title="User Management" />
      <ComponentContainerCard
        title="Team Management"
        description="Manage operation team and technician members — passwords, roles, blocking, session logout, and service expertise."
      >
        <Tab.Container
          activeKey={activeTab}
          onSelect={(key) => key && setActiveTab(key)}
        >
          <Nav variant="tabs" className="nav-tabs card-tabs mb-3">
            <Nav.Item>
              <Nav.Link eventKey={OPERATION_TAB}>Operation Team</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={TECHNICIAN_TAB}>Technicians</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey={OPERATION_TAB}>
              {activeTab === OPERATION_TAB && renderUsersTable()}
            </Tab.Pane>
            <Tab.Pane eventKey={TECHNICIAN_TAB}>
              {activeTab === TECHNICIAN_TAB && renderUsersTable()}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </ComponentContainerCard>

      <TechnicianExpertiseOffcanvas
        show={!!expertiseUser}
        user={expertiseUser}
        onHide={() => setExpertiseUser(null)}
        onSaved={handleExpertiseSaved}
      />

      <Modal show={!!selectedUser} onHide={() => setSelectedUser(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">
            Set a new password for {selectedUser?.email}. All active sessions will be revoked.
          </p>
          <Form.Control
            type="password"
            placeholder="New password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setSelectedUser(null)}>Cancel</Button>
          <Button onClick={changePassword} disabled={password.length < 8}>Update Password</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManagementPage;
