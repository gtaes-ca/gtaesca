import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Col,
  Form,
  Nav,
  Offcanvas,
  ProgressBar,
  Row,
  Spinner,
  Tab,
} from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import UserAvatar from '@/components/UserAvatar';
import httpClient from '@/helpers/httpClient';
import { formatCurrency } from '@/utils/currency';
import { formatBookingSlot } from '@/utils/bookingDateTime';

const STEPS = [
  { key: 'service', label: 'Service', icon: 'bx:wrench' },
  { key: 'area', label: 'Service Area', icon: 'bx:map' },
  { key: 'technician', label: 'Technician', icon: 'bx:user' },
  { key: 'schedule', label: 'Date & Time', icon: 'bx:calendar' },
  { key: 'details', label: 'Client Details', icon: 'bx:id-card' },
  { key: 'review', label: 'Review', icon: 'bx:check-circle' },
];

const GTA_TAB = 'gta';
const NEARBY_TAB = 'nearby';
const SERVICE_PAGE_SIZE = 8;

const defaultClient = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
};

function formatDuration(minutes) {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
}

function getDateStrInTimezone(timeZone) {
  return new Date().toLocaleDateString('en-CA', { timeZone });
}

function addDaysToDateStr(dateStr, days) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function getInitialState() {
  return {
    step: 0,
    catalog: { categories: [], locations: { gta: [], nearby: [] }, bookingSettings: null },
    technicians: [],
    slots: [],
    error: '',
    completedBooking: null,
    selectedServiceIds: [],
    serviceSearch: '',
    servicePage: 1,
    areaTab: GTA_TAB,
    selectedLocationId: '',
    selectedTechnicianId: '',
    selectedDate: '',
    selectedSlot: '',
    client: { ...defaultClient },
  };
}

