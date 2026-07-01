import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LogoBox from '@/components/LogoBox';
import PageMetaData from '@/components/PageTitle';
import TextFormInput from '@/components/form/TextFormInput';
import PasswordFormInput from '@/components/form/PasswordFormInput';
import useCustomerSignIn from './useCustomerSignIn';

const CustomerSignInPage = () => (
  <>
    <PageMetaData title="Customer Sign In" />
    <Card className="auth-card">
      <CardBody className="p-4">
        <div className="mx-auto mb-4 text-center auth-logo">
          <LogoBox
            textLogo={{ height: 24, width: 73 }}
            squareLogo={{ className: 'me-1' }}
            containerClassName="mx-auto mb-4 text-center auth-logo"
          />
        </div>
        <h2 className="fw-bold text-center fs-18">Customer Sign In</h2>
        <p className="text-muted text-center mt-1 mb-4">
          View your service bookings and itemized charges.
        </p>
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <CustomerLoginForm />
            <p className="text-center mt-3 mb-0 small text-muted">
              Staff member? <Link to="/auth/sign-in">Team sign in</Link>
            </p>
          </Col>
        </Row>
      </CardBody>
    </Card>
  </>
);

function CustomerLoginForm() {
  const { loading, login, control } = useCustomerSignIn();
  return (
    <form onSubmit={login}>
      <TextFormInput control={control} name="email" label="Email" containerClassName="mb-3" placeholder="you@example.com" />
      <PasswordFormInput control={control} name="password" label="Password" containerClassName="mb-3" placeholder="Password" />
      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

export default CustomerSignInPage;
