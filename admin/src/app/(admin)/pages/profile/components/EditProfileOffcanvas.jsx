import { useEffect, useState } from 'react';
import { Button, Form, Offcanvas } from 'react-bootstrap';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const EditProfileOffcanvas = ({ show, onHide, user, onUpdated }) => {
  const { refreshSession } = useAuthContext();
  const { showNotification } = useNotificationContext();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (!show || !user) return;
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      bio: user.bio || '',
    });
  }, [show, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await httpClient.put('/api/auth/profile', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        bio: form.bio.trim(),
      });
      await refreshSession();
      onUpdated?.();
      showNotification({ message: 'Profile updated successfully', variant: 'success' });
      onHide();
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to update profile',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Offcanvas placement="end" show={show} onHide={onHide}>
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title>Edit Profile</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control value={user?.email || ''} disabled readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="e.g. +1 416 555 0100"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Brief introduction about your role and experience"
            />
          </Form.Group>
          <div className="d-flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="light" type="button" onClick={onHide}>
              Cancel
            </Button>
          </div>
        </form>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default EditProfileOffcanvas;
