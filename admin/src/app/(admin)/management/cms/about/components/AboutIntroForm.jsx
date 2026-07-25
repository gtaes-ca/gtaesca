import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import {
  MAX_CMS_IMAGE_BYTES,
  mapAboutIntroForSave,
  mapAboutIntroFromApi,
} from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

const AboutIntroForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapAboutIntroFromApi());

  const loadIntro = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/about/intro');
      setForm(mapAboutIntroFromApi(res.data.content || {}));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load About page intro',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadIntro();
  }, [loadIntro]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updatePoint = (index, value) => {
    setForm((prev) => ({
      ...prev,
      points: prev.points.map((point, i) => (i === index ? value : point)),
    }));
  };

  const handleImageSelect = (file) => {
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
        imagePreview: dataUrl,
        imageData: dataUrl,
      }));
    };
    reader.onerror = () => {
      showNotification({ message: 'Failed to read image file', variant: 'danger' });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      showNotification({ message: 'Title is required', variant: 'danger' });
      return;
    }
    if (!form.image && !form.imageData) {
      showNotification({ message: 'Section image is required', variant: 'danger' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await httpClient.put('/api/admin/web-content/about/intro', {
        content: {
          ...mapAboutIntroForSave(form),
          imageData: form.imageData || undefined,
        },
      });
      setForm(mapAboutIntroFromApi(res.data.content || {}));
      showNotification({ message: 'About page intro saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save About page intro',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="About Page Intro"
      description="Content for the redesigned top section on /about (separate from the homepage About section)."
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
                  placeholder="Who We Are"
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
            <Col md={6}>
              <Form.Group>
                <Form.Label>Paragraph 1</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={form.text1}
                  onChange={(e) => updateField('text1', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Paragraph 2</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={form.text2}
                  onChange={(e) => updateField('text2', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Label className="mb-2">Highlight points (up to 6)</Form.Label>
              <Row className="g-3">
                {form.points.map((point, index) => (
                  <Col md={6} key={`point-${index}`}>
                    <Form.Control
                      value={point}
                      onChange={(e) => updatePoint(index, e.target.value)}
                      placeholder={`Point ${index + 1}`}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Button text</Form.Label>
                <Form.Control
                  value={form.buttonText}
                  onChange={(e) => updateField('buttonText', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Button link</Form.Label>
                <Form.Control
                  value={form.buttonLink}
                  onChange={(e) => updateField('buttonLink', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Feature image</Form.Label>
                <div
                  className="position-relative border rounded overflow-hidden bg-light mb-2"
                  style={{ aspectRatio: '4 / 3', maxWidth: 320 }}
                >
                  {form.imagePreview ? (
                    <img
                      src={form.imagePreview}
                      alt="About intro"
                      className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
                      No image selected
                    </div>
                  )}
                </div>
                <Form.Control
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => handleImageSelect(e.target.files?.[0])}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save intro'}
            </Button>
          </div>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default AboutIntroForm;
