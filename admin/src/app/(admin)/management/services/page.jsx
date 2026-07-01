import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Offcanvas, Row, Table } from 'react-bootstrap';
import clsx from 'clsx';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ServiceMaterialDefaultsOffcanvas from '@/components/services/ServiceMaterialDefaultsOffcanvas';
import PageMetaData from '@/components/PageTitle';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';
import { formatCurrency } from '@/utils/currency';

const defaultForm = {
  categoryId: '',
  name: '',
  description: '',
  durationMinutes: 120,
  price: '0',
  sortOrder: 0,
};

const DURATION_PRESETS = [
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
  { value: 240, label: '4 hours' },
  { value: 360, label: '6 hours' },
  { value: 480, label: '8 hours' },
];

function formatDuration(minutes) {
  if (!minutes) return '-';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}h ${mins}m` : `${hours}h`;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const SORTABLE_COLUMNS = [
  { key: 'name', label: 'Service' },
  { key: 'categoryName', label: 'Category' },
  { key: 'description', label: 'Description' },
  { key: 'durationMinutes', label: 'Duration' },
  { key: 'price', label: 'Charge' },
  { key: 'sortOrder', label: 'Sort' },
];

function SortableHeader({ column, sortBy, sortDir, onSort }) {
  const active = sortBy === column.key;
  return (
    <th
      role="button"
      className="user-select-none"
      onClick={() => onSort(column.key)}
    >
      <span className="d-inline-flex align-items-center gap-1">
        {column.label}
        <IconifyIcon
          icon={
            !active
              ? 'bx:sort'
              : sortDir === 'asc'
                ? 'bx:sort-up'
                : 'bx:sort-down'
          }
          className={clsx('fs-16', active ? 'text-primary' : 'text-muted')}
        />
      </span>
    </th>
  );
}

const ServicesPage = () => {
  const { showNotification } = useNotificationContext();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('sortOrder');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [form, setForm] = useState(defaultForm);
  const [defaultsService, setDefaultsService] = useState(null);
  const [showDefaultsSheet, setShowDefaultsSheet] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const res = await httpClient.get('/api/admin/service-categories');
      setCategories(res.data.categories || []);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load categories',
        variant: 'danger',
      });
    }
  }, [showNotification]);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/services', {
        params: {
          categoryId: filterCategoryId || undefined,
          search: search || undefined,
          page,
          limit,
          sortBy,
          sortDir,
        },
      });
      setServices(res.data.services || []);
      setPagination(res.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load services',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [filterCategoryId, search, page, limit, sortBy, sortDir, showNotification]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [filterCategoryId, limit]);

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(columnKey);
      setSortDir('asc');
    }
    setPage(1);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...defaultForm,
      categoryId: filterCategoryId || categories[0]?.id?.toString() || '',
    });
    setShowSheet(true);
  };

  const openEdit = (service) => {
    setEditingId(service.id);
    setForm({
      categoryId: String(service.categoryId),
      name: service.name,
      description: service.description || '',
      durationMinutes: service.durationMinutes ?? 120,
      price: String(service.price ?? 0),
      sortOrder: service.sortOrder,
    });
    setShowSheet(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        durationMinutes: Number(form.durationMinutes),
        price: Number(form.price),
        sortOrder: Number(form.sortOrder),
      };
      if (editingId) {
        await httpClient.patch(`/api/admin/services/${editingId}`, payload);
        showNotification({ message: 'Service updated', variant: 'success' });
      } else {
        await httpClient.post('/api/admin/services', payload);
        showNotification({ message: 'Service created', variant: 'success' });
      }
      setShowSheet(false);
      setForm(defaultForm);
      setEditingId(null);
      loadServices();
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Save failed',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const openMaterialDefaults = (service) => {
    setDefaultsService(service);
    setShowDefaultsSheet(true);
  };

  const handleDelete = async (service) => {
    if (!window.confirm(`Delete service "${service.name}"?`)) return;
    try {
      await httpClient.delete(`/api/admin/services/${service.id}`);
      showNotification({ message: 'Service deleted', variant: 'success' });
      loadServices();
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Delete failed',
        variant: 'danger',
      });
    }
  };

  const fromRecord = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const toRecord = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <>
      <PageMetaData title="Services" />
      <ComponentContainerCard
        title="Services"
        description="Manage individual electrical services under each category."
      >
        <Row className="g-2 mb-3 align-items-center">
          <Col md={4}>
            <Form.Control
              type="search"
              placeholder="Search service, category, or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterCategoryId}
              onChange={(e) => setFilterCategoryId(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={5} className="d-flex justify-content-md-end">
            <Button variant="primary" onClick={openCreate} disabled={categories.length === 0}>
              <IconifyIcon icon="bx:plus" className="me-1" />
              Add Service
            </Button>
          </Col>
        </Row>

        {categories.length === 0 && !loading && (
          <p className="text-muted">Create a service category first before adding services.</p>
        )}

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <>
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  {SORTABLE_COLUMNS.map((column) => (
                    <SortableHeader
                      key={column.key}
                      column={column}
                      sortBy={sortBy}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>{service.name}</td>
                    <td>{service.categoryName}</td>
                    <td className="text-muted" style={{ maxWidth: 320 }}>
                      {service.description || '-'}
                    </td>
                    <td>{formatDuration(service.durationMinutes)}</td>
                    <td>{formatCurrency(service.price)}</td>
                    <td>{service.sortOrder}</td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline-secondary" onClick={() => openMaterialDefaults(service)}>
                          Materials
                        </Button>
                        <Button size="sm" variant="outline-primary" onClick={() => openEdit(service)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(service)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && categories.length > 0 && (
                  <tr>
                    <td colSpan={7} className="text-muted">No services found.</td>
                  </tr>
                )}
              </tbody>
            </Table>

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 border-top">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <span className="text-muted">
                  Showing {fromRecord}-{toRecord} of {pagination.total}
                </span>
                <div className="d-flex align-items-center gap-2">
                  <label htmlFor="services-page-size" className="text-muted mb-0">Per page</label>
                  <Form.Select
                    id="services-page-size"
                    size="sm"
                    style={{ width: 90 }}
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </Form.Select>
                </div>
              </div>

              <ul className="pagination pagination-rounded m-0">
                <li className="page-item">
                  <button
                    type="button"
                    className="page-link"
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <IconifyIcon icon="bx:left-arrow-alt" />
                  </button>
                </li>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    const current = pagination.page;
                    return p === 1 || p === pagination.totalPages || Math.abs(p - current) <= 1;
                  })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && p - prev > 1;
                    return (
                      <span key={p} className="d-contents">
                        {showEllipsis && (
                          <li className="page-item disabled">
                            <span className="page-link">…</span>
                          </li>
                        )}
                        <li className={clsx('page-item', { active: p === pagination.page })}>
                          <button type="button" className="page-link" onClick={() => setPage(p)}>
                            {p}
                          </button>
                        </li>
                      </span>
                    );
                  })}
                <li className="page-item">
                  <button
                    type="button"
                    className="page-link"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <IconifyIcon icon="bx:right-arrow-alt" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </ComponentContainerCard>

      <Offcanvas placement="end" show={showSheet} onHide={() => setShowSheet(false)}>
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title>{editingId ? 'Edit Service' : 'Add Service'}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. EV Charger Installation"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description of the service"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Select
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
              >
                {DURATION_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>{preset.label}</option>
                ))}
                <option value={form.durationMinutes}>
                  Custom: {formatDuration(Number(form.durationMinutes))}
                </option>
              </Form.Select>
              <Form.Control
                className="mt-2"
                type="number"
                min={15}
                max={960}
                step={15}
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
              />
              <Form.Text className="text-muted">
                How long this service blocks the technician&apos;s calendar.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Service charge (CAD)</Form.Label>
              <Form.Control
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
              <Form.Text className="text-muted">
                Base price shown to clients when booking this service.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Sort Order</Form.Label>
              <Form.Control
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </Button>
              <Button variant="light" type="button" onClick={() => setShowSheet(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>

      <ServiceMaterialDefaultsOffcanvas
        show={showDefaultsSheet}
        service={defaultsService}
        onHide={() => setShowDefaultsSheet(false)}
        onSaved={() => showNotification({ message: 'Default materials saved', variant: 'success' })}
      />
    </>
  );
};

export default ServicesPage;
