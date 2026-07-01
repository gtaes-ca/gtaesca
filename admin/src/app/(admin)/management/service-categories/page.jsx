import { useEffect, useState } from 'react';
import { Button, Form, Offcanvas, Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import PageMetaData from '@/components/PageTitle';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const defaultForm = { name: '', sortOrder: 0 };

const ServiceCategoriesPage = () => {
  const { showNotification } = useNotificationContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/service-categories');
      setCategories(res.data.categories || []);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load categories',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setShowSheet(true);
  };

  const openEdit = (category) => {
    setEditingId(category.id);
    setForm({ name: category.name, sortOrder: category.sortOrder });
    setShowSheet(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await httpClient.patch(`/api/admin/service-categories/${editingId}`, form);
        showNotification({ message: 'Category updated', variant: 'success' });
      } else {
        await httpClient.post('/api/admin/service-categories', form);
        showNotification({ message: 'Category created', variant: 'success' });
      }
      setShowSheet(false);
      setForm(defaultForm);
      setEditingId(null);
      loadCategories();
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Save failed',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    const warning = category.serviceCount > 0
      ? `Delete "${category.name}" and its ${category.serviceCount} service(s)?`
      : `Delete category "${category.name}"?`;
    if (!window.confirm(warning)) return;

    try {
      await httpClient.delete(`/api/admin/service-categories/${category.id}`);
      showNotification({ message: 'Category deleted', variant: 'success' });
      loadCategories();
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Delete failed',
        variant: 'danger',
      });
    }
  };

  return (
    <>
      <PageMetaData title="Service Categories" />
      <ComponentContainerCard
        title="Service Categories"
        description="Manage electrical service categories shown in technician onboarding and the public catalog."
      >
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={openCreate}>
            <IconifyIcon icon="bx:plus" className="me-1" />
            Add Category
          </Button>
        </div>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Sort Order</th>
                <th>Services</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.sortOrder}</td>
                  <td>{category.serviceCount}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button size="sm" variant="outline-primary" onClick={() => openEdit(category)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(category)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-muted">No categories yet.</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </ComponentContainerCard>

      <Offcanvas placement="end" show={showSheet} onHide={() => setShowSheet(false)}>
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title>{editingId ? 'Edit Category' : 'Add Category'}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Home Electrical Services"
                required
              />
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
    </>
  );
};

export default ServiceCategoriesPage;
