import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import {
  BANNER_IMAGE_RATIO,
  MAX_CMS_IMAGE_BYTES,
  mapTeamBannerForSave,
  mapTeamBannerFromApi,
} from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

async function uploadBannerImage(dataUrl, key) {
  const res = await httpClient.post('/api/admin/web-content/upload-image', { dataUrl, key });
  return res.data.url;
}

function ImagePreview({ label, imageUrl, aspectRatio }) {
  return (
    <div>
      <p className="small text-muted mb-2">{label}</p>
      <div
        className="position-relative border rounded overflow-hidden bg-light"
        style={{ aspectRatio, maxWidth: 320 }}
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

const TeamBannerForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapTeamBannerFromApi());

  const loadBanner = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/team/banner');
      setForm(mapTeamBannerFromApi(res.data.content || {}));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load banner content',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadBanner();
  }, [loadBanner]);

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
        backgroundImage = await uploadBannerImage(form.backgroundImageData, 'team-banner-background');
      }

      const res = await httpClient.put('/api/admin/web-content/team/banner', {
        content: mapTeamBannerForSave({
          ...form,
          backgroundImage,
        }),
      });
      setForm(mapTeamBannerFromApi(res.data.content || {}));
      showNotification({ message: 'Banner saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save banner content',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Page Banner"
      description="Controls the Team listing page header title and background image."
    >
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Row className="g-4">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Banner Title</Form.Label>
                <Form.Control
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <ImagePreview
                label="Background image (optional)"
                imageUrl={form.backgroundImagePreview}
                aspectRatio={BANNER_IMAGE_RATIO}
              />
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
                {submitting ? 'Saving...' : 'Save Banner'}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default TeamBannerForm;
