import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import {
  mapContactSettingsForSave,
  mapContactSettingsFromApi,
} from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

const ContactSettingsForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapContactSettingsFromApi());

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/contact/settings');
      setForm(mapContactSettingsFromApi(res.data.content || {}));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load contact settings',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await httpClient.put('/api/admin/web-content/contact/settings', {
        content: mapContactSettingsForSave(form),
      });
      setForm(mapContactSettingsFromApi(res.data.content || {}));
      showNotification({ message: 'Contact settings saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save contact settings',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Get A Free Quote"
      description="Configure the contact form, SMTP sending account, where submissions are emailed, and map coordinates."
    >
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Row className="g-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Form Title</Form.Label>
                <Form.Control
                  value={form.formTitle}
                  onChange={(e) => updateField('formTitle', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Recipient Email</Form.Label>
                <Form.Control
                  type="email"
                  value={form.recipientEmail}
                  onChange={(e) => updateField('recipientEmail', e.target.value)}
                  placeholder="quotes@yourcompany.com"
                  required
                />
                <Form.Text className="text-muted">
                  Contact form submissions are delivered to this address.
                </Form.Text>
              </Form.Group>
            </Col>

            <Col xs={12}>
              <h5 className="mb-0">SMTP Account</h5>
              <p className="text-muted small mb-0">
                Used for all site emails (quotes, bookings, invitations, password resets).
                Server connection still uses <code>SMTP_HOST</code> / <code>SMTP_PORT</code> from the API .env.
              </p>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>SMTP User</Form.Label>
                <Form.Control
                  type="email"
                  value={form.smtpUser}
                  onChange={(e) => updateField('smtpUser', e.target.value)}
                  placeholder="you@gmail.com"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>SMTP Password</Form.Label>
                <Form.Control
                  type="password"
                  value={form.smtpPass}
                  onChange={(e) => updateField('smtpPass', e.target.value)}
                  placeholder={form.smtpPassConfigured ? '•••••••• (leave blank to keep)' : 'App password'}
                  autoComplete="new-password"
                  required={!form.smtpPassConfigured}
                />
                <Form.Text className="text-muted">
                  {form.smtpPassConfigured
                    ? 'Password is already saved. Enter a new value only to replace it.'
                    : 'For Gmail, use a 16-character App Password.'}
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>SMTP From Email</Form.Label>
                <Form.Control
                  type="email"
                  value={form.smtpFromEmail}
                  onChange={(e) => updateField('smtpFromEmail', e.target.value)}
                  placeholder="you@gmail.com"
                  required
                />
                <Form.Text className="text-muted">
                  Must match the SMTP user (or a verified Send mail as alias).
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>SMTP From Name</Form.Label>
                <Form.Control
                  value={form.smtpFromName}
                  onChange={(e) => updateField('smtpFromName', e.target.value)}
                  placeholder="GTA Electric Services"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => updateField('latitude', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => updateField('longitude', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Map Zoom (1–20)</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={20}
                  value={form.mapZoom}
                  onChange={(e) => updateField('mapZoom', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Settings'}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default ContactSettingsForm;
