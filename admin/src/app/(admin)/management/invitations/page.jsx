import { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Form, Offcanvas, Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import PageMetaData from '@/components/PageTitle';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import { isWhatsAppBookingMode } from '@/helpers/auth';
import httpClient from '@/helpers/httpClient';

const defaultForm = {
  method: 'email',
  email: '',
  userType: 'operation_team',
  role: 'support',
  firstName: '',
  lastName: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

const TeamInvitationsPage = () => {
  const { user } = useAuthContext();
  const { showNotification } = useNotificationContext();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showFormSheet, setShowFormSheet] = useState(false);
  const [resendingId, setResendingId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const whatsAppMode = isWhatsAppBookingMode(user);

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

  const openForm = () => {
    setForm({
      ...defaultForm,
      userType: 'operation_team',
      role: 'support',
    });
    setShowFormSheet(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.method === 'manual') {
      if (!form.firstName.trim() || !form.lastName.trim()) {
        showNotification({ message: 'First and last name are required', variant: 'danger' });
        return;
      }
      if (form.password.length < 8) {
        showNotification({ message: 'Password must be at least 8 characters', variant: 'danger' });
        return;
      }
      if (form.password !== form.confirmPassword) {
        showNotification({ message: 'Passwords do not match', variant: 'danger' });
        return;
      }
    }

    setSubmitting(true);
    try {
      const userType = whatsAppMode ? 'operation_team' : form.userType;
      const role = whatsAppMode
        ? (form.role === 'technician' ? 'support' : form.role)
        : form.role;

      if (form.method === 'email') {
        await httpClient.post('/api/invitations', {
          email: form.email,
          userType,
          role,
        });
        showNotification({ message: 'Invitation sent successfully', variant: 'success' });
      } else {
        await httpClient.post('/api/invitations/create-account', {
          email: form.email,
          userType,
          role,
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim() || undefined,
          password: form.password,
        });
        showNotification({
          message: 'Account created successfully. The user can sign in now.',
          variant: 'success',
        });
      }
      setForm(defaultForm);
      setShowFormSheet(false);
      loadInvitations();
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to process request',
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

  const isManual = form.method === 'manual';

  const visibleInvitations = useMemo(() => {
    if (!whatsAppMode) return invitations;
    return invitations.filter((invite) => invite.userType === 'operation_team');
  }, [invitations, whatsAppMode]);

  return (
    <>
      <PageMetaData title="Team Invitations" />

      <ComponentContainerCard
        title="Team Invitations"
        description={
          whatsAppMode
            ? 'Invite or create Operation Team accounts. Technician accounts are unavailable in WhatsApp booking mode.'
            : 'Invite by email link, or create an account manually with a password.'
        }
      >
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={openForm}>
            <IconifyIcon icon="bx:plus" className="me-1" />
            Add Team Member
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
              {visibleInvitations.map((invite) => (
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
              {visibleInvitations.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-muted">
                    No invitations yet. Use Add Team Member to invite or create an account.
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
        onHide={() => !submitting && setShowFormSheet(false)}
        className="border-0"
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title>Add Team Member</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Method</Form.Label>
              <div className="d-flex flex-column gap-2">
                <Form.Check
                  type="radio"
                  id="invite-method-email"
                  name="inviteMethod"
                  label="Email invitation (activation link + OTP)"
                  checked={form.method === 'email'}
                  onChange={() => setForm({ ...form, method: 'email' })}
                />
                <Form.Check
                  type="radio"
                  id="invite-method-manual"
                  name="inviteMethod"
                  label="Manual account (set password now)"
                  checked={form.method === 'manual'}
                  onChange={() => setForm({ ...form, method: 'manual' })}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
                required
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Team Type</Form.Label>
              {whatsAppMode ? (
                <Form.Control value="Operation Team" readOnly />
              ) : (
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
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                disabled={form.userType === 'technician'}
              >
                {form.userType === 'technician' && !whatsAppMode ? (
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

            {isManual && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    required
                    autoComplete="off"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    required
                    autoComplete="off"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone (optional)</Form.Label>
                  <Form.Control
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    autoComplete="off"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min 8 characters"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </Form.Group>
              </>
            )}

            {!isManual && (
              <p className="text-muted small mb-4">
                They will receive an email with an activation link and OTP to set their own password.
              </p>
            )}

            <div className="d-flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? isManual
                    ? 'Creating...'
                    : 'Sending...'
                  : isManual
                    ? 'Create Account'
                    : 'Send Invitation'}
              </Button>
              <Button
                variant="light"
                type="button"
                disabled={submitting}
                onClick={() => setShowFormSheet(false)}
              >
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
