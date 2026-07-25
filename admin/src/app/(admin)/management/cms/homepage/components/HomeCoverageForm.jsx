import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import { mapHomeCoverageForSave, mapHomeCoverageFromApi } from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

const HomeCoverageForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapHomeCoverageFromApi());
  const [locationCounts, setLocationCounts] = useState({ gta: 0, nearby: 0 });

  const loadCoverage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/home/coverage');
      const content = res.data.content || {};
      setForm(mapHomeCoverageFromApi(content));
      setLocationCounts({
        gta: Array.isArray(content.locations?.gta) ? content.locations.gta.length : 0,
        nearby: Array.isArray(content.locations?.nearby) ? content.locations.nearby.length : 0,
      });
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load coverage section',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadCoverage();
  }, [loadCoverage]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titleLine1?.trim()) {
      showNotification({ message: 'Title is required', variant: 'danger' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await httpClient.put('/api/admin/web-content/home/coverage', {
        content: mapHomeCoverageForSave(form),
      });
      setForm(mapHomeCoverageFromApi(res.data.content || {}));
      showNotification({ message: 'Coverage section saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save coverage section',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Homepage — Coverage Areas"
      description="Heading and details for the homepage coverage section. Area chips are loaded automatically from Management → Service Locations (GTA & Nearby)."
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
                  placeholder="Service Coverage"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Title line 1</Form.Label>
                <Form.Control
                  value={form.titleLine1}
                  onChange={(e) => updateField('titleLine1', e.target.value)}
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
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={form.text}
                  onChange={(e) => updateField('text', e.target.value)}
                  placeholder="Short description under the heading"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>GTA category label</Form.Label>
                <Form.Control
                  value={form.gtaLabel}
                  onChange={(e) => updateField('gtaLabel', e.target.value)}
                  placeholder="Greater Toronto Area"
                />
                <Form.Text className="text-muted">{locationCounts.gta} locations currently listed</Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nearby category label</Form.Label>
                <Form.Control
                  value={form.nearbyLabel}
                  onChange={(e) => updateField('nearbyLabel', e.target.value)}
                  placeholder="Nearby Areas"
                />
                <Form.Text className="text-muted">{locationCounts.nearby} locations currently listed</Form.Text>
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save coverage section'}
            </Button>
          </div>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default HomeCoverageForm;
