import { Card, CardBody, Col, Row } from 'react-bootstrap';
import AuthFormFooter from '@/components/AuthFormFooter';
import AuthPageSidebar from '@/components/AuthPageSidebar';

const AuthSplitCard = ({
  title,
  description,
  children,
  formColSize = 8,
}) => {
  return (
    <Card className="auth-card">
      <CardBody className="p-0">
        <Row className="align-items-stretch g-0">
          <Col lg={6} className="d-none d-lg-flex border-end">
            <AuthPageSidebar />
          </Col>
          <Col lg={6}>
            <div className="auth-form-panel p-4">
              <h2 className="fw-bold text-center fs-18">{title}</h2>
              {description ? (
                <p className="text-muted text-center mt-1 mb-4">{description}</p>
              ) : null}
              <Row className="justify-content-center">
                <Col xs={12} md={formColSize}>
                  {children}
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <AuthFormFooter />
      </CardBody>
    </Card>
  );
};

export default AuthSplitCard;