const BookingWizardOffcanvas = ({ show, onHide, onSuccess }) => {
  const [step, setStep] = useState(0);
  const [catalog, setCatalog] = useState({ categories: [], locations: { gta: [], nearby: [] }, bookingSettings: null });
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [completedBooking, setCompletedBooking] = useState(null);

  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [serviceSearch, setServiceSearch] = useState('');
  const [servicePage, setServicePage] = useState(1);
  const [areaTab, setAreaTab] = useState(GTA_TAB);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [client, setClient] = useState(defaultClient);
  const [clientLookupMessage, setClientLookupMessage] = useState('');

  const resetWizard = useCallback(() => {
    const initial = getInitialState();
    setStep(initial.step);
    setCatalog(initial.catalog);
    setTechnicians(initial.technicians);
    setSlots(initial.slots);
    setError(initial.error);
    setCompletedBooking(initial.completedBooking);
    setSelectedServiceIds(initial.selectedServiceIds);
    setServiceSearch(initial.serviceSearch);
    setServicePage(initial.servicePage);
    setAreaTab(initial.areaTab);
    setSelectedLocationId(initial.selectedLocationId);
    setSelectedTechnicianId(initial.selectedTechnicianId);
    setSelectedDate(initial.selectedDate);
    setSelectedSlot(initial.selectedSlot);
    setClient(initial.client);
    setClientLookupMessage('');
  }, []);

  const loadCatalog = useCallback(async () => {
    setLoadingCatalog(true);
    setError('');
    try {
      const res = await httpClient.get('/api/bookings/catalog');
      setCatalog(res.data);
    } catch {
      setError('Failed to load services. Please try again.');
    } finally {
      setLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    if (show) {
      resetWizard();
      loadCatalog();
    }
  }, [show, resetWizard, loadCatalog]);

  const selectedServices = useMemo(() => {
    const items = [];
    for (const category of catalog.categories) {
      for (const service of category.services || []) {
        if (selectedServiceIds.includes(String(service.id))) {
          items.push({
            ...service,
            categoryId: category.id,
            categoryName: category.name,
          });
        }
      }
    }
    return items;
  }, [catalog.categories, selectedServiceIds]);

  const totalDurationMinutes = useMemo(
    () => selectedServices.reduce((sum, service) => sum + (service.durationMinutes || 0), 0),
    [selectedServices]
  );

  const totalServicePrice = useMemo(
    () => selectedServices.reduce((sum, service) => sum + (service.price || 0), 0),
    [selectedServices]
  );

  const allCatalogServices = useMemo(
    () => catalog.categories.flatMap((category) =>
      (category.services || []).map((service) => ({
        ...service,
        categoryId: category.id,
        categoryName: category.name,
      }))
    ),
    [catalog.categories]
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

  const paginatedCatalogServices = useMemo(() => {
    const start = (servicePage - 1) * SERVICE_PAGE_SIZE;
    return filteredCatalogServices.slice(start, start + SERVICE_PAGE_SIZE);
  }, [filteredCatalogServices, servicePage]);

  const paginatedServicesByCategory = useMemo(() => {
    const grouped = new Map();
    for (const service of paginatedCatalogServices) {
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
  }, [paginatedCatalogServices]);

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

  const areaLocations = catalog.locations[areaTab] || [];
  const selectedLocation = areaLocations.find((l) => String(l.id) === selectedLocationId);
  const selectedTechnician = technicians.find((member) => member.id === selectedTechnicianId);

  const bookingSettings = catalog.bookingSettings || {
    startHour: 8,
    endHour: 18,
    lookaheadDays: 30,
    timezone: 'America/Toronto',
    workingDays: [1, 2, 3, 4, 5],
  };

  const minDate = useMemo(
    () => getDateStrInTimezone(bookingSettings.timezone),
    [bookingSettings.timezone]
  );
  const maxDate = useMemo(
    () => addDaysToDateStr(minDate, bookingSettings.lookaheadDays),
    [minDate, bookingSettings.lookaheadDays]
  );

  const loadTechnicians = useCallback(async () => {
    if (!selectedServiceIds.length) return;
    setLoadingTechnicians(true);
    setError('');
    try {
      const res = await httpClient.get('/api/bookings/technicians', {
        params: { serviceIds: selectedServiceIds.join(',') },
      });
      const members = res.data.technicians || [];
      setTechnicians(members);
      setSelectedTechnicianId((prev) => (prev && members.some((m) => m.id === prev) ? prev : ''));
    } catch {
      setError('Failed to load available technicians');
    } finally {
      setLoadingTechnicians(false);
    }
  }, [selectedServiceIds]);

  const loadSlots = useCallback(async () => {
    if (!selectedTechnicianId || !selectedDate || !selectedServiceIds.length) return;
    setLoadingSlots(true);
    setError('');
    try {
      const res = await httpClient.get('/api/bookings/availability', {
        params: {
          technicianUserId: selectedTechnicianId,
          date: selectedDate,
          serviceIds: selectedServiceIds.join(','),
        },
      });
      const newSlots = res.data.slots || [];
      setSlots(newSlots);
      setSelectedSlot((prev) => (prev && newSlots.includes(prev) ? prev : ''));
    } catch {
      setError('Failed to load available time slots');
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedTechnicianId, selectedDate, selectedServiceIds]);

  const toggleService = (serviceId) => {
    const id = String(serviceId);
    setSelectedServiceIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      return next;
    });
    setSelectedTechnicianId('');
    setSelectedSlot('');
    setSlots([]);
  };

  const lookupClient = useCallback(async (email) => {
    const trimmed = email?.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setClientLookupMessage('');
      return;
    }

    try {
      const res = await httpClient.get('/api/bookings/client-lookup', { params: { email: trimmed } });
      if (res.data.found && res.data.customer) {
        setClient((prev) => ({
          ...prev,
          firstName: res.data.customer.firstName || prev.firstName,
          lastName: res.data.customer.lastName || prev.lastName,
          phone: res.data.customer.phone || prev.phone,
          address: res.data.customer.address || prev.address,
        }));
        if (res.data.isActivated) {
          setClientLookupMessage('Existing customer account found — details prefilled.');
        } else if (res.data.source === 'booking') {
          setClientLookupMessage('Previous booking found for this email — details prefilled. Activation link will be sent if needed.');
        } else {
          setClientLookupMessage('Customer account pending activation — details prefilled. A new activation link will be sent.');
        }
      } else {
        setClientLookupMessage('New client — booking confirmation will include an account activation link.');
      }
    } catch {
      setClientLookupMessage('');
    }
  }, []);

  useEffect(() => {
    if (show && step === 2 && selectedServiceIds.length) loadTechnicians();
  }, [show, step, selectedServiceIds, loadTechnicians]);

  useEffect(() => {
    if (show && step === 3 && selectedTechnicianId && selectedDate) loadSlots();
  }, [show, step, selectedTechnicianId, selectedDate, loadSlots]);

  const canNext = () => {
    switch (STEPS[step].key) {
      case 'service':
        return selectedServiceIds.length > 0;
      case 'area':
        return Boolean(selectedLocationId);
      case 'technician':
        return Boolean(selectedTechnicianId);
      case 'schedule':
        return Boolean(selectedSlot);
      case 'details':
        return client.firstName.trim() && client.lastName.trim() && client.email.trim();
      default:
        return true;
    }
  };

  const goNext = () => {
    if (!canNext()) return;
    setError('');
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setError('');
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleClose = () => {
    if (submitting) return;
    onHide();
  };

  const handleSubmit = async () => {
    if (!selectedSlot) {
      setError('Please go back and select a time slot before submitting.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await httpClient.post('/api/bookings', {
        serviceIds: selectedServiceIds.map(Number),
        serviceLocationId: Number(selectedLocationId),
        technicianUserId: selectedTechnicianId,
        scheduledAt: selectedSlot,
        clientFirstName: client.firstName.trim(),
        clientLastName: client.lastName.trim(),
        clientEmail: client.email.trim(),
        clientPhone: client.phone.trim(),
        clientAddress: client.address.trim(),
        notes: client.notes.trim(),
      });
      setCompletedBooking(res.data.booking);
      onSuccess?.(res.data.booking);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <Offcanvas
      placement="end"
      show={show}
      onHide={handleClose}
      backdrop={submitting ? 'static' : true}
      style={{ width: 'min(640px, 100vw)' }}
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title>
          {completedBooking ? 'Booking Confirmed' : `New Booking — ${STEPS[step].label}`}
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column p-0 h-100">
        {!completedBooking && (
          <div className="px-3 pt-3 pb-2 border-bottom bg-light-subtle">
            <div className="d-flex justify-content-between gap-1 mb-2">
              {STEPS.map((s, idx) => (
                <div
                  key={s.key}
                  className={`text-center flex-fill ${idx <= step ? 'text-primary' : 'text-muted'}`}
                  style={{ minWidth: 0 }}
                >
                  <IconifyIcon icon={s.icon} className="fs-5 d-block mx-auto" />
                  <small className="d-none d-sm-block text-truncate">{s.label}</small>
                </div>
              ))}
            </div>
            <ProgressBar now={progress} style={{ height: 5 }} />
            <small className="text-muted">Step {step + 1} of {STEPS.length}</small>
          </div>
        )}

        <div className="flex-grow-1 overflow-auto p-3 min-h-0">
          {error && <Alert variant="danger">{error}</Alert>}

          {completedBooking ? (
            <div className="text-center py-3">
              <div className="avatar-lg bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                <IconifyIcon icon="bx:check" className="fs-1" />
              </div>
              <h5 className="mb-2">Booking Submitted</h5>
              <p className="text-muted">
                Confirmation sent to <strong>{completedBooking.clientEmail}</strong>
              </p>
              <Badge bg="warning" className="mb-3">Pending</Badge>
              <div className="text-start bg-light rounded p-3 small">
                <p className="mb-1"><strong>Reference:</strong> {completedBooking.referenceCode}</p>
                <p className="mb-1"><strong>Service:</strong> {completedBooking.serviceName}</p>
                {completedBooking.services?.length > 1 && (
                  <ul className="mb-2 ps-3">
                    {completedBooking.services.map((service) => (
                      <li key={service.serviceId}>
                        {service.serviceName} — {formatCurrency(service.price)}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mb-1"><strong>Charge:</strong> {formatCurrency(completedBooking.servicePrice)}</p>
                <p className="mb-1"><strong>Area:</strong> {completedBooking.locationParentName ? `${completedBooking.locationName} (${completedBooking.locationParentName})` : completedBooking.locationName}</p>
                <p className="mb-1"><strong>Technician:</strong> {[completedBooking.technicianFirstName, completedBooking.technicianLastName].filter(Boolean).join(' ')}</p>
                <p className="mb-0"><strong>Scheduled:</strong> {formatBookingSlot(completedBooking.scheduledAt, bookingSettings.timezone)}</p>
              </div>
            </div>
          ) : loadingCatalog ? (
            <div className="text-center py-5"><Spinner animation="border" /></div>
          ) : (
            <>
              {STEPS[step].key === 'service' && (
                <>
                  <h6 className="mb-2">Choose services</h6>
                  <p className="text-muted small mb-3">
                    Select one or more services from any category. Duration and pricing are combined for scheduling.
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
                              const checked = selectedServiceIds.includes(String(service.id));
                              return (
                                <div
                                  key={service.id}
                                  role="button"
                                  className={`border rounded p-2 ${checked ? 'border-primary bg-primary-subtle' : ''}`}
                                  onClick={() => toggleService(service.id)}
                                >
                                  <Form.Check
                                    type="checkbox"
                                    id={`service-${service.id}`}
                                    checked={checked}
                                    onChange={() => toggleService(service.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    label={
                                      <span>
                                        <span className="fw-medium">{service.name}</span>
                                        <span className="text-muted ms-2">
                                          {formatDuration(service.durationMinutes)} · {formatCurrency(service.price)}
                                        </span>
                                      </span>
                                    }
                                  />
                                  {service.description && (
                                    <div className="small text-muted ms-4 mt-1">{service.description}</div>
                                  )}
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
                        {serviceSearch.trim() ? ` matching “${serviceSearch.trim()}”` : ''}
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
                  {selectedServices.length > 0 && (
                    <Alert variant="light" className="border py-2 small mt-3 mb-0">
                      <div className="fw-medium mb-1">
                        {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                      </div>
                      <div className="d-flex flex-wrap gap-3">
                        <span><strong>Total duration:</strong> {formatDuration(totalDurationMinutes)}</span>
                        <span><strong>Total charge:</strong> {formatCurrency(totalServicePrice)}</span>
                      </div>
                    </Alert>
                  )}
                </>
              )}

              {STEPS[step].key === 'area' && (
                <>
                  <h6 className="mb-2">Select service area</h6>
                  <p className="text-muted small">Choose the coverage community for this job.</p>
                  <Tab.Container activeKey={areaTab} onSelect={(k) => { if (k) { setAreaTab(k); setSelectedLocationId(''); } }}>
                    <Nav variant="pills" className="mb-3 gap-1 flex-nowrap overflow-auto">
                      <Nav.Item>
                        <Nav.Link eventKey={GTA_TAB} className="text-nowrap">GTA</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey={NEARBY_TAB} className="text-nowrap">Nearby</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Row className="g-2">
                      {areaLocations.map((loc) => (
                        <Col xs={6} key={loc.id}>
                          <div
                            role="button"
                            className={`border rounded p-2 h-100 small ${String(loc.id) === selectedLocationId ? 'border-primary bg-primary-subtle' : ''}`}
                            onClick={() => setSelectedLocationId(String(loc.id))}
                          >
                            <div className="fw-medium">{loc.name}</div>
                            {loc.parentName && <span className="text-muted">{loc.parentName}</span>}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Tab.Container>
                </>
              )}

              {STEPS[step].key === 'technician' && (
                <>
                  <h6 className="mb-3">Choose technician</h6>
                  <p className="text-muted small mb-3">
                    Showing technicians qualified for all {selectedServices.length} selected service{selectedServices.length > 1 ? 's' : ''}.
                  </p>
                  {loadingTechnicians ? (
                    <div className="text-center py-4"><Spinner animation="border" size="sm" /></div>
                  ) : technicians.length === 0 ? (
                    <Alert variant="warning" className="mb-0">No technicians available for this service.</Alert>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {technicians.map((member) => (
                        <div
                          key={member.id}
                          role="button"
                          className={`border rounded p-2 d-flex gap-2 align-items-start ${selectedTechnicianId === member.id ? 'border-primary bg-primary-subtle' : ''}`}
                          onClick={() => setSelectedTechnicianId(member.id)}
                        >
                          <UserAvatar user={member} size="sm" />
                          <div className="small">
                            <div className="fw-semibold">{member.firstName} {member.lastName}</div>
                            <span className="text-muted">{member.yearsExperience} yrs experience</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {STEPS[step].key === 'schedule' && (
                <>
                  <h6 className="mb-3">Date & time</h6>
                  <p className="text-muted small mb-3">
                    Combined appointment: {formatDuration(totalDurationMinutes)} · {formatCurrency(totalServicePrice)}
                  </p>
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      min={minDate}
                      max={maxDate}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </Form.Group>
                  {selectedDate && (
                    loadingSlots ? (
                      <div className="text-center py-3"><Spinner animation="border" size="sm" /></div>
                    ) : slots.length === 0 ? (
                      <Alert variant="warning" className="mb-0">
                        No available slots on this date. The day may be outside business hours, a non-working day, or fully booked — try another day.
                      </Alert>
                    ) : (
                      <Row className="g-2">
                        {slots.map((slot) => (
                          <Col xs={12} sm={6} key={slot}>
                            <Button
                              size="sm"
                              variant={selectedSlot === slot ? 'primary' : 'outline-primary'}
                              className="w-100"
                              onClick={() => setSelectedSlot(slot)}
                            >
                              {formatBookingSlot(slot, bookingSettings.timezone)}
                            </Button>
                          </Col>
                        ))}
                      </Row>
                    )
                  )}
                </>
              )}

              {STEPS[step].key === 'details' && (
                <>
                  <h6 className="mb-3">Client details</h6>
                  {clientLookupMessage && (
                    <Alert variant="info" className="py-2 small mb-3">{clientLookupMessage}</Alert>
                  )}
                  <Row className="g-2">
                    <Col xs={12}>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={client.email}
                        onChange={(e) => setClient({ ...client, email: e.target.value })}
                        onBlur={(e) => lookupClient(e.target.value)}
                        required
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control value={client.firstName} onChange={(e) => setClient({ ...client, firstName: e.target.value })} required />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control value={client.lastName} onChange={(e) => setClient({ ...client, lastName: e.target.value })} required />
                    </Col>
                    <Col xs={12}>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} />
                    </Col>
                    <Col xs={12}>
                      <Form.Label>Service Address</Form.Label>
                      <Form.Control value={client.address} onChange={(e) => setClient({ ...client, address: e.target.value })} />
                    </Col>
                    <Col xs={12}>
                      <Form.Label>Notes</Form.Label>
                      <Form.Control as="textarea" rows={2} value={client.notes} onChange={(e) => setClient({ ...client, notes: e.target.value })} />
                    </Col>
                  </Row>
                </>
              )}

              {STEPS[step].key === 'review' && (
                <>
                  <h6 className="mb-3">Review booking</h6>
                  <div className="bg-light rounded p-3 small mb-3">
                    <p className="mb-2"><strong>Services:</strong></p>
                    <ul className="mb-2 ps-3">
                      {selectedServices.map((service) => (
                        <li key={service.id}>
                          {service.name}
                          <span className="text-muted">
                            {' '}({service.categoryName}) — {formatDuration(service.durationMinutes)} · {formatCurrency(service.price)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mb-1"><strong>Total charge:</strong> {formatCurrency(totalServicePrice)}</p>
                    <p className="mb-1"><strong>Area:</strong> {selectedLocation?.label}</p>
                    <p className="mb-1"><strong>Technician:</strong> {selectedTechnician?.firstName} {selectedTechnician?.lastName}</p>
                    <p className="mb-1"><strong>Scheduled:</strong> {formatBookingSlot(selectedSlot, bookingSettings.timezone)}</p>
                    <p className="mb-1"><strong>Client:</strong> {client.firstName} {client.lastName}</p>
                    <p className="mb-1"><strong>Email:</strong> {client.email}</p>
                    <p className="mb-1"><strong>Phone:</strong> {client.phone || '—'}</p>
                    <p className="mb-1"><strong>Address:</strong> {client.address || '—'}</p>
                    <p className="mb-0"><strong>Booking type:</strong> Admin Booking</p>
                  </div>
                  <Alert variant="info" className="small mb-0">
                    Creates a <strong>Pending</strong> <strong>Admin Booking</strong> for {formatCurrency(totalServicePrice)} across {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}.
                    {' '}A confirmation email goes to {client.email}.
                    {' '}New or not-yet-activated clients also receive an account activation link.
                  </Alert>
                </>
              )}
            </>
          )}
        </div>

        <div className="border-top p-3 d-flex justify-content-between gap-2 flex-shrink-0 bg-light-subtle">
          {completedBooking ? (
            <Button variant="primary" className="w-100" onClick={handleClose}>
              Done
            </Button>
          ) : (
            <>
              <Button variant="light" onClick={goBack} disabled={step === 0 || submitting}>
                <IconifyIcon icon="bx:left-arrow-alt" />
              </Button>
              {STEPS[step].key === 'review' ? (
                <Button variant="primary" className="flex-grow-1" onClick={handleSubmit} disabled={submitting || !selectedSlot}>
                  {submitting ? 'Submitting...' : 'Submit Booking'}
                </Button>
              ) : (
                <Button variant="primary" className="flex-grow-1" onClick={goNext} disabled={!canNext()}>
                  Continue <IconifyIcon icon="bx:right-arrow-alt" className="ms-1" />
                </Button>
              )}
            </>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default BookingWizardOffcanvas;
