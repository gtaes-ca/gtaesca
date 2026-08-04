import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const DEFAULT_SPEC_ITEMS = [
  'Licensed & Insured electricians',
  'Residential & Commercial Expertise',
  'Transparent Qoute with no hidden fee',
];

export default function ContactSpecificationForm() {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState(DEFAULT_SPEC_ITEMS);

  const loadSpec = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/contact/settings');
      const loaded = res.data?.content?.specificationItems;
      if (Array.isArray(loaded) && loaded.length) setItems(loaded.map((x) => String(x || '').trim()).filter(Boolean));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load specification',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadSpec();
  }, [loadSpec]);

  const updateItem = (index, value) => {
    setItems((prev) => prev.map((item, i) => (i === index ? value)));
  };

  const addItem = () => setItems((prev) => [...prev, '']);
  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = items.map((x) => String(x || '').trim()).filter(Boolean);
      const res = await httpClient.put('/api/admin/web-content/contact/settings', {
        content: { specificationItems: payload },
      });

      const next = res.data?.content?.specificationItems;
      setItems(Array.isArray(next) && next.length ? next : payload);
      showNotification({ message: 'Specification saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save specification',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Specification"
      description="These bullets are shown in the website footer."
    >
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Row className="g-4">
            {items.map((value, idx) => (
              <Form.Group key={`${idx}`} className="mb-0" as={Row} controlId={`spec-${idx}`}>
                <Form.Label column sm={3} className="col-form-label">
                  Item {idx + 1}
                </Form.Label>
                <div className="col-sm-9">
                  <Form.Control
                    value={value}
                    onChange={(e) => updateItem(idx, e.target.value)}
                    placeholder="e.g. Residential & Commercial Expertise"
                    required
                  />
                  <div className="mt-2 d-flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => removeItem(idx)}
                      disabled={items.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Form.Group>
            ))}

            <div className="d-flex flex-wrap gap-2 mt-3">
              <Button type="button" variant="outline-secondary" onClick={addItem}>
                Add Item
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Specification'}
              </Button>
            </div>
          </Row>
        </form>
      )}
    </ComponentContainerCard>
  );
}

