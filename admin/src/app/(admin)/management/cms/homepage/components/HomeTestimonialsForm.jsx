import { useCallback, useEffect, useState } from 'react';
import { Accordion, Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useNotificationContext } from '@/context/useNotificationContext';
import { mapTestimonialsForSave, mapTestimonialsFromApi } from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

const MAX_TESTIMONIALS = 12;

const emptyItem = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return {
    message: '',
    clientName: '',
    timestamp: local,
    rating: 5,
  };
};

const HomeTestimonialsForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapTestimonialsFromApi());

  const loadTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/home/testimonials');
      setForm(mapTestimonialsFromApi(res.data.content || {}));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load testimonials',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const addItem = () => {
    if (form.items.length >= MAX_TESTIMONIALS) {
      showNotification({
        message: `You can add up to ${MAX_TESTIMONIALS} testimonials`,
        variant: 'warning',
      });
      return;
    }
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, emptyItem()],
    }));
  };

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const moveItem = (index, direction) => {
    setForm((prev) => {
      const next = [...prev.items];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return { ...prev, items: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titleLine1?.trim()) {
      showNotification({ message: 'Section title is required', variant: 'danger' });
      return;
    }

    for (let i = 0; i < form.items.length; i += 1) {
      const item = form.items[i];
      if (!item.message?.trim() || !item.clientName?.trim() || !item.timestamp) {
        showNotification({
          message: `Testimonial ${i + 1} needs a message, client name, and timestamp`,
          variant: 'danger',
        });
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await httpClient.put('/api/admin/web-content/home/testimonials', {
        content: mapTestimonialsForSave(form),
      });
      setForm(mapTestimonialsFromApi(res.data.content || {}));
      showNotification({ message: 'Testimonials saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save testimonials',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ComponentContainerCard title="Testimonials">
        <p className="mb-0 text-muted">Loading…</p>
      </ComponentContainerCard>
    );
  }

  return (
    <ComponentContainerCard title="Testimonials">
      <Form onSubmit={handleSubmit}>
        <Row className="g-3 mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Tagline</Form.Label>
              <Form.Control
                value={form.tagline}
                onChange={(e) => updateField('tagline', e.target.value)}
                placeholder="Testimonials"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={form.titleLine1}
                onChange={(e) => updateField('titleLine1', e.target.value)}
                placeholder="What Our Clients Say"
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Title line 2 (optional)</Form.Label>
              <Form.Control
                value={form.titleLine2}
                onChange={(e) => updateField('titleLine2', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0">Client testimonials</h5>
          <Button type="button" variant="outline-primary" size="sm" onClick={addItem}>
            <IconifyIcon icon="bx:plus" className="me-1" />
            Add testimonial
          </Button>
        </div>

        {!form.items.length ? (
          <p className="text-muted">No testimonials yet. Add one to show this section on the homepage.</p>
        ) : (
          <Accordion alwaysOpen defaultActiveKey="0">
            {form.items.map((item, index) => (
              <Accordion.Item eventKey={String(index)} key={`testimonial-${index}`}>
                <Accordion.Header>
                  {item.clientName?.trim() || `Testimonial ${index + 1}`}
                  {item.rating ? ` · ${item.rating}★` : ''}
                </Accordion.Header>
                <Accordion.Body>
                  <Row className="g-3">
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={item.message}
                          onChange={(e) => updateItem(index, 'message', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Client name</Form.Label>
                        <Form.Control
                          value={item.clientName}
                          onChange={(e) => updateItem(index, 'clientName', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Timestamp</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={item.timestamp}
                          onChange={(e) => updateItem(index, 'timestamp', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Rating (stars)</Form.Label>
                        <Form.Select
                          value={item.rating}
                          onChange={(e) => updateItem(index, 'rating', Number(e.target.value))}
                        >
                          {[5, 4, 3, 2, 1].map((star) => (
                            <option key={star} value={star}>
                              {star} {star === 1 ? 'star' : 'stars'}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12} className="d-flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="light"
                        size="sm"
                        disabled={index === 0}
                        onClick={() => moveItem(index, -1)}
                      >
                        Move up
                      </Button>
                      <Button
                        type="button"
                        variant="light"
                        size="sm"
                        disabled={index === form.items.length - 1}
                        onClick={() => moveItem(index, 1)}
                      >
                        Move down
                      </Button>
                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}

        <div className="mt-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Save testimonials'}
          </Button>
        </div>
      </Form>
    </ComponentContainerCard>
  );
};

export default HomeTestimonialsForm;
