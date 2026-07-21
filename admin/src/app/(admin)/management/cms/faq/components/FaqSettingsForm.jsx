import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import { mapFaqSettingsForSave, mapFaqSettingsFromApi } from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

const FaqSettingsForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapFaqSettingsFromApi());

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/faq/settings');
      setForm(mapFaqSettingsFromApi(res.data.content || {}));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load FAQ page settings',
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
      const res = await httpClient.put('/api/admin/web-content/faq/settings', {
        content: mapFaqSettingsForSave(form),
      });
      setForm(mapFaqSettingsFromApi(res.data.content || {}));
      showNotification({ message: 'Page settings saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save page settings',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Page Intro"
      description="Optional heading and intro text shown above the FAQ accordion."
    >
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Row className="g-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tagline</Form.Label>
                <Form.Control
                  value={form.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Section Title</Form.Label>
                <Form.Control
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Intro Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={form.introText}
                  onChange={(e) => updateField('introText', e.target.value)}
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

export default FaqSettingsForm;
