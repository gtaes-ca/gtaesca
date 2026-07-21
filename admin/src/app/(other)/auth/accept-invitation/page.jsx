import { Link } from 'react-router-dom';
import AuthSplitCard from '@/components/AuthSplitCard';
import PageMetaData from '@/components/PageTitle';
import AcceptInvitationForm from './components/AcceptInvitationForm';

const AcceptInvitation = () => {
  return (
    <>
      <PageMetaData title="Accept Invitation" />
      <AuthSplitCard
        title="Accept Team Invitation"
        description="Verify your email with the OTP and complete your account setup."
        formColSize={10}
      >
        <AcceptInvitationForm />
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

export default AcceptInvitation;
