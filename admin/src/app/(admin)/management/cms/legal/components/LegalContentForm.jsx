import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import { mapLegalPageContentForSave, mapLegalPageContentFromApi } from '@/helpers/cms';
import httpClient from '@/helpers/httpClient';

const emptySection = () => ({
  id: crypto.randomUUID(),
  heading: '',
  body: '',
});

const LegalContentForm = ({ pageKey, pageLabel }) => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(mapLegalPageContentFromApi());

  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get(`/api/admin/web-content/${pageKey}/content`);
      setForm(mapLegalPageContentFromApi(res.data.content || {}));
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || `Failed to load ${pageLabel} content`,
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [pageKey, pageLabel, showNotification]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSection = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) => (
        i === index ? { ...section, [field]: value } : section
      )),
    }));
  };

  const addSection = () => {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, emptySection()],
    }));
  };

  const removeSection = (index) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await httpClient.put(`/api/admin/web-content/${pageKey}/content`, {
        content: mapLegalPageContentForSave(form),
      });
      setForm(mapLegalPageContentFromApi(res.data.content || {}));
      showNotification({ message: `${pageLabel} content saved`, variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save page content',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title={`${pageLabel} Content`}
      description={`Manage the ${pageLabel} page title, intro, and content sections.`}
    >
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Row className="g-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Page Title</Form.Label>
                <Form.Control
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Last Updated</Form.Label>
                <Form.Control
                  value={form.lastUpdated}
                  onChange={(e) => updateField('lastUpdated', e.target.value)}
                  placeholder="e.g. July 21, 2026"
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Intro Text</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={form.introText}
                  onChange={(e) => updateField('introText', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
            <h5 className="mb-0">Content Sections</h5>
            <Button type="button" variant="light" onClick={addSection}>
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add Section
            </Button>
          </div>

          {form.sections.length === 0 ? (
            <p className="text-muted">No sections yet. Add at least one section.</p>
          ) : (
            form.sections.map((section, index) => (
              <div key={section.id} className="border rounded p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <strong>Section {index + 1}</strong>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline-danger"
                    onClick={() => removeSection(index)}
                  >
                    Remove
                  </Button>
                </div>
                <Form.Group className="mb-3">
                  <Form.Label>Heading</Form.Label>
                  <Form.Control
                    value={section.heading}
                    onChange={(e) => updateSection(index, 'heading', e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Body</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={section.body}
                    onChange={(e) => updateSection(index, 'body', e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
            ))
          )}

          <Button type="submit" disabled={submitting || form.sections.length === 0}>
            {submitting ? 'Saving...' : 'Save Content'}
          </Button>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default LegalContentForm;
