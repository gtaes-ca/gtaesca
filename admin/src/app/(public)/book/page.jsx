import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import BookingWizardOffcanvas from '@/components/booking/BookingWizardOffcanvas';
import PageMetaData from '@/components/PageTitle';

/** Public booking: right-panel wizard. Logged-in admins use Management → Bookings instead. */
const BookServicePage = () => {
  const { isAuthenticated, sessionChecked } = useAuthContext();

  if (!sessionChecked) return null;

  if (isAuthenticated) {
    return <Navigate to="/management/bookings?new=1" replace />;
  }

  return (
    <>
      <PageMetaData title="Book a Service" />
      <div className="authentication-bg min-vh-100" />
      <BookingWizardOffcanvas
        show
        onHide={() => { window.location.href = '/auth/sign-in'; }}
        onSuccess={() => {}}
      />
    </>
  );
};

export default BookServicePage;
