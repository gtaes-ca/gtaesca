import { Fragment } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, ProgressBar, Row } from 'react-bootstrap';
import { formatCurrency } from '@/utils/currency';

const REGION_LABEL = { gta: 'GTA', nearby: 'Nearby' };

const SessionsByCountry = ({ analytics, loading }) => {
  const locations = analytics?.topLocations || [];
  const maxCount = Math.max(...locations.map((item) => item.count), 1);

  return (
    <Card>
      <CardHeader className="border-bottom border-dashed">
        <CardTitle className="mb-0">Bookings by Service Area</CardTitle>
      </CardHeader>
      <CardBody>
        {loading ? (
          <p className="text-muted mb-0">Loading areas...</p>
        ) : locations.length === 0 ? (
          <p className="text-muted mb-0">No bookings in this period.</p>
        ) : (
          <Row>
            <Col lg={12}>
              <div className="p-1">
                {locations.map((location, idx) => {
                  const percent = Math.round((location.count / maxCount) * 100);
                  const variant = location.region === 'gta' ? 'primary' : 'success';
                  return (
                    <Fragment key={`${location.locationName}-${idx}`}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <p className="mb-0">
                          <span className="fw-medium">{location.locationName}</span>
                          <span className="text-muted small ms-2">
                            {REGION_LABEL[location.region] || location.region}
                          </span>
                        </p>
                        <span className="text-muted small">{formatCurrency(location.revenue)}</span>
                      </div>
                      <Row className={`align-items-center ${idx === locations.length - 1 ? '' : 'mb-3'}`}>
                        <Col>
                          <ProgressBar
                            variant={variant}
                            now={percent}
                            className="progress progress-soft progress-sm"
                          />
                        </Col>
                        <Col xs="auto">
                          <p className="mb-0 fs-13 fw-semibold">{location.count}</p>
                        </Col>
                      </Row>
                    </Fragment>
                  );
                })}
              </div>
            </Col>
          </Row>
        )}
      </CardBody>
    </Card>
  );
};

export default SessionsByCountry;
