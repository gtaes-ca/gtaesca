import { useCallback, useEffect, useState } from 'react';
import { Accordion, Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useNotificationContext } from '@/context/useNotificationContext';
import { mapAboutValuesForSave, mapAboutValuesFromApi } from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

const MAX_VALUES = 8;

const ICON_OPTIONS = [
  { value: 'icon-certified', label: 'Certified / shield' },
  { value: 'icon-speech-bubbles', label: 'Speech bubbles' },
  { value: 'icon-medal', label: 'Medal / quality' },
  { value: 'icon-clock', label: 'Clock' },
  { value: 'icon-check', label: 'Check' },
  { value: 'icon-happy-customer', label: 'Happy customer' },
  { value: 'icon-like', label: 'Like' },
  { value: 'icon-hands-on-experience', label: 'Hands-on experience' },
  { value: 'icon-customer-support', label: 'Customer support' },
  { value: 'icon-project-complete', label: 'Project complete' },
];

const emptyItem = () => ({
  icon: 'icon-check',
  title: '',
  text: '',
});

const AboutValuesForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapAboutValuesFromApi());

  const loadValues = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/about/values');
      setForm(mapAboutValuesFromApi(res.data.content || {}));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load About values',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadValues();
  }, [loadValues]);

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
    if (form.items.length >= MAX_VALUES) {
      showNotification({
        message: `You can add up to ${MAX_VALUES} value cards`,
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

    if (!form.title?.trim()) {
      showNotification({ message: 'Section title is required', variant: 'danger' });
      return;
    }

    for (let i = 0; i < form.items.length; i += 1) {
      const item = form.items[i];
      if (!item.title?.trim() || !item.text?.trim()) {
        showNotification({
          message: `Value card ${i + 1} needs a title and description`,
          variant: 'danger',
        });
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await httpClient.put('/api/admin/web-content/about/values', {
        content: mapAboutValuesForSave(form),
      });
      setForm(mapAboutValuesFromApi(res.data.content || {}));
      showNotification({ message: 'About values saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save About values',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Our Values"
      description="Value cards shown on /about under “What We Stand For”."
    >
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Row className="g-4 mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tagline</Form.Label>
                <Form.Control
                  value={form.tagline}
                  onChange={(e) => updateField('tagline', e.target.value)}
                  placeholder="Our Values"
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="mb-0">Value cards</h5>
            <Button type="button" variant="outline-primary" size="sm" onClick={addItem}>
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add card
            </Button>
          </div>

          <Accordion alwaysOpen>
            {form.items.map((item, index) => (
              <Accordion.Item eventKey={String(index)} key={`value-${index}`}>
                <Accordion.Header>
                  {item.title?.trim() || `Value card ${index + 1}`}
                </Accordion.Header>
                <Accordion.Body>
                  <Row className="g-3">
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Icon</Form.Label>
                        <Form.Select
                          value={item.icon}
                          onChange={(e) => updateItem(index, 'icon', e.target.value)}
                        >
                          {ICON_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={8}>
                      <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          value={item.title}
                          onChange={(e) => updateItem(index, 'title', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={item.text}
                          onChange={(e) => updateItem(index, 'text', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} className="d-flex gap-2">
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
                        className="ms-auto"
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

          <div className="mt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save values'}
            </Button>
          </div>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default AboutValuesForm;
