import { useCallback, useEffect, useState } from 'react';
import { Accordion, Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useNotificationContext } from '@/context/useNotificationContext';
import {
  GALLERY_IMAGE_RATIO,
  MAX_CMS_IMAGE_BYTES,
  mapServiceCategoryGalleryForSave,
  mapServiceCategoryGalleryFromApi,
} from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

const MAX_GALLERY_ITEMS = 24;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function uploadGalleryImage(dataUrl, key) {
  const res = await httpClient.post('/api/admin/web-content/upload-image', { dataUrl, key });
  return res.data.url;
}

function ImagePreview({ label, imageUrl }) {
  return (
    <div>
      <p className="small text-muted mb-2">{label}</p>
      <div
        className="position-relative border rounded overflow-hidden bg-light"
        style={{ aspectRatio: GALLERY_IMAGE_RATIO, maxWidth: 280 }}
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

const emptyItem = () => ({
  serviceId: '',
  serviceName: '',
  subTitle: '',
  title: '',
  text: '',
  image: '',
  imagePreview: '',
  imageData: null,
});

export default function CategoryServicesGalleryForm({
  pageKey,
  title,
  description,
}) {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(mapServiceCategoryGalleryFromApi());

  const loadGallery = useCallback(async () => {
    setLoading(true);
    try {
      const [galleryRes, servicesRes] = await Promise.all([
        httpClient.get(`/api/admin/web-content/${pageKey}/gallery`),
        fetch(`${API_URL}/api/services/list?group=${encodeURIComponent(pageKey)}`).then((res) =>
          res.ok ? res.json() : { services: [] }
        ),
      ]);
      setForm(mapServiceCategoryGalleryFromApi(galleryRes.data.content || {}));
      setServices(Array.isArray(servicesRes.services) ? servicesRes.services : []);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load gallery content',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [pageKey, showNotification]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const handleServiceSelect = (index, serviceId) => {
    const selected = services.find((service) => String(service.id) === String(serviceId));
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i !== index) return item;
        return {
          ...item,
          serviceId: serviceId || '',
          serviceName: selected?.name || '',
          subTitle: item.subTitle || selected?.name || '',
        };
      }),
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
        items: prev.items.map((item, i) => (
          i === index
            ? { ...item, imagePreview: dataUrl, imageData: dataUrl }
            : item
        )),
      }));
    };
    reader.onerror = () => {
      showNotification({ message: 'Failed to read image file', variant: 'danger' });
    };
    reader.readAsDataURL(file);
  };

  const addItem = () => {
    if (form.items.length >= MAX_GALLERY_ITEMS) {
      showNotification({
        message: `You can add up to ${MAX_GALLERY_ITEMS} gallery items`,
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

    for (let index = 0; index < form.items.length; index += 1) {
      const item = form.items[index];
      if (!item.serviceId) {
        showNotification({
          message: `Gallery item ${index + 1} needs a service selected`,
          variant: 'danger',
        });
        return;
      }
      if (!item.image && !item.imageData) {
        showNotification({
          message: `Gallery item ${index + 1} needs an image`,
          variant: 'danger',
        });
        return;
      }
    }

    if (form.items.length && !form.titleLine1.trim()) {
      showNotification({ message: 'Section title is required when gallery items are present', variant: 'danger' });
      return;
    }

    setSubmitting(true);
    try {
      const preparedItems = [];

      for (let index = 0; index < form.items.length; index += 1) {
        const item = form.items[index];
        let image = item.image;
        const selected = services.find((service) => String(service.id) === String(item.serviceId));

        if (item.imageData) {
          image = await uploadGalleryImage(item.imageData, `${pageKey}-gallery-${index}`);
        }

        preparedItems.push({
          serviceId: String(item.serviceId),
          serviceName: selected?.name || item.serviceName || '',
          subTitle: item.subTitle,
          title: item.title,
          text: item.text,
          image,
        });
      }

      const res = await httpClient.put(`/api/admin/web-content/${pageKey}/gallery`, {
        content: mapServiceCategoryGalleryForSave({
          ...form,
          items: preparedItems,
        }),
      });
      setForm(mapServiceCategoryGalleryFromApi(res.data.content || {}));
      showNotification({ message: 'Gallery saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save gallery content',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard title={title} description={description}>
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
                  placeholder="Our Gallery"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Title — Line 1</Form.Label>
                <Form.Control
                  value={form.titleLine1}
                  onChange={(e) => updateField('titleLine1', e.target.value)}
                  placeholder="Project Gallery"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Title — Line 2</Form.Label>
                <Form.Control
                  value={form.titleLine2}
                  onChange={(e) => updateField('titleLine2', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Button Text (optional)</Form.Label>
                <Form.Control
                  value={form.buttonText}
                  onChange={(e) => updateField('buttonText', e.target.value)}
                  placeholder="View All"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Button Link (optional)</Form.Label>
                <Form.Control
                  value={form.buttonLink}
                  onChange={(e) => updateField('buttonLink', e.target.value)}
                  placeholder="/contact"
                />
              </Form.Group>
            </Col>
          </Row>

          {form.items.length ? (
            <Accordion defaultActiveKey="0" className="mb-4">
              {form.items.map((item, index) => (
                <Accordion.Item eventKey={String(index)} key={`gallery-item-${index}`}>
                  <Accordion.Header>
                    Item {index + 1}: {item.serviceName || item.title || 'Untitled'}
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row className="g-4">
                      <Col xs={12}>
                        <ImagePreview label="Gallery image" imageUrl={item.imagePreview} />
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Service</Form.Label>
                          <Form.Select
                            value={item.serviceId || ''}
                            onChange={(e) => handleServiceSelect(index, e.target.value)}
                            required
                          >
                            <option value="">Select a service…</option>
                            {services.map((service) => (
                              <option key={service.id} value={String(service.id)}>
                                {service.name}
                              </option>
                            ))}
                          </Form.Select>
                          {!services.length ? (
                            <Form.Text className="text-muted">
                              No {pageKey} services found. Add services first under Management → Services.
                            </Form.Text>
                          ) : null}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Label / Category</Form.Label>
                          <Form.Control
                            value={item.subTitle}
                            onChange={(e) => updateItem(index, 'subTitle', e.target.value)}
                            placeholder="Panel Upgrade"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Title</Form.Label>
                          <Form.Control
                            value={item.title}
                            onChange={(e) => updateItem(index, 'title', e.target.value)}
                            placeholder="Kitchen renovation wiring"
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <Form.Group>
                          <Form.Label>Short description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={item.text}
                            onChange={(e) => updateItem(index, 'text', e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Upload image</Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            onChange={(e) => {
                              handleImageSelect(index, e.target.files?.[0]);
                              e.target.value = '';
                            }}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12}>
                        <div className="d-flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline-secondary"
                            size="sm"
                            disabled={index === 0}
                            onClick={() => moveItem(index, -1)}
                          >
                            <IconifyIcon icon="bx:up-arrow-alt" /> Move up
                          </Button>
                          <Button
                            type="button"
                            variant="outline-secondary"
                            size="sm"
                            disabled={index === form.items.length - 1}
                            onClick={() => moveItem(index, 1)}
                          >
                            <IconifyIcon icon="bx:down-arrow-alt" /> Move down
                          </Button>
                          <Button
                            type="button"
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <IconifyIcon icon="bx:trash" /> Remove
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted mb-4">No gallery items yet. Add photos linked to a service.</p>
          )}

          <div className="d-flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={addItem}
              disabled={form.items.length >= MAX_GALLERY_ITEMS}
            >
              Add Gallery Item
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Gallery'}
            </Button>
          </div>
        </form>
      )}
    </ComponentContainerCard>
  );
}
