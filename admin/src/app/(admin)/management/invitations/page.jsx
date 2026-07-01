import { useEffect, useState } from 'react';
import { Badge, Button, Form, Offcanvas, Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import PageMetaData from '@/components/PageTitle';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const defaultForm = {
  email: '',
  userType: 'operation_team',
  role: 'support',
};

const TeamInvitationsPage = () => {
  const { showNotification } = useNotificationContext();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [resendingId, setResendingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const loadInvitations = async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/invitations');
      setInvitations(res.data.invitations || []);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load invitations',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const operationRoles = [
    { value: 'admin', label: 'Admin' },
    { value: 'support', label: 'Support' },
    { value: 'viewer', label: 'Viewer' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await httpClient.post('/api/invitations', form);
      showNotification({ message: 'Invitation sent successfully', variant: 'success' });
      setForm(defaultForm);
      setShowFormSheet(false);
      loadInvitations();
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to send invitation',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async (invite) => {
    setResendingId(invite.id);
    try {
      await httpClient.post(`/api/invitations/${invite.id}/resend`);
      showNotification({ message: `Invitation resent to ${invite.email}`, variant: 'success' });
      loadInvitations();
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to resend invitation',
        variant: 'danger',
      });
    } finally {
      setResendingId(null);
    }
  };

  const handleCancel = async (invite) => {
    if (!window.confirm(`Cancel the pending invitation for ${invite.email}?`)) return;

    setCancellingId(invite.id);
    try {
      await httpClient.delete(`/api/invitations/${invite.id}`);
      showNotification({ message: `Invitation cancelled for ${invite.email}`, variant: 'success' });
      loadInvitations();
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to cancel invitation',
        variant: 'danger',
      });
    } finally {
      setCancellingId(null);
    }
  };

  const statusVariant = (status) => {
    if (status === 'accepted') return 'success';
    if (status === 'expired') return 'secondary';
    return 'warning';
  };

  return (
    <>
      <PageMetaData title="Team Invitations" />

      <ComponentContainerCard
        title="Team Invitations"
        description="Manage pending, accepted, and expired team invitations."
      >
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={() => setShowFormSheet(true)}>
            <IconifyIcon icon="bx:plus" className="me-1" />
            Send Invitation
          </Button>
        </div>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Email</th>
                <th>Team</th>
                <th>Role</th>
                <th>Status</th>
                <th>Invited By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invite) => (
                <tr key={invite.id}>
                  <td>{invite.email}</td>
                  <td>{invite.userType === 'operation_team' ? 'Operation' : 'Technician'}</td>
                  <td>{invite.role}</td>
                  <td>
                    <Badge bg={statusVariant(invite.status)}>{invite.status}</Badge>
                  </td>
                  <td>{invite.invitedBy || '-'}</td>
                  <td>
                    {invite.status === 'pending' && (
                      <div className="d-flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          disabled={resendingId === invite.id || cancellingId === invite.id}
                          onClick={() => handleResend(invite)}
                        >
                          {resendingId === invite.id ? 'Resending...' : 'Resend'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={resendingId === invite.id || cancellingId === invite.id}
                          onClick={() => handleCancel(invite)}
                        >
                          {cancellingId === invite.id ? 'Cancelling...' : 'Cancel'}
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {invitations.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-muted">
                    No invitations yet. Use Send Invitation to invite a team member.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </ComponentContainerCard>

      <Offcanvas
        placement="end"
        show={showFormSheet}
        onHide={() => setShowFormSheet(false)}
        className="border-0"
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title>Send Invitation</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p className="text-muted">
            Invite Operation or Technician members by email. They will receive a link and OTP to complete signup.
          </p>
          <form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Team Type</Form.Label>
              <Form.Select
                value={form.userType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    userType: e.target.value,
                    role: e.target.value === 'technician' ? 'technician' : 'support',
                  })
                }
              >
                <option value="operation_team">Operation Team</option>
                <option value="technician">Technicians</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                disabled={form.userType === 'technician'}
              >
                {form.userType === 'technician' ? (
                  <option value="technician">Technician</option>
                ) : (
                  operationRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))
                )}
              </Form.Select>
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Invitation'}
              </Button>
              <Button variant="light" type="button" onClick={() => setShowFormSheet(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default TeamInvitationsPage;
