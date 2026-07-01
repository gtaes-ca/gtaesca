import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Offcanvas, Row, Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import PageMetaData from '@/components/PageTitle';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';
import { formatCurrency } from '@/utils/currency';

const UNIT_OPTIONS = ['each', 'ft', 'box', 'roll', 'pack', 'bag', 'set', 'lb'];

const defaultForm = {
  name: '',
  unit: 'each',
  defaultUnitPrice: '0',
  description: '',
  isActive: true,
};

const MaterialsPage = () => {
  const { showNotification } = useNotificationContext();
  const [materials, setMaterials] = useState([]);
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

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/materials', {
        params: {
          search: search || undefined,
          active: activeFilter || undefined,
          page,
          limit: 20,
          sortBy: 'name',
          sortDir: 'asc',
        },
      });
      setMaterials(res.data.materials || []);
      setPagination(res.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load materials',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [search, activeFilter, page, showNotification]);

  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

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
    setForm(defaultForm);
    setShowSheet(true);
  };

  const openEdit = (material) => {
    setEditingId(material.id);
    setForm({
      name: material.name,
      unit: material.unit,
      defaultUnitPrice: String(material.defaultUnitPrice ?? 0),
      description: material.description || '',
      isActive: material.isActive,
    });
    setShowSheet(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        unit: form.unit,
        defaultUnitPrice: Number(form.defaultUnitPrice),
        description: form.description.trim() || null,
        isActive: form.isActive,
      };
      if (editingId) {
        await httpClient.patch(`/api/admin/materials/${editingId}`, payload);
        showNotification({ message: 'Material updated', variant: 'success' });
      } else {
        await httpClient.post('/api/admin/materials', payload);
        showNotification({ message: 'Material created', variant: 'success' });
      }
      setShowSheet(false);
      setForm(defaultForm);
      setEditingId(null);
      loadMaterials();
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Save failed',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (material) => {
    if (!window.confirm(`Delete material "${material.name}"?`)) return;
    try {
      await httpClient.delete(`/api/admin/materials/${material.id}`);
      showNotification({ message: 'Material deleted', variant: 'success' });
      loadMaterials();
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Delete failed',
        variant: 'danger',
      });
    }
  };

  return (
    <>
      <PageMetaData title="Materials" />
      <ComponentContainerCard
        title="Materials & Supplies"
        description="Manage billable parts and supplies used during service jobs (wire, outlets, breakers, etc.)."
      >
        <Row className="g-2 mb-3 align-items-center">
          <Col md={4}>
            <Form.Control
              type="search"
              placeholder="Search materials..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
              <option value="">All materials</option>
              <option value="true">Active only</option>
              <option value="false">Inactive only</option>
            </Form.Select>
          </Col>
          <Col md={5} className="d-flex justify-content-md-end">
            <Button variant="primary" onClick={openCreate}>
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add Material
            </Button>
          </Col>
        </Row>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Unit</th>
                <th>Default Price</th>
                <th>Status</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.id}>
                  <td className="fw-medium">{material.name}</td>
                  <td>{material.unit}</td>
                  <td>{formatCurrency(material.defaultUnitPrice)}</td>
                  <td>{material.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="text-muted" style={{ maxWidth: 280 }}>{material.description || '—'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button size="sm" variant="light" onClick={() => openEdit(material)}>Edit</Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(material)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {materials.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-muted">No materials found.</td>
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

      <Offcanvas placement="end" show={showSheet} onHide={() => !submitting && setShowSheet(false)} style={{ width: 'min(420px, 100vw)' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{editingId ? 'Edit Material' : 'Add Material'}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </Form.Group>
            <Row>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit</Form.Label>
                  <Form.Select
                    value={form.unit}
                    onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
                  >
                    {UNIT_OPTIONS.map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Default price</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.defaultUnitPrice}
                    onChange={(e) => setForm((prev) => ({ ...prev, defaultUnitPrice: e.target.value }))}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              />
            </Form.Group>
            <Form.Check
              type="switch"
              id="material-active"
              className="mb-4"
              label="Active (available when adding to bookings)"
              checked={form.isActive}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            <div className="d-flex gap-2">
              <Button variant="light" className="flex-grow-1" onClick={() => setShowSheet(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" className="flex-grow-1" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MaterialsPage;
