import { Link } from 'react-router-dom';
import AuthSplitCard from '@/components/AuthSplitCard';
import PageMetaData from '@/components/PageTitle';

const Maintenance = () => {
  return (
    <>
      <PageMetaData title="Maintenance" />
      <AuthSplitCard
        title="We are currently performing maintenance"
        description="We're making the system more awesome. We'll be back shortly."
      >
        <div className="text-center">
          <Link to="/pages/contact-us" className="btn btn-success">
            Contact Us
          </Link>
        </div>
      </AuthSplitCard>
    </>
  );
};

export default Maintenance;
