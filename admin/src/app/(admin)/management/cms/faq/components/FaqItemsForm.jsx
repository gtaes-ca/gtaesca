import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Offcanvas, Row, Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const defaultForm = {
  question: '',
  answer: '',
  sortOrder: '0',
  isActive: true,
};

const FaqItemsForm = () => {
  const { showNotification } = useNotificationContext();
  const [faqs, setFaqs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(defaultForm);

  const loadFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/faqs', {
        params: {
          search: search || undefined,
          active: activeFilter || undefined,
          page,
          limit: 20,
        },
      });
      setFaqs(res.data.faqs || []);
      setPagination(res.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load FAQs',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [search, activeFilter, page, showNotification]);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  const openCreate = () => {
    setEditingId(null);
    const nextSortOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.sortOrder ?? 0)) + 1 : 0;
    setForm({
      ...defaultForm,
      sortOrder: String(nextSortOrder),
    });
    setShowSheet(true);
  };

  const openEdit = (faq) => {
    setEditingId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      sortOrder: String(faq.sortOrder ?? 0),
      isActive: faq.isActive,
    });
    setShowSheet(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        sortOrder: Number(form.sortOrder),
        isActive: form.isActive,
      };

      if (editingId) {
        await httpClient.patch(`/api/admin/faqs/${editingId}`, payload);
        showNotification({ message: 'FAQ updated', variant: 'success' });
      } else {
        await httpClient.post('/api/admin/faqs', payload);
        showNotification({ message: 'FAQ created', variant: 'success' });
      }

      setShowSheet(false);
      setForm(defaultForm);
      setEditingId(null);
      loadFaqs();
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Save failed',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (faq) => {
    if (!window.confirm(`Delete FAQ "${faq.question}"?`)) return;
    try {
      await httpClient.delete(`/api/admin/faqs/${faq.id}`);
      showNotification({ message: 'FAQ deleted', variant: 'success' });
      loadFaqs();
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Delete failed',
        variant: 'danger',
      });
    }
  };

  return (
    <>
      <ComponentContainerCard
        title="FAQ Items"
        description="Create, edit, and reorder frequently asked questions shown on the public FAQ page."
      >
        <Row className="g-2 mb-3 align-items-center">
          <Col md={4}>
            <Form.Control
              type="search"
              placeholder="Search questions or answers..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
              <option value="">All FAQs</option>
              <option value="true">Active only</option>
              <option value="false">Inactive only</option>
            </Form.Select>
          </Col>
          <Col md={5} className="d-flex justify-content-md-end">
            <Button variant="primary" onClick={openCreate}>
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add FAQ
            </Button>
          </Col>
        </Row>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th style={{ width: 70 }}>Order</th>
                <th>Question</th>
                <th>Status</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq.id}>
                  <td>{faq.sortOrder}</td>
                  <td>
                    <div className="fw-medium">{faq.question}</div>
                    <div className="text-muted small text-truncate" style={{ maxWidth: 480 }}>
                      {faq.answer}
                    </div>
                  </td>
                  <td>{faq.isActive ? 'Active' : 'Inactive'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button size="sm" variant="light" onClick={() => openEdit(faq)}>Edit</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(faq)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {faqs.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-muted">No FAQs found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {pagination.totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-muted">Page {pagination.page} of {pagination.totalPages}</small>
            <div className="d-flex gap-2">
              <Button size="sm" variant="light" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button size="sm" variant="light" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </ComponentContainerCard>

      <Offcanvas placement="end" show={showSheet} onHide={() => !submitting && setShowSheet(false)} style={{ width: 'min(480px, 100vw)' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{editingId ? 'Edit FAQ' : 'Add FAQ'}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                value={form.question}
                onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Answer</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={form.answer}
                onChange={(e) => setForm((prev) => ({ ...prev, answer: e.target.value }))}
                required
              />
            </Form.Group>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sort Order</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={form.sortOrder}
                    onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Check
                    type="switch"
                    id="faq-active-switch"
                    label={form.isActive ? 'Active' : 'Inactive'}
                    checked={form.isActive}
                    onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update FAQ' : 'Create FAQ'}
              </Button>
              <Button variant="light" disabled={submitting} onClick={() => setShowSheet(false)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default FaqItemsForm;
