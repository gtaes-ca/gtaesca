import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
import { groupExpertiseByCategory } from '../utils';

const ServiceExpertise = ({ expertise = [] }) => {
  const grouped = groupExpertiseByCategory(expertise);
  const categories = Object.keys(grouped);

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h5">Service Expertise</CardTitle>
      </CardHeader>
      <CardBody>
        {categories.length === 0 ? (
          <p className="text-muted mb-0">No services selected yet.</p>
        ) : (
          <Row className="g-3">
            {categories.map((category) => (
              <Col lg={6} key={category}>
                <div className="border rounded p-3 h-100">
                  <h6 className="mb-3">{category}</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {grouped[category].map((service) => (
                      <span
                        key={service.id}
                        className="badge bg-primary-subtle text-primary py-2 px-3 fs-13"
                      >
                        {service.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </CardBody>
    </Card>
  );
};

export default ServiceExpertise;
