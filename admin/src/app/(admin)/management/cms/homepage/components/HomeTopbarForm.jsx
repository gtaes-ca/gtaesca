import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const DEFAULT_FORM = {
  phone: '',
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

  const loadContactDetails = useCallback(async () => {
    setLoading(true);
    try {
      const [topbarRes, settingsRes] = await Promise.all([
        httpClient.get('/api/admin/web-content/home/topbar'),
        httpClient.get('/api/admin/web-content/contact/settings'),
      ]);
      const topbar = topbarRes.data.content || {};
      const settings = settingsRes.data.content || {};
      setForm({
        phone: topbar.phone || settings.phone || '',
        email: topbar.email || settings.displayEmail || '',
        address: topbar.address || settings.address || '',
        social: {
          facebook: topbar.social?.facebook || '',
          twitter: topbar.social?.twitter || '',
          linkedin: topbar.social?.linkedin || '',
          instagram: topbar.social?.instagram || '',
        },
      });
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load contact details',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadContactDetails();
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
      const [topbarRes] = await Promise.all([
        httpClient.put('/api/admin/web-content/home/topbar', {
          content: {
            phone: form.phone,
            email: form.email,
            address: form.address,
            social: form.social,
          },
        }),
        httpClient.put('/api/admin/web-content/contact/settings', {
          content: {
            phone: form.phone,
            displayEmail: form.email,
            address: form.address,
            syncContactDetails: true,
          },
        }),
      ]);
      const content = topbarRes.data.content || form;
      setForm({
        phone: content.phone || form.phone || '',
        email: content.email || '',
        address: content.address || '',
        social: {
          facebook: content.social?.facebook || '',
          twitter: content.social?.twitter || '',
          linkedin: content.social?.linkedin || '',
          instagram: content.social?.instagram || '',
        },
      });
      showNotification({ message: 'Contact details saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save contact details',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Contact Details"
      description="Manage the phone, email, address, and social links shown in the website header and contact page."
    >
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Row className="g-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Display Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+55 827 057 5405"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Display Email</Form.Label>
                <Form.Control
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="example@gamil.com"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Office Address</Form.Label>
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
                  placeholder="https://facebook.com/gtaes"
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
                  placeholder="https://twitter.com/gtaes"
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
                  placeholder="https://linkedin.com/gtaes"
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
                  placeholder="https://instagram.com/gtaes"
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Contact Details'}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default HomeTopbarForm;
