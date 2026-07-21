import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import {
  CONTACT_IMAGE_RATIO,
  MAX_CMS_IMAGE_BYTES,
  mapAboutContactForSave,
  mapAboutContactFromApi,
} from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

async function uploadContactImage(dataUrl, key) {
  const res = await httpClient.post('/api/admin/web-content/upload-image', { dataUrl, key });
  return res.data.url;
}

function ImagePreview({ label, imageUrl }) {
  return (
    <div>
      <p className="small text-muted mb-2">{label}</p>
      <div
        className="position-relative border rounded overflow-hidden bg-light"
        style={{ aspectRatio: CONTACT_IMAGE_RATIO, maxWidth: 320 }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
          />
        ) : (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-muted small px-2 text-center">
            No image selected
          </div>
        )}
      </div>
    </div>
  );
}

const AboutContactForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapAboutContactFromApi());

  const loadContact = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/about/contact');
      setForm(mapAboutContactFromApi(res.data.content || {}));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load contact section content',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadContact();
  }, [loadContact]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
        backgroundImagePreview: dataUrl,
        backgroundImageData: dataUrl,
      }));
    };
    reader.onerror = () => {
      showNotification({ message: 'Failed to read image file', variant: 'danger' });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let backgroundImage = form.backgroundImage;

      if (form.backgroundImageData) {
        backgroundImage = await uploadContactImage(form.backgroundImageData, 'about-contact-bg');
      }

      const res = await httpClient.put('/api/admin/web-content/about/contact', {
        content: mapAboutContactForSave({
          ...form,
          backgroundImage,
        }),
      });
      setForm(mapAboutContactFromApi(res.data.content || {}));
      showNotification({ message: 'Contact section saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save contact section content',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Contact With Us"
      description="Text and left-side image section shown on the About Us page."
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
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label>Primary Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={form.text1}
                  onChange={(e) => updateField('text1', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group>
                <Form.Label>Secondary Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={form.text2}
                  onChange={(e) => updateField('text2', e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Primary Button Text</Form.Label>
                <Form.Control
                  value={form.primaryButtonText}
                  onChange={(e) => updateField('primaryButtonText', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Primary Button Link</Form.Label>
                <Form.Control
                  value={form.primaryButtonLink}
                  onChange={(e) => updateField('primaryButtonLink', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Secondary Button Text</Form.Label>
                <Form.Control
                  value={form.secondaryButtonText}
                  onChange={(e) => updateField('secondaryButtonText', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Secondary Button Link</Form.Label>
                <Form.Control
                  value={form.secondaryButtonLink}
                  onChange={(e) => updateField('secondaryButtonLink', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <ImagePreview label="Left side image" imageUrl={form.backgroundImagePreview} />
              <Form.Control
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="mt-2"
                onChange={(e) => {
                  handleImageSelect(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </Col>

            <Col xs={12}>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Contact With Us'}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default AboutContactForm;
