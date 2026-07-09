import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const DEFAULT_FORM = {
  email: '',
  address: '',
  social: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
  },
};

const HomeTopbarForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  const loadTopbar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/home/topbar');
      const content = res.data.content || DEFAULT_FORM;
      setForm({
        email: content.email || '',
        address: content.address || '',
        social: {
          facebook: content.social?.facebook || '',
          twitter: content.social?.twitter || '',
          linkedin: content.social?.linkedin || '',
          instagram: content.social?.instagram || '',
        },
      });
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load homepage top bar content',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadTopbar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSocial = (key, value) => {
    setForm((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await httpClient.put('/api/admin/web-content/home/topbar', {
        content: form,
      });
      const content = res.data.content || form;
      setForm({
        email: content.email || '',
        address: content.address || '',
        social: {
          facebook: content.social?.facebook || '',
          twitter: content.social?.twitter || '',
          linkedin: content.social?.linkedin || '',
          instagram: content.social?.instagram || '',
        },
      });
      showNotification({ message: 'Homepage top bar saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save top bar content',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Top Bar"
      description="Manage the email, address, and social links shown in the website header top bar."
    >
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Row className="g-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="contact@example.com"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="12 Green Road, 05 New York"
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <h6 className="mb-3">Social accounts</h6>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Facebook URL</Form.Label>
                <Form.Control
                  type="url"
                  value={form.social.facebook}
                  onChange={(e) => updateSocial('facebook', e.target.value)}
                  placeholder="https://facebook.com/your-page"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Twitter / X URL</Form.Label>
                <Form.Control
                  type="url"
                  value={form.social.twitter}
                  onChange={(e) => updateSocial('twitter', e.target.value)}
                  placeholder="https://x.com/your-handle"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>LinkedIn URL</Form.Label>
                <Form.Control
                  type="url"
                  value={form.social.linkedin}
                  onChange={(e) => updateSocial('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/your-company"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Instagram URL</Form.Label>
                <Form.Control
                  type="url"
                  value={form.social.instagram}
                  onChange={(e) => updateSocial('instagram', e.target.value)}
                  placeholder="https://instagram.com/your-handle"
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Top Bar'}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default HomeTopbarForm;
