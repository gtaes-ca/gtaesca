import { useCallback, useEffect, useState } from 'react';
import { Accordion, Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const ICON_OPTIONS = [
  { value: 'icon-affordable-price', label: 'Affordable price' },
  { value: 'icon-setting', label: 'Settings / quality' },
  { value: 'icon-services', label: 'Services' },
];

const DEFAULT_ITEMS = [
  {
    title: 'Fair & Transparent Pricing',
    text: 'Honest upfront quotes with no hidden fees on residential and commercial electrical work.',
    link: '/services',
    icon: 'icon-affordable-price',
  },
  {
    title: 'Licensed & Insured',
    text: 'ESA-certified electricians delivering safe, code-compliant work backed by our satisfaction guarantee.',
    link: '/about',
    icon: 'icon-setting',
  },
  {
    title: '24/7 Emergency Service',
    text: 'Available around the clock for urgent electrical repairs across the Greater Toronto Area.',
    link: '/contact',
    icon: 'icon-services',
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
      icon: item.icon || fallback.icon,
    };
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await httpClient.put('/api/admin/web-content/home/services', {
        content: { items },
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
      description="Manage the three feature cards shown below the hero slider on the homepage."
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
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Icon</Form.Label>
                        <Form.Select
                          value={item.icon}
                          onChange={(e) => updateItem(index, 'icon', e.target.value)}
                          required
                        >
                          {ICON_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
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
