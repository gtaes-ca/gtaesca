import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import PageMetaData from '@/components/PageTitle';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import { BOOKING_MODES, isSuperAdmin } from '@/helpers/auth';
import httpClient from '@/helpers/httpClient';

const WEEKDAYS = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
];

const TIMEZONE_OPTIONS = [
  'America/Toronto',
  'America/Vancouver',
  'America/Edmonton',
  'America/Winnipeg',
  'America/Halifax',
  'America/St_Johns',
];

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i);
const END_HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => i + 1);

function formatHour(hour) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:00 ${period}`;
}

const BookingSettingsPage = () => {
  const { user } = useAuthContext();
  const superAdmin = isSuperAdmin(user);
  const { showNotification } = useNotificationContext();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    startHour: 8,
    endHour: 18,
    lookaheadDays: 30,
    timezone: 'America/Toronto',
    workingDays: [1, 2, 3, 4, 5],
    bookingMode: BOOKING_MODES.FULL,
    companyWhatsappNumber: '',
  });

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get('/api/admin/booking-settings');
      const settings = res.data.settings;
      setForm({
        startHour: settings.startHour,
        endHour: settings.endHour,
        lookaheadDays: settings.lookaheadDays,
        timezone: settings.timezone,
        workingDays: settings.workingDays || [1, 2, 3, 4, 5],
        bookingMode: settings.bookingMode || BOOKING_MODES.FULL,
        companyWhatsappNumber: settings.companyWhatsappNumber || '',
      });
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Failed to load booking settings',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const toggleWorkingDay = (day) => {
    setForm((prev) => {
      const hasDay = prev.workingDays.includes(day);
      const workingDays = hasDay
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day].sort((a, b) => a - b);
      return { ...prev, workingDays };
    });
  };

  const isWhatsAppMode = form.bookingMode === BOOKING_MODES.WHATSAPP;

  const summary = useMemo(() => {
    const days = WEEKDAYS.filter((d) => form.workingDays.includes(d.value))
      .map((d) => d.short)
      .join(', ');
    return `Bookings accepted ${days || 'on no days'} from ${formatHour(form.startHour)} to ${formatHour(form.endHour)} (${form.timezone}), up to ${form.lookaheadDays} days ahead.`;
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.workingDays.length === 0) {
      showNotification({ message: 'Select at least one working day', variant: 'danger' });
      return;
    }
    if (form.startHour >= form.endHour) {
      showNotification({ message: 'Start hour must be before end hour', variant: 'danger' });
      return;
    }
    if (isWhatsAppMode && !form.companyWhatsappNumber.trim()) {
      showNotification({ message: 'Company WhatsApp number is required in WhatsApp mode', variant: 'danger' });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        startHour: Number(form.startHour),
        endHour: Number(form.endHour),
        lookaheadDays: Number(form.lookaheadDays),
        timezone: form.timezone,
        workingDays: form.workingDays,
      };

      if (superAdmin) {
        payload.bookingMode = form.bookingMode;
        payload.companyWhatsappNumber = form.companyWhatsappNumber.trim() || null;
      }

      const res = await httpClient.patch('/api/admin/booking-settings', payload);
      const settings = res.data.settings;
      setForm({
        startHour: settings.startHour,
        endHour: settings.endHour,
        lookaheadDays: settings.lookaheadDays,
        timezone: settings.timezone,
        workingDays: settings.workingDays,
        bookingMode: settings.bookingMode || BOOKING_MODES.FULL,
        companyWhatsappNumber: settings.companyWhatsappNumber || '',
      });
      showNotification({ message: 'Booking settings saved', variant: 'success' });
      if (superAdmin && settings.bookingMode) {
        window.dispatchEvent(new CustomEvent('booking-mode-changed', { detail: { bookingMode: settings.bookingMode } }));
      }
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save settings',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageMetaData title="Booking Settings" />
      {superAdmin && isWhatsAppMode ? (
        <Alert variant="warning" className="mb-3">
          WhatsApp mode is active. Dashboard, Online Customers, Bookings, and Booking Settings are hidden from non–super admin users.
        </Alert>
      ) : null}
      <ComponentContainerCard
        title="Booking Settings"
        description="Configure business hours, working days, and how far ahead customers can book."
      >
        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <Row className="g-4">
              {superAdmin ? (
                <Col xs={12}>
                  <h6 className="mb-3">Booking channel</h6>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Mode</Form.Label>
                        <Form.Select
                          value={form.bookingMode}
                          onChange={(e) => setForm({ ...form, bookingMode: e.target.value })}
                        >
                          <option value={BOOKING_MODES.FULL}>Full booking system</option>
                          <option value={BOOKING_MODES.WHATSAPP}>WhatsApp requests only</option>
                        </Form.Select>
                        <Form.Text className="text-muted">
                          In WhatsApp mode, customers complete the wizard and send details via WhatsApp instead of creating a booking record.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Company mobile number</Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="e.g. 14165551234"
                          value={form.companyWhatsappNumber}
                          onChange={(e) => setForm({ ...form, companyWhatsappNumber: e.target.value })}
                          required={isWhatsAppMode}
                        />
                        <Form.Text className="text-muted">
                          Include country code, digits only (10–15). Used for Call Now on the website and WhatsApp booking.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              ) : null}

              <Col lg={6}>
                <h6 className="mb-3">Business hours</h6>
                <Row className="g-3">
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>Start hour</Form.Label>
                      <Form.Select
                        value={form.startHour}
                        onChange={(e) => setForm({ ...form, startHour: Number(e.target.value) })}
                      >
                        {HOUR_OPTIONS.map((hour) => (
                          <option key={hour} value={hour}>{formatHour(hour)}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>End hour</Form.Label>
                      <Form.Select
                        value={form.endHour}
                        onChange={(e) => setForm({ ...form, endHour: Number(e.target.value) })}
                      >
                        {END_HOUR_OPTIONS.map((hour) => (
                          <option key={hour} value={hour}>{formatHour(hour)}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Text className="text-muted d-block mt-2">
                  Last appointment must finish by the end hour. Slot length comes from each service&apos;s duration.
                </Form.Text>
              </Col>

              <Col lg={6}>
                <h6 className="mb-3">Booking window</h6>
                <Row className="g-3">
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>Days ahead</Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        max={365}
                        value={form.lookaheadDays}
                        onChange={(e) => setForm({ ...form, lookaheadDays: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>Timezone</Form.Label>
                      <Form.Select
                        value={form.timezone}
                        onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                      >
                        {TIMEZONE_OPTIONS.map((tz) => (
                          <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>

              <Col xs={12}>
                <h6 className="mb-3">Working days</h6>
                <div className="d-flex flex-wrap gap-2">
                  {WEEKDAYS.map((day) => (
                    <Form.Check
                      key={day.value}
                      type="checkbox"
                      id={`working-day-${day.value}`}
                      label={day.label}
                      checked={form.workingDays.includes(day.value)}
                      onChange={() => toggleWorkingDay(day.value)}
                    />
                  ))}
                </div>
              </Col>

              <Col xs={12}>
                <Alert variant="info" className="mb-0">{summary}</Alert>
              </Col>

              <Col xs={12}>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Settings'}
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </ComponentContainerCard>
    </>
  );
};

export default BookingSettingsPage;
