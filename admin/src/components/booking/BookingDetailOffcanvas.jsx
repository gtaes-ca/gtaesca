import { Badge, Button, Col, Offcanvas, Row, Table } from 'react-bootstrap';
import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import { APP_NAME } from '@/context/constants';
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
  return (
    <Badge bg={STATUS_VARIANT[status] || 'secondary'}>
      {STATUS_LABEL[status] || status}
    </Badge>
  );
}

function locationDisplay(booking) {
  return booking.locationParentName
    ? `${booking.locationName} (${booking.locationParentName})`
    : booking.locationName;
}

function formatDate(iso, timezone) {
  if (!iso) return '—';
  return formatBookingDateTime(iso, timezone);
}

function invoiceTitle(status) {
  if (status === 'completed') return 'Invoice';
  if (status === 'cancelled') return 'Cancelled Booking';
  return 'Service Estimate';
}

function invoiceDate(booking, timezone) {
  if (booking.completedAt) return formatDate(booking.completedAt, timezone);
  if (booking.createdAt) return formatDate(booking.createdAt, timezone);
  return '—';
}

function InvoiceLogo() {
  return (
    <div className="auth-logo d-inline-block">
      <span className="logo-dark d-inline-block">
        <img src={logoDark} alt={APP_NAME} height={28} />
      </span>
      <span className="logo-light d-inline-block">
        <img src={logoLight} alt={APP_NAME} height={28} />
      </span>
    </div>
  );
}

