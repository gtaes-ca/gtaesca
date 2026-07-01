import { Card, CardBody, CardTitle, Col, Row } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { formatCurrency } from '@/utils/currency';
import { fillTimeline } from './AnalyticsDateFilter';

const Conversions = ({ analytics, loading }) => {
  const summary = analytics?.summary;
  const range = analytics?.range;
  const timeline = fillTimeline(analytics?.timeline, range?.from, range?.to);

  const completionRate = summary?.completionRate ?? 0;
  const pendingRate = summary?.totalBookings
    ? Math.round((summary.pending / summary.totalBookings) * 1000) / 10
    : 0;

  const chartOptions = {
    chart: { height: 292, type: 'radialBar' },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        dataLabels: {
          name: { fontSize: '14px', offsetY: 100 },
          value: {
            offsetY: 55,
            fontSize: '20px',
            formatter: (val) => `${val}%`,
          },
        },
        track: { background: 'rgba(170,184,197, 0.2)', margin: 0 },
      },
    },
    stroke: { dashArray: 4 },
    colors: ['#22c55e'],
    series: [loading ? 0 : completionRate],
    labels: ['Completion Rate'],
    responsive: [{ breakpoint: 380, options: { chart: { height: 180 } } }],
  };

  const categories = timeline.map((row) => {
    const date = new Date(`${row.date}T12:00:00`);
    return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  });

  const performanceOptions = {
    series: [
      { name: 'Bookings', type: 'column', data: timeline.map((row) => row.bookings) },
      { name: 'Revenue', type: 'area', data: timeline.map((row) => row.revenue) },
    ],
    chart: { height: 313, type: 'line', toolbar: { show: false } },
    stroke: { width: [0, 2], curve: 'smooth' },
    fill: {
      opacity: [1, 1],
      type: ['solid', 'gradient'],
      gradient: { type: 'vertical', opacityFrom: 0.45, opacityTo: 0, stops: [0, 90] },
    },
    xaxis: { categories, axisTicks: { show: false }, axisBorder: { show: false } },
    yaxis: [
      { title: { text: 'Bookings' }, min: 0, forceNiceScale: true },
      {
        opposite: true,
        title: { text: 'Revenue (CAD)' },
        min: 0,
        labels: {
          formatter: (val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : Math.round(val)),
        },
      },
    ],
    grid: {
      strokeDashArray: 3,
      padding: { top: 0, right: 8, bottom: 0, left: 8 },
    },
    legend: { horizontalAlign: 'center', offsetY: 5 },
    plotOptions: { bar: { columnWidth: '42%', borderRadius: 3 } },
    colors: ['#7f56da', '#22c55e'],
    tooltip: {
      shared: true,
      y: [
        { formatter: (y) => (y != null ? String(Math.round(y)) : y) },
        { formatter: (y) => (y != null ? formatCurrency(y) : y) },
      ],
    },
  };

  return (
    <Card>
      <CardBody className="p-0">
        <Row className="g-0">
          <Col lg={4}>
            <div className="p-3 d-flex flex-column justify-content-between h-100">
              <CardTitle as="h5">Job Completion</CardTitle>
              <ReactApexChart
                options={chartOptions}
                series={chartOptions.series}
                height={292}
                type="radialBar"
                className="apex-charts mb-2 mt-n2"
              />
              <Row className="text-center">
                <Col xs={6}>
                  <p className="text-muted mb-2">Completed</p>
                  <h3 className="text-body-emphasis mb-3">{loading ? '—' : summary?.completed ?? 0}</h3>
                </Col>
                <Col xs={6}>
                  <p className="text-muted mb-2">Pending</p>
                  <h3 className="text-body-emphasis mb-3">{loading ? '—' : `${pendingRate}%`}</h3>
                </Col>
              </Row>
              <p className="text-muted small mb-0 text-center">
                {loading ? 'Loading...' : `${summary?.completed ?? 0} of ${summary?.totalBookings ?? 0} bookings completed`}
              </p>
            </div>
          </Col>
          <Col lg={8} className="border-start border-secondary-subtle">
            <div className="p-3">
              <CardTitle as="h5" className="mb-3">Bookings &amp; Revenue</CardTitle>
              {loading ? (
                <p className="text-muted">Loading chart...</p>
              ) : (
                <div dir="ltr">
                  <ReactApexChart
                    options={performanceOptions}
                    series={performanceOptions.series}
                    height={313}
                    type="line"
                    className="apex-charts"
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Conversions;
