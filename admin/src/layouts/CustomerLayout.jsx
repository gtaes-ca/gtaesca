import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import LogoBox from '@/components/LogoBox';
import { useAuthContext } from '@/context/useAuthContext';
import httpClient from '@/helpers/httpClient';

const CustomerLayout = ({ children }) => {
  const { user, removeSession } = useAuthContext();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await httpClient.post('/api/auth/logout');
    } catch {
      // ignore
    }
    removeSession();
    navigate('/auth/customer-sign-in');
  };

  return (
    <div className="min-vh-100 bg-light">
      <Navbar bg="white" className="border-bottom shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/customer/bookings" className="d-flex align-items-center">
            <LogoBox textLogo={{ height: 22, width: 68 }} squareLogo={{ className: 'me-2' }} />
          </Navbar.Brand>
          <Nav className="ms-auto align-items-center gap-3">
            {user && (
              <span className="text-muted small d-none d-sm-inline">
                {user.firstName} {user.lastName}
              </span>
            )}
            <Button size="sm" variant="outline-secondary" onClick={logout}>Sign Out</Button>
          </Nav>
        </Container>
      </Navbar>
      <Container className="py-4">{children}</Container>
    </div>
  );
};

export default CustomerLayout;
