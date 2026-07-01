import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Offcanvas, Table } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import PageMetaData from '@/components/PageTitle';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';
import { DEFAULT_BOOKING_TIMEZONE, formatBookingDateTime } from '@/utils/bookingDateTime';
import { formatCurrency } from '@/utils/currency';

const STATUS_VARIANT = {
  pending: 'warning',
  technician_assigned: 'info',
  completed: 'success',
  cancelled: 'danger',
};

const STATUS_LABEL = {
  pending: 'Pending',
  technician_assigned: 'Technician Assigned',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function statusBadge(status) {
  return <Badge bg={STATUS_VARIANT[status] || 'secondary'}>{STATUS_LABEL[status] || status}</Badge>;
}

const CustomerBookingsPage = () => {
  const { showNotification } = useNotificationContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingTimezone, setBookingTimezone] = useState(DEFAULT_BOOKING_TIMEZONE);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/customer/bookings');
      setBookings(res.data.bookings || []);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load bookings',
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

  const locationDisplay = (booking) =>
    booking.locationParentName ? `${booking.locationName} (${booking.locationParentName})` : booking.locationName;

  return (
    <>
      <PageMetaData title="My Bookings" />
      <ComponentContainerCard
        title="My Service Bookings"
        description="View your scheduled services and final charges including any materials used."
      >
        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Service</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th>Total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="fw-medium">{booking.referenceCode}</td>
                  <td>{booking.serviceName}</td>
                  <td>{formatBookingDateTime(booking.scheduledAt, bookingTimezone)}</td>
                  <td>{statusBadge(booking.status)}</td>
                  <td>{formatCurrency(booking.totalPrice ?? booking.servicePrice)}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => setSelectedBooking(booking)}>
                      View Invoice
                    </Button>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-muted">No bookings linked to your account yet.</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </ComponentContainerCard>

      <Offcanvas
        placement="end"
        show={!!selectedBooking}
        onHide={() => setSelectedBooking(null)}
        style={{ width: 'min(520px, 100vw)' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Booking Invoice</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedBooking && (
            <>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <strong>{selectedBooking.referenceCode}</strong>
                  {statusBadge(selectedBooking.status)}
                </div>
                <p className="mb-1 small"><strong>Service area:</strong> {locationDisplay(selectedBooking)}</p>
                <p className="mb-1 small"><strong>Scheduled:</strong> {formatBookingDateTime(selectedBooking.scheduledAt, bookingTimezone)}</p>
                <p className="mb-0 small"><strong>Technician:</strong> {[selectedBooking.technicianFirstName, selectedBooking.technicianLastName].filter(Boolean).join(' ') || 'To be assigned'}</p>
              </div>

              <h6 className="mb-2">Services</h6>
              {(selectedBooking.services?.length ? selectedBooking.services : [{
                serviceName: selectedBooking.serviceName,
                price: selectedBooking.servicePrice,
              }]).map((service) => (
                <div key={service.serviceId || service.serviceName} className="d-flex justify-content-between small mb-1">
                  <span>{service.serviceName}</span>
                  <span>{formatCurrency(service.price)}</span>
                </div>
              ))}

              <div className="d-flex justify-content-between small fw-medium border-top pt-2 mt-2 mb-3">
                <span>Services subtotal</span>
                <span>{formatCurrency(selectedBooking.servicePrice)}</span>
              </div>

              <h6 className="mb-2">Materials</h6>
              {selectedBooking.materials?.length > 0 ? (
                selectedBooking.materials.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between small mb-1">
                    <span>{item.name} ({item.quantity} {item.unit})</span>
                    <span>{formatCurrency(item.lineTotal)}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted small">No materials recorded yet.</p>
              )}

              <div className="d-flex justify-content-between small fw-medium border-top pt-2 mt-2 mb-3">
                <span>Materials subtotal</span>
                <span>{formatCurrency(selectedBooking.materialsTotal || 0)}</span>
              </div>

              <div className="bg-light rounded p-3 d-flex justify-content-between fw-semibold">
                <span>Total</span>
                <span>{formatCurrency(selectedBooking.totalPrice ?? selectedBooking.servicePrice)}</span>
              </div>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default CustomerBookingsPage;
