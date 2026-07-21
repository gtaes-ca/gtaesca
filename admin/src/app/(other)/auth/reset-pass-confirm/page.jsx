import { Link } from 'react-router-dom';
import AuthSplitCard from '@/components/AuthSplitCard';
import PageMetaData from '@/components/PageTitle';
import ResetPassConfirmForm from './components/ResetPassConfirmForm';

const ResetPassConfirm = () => {
  return (
    <>
      <PageMetaData title="Confirm Password Reset" />
      <AuthSplitCard
        title="Confirm Password Reset"
        description="Enter the OTP from your email and choose a new password."
      >
        <ResetPassConfirmForm />
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

export default ResetPassConfirm;
