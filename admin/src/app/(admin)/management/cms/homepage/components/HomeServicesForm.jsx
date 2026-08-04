import { useCallback, useEffect, useState } from 'react';
import { Accordion, Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import { MAX_CMS_IMAGE_BYTES, resolveCmsAssetUrl } from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

const HOME_SERVICES_ICON = 'icon-like';

const DEFAULT_ITEMS = [
  {
    title: 'Fair & Transparent Pricing',
    text: 'Honest upfront quotes with no hidden fees on residential and commercial electrical work.',
    link: '/services',
    icon: HOME_SERVICES_ICON,
    image: '',
  },
  {
    title: 'Licensed & Insured',
    text: 'ESA-certified electricians delivering safe, code-compliant work backed by our satisfaction guarantee.',
    link: '/about',
    icon: HOME_SERVICES_ICON,
    image: '',
  },
  {
    title: '24/7 Emergency Service',
    text: 'Available around the clock for urgent electrical repairs across the Greater Toronto Area.',
    link: '/contact',
    icon: HOME_SERVICES_ICON,
    image: '',
  },
];

function mapItemsFromApi(items = []) {
  if (!items.length) return DEFAULT_ITEMS;
  return items.slice(0, 3).map((item, index) => {
    const fallback = DEFAULT_ITEMS[index] || DEFAULT_ITEMS[0];
    return {
      title: item.title || fallback.title,
      text: item.text || fallback.text,
      link: item.link || fallback.link,
      icon: item.icon || fallback.icon || HOME_SERVICES_ICON,
      image: item.image || fallback.image || '',
      imagePreview: item.image ? resolveCmsAssetUrl(item.image) : '',
    };
  });
}

async function uploadServiceFeatureImage(dataUrl, key) {
  const res = await httpClient.post('/api/admin/web-content/upload-image', { dataUrl, key });
  return res.data.url;
}

const HomeServicesForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState(DEFAULT_ITEMS);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/home/services');
      setItems(mapItemsFromApi(res.data.content?.items || []));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load service features',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateItem = (index, field, value) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
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
      setItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, imagePreview: dataUrl, imageData: dataUrl } : item
        )
      );
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
      const preparedItems = await Promise.all(
        items.slice(0, 3).map(async (item, index) => {
          let image = item.image || '';
          if (item.imageData) {
            image = await uploadServiceFeatureImage(item.imageData, `home-service-feature-${index}`);
          }

          return {
            title: item.title,
            text: item.text,
            link: item.link,
            icon: item.icon || HOME_SERVICES_ICON,
            image,
          };
        })
      );

      const res = await httpClient.put('/api/admin/web-content/home/services', {
        content: { items: preparedItems },
      });

      setItems(mapItemsFromApi(res.data.content?.items || []));
      showNotification({ message: 'Homepage service features saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save service features',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Homepage — Service Features"
      description="Manage the three feature cards shown below the hero slider on the homepage. Upload a logo/image per card; if missing, it falls back to the symbol icon."
    >
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Accordion defaultActiveKey="0" className="mb-4">
            {items.map((item, index) => (
              <Accordion.Item eventKey={String(index)} key={`service-feature-${index}`}>
                <Accordion.Header>Feature {index + 1}: {item.title || 'Untitled'}</Accordion.Header>
                <Accordion.Body>
                  <Row className="g-4">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          value={item.title}
                          onChange={(e) => updateItem(index, 'title', e.target.value)}
                          placeholder="Fair & Transparent Pricing"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Link</Form.Label>
                        <Form.Control
                          value={item.link}
                          onChange={(e) => updateItem(index, 'link', e.target.value)}
                          placeholder="/services"
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
                          placeholder="Honest upfront quotes with no hidden fees..."
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Feature Logo / Image</Form.Label>
                        <div className="d-flex gap-3 align-items-start flex-wrap">
                          <div style={{ width: 92 }}>
                            {item.imagePreview ? (
                              <img
                                src={item.imagePreview}
                                alt="Feature preview"
                                style={{
                                  width: 92,
                                  height: 92,
                                  objectFit: 'contain',
                                  background: '#fff',
                                  borderRadius: 999,
                                  border: '1px solid rgba(0,0,0,0.08)',
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 92,
                                  height: 92,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '1px dashed rgba(0,0,0,0.2)',
                                  borderRadius: 999,
                                  color: '#6c757d',
                                  fontSize: 12,
                                  textAlign: 'center',
                                }}
                              >
                                No image
                              </div>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 260 }}>
                            <Form.Control
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageSelect(index, e.target.files?.[0])}
                            />
                            <Form.Text className="text-muted">
                              Optional. If missing, the symbol icon is used.
                            </Form.Text>
                          </div>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Service Features'}
          </Button>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default HomeServicesForm;
