import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import AboutCard from './components/AboutCard';
import AccountSummary from './components/AccountSummary';
import EditProfileOffcanvas from './components/EditProfileOffcanvas';
import PersonalInfo from './components/PersonalInfo';
import ServiceExpertise from './components/ServiceExpertise';
import useProfilePage from './useProfilePage';
import { canEditOwnProfile } from './utils';

const Profile = () => {
  const { user, technicianProfile, expertise, loading, error, isTechnician } = useProfilePage();
  const [showEditProfile, setShowEditProfile] = useState(false);

  if (loading) {
    return (
      <>
        <PageBreadcrumb subName="Pages" title="Profile" />
        <PageMetaData title="Profile" />
        <p className="text-muted">Loading profile...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageBreadcrumb subName="Pages" title="Profile" />
        <PageMetaData title="Profile" />
        <p className="text-danger">{error}</p>
      </>
    );
  }

  return (
    <>
      <PageBreadcrumb subName="Pages" title="Profile" />
      <PageMetaData title="Profile" />

      <Row>
        <Col xxl={4}>
          <AboutCard
            user={user}
            technicianProfile={technicianProfile}
            expertise={expertise}
            isTechnician={isTechnician}
            onEditProfile={() => setShowEditProfile(true)}
          />
        </Col>
        <Col xxl={8}>
          <Row>
            <Col lg={6}>
              <PersonalInfo user={user} technicianProfile={technicianProfile} isTechnician={isTechnician} />
            </Col>
            <Col lg={6}>
              <AccountSummary
                user={user}
                technicianProfile={technicianProfile}
                expertise={expertise}
                isTechnician={isTechnician}
              />
            </Col>
          </Row>
          {isTechnician && (
            <Row className="mt-3">
              <Col xs={12}>
                <ServiceExpertise expertise={expertise} />
              </Col>
            </Row>
          )}
        </Col>
      </Row>

      {canEditOwnProfile(user) && (
        <EditProfileOffcanvas
          show={showEditProfile}
          onHide={() => setShowEditProfile(false)}
          user={user}
        />
      )}
    </>
  );
};

export default Profile;
