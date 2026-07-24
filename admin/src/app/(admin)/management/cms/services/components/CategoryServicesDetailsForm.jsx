import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import {
  mapServiceCategoryDetailsForSave,
  mapServiceCategoryDetailsFromApi,
} from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

export default function CategoryServicesDetailsForm({ pageKey, title, description }) {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapServiceCategoryDetailsFromApi());

  const loadDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get(`/api/admin/web-content/${pageKey}/details`);
      setForm(mapServiceCategoryDetailsFromApi(res.data.content || {}));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load page details',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [pageKey, showNotification]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await httpClient.put(`/api/admin/web-content/${pageKey}/details`, {
        content: mapServiceCategoryDetailsForSave(form),
      });
      setForm(mapServiceCategoryDetailsFromApi(res.data.content || {}));
      showNotification({ message: 'Page details saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save page details',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard title={title} description={description}>
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
                  value={form.text}
                  onChange={(e) => updateField('text', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Details'}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </ComponentContainerCard>
  );
}
