import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { formatBookingDateTime } from '@/utils/bookingDateTime';

const PRESETS = [
  { id: '7d', label: '7 Days' },
  { id: '10d', label: '10 Days' },
  { id: '90d', label: '90 Days' },
  { id: 'custom', label: 'Custom' },
];

function addDays(dateStr, days) {
  const date = new Date(`${dateStr}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function listDates(from, to) {
  const dates = [];
  let current = from;
  while (current <= to) {
    dates.push(current);
    current = addDays(current, 1);
  }
  return dates;
}

export function fillTimeline(timeline, from, to) {
  if (!from || !to) return timeline || [];
  const map = new Map(
    (timeline || []).map((row) => {
      const key = typeof row.date === 'string' ? row.date.slice(0, 10) : String(row.date).slice(0, 10);
      return [key, row];
    })
  );
  return listDates(from, to).map((date) => {
    const row = map.get(date);
    return {
      date,
      bookings: row?.bookings || 0,
      completed: row?.completed || 0,
      revenue: row?.revenue || 0,
    };
  });
}

const AnalyticsDateFilter = ({
  preset,
  customFrom,
  customTo,
  timezone,
  onPresetChange,
  onCustomFromChange,
  onCustomToChange,
  onApplyCustom,
  loading,
}) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const clockLabel = useMemo(
    () => formatBookingDateTime(now.toISOString(), timezone || 'America/Toronto'),
    [now, timezone]
  );

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <Row className="g-3 align-items-center">
          <Col lg={5}>
            <div className="d-flex align-items-center gap-2 mb-1">
              <IconifyIcon icon="iconamoon:chart-bar-duotone" className="fs-20 text-primary" />
              <h5 className="mb-0">GTA Service Analytics</h5>
            </div>
            <div className="text-muted small d-flex align-items-center gap-2">
              <IconifyIcon icon="bx:time-five" />
              <span>{clockLabel}</span>
              {timezone && <span className="text-muted">({timezone})</span>}
            </div>
          </Col>
          <Col lg={7}>
            <div className="d-flex flex-wrap justify-content-lg-end gap-2">
              {PRESETS.map((item) => (
                <Button
                  key={item.id}
                  size="sm"
                  variant={preset === item.id ? 'primary' : 'outline-secondary'}
                  onClick={() => onPresetChange(item.id)}
                  disabled={loading}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            {preset === 'custom' && (
              <Row className="g-2 mt-2 justify-content-lg-end">
                <Col xs={6} md={4} lg={3}>
                  <Form.Label className="small text-muted mb-1">From</Form.Label>
                  <Form.Control
                    type="date"
                    size="sm"
                    value={customFrom}
                    onChange={(e) => onCustomFromChange(e.target.value)}
                  />
                </Col>
                <Col xs={6} md={4} lg={3}>
                  <Form.Label className="small text-muted mb-1">To</Form.Label>
                  <Form.Control
                    type="date"
                    size="sm"
                    value={customTo}
                    onChange={(e) => onCustomToChange(e.target.value)}
                  />
                </Col>
                <Col xs={12} md="auto" className="d-flex align-items-end">
                  <Button size="sm" onClick={onApplyCustom} disabled={loading || !customFrom || !customTo}>
                    Apply Range
                  </Button>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AnalyticsDateFilter;
