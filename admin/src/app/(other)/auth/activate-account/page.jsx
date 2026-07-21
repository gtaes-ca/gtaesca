import { Link } from 'react-router-dom';
import AuthSplitCard from '@/components/AuthSplitCard';
import PageMetaData from '@/components/PageTitle';
import ActivateAccountForm from './components/ActivateAccountForm';

const ActivateAccount = () => {
  return (
    <>
      <PageMetaData title="Activate Account" />
      <AuthSplitCard
        title="Activate Customer Account"
        description="Set a password to access your bookings online."
        formColSize={10}
      >
        <ActivateAccountForm />
      </AuthSplitCard>
      <p className="auth-page-note mb-0 text-center">
        Back to
        <Link to="/auth/sign-in" className="auth-page-note__link ms-1">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default ActivateAccount;
