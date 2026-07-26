import { useCallback, useEffect, useState } from 'react';
import { Accordion, Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useNotificationContext } from '@/context/useNotificationContext';
import {
  MAX_CMS_IMAGE_BYTES,
  mapAboutCredentialsForSave,
  mapAboutCredentialsFromApi,
  resolveCmsAssetUrl,
} from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

const MAX_ITEMS = 6;

const emptyItem = () => ({
  image: '',
  imagePreview: '',
  imageData: null,
  label: '',
});

const AboutCredentialsForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapAboutCredentialsFromApi());

  const loadCredentials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/about/credentials');
      setForm(mapAboutCredentialsFromApi(res.data.content || {}));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load credentials section',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const handleImageSelect = (index, file) => {
    if (!file) return;
    if (file.size > MAX_CMS_IMAGE_BYTES) {
      showNotification({ message: 'Image must be 5MB or smaller', variant: 'danger' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setForm((prev) => ({
        ...prev,
        items: prev.items.map((item, i) =>
          i === index
            ? {
                ...item,
                imagePreview: dataUrl,
                imageData: dataUrl,
              }
            : item
        ),
      }));
    };
    reader.onerror = () => {
      showNotification({ message: 'Failed to read image file', variant: 'danger' });
    };
    reader.readAsDataURL(file);
  };

  const addItem = () => {
    if (form.items.length >= MAX_ITEMS) {
      showNotification({
        message: `You can add up to ${MAX_ITEMS} credential cards`,
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
      if (!item.label?.trim()) {
        showNotification({
          message: `Credential card ${i + 1} needs a label`,
          variant: 'danger',
        });
        return;
      }
      if (!item.image && !item.imageData) {
        showNotification({
          message: `Credential card ${i + 1} needs a logo image`,
          variant: 'danger',
        });
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await httpClient.put('/api/admin/web-content/about/credentials', {
        content: mapAboutCredentialsForSave(form),
      });
      setForm(mapAboutCredentialsFromApi(res.data.content || {}));
      showNotification({ message: 'Credentials section saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save credentials section',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Licensed & Certified"
      description="Credential logos shown on /about after Our Values. Upload official ESA / WSIB logos when available."
    >
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Row className="g-4 mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Section title</Form.Label>
                <Form.Control
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>ESA license number</Form.Label>
                <Form.Control
                  value={form.esaLicenseNumber}
                  onChange={(e) => updateField('esaLicenseNumber', e.target.value)}
                  placeholder="#7014495"
                />
                <Form.Text className="text-muted">
                  Enter only the number (e.g. #7014495). It appears under “ESA Licensed”.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="mb-0">Credential cards</h5>
            <Button type="button" variant="outline-primary" size="sm" onClick={addItem}>
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add card
            </Button>
          </div>

          <Accordion alwaysOpen>
            {form.items.map((item, index) => (
              <Accordion.Item eventKey={String(index)} key={`credential-${index}`}>
                <Accordion.Header>
                  {item.label?.trim() || `Credential card ${index + 1}`}
                </Accordion.Header>
                <Accordion.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Label</Form.Label>
                        <Form.Control
                          value={item.label}
                          onChange={(e) => updateItem(index, 'label', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Logo image</Form.Label>
                        <div
                          className="position-relative border rounded overflow-hidden bg-light mb-2"
                          style={{ aspectRatio: '16 / 7', maxWidth: 280 }}
                        >
                          {item.imagePreview ? (
                            <img
                              src={item.imagePreview || resolveCmsAssetUrl(item.image)}
                              alt={item.label || 'Credential logo'}
                              className="position-absolute top-0 start-0 w-100 h-100"
                              style={{ objectFit: 'contain', padding: 12 }}
                            />
                          ) : (
                            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
                              No image selected
                            </div>
                          )}
                        </div>
                        <Form.Control
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                          onChange={(e) => handleImageSelect(index, e.target.files?.[0])}
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
              {submitting ? 'Saving…' : 'Save credentials'}
            </Button>
          </div>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default AboutCredentialsForm;
