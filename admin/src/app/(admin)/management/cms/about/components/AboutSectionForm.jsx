import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import {
  ABOUT_IMAGE_RATIO,
  MAX_CMS_IMAGE_BYTES,
  mapAboutForSave,
  mapAboutFromApi,
} from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

async function uploadAboutImage(dataUrl, key) {
  const res = await httpClient.post('/api/admin/web-content/upload-image', { dataUrl, key });
  return res.data.url;
}

function ImagePreview({ label, imageUrl }) {
  return (
    <div>
      <p className="small text-muted mb-2">{label}</p>
      <div
        className="position-relative border rounded overflow-hidden bg-light"
        style={{ aspectRatio: ABOUT_IMAGE_RATIO, maxWidth: 220 }}
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

const AboutSectionForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapAboutFromApi());

  const loadAbout = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/home/about');
      setForm(mapAboutFromApi(res.data.content || {}));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load about section content',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadAbout();
  }, [loadAbout]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (type, file) => {
    if (!file) return;
    if (file.size > MAX_CMS_IMAGE_BYTES) {
      showNotification({ message: 'Image must be 5MB or smaller', variant: 'danger' });
      return;
    }

    const previewField = type === 'image2' ? 'image2Preview' : 'image1Preview';
    const dataField = type === 'image2' ? 'image2Data' : 'image1Data';

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setForm((prev) => ({
        ...prev,
        [previewField]: dataUrl,
        [dataField]: dataUrl,
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
      let image1 = form.image1;
      let image2 = form.image2;

      if (form.image1Data) {
        image1 = await uploadAboutImage(form.image1Data, 'home-about-image-1');
      }
      if (form.image2Data) {
        image2 = await uploadAboutImage(form.image2Data, 'home-about-image-2');
      }

      const res = await httpClient.put('/api/admin/web-content/home/about', {
        content: mapAboutForSave({
          ...form,
          image1,
          image2,
        }),
      });
      setForm(mapAboutFromApi(res.data.content || {}));
      showNotification({ message: 'About section saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save about section content',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Get To Know Us"
      description="Shared on the homepage and About Us page. Updates apply to both."
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
            <Col md={6}>
              <Form.Group>
                <Form.Label>Button Link</Form.Label>
                <Form.Control
                  value={form.buttonLink}
                  onChange={(e) => updateField('buttonLink', e.target.value)}
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
                <Form.Label>Button Text</Form.Label>
                <Form.Control
                  value={form.buttonText}
                  onChange={(e) => updateField('buttonText', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <ImagePreview label="Primary side image" imageUrl={form.image1Preview} />
              <Form.Control
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="mt-2"
                onChange={(e) => {
                  handleImageSelect('image1', e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </Col>

            <Col md={6}>
              <ImagePreview label="Secondary side image" imageUrl={form.image2Preview} />
              <Form.Control
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="mt-2"
                onChange={(e) => {
                  handleImageSelect('image2', e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </Col>

            <Col xs={12}>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Get To Know Us'}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default AboutSectionForm;
