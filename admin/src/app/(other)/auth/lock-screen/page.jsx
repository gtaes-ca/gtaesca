import { Link } from 'react-router-dom';
import AuthSplitCard from '@/components/AuthSplitCard';
import LockScreenForm from './components/LockScreenForm';
import PageMetaData from '@/components/PageTitle';

const LockScreen = () => {
  return (
    <>
      <PageMetaData title="Lock Screen" />
      <AuthSplitCard
        title="Hi ! Gaston"
        description="Enter your password to access the admin."
      >
        <LockScreenForm />
      </AuthSplitCard>
      <p className="auth-page-note mb-0 text-center">
        Not you? return{' '}
        <Link to="/auth/sign-in" className="auth-page-note__link">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default LockScreen;
