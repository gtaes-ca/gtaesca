import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Offcanvas, Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import BookingMaterialsPanel from '@/components/booking/BookingMaterialsPanel';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import PageMetaData from '@/components/PageTitle';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';
import { DEFAULT_BOOKING_TIMEZONE, formatBookingDateTime } from '@/utils/bookingDateTime';
import { formatCurrency } from '@/utils/currency';

const STATUS_VARIANT = {
  technician_assigned: 'info',
  completed: 'success',
};

function statusBadge(status) {
  const label = status === 'technician_assigned' ? 'Assigned' : status.replace('_', ' ');
  return <Badge bg={STATUS_VARIANT[status] || 'secondary'} className="text-capitalize">{label}</Badge>;
}

const TechnicianJobsPage = () => {
  const { showNotification } = useNotificationContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingTimezone, setBookingTimezone] = useState(DEFAULT_BOOKING_TIMEZONE);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [suggestedMaterials, setSuggestedMaterials] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [completing, setCompleting] = useState(false);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/technician/bookings', {
        params: { status: 'technician_assigned' },
      });
      setBookings(res.data.bookings || []);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load assigned jobs',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    httpClient.get('/api/bookings/settings')
      .then((res) => setBookingTimezone(res.data.settings?.timezone || DEFAULT_BOOKING_TIMEZONE))
      .catch(() => setBookingTimezone(DEFAULT_BOOKING_TIMEZONE));
  }, []);

  const openJob = async (booking) => {
    setSelectedBooking(booking);
    setSuggestedMaterials([]);
    setLoadingDetail(true);
    try {
      const res = await httpClient.get(`/api/technician/bookings/${booking.id}`);
      setSelectedBooking(res.data.booking);
      setSuggestedMaterials(res.data.suggestedMaterials || []);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load job details',
        variant: 'danger',
      });
      setSelectedBooking(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleBookingUpdated = (booking) => {
    setSelectedBooking(booking);
    setBookings((prev) => prev.map((item) => (item.id === booking.id ? booking : item)));
  };

  const completeJob = async () => {
    if (!selectedBooking) return;
    setCompleting(true);
    try {
      const res = await httpClient.post(`/api/technician/bookings/${selectedBooking.id}/complete`);
      showNotification({ message: 'Job marked as completed', variant: 'success' });
      setSelectedBooking(null);
      setBookings((prev) => prev.filter((item) => item.id !== selectedBooking.id));
      if (res.data.booking) {
        setBookings((prev) => prev); // already removed assigned
      }
      loadBookings();
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to complete job',
        variant: 'danger',
      });
    } finally {
      setCompleting(false);
    }
  };

  const locationDisplay = (booking) =>
    booking.locationParentName ? `${booking.locationName} (${booking.locationParentName})` : booking.locationName;

  return (
    <>
      <PageMetaData title="My Jobs" />
      <ComponentContainerCard
        title="Assigned Jobs"
        description="View your scheduled work, record materials used on site, and mark jobs complete."
      >
        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Client</th>
                <th>Service</th>
                <th>Area</th>
                <th>Scheduled</th>
                <th>Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="fw-medium">{booking.referenceCode}</td>
                  <td>
                    <div>{booking.clientFirstName} {booking.clientLastName}</div>
                    <small className="text-muted">{booking.clientPhone || booking.clientEmail}</small>
                  </td>
                  <td>{booking.serviceName}</td>
                  <td className="text-muted">{locationDisplay(booking)}</td>
                  <td>{formatBookingDateTime(booking.scheduledAt, bookingTimezone)}</td>
                  <td>{formatCurrency(booking.totalPrice ?? booking.servicePrice)}</td>
                  <td>
                    <Button size="sm" variant="primary" onClick={() => openJob(booking)}>
                      Complete Job
                    </Button>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-muted">No assigned jobs right now.</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </ComponentContainerCard>

      <Offcanvas
        placement="end"
        show={!!selectedBooking}
        onHide={() => !completing && setSelectedBooking(null)}
        backdrop={completing ? 'static' : true}
        style={{ width: 'min(560px, 100vw)' }}
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title>Complete Job</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column">
          {selectedBooking && (
            <>
              <div className="bg-light rounded p-3 small mb-3">
                <p className="mb-2">
                  <strong>{selectedBooking.referenceCode}</strong> {statusBadge(selectedBooking.status)}
                </p>
                <p className="mb-1"><strong>Client:</strong> {selectedBooking.clientFirstName} {selectedBooking.clientLastName}</p>
                <p className="mb-1"><strong>Phone:</strong> {selectedBooking.clientPhone || '—'}</p>
                <p className="mb-1"><strong>Address:</strong> {selectedBooking.clientAddress || '—'}</p>
                <p className="mb-1"><strong>Services:</strong> {selectedBooking.serviceName}</p>
                <p className="mb-0"><strong>Scheduled:</strong> {formatBookingDateTime(selectedBooking.scheduledAt, bookingTimezone)}</p>
              </div>

              {loadingDetail ? (
                <p className="text-muted small">Loading job details...</p>
              ) : (
                <BookingMaterialsPanel
                  mode="technician"
                  booking={selectedBooking}
                  suggestedMaterials={suggestedMaterials}
                  onBookingUpdated={handleBookingUpdated}
                />
              )}

              <div className="mt-auto d-flex gap-2 pt-3 border-top">
                <Button variant="light" className="flex-grow-1" onClick={() => setSelectedBooking(null)} disabled={completing}>
                  Close
                </Button>
                <Button className="flex-grow-1" onClick={completeJob} disabled={completing || loadingDetail}>
                  {completing ? 'Completing...' : 'Mark Complete'}
                </Button>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default TechnicianJobsPage;