const BookingDetailOffcanvas = ({
  show,
  booking,
  loading = false,
  timezone = DEFAULT_BOOKING_TIMEZONE,
  onHide,
  onManage,
}) => {
  const services = booking?.services?.length
    ? booking.services
    : booking
      ? [{ serviceName: booking.serviceName, price: booking.servicePrice }]
      : [];

  const lineItems = [
    ...services.map((service) => ({
      key: `service-${service.serviceId || service.serviceName}`,
      description: service.serviceName,
      type: 'Service',
      quantity: 1,
      unit: 'job',
      unitPrice: service.price,
      amount: service.price,
    })),
    ...(booking?.materials || []).map((item) => ({
      key: item.id,
      description: item.name,
      type: 'Material',
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      amount: item.lineTotal,
      notes: item.notes,
    })),
  ];

  const hasMaterials = (booking?.materialsTotal || 0) > 0;
  const isFinal = booking?.status === 'completed';

  return (
    <Offcanvas
      placement="end"
      show={show}
      onHide={onHide}
      className="booking-invoice-offcanvas"
      style={{ width: 'min(680px, 100vw)' }}
    >
      <Offcanvas.Header closeButton className="border-bottom border-secondary-subtle">
        <Offcanvas.Title>{booking ? invoiceTitle(booking.status) : 'Booking Details'}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column p-0 bg-body-tertiary">
        {loading && (
          <div className="p-4">
            <p className="text-muted small mb-0">Loading invoice...</p>
          </div>
        )}

        {!loading && booking && (
          <>
            <div className="flex-grow-1 overflow-auto p-4">
              <div className="booking-invoice-document border border-secondary-subtle rounded shadow-sm p-4 bg-body text-body">
                <div className="clearfix mb-4">
                  <div className="float-end text-end">
                    <InvoiceLogo />
                    <address className="mb-0 small text-muted" style={{ lineHeight: 1.6 }}>
                      <strong className="text-body-emphasis d-block mb-1">{APP_NAME}</strong>
                      Greater Toronto Area<br />
                      Ontario, Canada
                    </address>
                  </div>
                  <div className="float-start">
                    <h4 className="mb-1 fw-bold text-body-emphasis">{invoiceTitle(booking.status)}</h4>
                    <p className="text-muted mb-2 small">#{booking.referenceCode}</p>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      {statusBadge(booking.status)}
                      {!isFinal && hasMaterials && (
                        <Badge bg="secondary-subtle" text="secondary" className="border border-secondary-subtle">
                          Includes materials
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Row className="g-3 mb-4">
                  <Col sm={6}>
                    <p className="text-uppercase text-muted small fw-semibold mb-2">Bill To</p>
                    <h6 className="mb-1 text-body-emphasis">
                      {booking.clientFirstName} {booking.clientLastName}
                    </h6>
                    <address className="mb-0 small text-muted" style={{ lineHeight: 1.7 }}>
                      {booking.clientAddress ? (
                        <>
                          {booking.clientAddress}
                          <br />
                        </>
                      ) : null}
                      {booking.clientEmail}
                      <br />
                      {booking.clientPhone ? (
                        <>
                          <abbr title="Phone" className="text-muted">Tel:</abbr> {booking.clientPhone}
                        </>
                      ) : (
                        <span className="text-muted">No phone on file</span>
                      )}
                    </address>
                  </Col>
                  <Col sm={6} className="text-sm-end">
                    <p className="text-uppercase text-muted small fw-semibold mb-2">Invoice Details</p>
                    <table className="table table-sm table-borderless mb-0 ms-sm-auto text-body" style={{ maxWidth: 280 }}>
                      <tbody className="small">
                        <tr>
                          <td className="text-muted ps-0">Invoice date</td>
                          <td className="text-end pe-0 fw-medium text-body-emphasis">{invoiceDate(booking, timezone)}</td>
                        </tr>
                        <tr>
                          <td className="text-muted ps-0">Scheduled</td>
                          <td className="text-end pe-0">{formatDate(booking.scheduledAt, timezone)}</td>
                        </tr>
                        <tr>
                          <td className="text-muted ps-0">Service area</td>
                          <td className="text-end pe-0">{locationDisplay(booking)}</td>
                        </tr>
                        <tr>
                          <td className="text-muted ps-0">Technician</td>
                          <td className="text-end pe-0">
                            {[booking.technicianFirstName, booking.technicianLastName].filter(Boolean).join(' ') || '—'}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted ps-0">Duration</td>
                          <td className="text-end pe-0">{booking.durationMinutes} min</td>
                        </tr>
                      </tbody>
                    </table>
                  </Col>
                </Row>

                <div className="table-responsive table-borderless text-nowrap mt-2">
                  <Table className="table mb-0 align-middle text-body">
                    <thead className="bg-body-secondary">
                      <tr>
                        <th className="border-0 py-2 ps-3 text-body-emphasis">Description</th>
                        <th className="border-0 py-2 text-body-emphasis">Type</th>
                        <th className="border-0 py-2 text-center text-body-emphasis">Qty</th>
                        <th className="border-0 py-2 text-end text-body-emphasis">Rate</th>
                        <th className="border-0 py-2 text-end pe-3 text-body-emphasis">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((item) => (
                        <tr key={item.key} className="border-bottom border-secondary-subtle">
                          <td className="ps-3 py-3">
                            <div className="fw-medium text-body-emphasis">{item.description}</div>
                            {item.notes && <small className="text-muted">{item.notes}</small>}
                          </td>
                          <td className="py-3">
                            <Badge
                              bg={item.type === 'Service' ? 'primary-subtle' : 'secondary-subtle'}
                              text={item.type === 'Service' ? 'primary' : 'secondary'}
                              className="fw-normal"
                            >
                              {item.type}
                            </Badge>
                          </td>
                          <td className="text-center py-3">
                            {item.quantity}{item.unit !== 'job' ? ` ${item.unit}` : ''}
                          </td>
                          <td className="text-end py-3">{formatCurrency(item.unitPrice)}</td>
                          <td className="text-end pe-3 py-3 fw-medium text-body-emphasis">{formatCurrency(item.amount)}</td>
                        </tr>
                      ))}
                      {lineItems.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-muted text-center py-4">No line items</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                <Row className="mt-4">
                  <Col sm={7}>
                    {booking.notes && (
                      <div>
                        <h6 className="text-muted text-uppercase small fw-semibold">Notes</h6>
                        <p className="text-muted small mb-0">{booking.notes}</p>
                      </div>
                    )}
                    {!isFinal && (
                      <p className="text-muted small mb-0 mt-3">
                        This is a service estimate. Materials and final charges may be updated when the job is completed.
                      </p>
                    )}
                  </Col>
                  <Col sm={5}>
                    <div className="float-sm-end w-100 booking-invoice-totals rounded bg-body-secondary p-3" style={{ maxWidth: 280 }}>
                      <div className="d-flex justify-content-between small mb-2">
                        <span className="text-muted">Services subtotal</span>
                        <span className="text-body-emphasis">{formatCurrency(booking.servicePrice)}</span>
                      </div>
                      <div className="d-flex justify-content-between small mb-2">
                        <span className="text-muted">Materials subtotal</span>
                        <span className="text-body-emphasis">{formatCurrency(booking.materialsTotal || 0)}</span>
                      </div>
                      <hr className="my-2 border-secondary-subtle" />
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold text-body-emphasis">{isFinal ? 'Amount Due' : 'Estimated Total'}</span>
                        <h4 className="mb-0 text-primary">
                          {formatCurrency(booking.totalPrice ?? booking.servicePrice)}
                        </h4>
                      </div>
                    </div>
                  </Col>
                </Row>

                {(booking.assignedAt || booking.completedAt) && (
                  <div className="mt-4 pt-3 border-top border-secondary-subtle small text-muted">
                    {booking.assignedAt && (
                      <span className="me-3">Assigned: {formatDate(booking.assignedAt, timezone)}</span>
                    )}
                    {booking.completedAt && (
                      <span>Completed: {formatDate(booking.completedAt, timezone)}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="border-top border-secondary-subtle bg-body p-3 d-flex gap-2">
              <Button variant="light" className="flex-grow-1" onClick={onHide}>
                Close
              </Button>
              {booking.status !== 'cancelled' && onManage && (
                <Button className="flex-grow-1" onClick={() => onManage(booking)}>
                  Manage Booking
                </Button>
              )}
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default BookingDetailOffcanvas;
