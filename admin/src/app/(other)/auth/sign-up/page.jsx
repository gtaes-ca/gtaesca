import { Link } from 'react-router-dom';
import AuthSplitCard from '@/components/AuthSplitCard';
import PageMetaData from '@/components/PageTitle';
import SignUpForm from './components/SignUpForm';

const SignUp = () => {
  return (
    <>
      <PageMetaData title="Sign Up" />
      <AuthSplitCard
        title="Sign Up"
        description="New to our platform? Sign up now! It only takes a minute."
      >
        <SignUpForm />
      </AuthSplitCard>
      <p className="auth-page-note mb-0 text-center">
        I already have an account
        <Link to="/auth/sign-in" className="auth-page-note__link ms-1">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUp;
