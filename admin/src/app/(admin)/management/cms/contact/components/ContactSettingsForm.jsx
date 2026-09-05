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

  const updateRecipient = (index, value) => {
    setForm((prev) => ({
      ...prev,
      recipientEmails: prev.recipientEmails.map((email, i) => (i === index ? value : email)),
    }));
  };

  const addRecipient = () => {
    setForm((prev) => ({
      ...prev,
      recipientEmails: [...prev.recipientEmails, ''],
    }));
  };

  const removeRecipient = (index) => {
    setForm((prev) => {
      const next = prev.recipientEmails.filter((_, i) => i !== index);
      return {
        ...prev,
        recipientEmails: next.length ? next : [''],
      };
    });
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
      description="Configure the contact form, sender, recipients, and map."
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
                <Form.Label>From Name</Form.Label>
                <Form.Control
                  value={form.plunkFromName}
                  onChange={(e) => updateField('plunkFromName', e.target.value)}
                  placeholder="GTA Electric Services"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>From Email</Form.Label>
                <Form.Control
                  type="email"
                  value={form.plunkFromEmail}
                  onChange={(e) => updateField('plunkFromEmail', e.target.value)}
                  placeholder="gtaes.ca@hashmark.tech"
                  required
                />
              </Form.Group>
            </Col>

            {form.recipientEmails.map((email, idx) => (
              <Col md={6} key={`recipient-${idx}`}>
                <Form.Group>
                  <Form.Label>
                    {form.recipientEmails.length > 1
                      ? `Recipient Email ${idx + 1}`
                      : 'Recipient Email'}
                  </Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => updateRecipient(idx, e.target.value)}
                      placeholder="quotes@yourcompany.com"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={() => removeRecipient(idx)}
                      disabled={form.recipientEmails.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            ))}
            <Col xs={12}>
              <Button type="button" variant="outline-secondary" onClick={addRecipient}>
                Add Recipient Email
              </Button>
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
