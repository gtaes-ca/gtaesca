import AuthSplitCard from '@/components/AuthSplitCard';
import PageMetaData from '@/components/PageTitle';
import LoginForm from './LoginForm';

const SignIn = () => {
  return (
    <>
      <PageMetaData title="Sign In" />
      <AuthSplitCard
        title="Sign In"
        description="Enter your email address and password to access admin panel."
      >
        <LoginForm />
      </AuthSplitCard>
    </>
  );
};

export default SignIn;
