import { useCallback, useEffect, useState } from 'react';
import { Accordion, Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useNotificationContext } from '@/context/useNotificationContext';
import {
  GALLERY_IMAGE_RATIO,
  MAX_CMS_IMAGE_BYTES,
  mapProjectsGalleryForSave,
  mapProjectsGalleryFromApi,
} from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

const MAX_GALLERY_ITEMS = 12;

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
  id: crypto.randomUUID(),
  subTitle: '',
  title: '',
  text: '',
  challengeText: '',
  resultText: '',
  client: '',
  date: '',
  location: '',
  image: '',
  imagePreview: '',
  imageData: null,
});

const ProjectsGalleryForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapProjectsGalleryFromApi());

  const loadGallery = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/projects/gallery');
      setForm(mapProjectsGalleryFromApi(res.data.content || {}));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load projects gallery',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        message: `You can add up to ${MAX_GALLERY_ITEMS} projects`,
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
    if (!form.items.length) {
      showNotification({ message: 'Add at least one project', variant: 'danger' });
      return;
    }

    setSubmitting(true);
    try {
      const preparedItems = [];

      for (let index = 0; index < form.items.length; index += 1) {
        const item = form.items[index];
        let image = item.image;

        if (item.imageData) {
          const key = item.id ? `projects-gallery-${item.id}` : `projects-gallery-${index}`;
          image = await uploadGalleryImage(item.imageData, key);
        }

        preparedItems.push({
          id: item.id,
          subTitle: item.subTitle,
          title: item.title,
          text: item.text,
          challengeText: item.challengeText,
          resultText: item.resultText,
          client: item.client,
          date: item.date,
          location: item.location,
          image,
        });
      }

      const res = await httpClient.put('/api/admin/web-content/projects/gallery', {
        content: mapProjectsGalleryForSave({
          ...form,
          items: preparedItems,
        }),
      });
      setForm(mapProjectsGalleryFromApi(res.data.content || {}));
      showNotification({ message: 'Projects gallery saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save projects gallery',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Projects Gallery"
      description="Manage projects shown on the /projects page. Each item links to its detail page automatically."
    >
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
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Title — Line 1</Form.Label>
                <Form.Control
                  value={form.titleLine1}
                  onChange={(e) => updateField('titleLine1', e.target.value)}
                  placeholder="Your Brightest"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Title — Line 2</Form.Label>
                <Form.Control
                  value={form.titleLine2}
                  onChange={(e) => updateField('titleLine2', e.target.value)}
                  placeholder="Choice in Repairs"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Button Text (optional)</Form.Label>
                <Form.Control
                  value={form.buttonText}
                  onChange={(e) => updateField('buttonText', e.target.value)}
                  placeholder="All Gallery"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Button Link</Form.Label>
                <Form.Control
                  value={form.buttonLink}
                  onChange={(e) => updateField('buttonLink', e.target.value)}
                  placeholder="/projects"
                />
              </Form.Group>
            </Col>
          </Row>

          <Accordion defaultActiveKey="0" className="mb-4">
            {form.items.map((item, index) => (
              <Accordion.Item eventKey={String(index)} key={item.id || `project-item-${index}`}>
                <Accordion.Header>Project {index + 1}: {item.title || 'Untitled'}</Accordion.Header>
                <Accordion.Body>
                  <Row className="g-4">
                    <Col xs={12}>
                      <ImagePreview label="Project image" imageUrl={item.imagePreview} />
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Category / Label</Form.Label>
                        <Form.Control
                          value={item.subTitle}
                          onChange={(e) => updateItem(index, 'subTitle', e.target.value)}
                          placeholder="Home Electrical"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          value={item.title}
                          onChange={(e) => updateItem(index, 'title', e.target.value)}
                          placeholder="Panel Upgrade & Installation"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Overview (detail page)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={item.text}
                          onChange={(e) => updateItem(index, 'text', e.target.value)}
                          placeholder="About the project overview"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Challenge (detail page, optional)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={item.challengeText}
                          onChange={(e) => updateItem(index, 'challengeText', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Result (detail page, optional)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={item.resultText}
                          onChange={(e) => updateItem(index, 'resultText', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Client (sidebar)</Form.Label>
                        <Form.Control
                          value={item.client}
                          onChange={(e) => updateItem(index, 'client', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Date (sidebar)</Form.Label>
                        <Form.Control
                          value={item.date}
                          onChange={(e) => updateItem(index, 'date', e.target.value)}
                          placeholder="02 June 2024"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Location (sidebar)</Form.Label>
                        <Form.Control
                          value={item.location}
                          onChange={(e) => updateItem(index, 'location', e.target.value)}
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
                        {form.items.length > 1 && (
                          <Button
                            type="button"
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <IconifyIcon icon="bx:trash" /> Remove
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          <div className="d-flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={addItem}
              disabled={form.items.length >= MAX_GALLERY_ITEMS}
            >
              Add Project
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Gallery'}
            </Button>
          </div>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default ProjectsGalleryForm;
