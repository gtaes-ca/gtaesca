import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Form, Nav, Offcanvas, Tab, Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import PageMetaData from '@/components/PageTitle';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const GTA_TAB = 'gta';
const NEARBY_TAB = 'nearby';

const TAB_LABELS = {
  [GTA_TAB]: 'Greater Toronto Area',
  [NEARBY_TAB]: 'Nearby Areas Outside GTA',
};

const defaultForm = {
  name: '',
  parentId: '',
  sortOrder: 0,
};

const ServiceLocationsPage = () => {
  const { showNotification } = useNotificationContext();
  const [activeTab, setActiveTab] = useState(GTA_TAB);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);

  const loadLocations = useCallback(async (region) => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/service-locations', { params: { region } });
      setLocations(res.data.locations || []);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load service locations',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadLocations(activeTab);
  }, [activeTab, loadLocations]);

  const parentOptions = useMemo(
    () => locations.filter((loc) => !loc.parentId),
    [locations]
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setShowSheet(true);
  };

  const openEdit = (location) => {
    setEditingId(location.id);
    setForm({
      name: location.name,
      parentId: location.parentId ? String(location.parentId) : '',
      sortOrder: location.sortOrder,
    });
    setShowSheet(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        region: activeTab,
        name: form.name,
        parentId: form.parentId ? Number(form.parentId) : null,
        sortOrder: Number(form.sortOrder),
      };

      if (editingId) {
        await httpClient.patch(`/api/admin/service-locations/${editingId}`, payload);
        showNotification({ message: 'Location updated', variant: 'success' });
      } else {
        await httpClient.post('/api/admin/service-locations', payload);
        showNotification({ message: 'Location created', variant: 'success' });
      }

      setShowSheet(false);
      setForm(defaultForm);
      setEditingId(null);
      loadLocations(activeTab);
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Save failed',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (location) => {
    const warning = location.parentId
      ? `Delete sub-area "${location.name}"?`
      : `Delete "${location.name}"? This will also remove any sub-areas under it.`;
    if (!window.confirm(warning)) return;

    try {
      await httpClient.delete(`/api/admin/service-locations/${location.id}`);
      showNotification({ message: 'Location deleted', variant: 'success' });
      loadLocations(activeTab);
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Delete failed',
        variant: 'danger',
      });
    }
  };

  const renderTable = () => {
    if (loading) {
      return <p className="text-muted">Loading...</p>;
    }

    return (
      <Table responsive hover className="mb-0">
        <thead>
          <tr>
            <th>Location</th>
            {activeTab === GTA_TAB && <th>Parent Area</th>}
            <th>Sort Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location) => (
            <tr key={location.id}>
              <td className={location.parentId ? 'ps-4' : 'fw-medium'}>
                {location.parentId && (
                  <IconifyIcon icon="bx:subdirectory-right" className="me-1 text-muted" />
                )}
                {location.name}
              </td>
              {activeTab === GTA_TAB && (
                <td className="text-muted">{location.parentName || '-'}</td>
              )}
              <td>{location.sortOrder}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => openEdit(location)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDelete(location)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {locations.length === 0 && (
            <tr>
              <td colSpan={activeTab === GTA_TAB ? 4 : 3} className="text-muted">
                No locations in this coverage area yet.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <PageMetaData title="Service Locations" />
      <ComponentContainerCard
        title="Service Location Coverage"
        description="Manage GTA and nearby communities where GTA Electric Services provides coverage."
      >
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={openCreate}>
            <IconifyIcon icon="bx:plus" className="me-1" />
            Add Location
          </Button>
        </div>

        <Tab.Container activeKey={activeTab} onSelect={(key) => key && setActiveTab(key)}>
          <Nav variant="tabs" className="nav-tabs card-tabs mb-3">
            <Nav.Item>
              <Nav.Link eventKey={GTA_TAB}>{TAB_LABELS[GTA_TAB]}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={NEARBY_TAB}>{TAB_LABELS[NEARBY_TAB]}</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey={GTA_TAB}>
              {activeTab === GTA_TAB && renderTable()}
            </Tab.Pane>
            <Tab.Pane eventKey={NEARBY_TAB}>
              {activeTab === NEARBY_TAB && renderTable()}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </ComponentContainerCard>

      <Offcanvas placement="end" show={showSheet} onHide={() => setShowSheet(false)}>
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title>{editingId ? 'Edit Location' : 'Add Location'}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Coverage Area</Form.Label>
              <Form.Control value={TAB_LABELS[activeTab]} disabled readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={activeTab === GTA_TAB ? 'e.g. Mississauga or North York' : 'e.g. Hamilton'}
                required
              />
            </Form.Group>
            {activeTab === GTA_TAB && (
              <Form.Group className="mb-3">
                <Form.Label>Parent Area (optional)</Form.Label>
                <Form.Select
                  value={form.parentId}
                  onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                >
                  <option value="">Top-level GTA location</option>
                  {parentOptions
                    .filter((loc) => !editingId || loc.id !== editingId)
                    .map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                </Form.Select>
                <Form.Text>Use a parent for neighbourhoods under a city (e.g. North York under Toronto).</Form.Text>
              </Form.Group>
            )}
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

export default ServiceLocationsPage;
