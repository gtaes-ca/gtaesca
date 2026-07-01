import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import { formatCurrency } from '@/utils/currency';

const SessionByBrowser = ({ analytics, loading }) => {
  const technicians = analytics?.topTechnicians || [];

  return (
    <Card className="h-100">
      <CardHeader className="border-bottom border-dashed">
        <CardTitle className="mb-0">Technician Activity</CardTitle>
      </CardHeader>
      <CardBody className="py-2 px-0">
        {loading ? (
          <p className="text-muted px-3">Loading...</p>
        ) : technicians.length === 0 ? (
          <p className="text-muted px-3 mb-0">No technician assignments in this period.</p>
        ) : (
          <SimplebarReactClient className="px-2" style={{ height: 270 }}>
            {technicians.map((tech) => (
              <div className="d-flex justify-content-between align-items-center p-2 border-bottom border-light border-opacity-10" key={tech.name}>
                <div>
                  <div className="fw-medium">{tech.name}</div>
                  <small className="text-muted">{tech.completed} completed / {tech.bookings} assigned</small>
                </div>
                <span className="fw-semibold text-body-emphasis">{formatCurrency(tech.revenue)}</span>
              </div>
            ))}
          </SimplebarReactClient>
        )}
      </CardBody>
    </Card>
  );
};

export default SessionByBrowser;
