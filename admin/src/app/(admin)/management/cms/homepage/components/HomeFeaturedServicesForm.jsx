import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Col, Form, ListGroup, Row, Table } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const MAX_FEATURED_SERVICES = 12;

const DEFAULT_SETTINGS = {
  tagline: 'What We Do',
  titleLine1: 'Featured Electrical Services',
  titleLine2: 'for Your Home & Business',
  serviceIds: [],
};

const HomeFeaturedServicesForm = () => {
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searching, setSearching] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const selectedIds = useMemo(
    () => new Set(selectedServices.map((service) => service.id)),
    [selectedServices]
  );

  const loadFeaturedServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/web-content/home/featured-services');
      const content = res.data.content || {};
      setSettings({
        tagline: content.tagline || DEFAULT_SETTINGS.tagline,
        titleLine1: content.titleLine1 || DEFAULT_SETTINGS.titleLine1,
        titleLine2: content.titleLine2 || DEFAULT_SETTINGS.titleLine2,
        serviceIds: Array.isArray(content.serviceIds) ? content.serviceIds : [],
      });
      setSelectedServices(Array.isArray(content.services) ? content.services : []);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load featured services section',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const searchServices = useCallback(async (query) => {
    setSearching(true);
    try {
      const res = await httpClient.get('/api/admin/services', {
        params: {
          search: query || undefined,
          limit: 20,
          page: 1,
          sortBy: 'name',
          sortDir: 'asc',
        },
      });
      setSearchResults(res.data.services || []);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to search services',
        variant: 'danger',
      });
    } finally {
      setSearching(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadFeaturedServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchServices(searchInput.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, searchServices]);

  const updateSetting = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const addService = (service) => {
    if (selectedIds.has(service.id)) return;
    if (selectedServices.length >= MAX_FEATURED_SERVICES) {
      showNotification({
        message: `You can feature up to ${MAX_FEATURED_SERVICES} services`,
        variant: 'warning',
      });
      return;
    }
    setSelectedServices((prev) => [
      ...prev,
      {
        id: service.id,
        name: service.name,
        description: service.description || '',
        categoryName: service.categoryName,
      },
    ]);
  };

  const removeService = (serviceId) => {
    setSelectedServices((prev) => prev.filter((service) => service.id !== serviceId));
  };

  const moveService = (index, direction) => {
    setSelectedServices((prev) => {
      const next = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await httpClient.put('/api/admin/web-content/home/featured-services', {
        content: {
          tagline: settings.tagline,
          titleLine1: settings.titleLine1,
          titleLine2: settings.titleLine2,
          serviceIds: selectedServices.map((service) => service.id),
        },
      });
      const content = res.data.content || {};
      setSettings({
        tagline: content.tagline || DEFAULT_SETTINGS.tagline,
        titleLine1: content.titleLine1 || DEFAULT_SETTINGS.titleLine1,
        titleLine2: content.titleLine2 || DEFAULT_SETTINGS.titleLine2,
        serviceIds: Array.isArray(content.serviceIds) ? content.serviceIds : [],
      });
      setSelectedServices(Array.isArray(content.services) ? content.services : []);
      showNotification({ message: 'Featured services section saved', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save featured services section',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentContainerCard
      title="Homepage — Featured Services"
      description="Choose which catalog services appear as cards below the Residential & Commercial cards on the homepage. Limit: 12. Edit “What We Do” headings under Website CMS → Services Pages → Homepage Section."
    >
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <Row className="g-4">
            <Col xs={12}>
              <h6 className="mb-2">Featured services ({selectedServices.length}/{MAX_FEATURED_SERVICES})</h6>
              {selectedServices.length ? (
                <ListGroup className="mb-3">
                  {selectedServices.map((service, index) => (
                    <ListGroup.Item key={service.id} className="d-flex align-items-start gap-3">
                      <div className="flex-grow-1">
                        <div className="fw-semibold">{service.name}</div>
                        <div className="small text-muted">{service.categoryName}</div>
                        {service.description ? (
                          <div className="small mt-1">{service.description}</div>
                        ) : null}
                      </div>
                      <div className="d-flex gap-1">
                        <Button
                          type="button"
                          variant="outline-secondary"
                          size="sm"
                          disabled={index === 0}
                          onClick={() => moveService(index, -1)}
                          aria-label="Move up"
                        >
                          <IconifyIcon icon="bx:up-arrow-alt" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline-secondary"
                          size="sm"
                          disabled={index === selectedServices.length - 1}
                          onClick={() => moveService(index, 1)}
                          aria-label="Move down"
                        >
                          <IconifyIcon icon="bx:down-arrow-alt" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeService(service.id)}
                          aria-label="Remove"
                        >
                          <IconifyIcon icon="bx:trash" />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">
                  No featured services selected yet. Search below and add services from your catalog.
                  If none are selected, the first three services will be shown on the homepage.
                </p>
              )}
            </Col>

            <Col xs={12}>
              <h6 className="mb-2">Search services</h6>
              <Form.Control
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by service name, description, or category..."
              />
            </Col>

            <Col xs={12}>
              {searching ? (
                <p className="text-muted mb-0">Searching...</p>
              ) : (
                <Table responsive hover className="align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th style={{ width: 120 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.length ? searchResults.map((service) => {
                      const alreadySelected = selectedIds.has(service.id);
                      const limitReached = selectedServices.length >= MAX_FEATURED_SERVICES;
                      return (
                        <tr key={service.id}>
                          <td className="fw-semibold">{service.name}</td>
                          <td>{service.categoryName}</td>
                          <td className="text-muted small">{service.description || '-'}</td>
                          <td className="text-end">
                            {alreadySelected ? (
                              <Badge bg="secondary">Added</Badge>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                variant="outline-primary"
                                disabled={limitReached}
                                onClick={() => addService(service)}
                              >
                                Add
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={4} className="text-muted">
                          No services found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )}
            </Col>

            <Col xs={12}>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Featured Services'}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </ComponentContainerCard>
  );
};

export default HomeFeaturedServicesForm;
