import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, CardTitle, Col, Form, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import { MAX_PROFILE_IMAGE_BYTES } from '@/helpers/profileImage';
import httpClient from '@/helpers/httpClient';
import { getDisplayName, getInitials, getRoleLabel, resolveImageUrl, canEditOwnProfile } from '../utils';

const AboutCard = ({ user, technicianProfile, expertise = [], isTechnician, onProfileUpdated, onEditProfile }) => {
  const fileInputRef = useRef(null);
  const { refreshSession } = useAuthContext();
  const { showNotification } = useNotificationContext();
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState('');

  const displayName = getDisplayName(user, technicianProfile);
  const roleLabel = getRoleLabel(user);
  const profileImageUrl = localPreview || resolveImageUrl(technicianProfile?.profileImageUrl || user?.profileImageUrl);
  const initials = getInitials(user, technicianProfile);
  const bio = technicianProfile?.bio || user?.bio || (isTechnician ? 'No bio added yet.' : 'No bio added yet.');
  const onboardingCompleted = technicianProfile?.onboardingCompleted;
  const canEditPhoto = canEditOwnProfile(user);
  const canEditProfile = canEditOwnProfile(user);

  const uploadProfileImage = async (dataUrl) => {
    setUploading(true);
    try {
      const res = await httpClient.put('/api/auth/profile', { profileImageData: dataUrl });
      setLocalPreview(resolveImageUrl(res.data.user?.profileImageUrl));
      await refreshSession();
      onProfileUpdated?.();
      showNotification({ message: 'Profile photo updated', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to upload profile photo',
        variant: 'danger',
      });
    } finally {
      setUploading(false);
    }
  };

  const removeProfileImage = async () => {
    setUploading(true);
    try {
      await httpClient.put('/api/auth/profile', { removeProfileImage: true });
      setLocalPreview('');
      await refreshSession();
      onProfileUpdated?.();
      showNotification({ message: 'Profile photo removed', variant: 'success' });
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to remove profile photo',
        variant: 'danger',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification({ message: 'Please choose an image file', variant: 'danger' });
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      showNotification({ message: 'Profile image must be 2MB or smaller', variant: 'danger' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setLocalPreview(reader.result);
      uploadProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card>
      <div className="position-relative">
        <div
          className="card-img rounded-bottom-0 bg-primary-subtle"
          style={{ height: 200 }}
        />
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt={displayName}
            className="avatar-lg rounded-circle position-absolute top-100 start-0 translate-middle-y ms-3 border border-light border-3 bg-white object-fit-cover"
          />
        ) : (
          <div
            className="avatar-lg rounded-circle position-absolute top-100 start-0 translate-middle-y ms-3 border border-light border-3 bg-primary text-white d-flex align-items-center justify-content-center fw-semibold"
            style={{ fontSize: '1.5rem' }}
          >
            {initials}
          </div>
        )}
      </div>
      <CardBody className="mt-4">
        <div>
          <div className="d-flex align-items-center">
            <div className="d-block">
              <h4 className="mb-1">{displayName}</h4>
              <p className="fs-14 mb-0">{roleLabel}</p>
              {isTechnician && (
                <span className={`badge mt-2 ${onboardingCompleted ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                  {onboardingCompleted ? 'Onboarding Complete' : 'Onboarding Pending'}
                </span>
              )}
            </div>
          </div>
          {canEditPhoto && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              <Button
                type="button"
                variant="outline-primary"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <IconifyIcon icon="bx:camera" className="me-1" />
                {profileImageUrl ? 'Change Photo' : 'Upload Photo'}
              </Button>
              {profileImageUrl && (
                <Button
                  type="button"
                  variant="outline-danger"
                  size="sm"
                  disabled={uploading}
                  onClick={removeProfileImage}
                >
                  Remove
                </Button>
              )}
              <Form.Text className="w-100">JPG, PNG, WebP, or GIF. Max 2MB.</Form.Text>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="d-none"
                onChange={handleImageSelect}
              />
            </div>
          )}
          <Row className="mt-3">
            <Col xs={12}>
              <CardTitle as="h5" className="badge bg-light text-secondary py-1 px-2 fs-13 mb-3 border-start border-secondary border-2 rounded-1">
                About Me
              </CardTitle>
              <p className="fs-15 mb-0 text-muted">{bio}</p>
              {expertise.length > 0 && (
                <div className="mt-3">
                  <div className="d-flex gap-2 flex-wrap">
                    {expertise.map((item) => (
                      <span
                        key={item.id}
                        className="badge text-secondary py-1 px-2 fs-12 border rounded-1"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </CardBody>
      {isTechnician && (
        <CardFooter className="bg-light-subtle d-grid gap-2">
          <Button
            as={Link}
            to="/technician/jobs"
            variant="success"
            type="button"
            className="d-flex align-items-center justify-content-center gap-1 w-100"
          >
            <IconifyIcon icon="bx:briefcase" />
            My Jobs
          </Button>
          <Button
            as={Link}
            to="/technician/onboarding"
            variant="primary"
            type="button"
            className="d-flex align-items-center justify-content-center gap-1 w-100"
          >
            <IconifyIcon icon="bx:edit-alt" />
            {onboardingCompleted ? 'Update Profile' : 'Complete Onboarding'}
          </Button>
        </CardFooter>
      )}
      {canEditProfile && !isTechnician && (
        <CardFooter className="bg-light-subtle">
          <Button
            type="button"
            variant="primary"
            className="d-flex align-items-center justify-content-center gap-1 w-100"
            onClick={onEditProfile}
          >
            <IconifyIcon icon="bx:edit-alt" />
            Edit Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AboutCard;
