import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import {
  mapServicesHomepageSectionForSave,
  mapServicesHomepageSectionFromApi,
} from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

export default function ServicesHomepageSectionForm() {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapServicesHomepageSectionFromApi());

  const loadSection = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/services/homepage-section');
      setForm(mapServicesHomepageSectionFromApi(res.data.content || {}));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load homepage section headings',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadSection();
  }, [loadSection]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titleLine1?.trim()) {
      showNotification({ message: 'Title line 1 is required', variant: 'danger' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await httpClient.put('/api/admin/web-content/services/homepage-section', {
        content: mapServicesHomepageSectionForSave(form),
      });
      setForm(mapServicesHomepageSectionFromApi(res.data.content || {}));
      showNotification({ message: 'Homepage section headings saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save homepage section headings',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Homepage “What We Do” Section"
      description="Tagline and heading shown above the Residential & Commercial cards on the homepage."
    >
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Row className="g-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tagline</Form.Label>
                <Form.Control
                  value={form.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  placeholder="What We Do"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Title line 1</Form.Label>
                <Form.Control
                  value={form.titleLine1}
                  onChange={(e) => updateField('titleLine1', e.target.value)}
                  placeholder="Featured Electrical Services"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Title line 2</Form.Label>
                <Form.Control
                  value={form.titleLine2}
                  onChange={(e) => updateField('titleLine2', e.target.value)}
                  placeholder="for Your Home & Business"
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save headings'}
            </Button>
          </div>
        </form>
      )}
    </ComponentContainerCard>
  );
}
