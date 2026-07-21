import { Link } from 'react-router-dom';
import AuthSplitCard from '@/components/AuthSplitCard';
import PageMetaData from '@/components/PageTitle';
import ResetPassForm from './components/ResetPassForm';

const ResetPassword = () => {
  return (
    <>
      <PageMetaData title="Reset Password" />
      <AuthSplitCard
        title="Reset Password"
        description="Enter your email address and we'll send you an email with instructions to reset your password."
      >
        <ResetPassForm />
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

export default ResetPassword;
