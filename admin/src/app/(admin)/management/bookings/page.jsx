import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge, Button, Col, Form, Offcanvas, Row, Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import BookingWizardOffcanvas from '@/components/booking/BookingWizardOffcanvas';
import BookingDetailOffcanvas from '@/components/booking/BookingDetailOffcanvas';
import BookingMaterialsPanel from '@/components/booking/BookingMaterialsPanel';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import PageMetaData from '@/components/PageTitle';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';
import { DEFAULT_BOOKING_TIMEZONE, formatBookingDateTime } from '@/utils/bookingDateTime';
import { formatCurrency } from '@/utils/currency';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', variant: 'warning' },
  { value: 'technician_assigned', label: 'Technician Assigned', variant: 'info' },
  { value: 'completed', label: 'Completed', variant: 'success' },
  { value: 'cancelled', label: 'Cancelled', variant: 'danger' },
];

const NEXT_STATUS = {
  pending: ['technician_assigned', 'cancelled'],
  technician_assigned: ['completed', 'cancelled'],
};

function statusBadge(status) {
  const opt = STATUS_OPTIONS.find((s) => s.value === status);
  return <Badge bg={opt?.variant || 'secondary'}>{opt?.label || status}</Badge>;
}

const BookingsManagementPage = () => {
  const { showNotification } = useNotificationContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [bookingTimezone, setBookingTimezone] = useState(DEFAULT_BOOKING_TIMEZONE);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailBooking, setDetailBooking] = useState(null);
  const [loadingBookingDetail, setLoadingBookingDetail] = useState(false);
  const [loadingDetailView, setLoadingDetailView] = useState(false);
  const [suggestedMaterials, setSuggestedMaterials] = useState([]);
  const [newStatus, setNewStatus] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [updating, setUpdating] = useState(false);
  const [resendingEmailId, setResendingEmailId] = useState(null);
  const [showWizard, setShowWizard] = useState(false);

  const loadBookings = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/bookings', {
        params: {
          page,
          limit: 20,
          status: statusFilter || undefined,
          search: search || undefined,
        },
      });
      setBookings(res.data.bookings || []);
      setPagination(res.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load bookings',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, showNotification]);

  useEffect(() => {
    loadBookings(1);
  }, [loadBookings]);

  useEffect(() => {
    httpClient.get('/api/bookings/settings')
      .then((res) => setBookingTimezone(res.data.settings?.timezone || DEFAULT_BOOKING_TIMEZONE))
      .catch(() => setBookingTimezone(DEFAULT_BOOKING_TIMEZONE));
  }, []);

  const formatDateTime = (iso) => formatBookingDateTime(iso, bookingTimezone);

  useEffect(() => {
    const querySearch = searchParams.get('search');
    if (querySearch) {
      setSearch(querySearch);
    }
    if (searchParams.get('new') === '1') {
      setShowWizard(true);
      const next = new URLSearchParams(searchParams);
      next.delete('new');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const fetchBookingDetail = async (bookingId) => {
    const res = await httpClient.get(`/api/admin/bookings/${bookingId}`);
    return {
      booking: res.data.booking,
      suggestedMaterials: res.data.suggestedMaterials || [],
    };
  };

  const openDetailView = async (booking) => {
    setDetailBooking(booking);
    setLoadingDetailView(true);
    try {
      const { booking: fullBooking } = await fetchBookingDetail(booking.id);
      setDetailBooking(fullBooking);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load booking details',
        variant: 'danger',
      });
      setDetailBooking(null);
    } finally {
      setLoadingDetailView(false);
    }
  };

  const loadTechniciansForBooking = useCallback(async (booking) => {
    const serviceIds = booking.services?.map((service) => service.serviceId) || [booking.serviceId];
    if (!serviceIds.length) return;

    setLoadingTechnicians(true);
    try {
      const res = await httpClient.get('/api/admin/bookings/technicians', {
        params: { serviceIds: serviceIds.join(',') },
      });
      setTechnicians(res.data.technicians || []);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load technicians',
        variant: 'danger',
      });
      setTechnicians([]);
    } finally {
      setLoadingTechnicians(false);
    }
  }, [showNotification]);

  const openStatusSheet = async (booking) => {
    setSelectedBooking(booking);
    const next = NEXT_STATUS[booking.status] || [];
    setNewStatus(next[0] || '');
    setSelectedTechnicianId(booking.technicianUserId || '');
    setTechnicians([]);
    setLoadingBookingDetail(true);
    setSuggestedMaterials([]);
    try {
      const { booking: fullBooking, suggestedMaterials: suggestions } = await fetchBookingDetail(booking.id);
      setSelectedBooking(fullBooking);
      setSuggestedMaterials(suggestions);
      setSelectedTechnicianId(fullBooking.technicianUserId || '');
      if (['pending', 'technician_assigned'].includes(fullBooking.status)) {
        await loadTechniciansForBooking(fullBooking);
      }
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load booking details',
        variant: 'danger',
      });
    } finally {
      setLoadingBookingDetail(false);
    }
  };

  const openManageFromDetail = (booking) => {
    setDetailBooking(null);
    openStatusSheet(booking);
  };

  const handleBookingMaterialsUpdated = (booking) => {
    setSelectedBooking(booking);
    setDetailBooking((prev) => (prev?.id === booking.id ? booking : prev));
    setBookings((prev) => prev.map((item) => (item.id === booking.id ? booking : item)));
  };

  const updateStatus = async () => {
    if (!selectedBooking || !newStatus) return;
    if (newStatus === 'technician_assigned' && !selectedTechnicianId) {
      showNotification({ message: 'Select a technician before assigning', variant: 'warning' });
      return;
    }
    setUpdating(true);
    try {
      const res = await httpClient.patch(`/api/admin/bookings/${selectedBooking.id}/status`, {
        status: newStatus,
        technicianUserId: newStatus === 'technician_assigned' ? selectedTechnicianId : selectedBooking.technicianUserId,
      });
      showNotification({ message: 'Booking status updated', variant: 'success' });
      setSelectedBooking(null);
      loadBookings(pagination.page);
      if (res.data.booking) {
        setBookings((prev) => prev.map((item) => (item.id === res.data.booking.id ? res.data.booking : item)));
      }
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Status update failed',
        variant: 'danger',
      });
    } finally {
      setUpdating(false);
    }
  };

  const reassignTechnician = async () => {
    if (!selectedBooking || !selectedTechnicianId) return;
    if (selectedTechnicianId === selectedBooking.technicianUserId) {
      showNotification({ message: 'Choose a different technician to reassign', variant: 'warning' });
      return;
    }
    setUpdating(true);
    try {
      const res = await httpClient.patch(`/api/admin/bookings/${selectedBooking.id}/technician`, {
        technicianUserId: selectedTechnicianId,
      });
      const updated = res.data.booking;
      setSelectedBooking(updated);
      setBookings((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      if (updated.status === 'technician_assigned') {
        const next = NEXT_STATUS[updated.status] || [];
        setNewStatus(next[0] || '');
      }
      showNotification({ message: 'Technician reassigned', variant: 'success' });
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Technician reassignment failed',
        variant: 'danger',
      });
    } finally {
      setUpdating(false);
    }
  };

  const resendEmail = async (booking) => {
    setResendingEmailId(booking.id);
    try {
      const res = await httpClient.post(`/api/admin/bookings/${booking.id}/resend-email`);
      showNotification({
        message: res.data.message || `Email resent to ${booking.clientEmail}`,
        variant: 'success',
      });
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to resend email',
        variant: 'danger',
      });
    } finally {
      setResendingEmailId(null);
    }
  };

  const handleBookingCreated = (booking) => {
    showNotification({
      message: `Booking ${booking.referenceCode} created`,
      variant: 'success',
    });
    loadBookings(1);
  };

  const locationDisplay = (b) =>
    b.locationParentName ? `${b.locationName} (${b.locationParentName})` : b.locationName;

  const servicesDisplay = (booking) => {
    if (booking.services?.length > 1) {
      return (
        <ul className="mb-0 ps-3 small">
          {booking.services.map((service) => (
            <li key={service.serviceId}>{service.serviceName}</li>
          ))}
        </ul>
      );
    }
    return booking.serviceName;
  };

  return (
    <>
      <PageMetaData title="Bookings" />
      <ComponentContainerCard
        title="Service Bookings"
        description="Review customer bookings, assign technicians, and update status through to completion."
      >
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={() => setShowWizard(true)}>
            <IconifyIcon icon="bx:plus" className="me-1" />
            New Booking
          </Button>
        </div>

        <Row className="g-2 mb-3">
          <Col md={4}>
            <Form.Control
              type="search"
              placeholder="Search reference, client, service, area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Client</th>
                <th>Service</th>
                <th>Total</th>
                <th>Area</th>
                <th>Technician</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="fw-medium">{booking.referenceCode}</td>
                  <td>
                    <div>{booking.clientFirstName} {booking.clientLastName}</div>
                    <small className="text-muted">{booking.clientEmail}</small>
                    {booking.clientPhone && <small className="text-muted d-block">{booking.clientPhone}</small>}
                  </td>
                  <td>{servicesDisplay(booking)}</td>
                  <td>
                    <div>{formatCurrency(booking.totalPrice ?? booking.servicePrice)}</div>
                    {booking.materialsTotal > 0 && (
                      <small className="text-muted">
                        {formatCurrency(booking.servicePrice)} + {formatCurrency(booking.materialsTotal)} materials
                      </small>
                    )}
                  </td>
                  <td className="text-muted" style={{ maxWidth: 140 }}>{locationDisplay(booking)}</td>
                  <td>{[booking.technicianFirstName, booking.technicianLastName].filter(Boolean).join(' ') || '-'}</td>
                  <td>{formatDateTime(booking.scheduledAt)}</td>
                  <td>{statusBadge(booking.status)}</td>
                  <td className="d-flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => openDetailView(booking)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={() => resendEmail(booking)}
                      disabled={resendingEmailId === booking.id}
                    >
                      {resendingEmailId === booking.id ? 'Sending...' : 'Resend Email'}
                    </Button>
                    {booking.status !== 'cancelled' && (
                      <Button size="sm" variant="outline-primary" onClick={() => openStatusSheet(booking)}>
                        Manage
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-muted">
                    No bookings found.{' '}
                    <Button variant="link" className="p-0 align-baseline" onClick={() => setShowWizard(true)}>
                      Create a new booking
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {pagination.totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="text-muted">Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</small>
            <div className="d-flex gap-2">
              <Button size="sm" variant="light" disabled={pagination.page <= 1} onClick={() => loadBookings(pagination.page - 1)}>Previous</Button>
              <Button size="sm" variant="light" disabled={pagination.page >= pagination.totalPages} onClick={() => loadBookings(pagination.page + 1)}>Next</Button>
            </div>
          </div>
        )}
      </ComponentContainerCard>

      <BookingWizardOffcanvas
        show={showWizard}
        onHide={() => setShowWizard(false)}
        onSuccess={handleBookingCreated}
      />

      <BookingDetailOffcanvas
        show={!!detailBooking}
        booking={detailBooking}
        loading={loadingDetailView}
        timezone={bookingTimezone}
        onHide={() => setDetailBooking(null)}
        onManage={openManageFromDetail}
      />

      <Offcanvas
        placement="end"
        show={!!selectedBooking}
        onHide={() => !updating && setSelectedBooking(null)}
        backdrop={updating ? 'static' : true}
        style={{ width: 'min(560px, 100vw)' }}
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title>Manage Booking</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">
          {selectedBooking && (
            <>
              <div className="bg-light rounded p-3 small mb-3">
                <p className="mb-2">
                  <strong>{selectedBooking.referenceCode}</strong>
                  {' '}{statusBadge(selectedBooking.status)}
                </p>
                <p className="mb-1"><strong>Client:</strong> {selectedBooking.clientFirstName} {selectedBooking.clientLastName}</p>
                <p className="mb-1"><strong>Email:</strong> {selectedBooking.clientEmail}</p>
                {selectedBooking.clientPhone && (
                  <p className="mb-1"><strong>Phone:</strong> {selectedBooking.clientPhone}</p>
                )}
                <p className="mb-1"><strong>Services:</strong> {selectedBooking.serviceName}</p>
                {selectedBooking.services?.length > 1 && (
                  <ul className="mb-2 ps-3">
                    {selectedBooking.services.map((service) => (
                      <li key={service.serviceId}>
                        {service.serviceName} — {formatCurrency(service.price)}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mb-1"><strong>Area:</strong> {locationDisplay(selectedBooking)}</p>
                <p className="mb-1"><strong>Technician:</strong> {[selectedBooking.technicianFirstName, selectedBooking.technicianLastName].filter(Boolean).join(' ') || '—'}</p>
                <p className="mb-0"><strong>Scheduled:</strong> {formatDateTime(selectedBooking.scheduledAt)}</p>
              </div>

              {loadingBookingDetail ? (
                <p className="text-muted small">Loading materials...</p>
              ) : (
                <BookingMaterialsPanel
                  booking={selectedBooking}
                  suggestedMaterials={suggestedMaterials}
                  onBookingUpdated={handleBookingMaterialsUpdated}
                  disabled={selectedBooking.status === 'cancelled'}
                />
              )}

              {['pending', 'technician_assigned'].includes(selectedBooking.status) && (
                <Form.Group className="mb-4">
                  <Form.Label>
                    {selectedBooking.status === 'technician_assigned'
                      ? 'Assign to another technician'
                      : 'Assign technician'}
                  </Form.Label>
                  {loadingTechnicians ? (
                    <p className="text-muted small mb-0">Loading qualified technicians...</p>
                  ) : technicians.length === 0 ? (
                    <p className="text-muted small mb-0">No qualified technicians available for this booking.</p>
                  ) : (
                    <Form.Select
                      value={selectedTechnicianId}
                      onChange={(e) => setSelectedTechnicianId(e.target.value)}
                      disabled={updating}
                    >
                      <option value="">Select technician...</option>
                      {technicians.map((technician) => (
                        <option key={technician.id} value={technician.id}>
                          {[technician.firstName, technician.lastName].filter(Boolean).join(' ')}
                          {technician.id === selectedBooking.technicianUserId ? ' (current)' : ''}
                          {!technician.onboardingCompleted ? ' (onboarding pending)' : ''}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                  {selectedBooking.status === 'technician_assigned' && (
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={reassignTechnician}
                        disabled={
                          updating
                          || loadingTechnicians
                          || !selectedTechnicianId
                          || selectedTechnicianId === selectedBooking.technicianUserId
                        }
                      >
                        {updating ? 'Saving...' : 'Reassign Technician'}
                      </Button>
                      <Form.Text className="d-block text-muted mt-1">
                        Reassigning notifies the client by email and moves the job to the selected technician.
                      </Form.Text>
                    </div>
                  )}
                  {selectedBooking.status === 'pending' && newStatus === 'technician_assigned' && (
                    <Form.Text className="d-block text-muted mt-1">
                      Select the technician who will handle this job before updating the status.
                    </Form.Text>
                  )}
                </Form.Group>
              )}

              {(NEXT_STATUS[selectedBooking.status] || []).length > 0 && (
                <Form.Group className="mb-4">
                  <Form.Label>New status</Form.Label>
                  <Form.Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    {(NEXT_STATUS[selectedBooking.status] || []).map((s) => {
                      const opt = STATUS_OPTIONS.find((o) => o.value === s);
                      return <option key={s} value={s}>{opt?.label || s}</option>;
                    })}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Add materials used on the job before marking complete. The client will receive an itemized total by email.
                  </Form.Text>
                </Form.Group>
              )}

              <div className="mt-auto d-flex gap-2 pt-3 border-top">
                <Button variant="light" className="flex-grow-1" onClick={() => setSelectedBooking(null)} disabled={updating}>
                  Close
                </Button>
                {(NEXT_STATUS[selectedBooking.status] || []).length > 0 && (
                  <Button
                    className="flex-grow-1"
                    onClick={updateStatus}
                    disabled={
                      updating
                      || !newStatus
                      || (newStatus === 'technician_assigned' && !selectedTechnicianId)
                    }
                  >
                    {updating ? 'Updating...' : 'Update Status'}
                  </Button>
                )}
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default BookingsManagementPage;
