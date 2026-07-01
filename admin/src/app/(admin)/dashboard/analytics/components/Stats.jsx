import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { formatCurrency } from '@/utils/currency';

const StatCard = ({ amount, icon, variant, name, loading }) => (
  <Card>
    <CardBody>
      <Row>
        <Col xs={6}>
          <div className={`avatar-md bg-opacity-10 rounded flex-centered bg-${variant}`}>
            <IconifyIcon icon={icon} height={32} width={32} className={`text-${variant}`} />
          </div>
        </Col>
        <Col xs={6} className="text-end">
          <p className="text-muted mb-0 text-truncate">{name}</p>
          <h3 className="text-body-emphasis mt-1 mb-0">{loading ? '—' : amount}</h3>
        </Col>
      </Row>
    </CardBody>
  </Card>
);

const Stats = ({ summary, loading }) => {
  const cards = [
    {
      name: 'Total Bookings',
      amount: summary?.totalBookings ?? 0,
      icon: 'iconamoon:calendar-1-duotone',
      variant: 'primary',
    },
    {
      name: 'Total Revenue',
      amount: formatCurrency(summary?.totalRevenue ?? 0),
      icon: 'iconamoon:wallet-duotone',
      variant: 'success',
    },
    {
      name: 'Completed Jobs',
      amount: summary?.completed ?? 0,
      icon: 'iconamoon:check-circle-1-duotone',
      variant: 'info',
    },
    {
      name: 'Completion Rate',
      amount: `${summary?.completionRate ?? 0}%`,
      icon: 'iconamoon:trend-up-bold',
      variant: 'warning',
    },
    {
      name: 'Materials Revenue',
      amount: formatCurrency(summary?.materialsRevenue ?? 0),
      icon: 'iconamoon:box-duotone',
      variant: 'danger',
    },
    {
      name: 'Active Technicians',
      amount: summary?.activeTechnicians ?? 0,
      icon: 'iconamoon:profile-circle-duotone',
      variant: 'secondary',
    },
  ];

  return (
    <Row>
      {cards.map((stat) => (
        <Col md={6} xxl={12} key={stat.name}>
          <StatCard {...stat} loading={loading} />
        </Col>
      ))}
    </Row>
  );
};

export default Stats;
