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
      description="Configure the contact form, where submissions are emailed, and map coordinates."
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
                  Form submissions are sent to this address.
                </Form.Text>
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
