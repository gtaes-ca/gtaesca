import { Card, CardBody, CardHeader, CardTitle } from 'react-bootstrap';

const AccountSummary = ({ user, technicianProfile, expertise = [], isTechnician }) => {
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '-';

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h5">Account Summary</CardTitle>
      </CardHeader>
      <CardBody>
        <ul className="list-group">
          <li className="list-group-item border-0 border-bottom px-0 pt-0">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
              <h5 className="mb-0 fw-medium">Member Since</h5>
              <span className="fs-14 text-muted">{memberSince}</span>
            </div>
          </li>
          {isTechnician && (
            <>
              <li className="list-group-item border-0 border-bottom px-0">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                  <h5 className="mb-0 fw-medium">Services Selected</h5>
                  <span className="fs-14 text-muted">{expertise.length}</span>
                </div>
              </li>
              <li className="list-group-item border-0 px-0 pb-0">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                  <h5 className="mb-0 fw-medium">Onboarding</h5>
                  <span className={`fs-14 ${technicianProfile?.onboardingCompleted ? 'text-success' : 'text-warning'}`}>
                    {technicianProfile?.onboardingCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </li>
            </>
          )}
          {!isTechnician && (
            <li className="list-group-item border-0 px-0 pb-0">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                <h5 className="mb-0 fw-medium">Team</h5>
                <span className="fs-14 text-muted text-capitalize">
                  {user?.userType?.replace(/_/g, ' ') || '-'}
                </span>
              </div>
            </li>
          )}
        </ul>
      </CardBody>
    </Card>
  );
};

export default AccountSummary;
