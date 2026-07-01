import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Button, Form, Offcanvas, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import UserAvatar from '@/components/UserAvatar';
import httpClient from '@/helpers/httpClient';

const SERVICE_PAGE_SIZE = 10;

const TechnicianExpertiseOffcanvas = ({ show, user, onHide, onSaved }) => {
  const [categories, setCategories] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [serviceSearch, setServiceSearch] = useState('');
  const [servicePage, setServicePage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const resetLocalState = useCallback(() => {
    setServiceSearch('');
    setServicePage(1);
    setError('');
  }, []);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const [servicesRes, expertiseRes] = await Promise.all([
        httpClient.get('/api/services'),
        httpClient.get(`/api/admin/users/${user.id}/expertise`),
      ]);
      setCategories(servicesRes.data.categories || []);
      setSelectedServiceIds((expertiseRes.data.expertise || []).map((item) => item.id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load service expertise');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (show && user) {
      resetLocalState();
      loadData();
    }
  }, [show, user, loadData, resetLocalState]);

  const allCatalogServices = useMemo(
    () => categories.flatMap((category) =>
      (category.services || []).map((service) => ({
        ...service,
        categoryId: category.id,
        categoryName: category.name,
      }))
    ),
    [categories]
  );

  const filteredCatalogServices = useMemo(() => {
    const query = serviceSearch.trim().toLowerCase();
    if (!query) return allCatalogServices;
    return allCatalogServices.filter((service) =>
      service.name.toLowerCase().includes(query)
      || service.categoryName.toLowerCase().includes(query)
      || service.description?.toLowerCase().includes(query)
    );
  }, [allCatalogServices, serviceSearch]);

  const serviceTotalPages = Math.max(1, Math.ceil(filteredCatalogServices.length / SERVICE_PAGE_SIZE));

  const paginatedServicesByCategory = useMemo(() => {
    const start = (servicePage - 1) * SERVICE_PAGE_SIZE;
    const pageItems = filteredCatalogServices.slice(start, start + SERVICE_PAGE_SIZE);
    const grouped = new Map();
    for (const service of pageItems) {
      if (!grouped.has(service.categoryId)) {
        grouped.set(service.categoryId, {
          id: service.categoryId,
          name: service.categoryName,
          services: [],
        });
      }
      grouped.get(service.categoryId).services.push(service);
    }
    return Array.from(grouped.values());
  }, [filteredCatalogServices, servicePage]);

  const servicePageFrom = filteredCatalogServices.length === 0
    ? 0
    : (servicePage - 1) * SERVICE_PAGE_SIZE + 1;
  const servicePageTo = Math.min(servicePage * SERVICE_PAGE_SIZE, filteredCatalogServices.length);

  useEffect(() => {
    setServicePage(1);
  }, [serviceSearch]);

  useEffect(() => {
    if (servicePage > serviceTotalPages) {
      setServicePage(serviceTotalPages);
    }
  }, [servicePage, serviceTotalPages]);

  const toggleService = (serviceId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    setError('');
    try {
      const res = await httpClient.put(`/api/admin/users/${user.id}/expertise`, {
        serviceIds: selectedServiceIds,
      });
      onSaved?.(user.id, res.data.expertise || []);
      onHide();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update service expertise');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;
    onHide();
  };

  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : '';

  return (
    <Offcanvas
      placement="end"
      show={show}
      onHide={handleClose}
      backdrop={saving ? 'static' : true}
      style={{ width: 'min(560px, 100vw)' }}
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title>Service Expertise</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column p-0 h-100">
        {user && (
          <div className="px-3 pt-3 pb-2 border-bottom bg-light-subtle d-flex align-items-center gap-2">
            <UserAvatar user={user} size="sm" />
            <div className="min-w-0">
              <div className="fw-medium text-truncate">{userName}</div>
              <small className="text-muted text-truncate d-block">{user.email}</small>
            </div>
            <Badge bg="primary-subtle" text="primary" className="ms-auto">
              {selectedServiceIds.length} selected
            </Badge>
          </div>
        )}

        <div className="flex-grow-1 overflow-auto p-3 min-h-0">
          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center py-5"><Spinner animation="border" /></div>
          ) : (
            <>
              <p className="text-muted small mb-3">
                Assign or remove services this technician is qualified to perform. Changes apply immediately for new bookings.
              </p>

              <Form.Group className="mb-3">
                <div className="position-relative">
                  <IconifyIcon
                    icon="bx:search"
                    className="position-absolute top-50 translate-middle-y text-muted"
                    style={{ left: 12, pointerEvents: 'none' }}
                  />
                  <Form.Control
                    type="search"
                    placeholder="Search services or categories..."
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    className="ps-5"
                  />
                </div>
              </Form.Group>

              {filteredCatalogServices.length === 0 ? (
                <Alert variant="light" className="border text-center small mb-0">
                  No services match &ldquo;{serviceSearch.trim()}&rdquo;.
                </Alert>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {paginatedServicesByCategory.map((category) => (
                    <div key={category.id}>
                      <div className="fw-semibold small text-uppercase text-muted mb-2">{category.name}</div>
                      <div className="d-flex flex-column gap-2">
                        {category.services.map((service) => {
                          const checked = selectedServiceIds.includes(service.id);
                          return (
                            <div
                              key={service.id}
                              role="button"
                              className={`border rounded p-2 ${checked ? 'border-primary bg-primary-subtle' : ''}`}
                              onClick={() => toggleService(service.id)}
                            >
                              <Form.Check
                                type="checkbox"
                                id={`technician-expertise-${user?.id}-${service.id}`}
                                checked={checked}
                                onChange={() => toggleService(service.id)}
                                onClick={(e) => e.stopPropagation()}
                                label={<span className="fw-medium">{service.name}</span>}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredCatalogServices.length > 0 && (
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mt-3 pt-2 border-top">
                  <small className="text-muted">
                    Showing {servicePageFrom}-{servicePageTo} of {filteredCatalogServices.length}
                  </small>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant="light"
                      disabled={servicePage <= 1}
                      onClick={() => setServicePage((page) => Math.max(1, page - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      disabled={servicePage >= serviceTotalPages}
                      onClick={() => setServicePage((page) => Math.min(serviceTotalPages, page + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-top p-3 d-flex justify-content-end gap-2 flex-shrink-0 bg-light-subtle">
          <Button variant="light" onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? 'Saving...' : 'Save Expertise'}
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default TechnicianExpertiseOffcanvas;
