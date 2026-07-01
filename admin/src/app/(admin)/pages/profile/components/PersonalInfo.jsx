import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';
import { getDisplayName, getRoleLabel } from '../utils';

const PersonalInfo = ({ user, technicianProfile, isTechnician }) => {
  const displayName = getDisplayName(user, technicianProfile);
  const email = technicianProfile?.email || user?.email || '-';
  const phone = technicianProfile?.phone || user?.phone || '-';
  const roleLabel = getRoleLabel(user);
  const bio = technicianProfile?.bio || user?.bio;
  const certifications = technicianProfile?.certifications;
  const status = user?.status;

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h5">Personal Info</CardTitle>
      </CardHeader>
      <CardBody>
        <ul className="list-group">
          <li className="list-group-item border-0 border-bottom px-0 pt-0">
            <div className="d-flex flex-wrap align-items-center">
              <h5 className="me-2 fw-medium mb-0">Name :</h5>
              <span className="fs-14 text-muted">{displayName}</span>
            </div>
          </li>
          <li className="list-group-item border-0 border-bottom px-0">
            <div className="d-flex flex-wrap align-items-center">
              <h5 className="me-2 fw-medium mb-0">Email :</h5>
              <span className="fs-14 text-muted">{email}</span>
            </div>
          </li>
          <li className="list-group-item border-0 border-bottom px-0">
            <div className="d-flex flex-wrap align-items-center">
              <h5 className="me-2 mb-0 fw-medium">Phone :</h5>
              <span className="fs-14 text-muted">{phone || '-'}</span>
            </div>
          </li>
          <li className="list-group-item border-0 border-bottom px-0">
            <div className="d-flex flex-wrap align-items-center">
              <h5 className="me-2 mb-0 fw-medium">Role :</h5>
              <span className="fs-14 text-muted">{roleLabel}</span>
            </div>
          </li>
          <li className="list-group-item border-0 border-bottom px-0">
            <div className="d-flex flex-wrap align-items-center">
              <h5 className="me-2 mb-0 fw-medium">Account Status :</h5>
              <span className="fs-14 text-muted text-capitalize">{status || '-'}</span>
            </div>
          </li>
          {isTechnician && (
            <li className="list-group-item border-0 border-bottom px-0">
              <div className="d-flex flex-wrap align-items-center">
                <h5 className="me-2 mb-0 fw-medium">Experience :</h5>
                <span className="fs-14 text-muted">
                  {technicianProfile?.yearsExperience != null
                    ? `${technicianProfile.yearsExperience} Year${technicianProfile.yearsExperience === 1 ? '' : 's'}`
                    : '-'}
                </span>
              </div>
            </li>
          )}
          {!isTechnician && (
            <li className="list-group-item border-0 border-bottom px-0">
              <div className="d-flex flex-wrap align-items-start">
                <h5 className="me-2 mb-0 fw-medium">Bio :</h5>
                <span className="fs-14 text-muted">{bio || 'Not provided'}</span>
              </div>
            </li>
          )}
          {isTechnician && (
            <li className="list-group-item border-0 px-0 pb-0">
              <div className="d-flex flex-wrap align-items-start">
                <h5 className="me-2 mb-0 fw-medium">Certifications :</h5>
                <span className="fs-14 text-muted">{certifications || 'Not provided'}</span>
              </div>
            </li>
          )}
        </ul>
      </CardBody>
    </Card>
  );
};

export default PersonalInfo;
