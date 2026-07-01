import { useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ComponentContainerCard from '@/components/ComponentContainerCard';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PageMetaData from '@/components/PageTitle';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

import { MAX_PROFILE_IMAGE_BYTES, resolveImageUrl } from '@/helpers/profileImage';

const defaultForm = {
  yearsExperience: 0,
  bio: '',
  certifications: '',
  phone: '',
  serviceIds: [],
};

const TechnicianOnboardingPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { showNotification } = useNotificationContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', email: '' });
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [profileImageData, setProfileImageData] = useState(null);
  const [removeProfileImage, setRemoveProfileImage] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, profileRes] = await Promise.all([
          httpClient.get('/api/services'),
          httpClient.get('/api/technician/profile').catch(() => null),
        ]);
        setCategories(servicesRes.data.categories || []);
        if (profileRes?.data?.profile) {
          const { profile, expertise } = profileRes.data;
          setUserInfo({
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            email: profile.email || '',
          });
          setForm({
            yearsExperience: profile.yearsExperience || 0,
            bio: profile.bio || '',
            certifications: profile.certifications || '',
            phone: profile.phone || '',
            serviceIds: expertise?.map((item) => item.id) || [],
          });
          setProfileImagePreview(resolveImageUrl(profile.profileImageUrl));
          if (profile.onboardingCompleted) {
            navigate('/');
          }
        }
      } catch (e) {
        showNotification({
          message: e.response?.data?.error || 'Failed to load onboarding data',
          variant: 'danger',
        });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate, showNotification]);

  const toggleService = (serviceId) => {
    setForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId],
    }));
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
      setProfileImagePreview(reader.result);
      setProfileImageData(reader.result);
      setRemoveProfileImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImagePreview('');
    setProfileImageData(null);
    setRemoveProfileImage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await httpClient.put('/api/technician/profile', {
        ...form,
        yearsExperience: Number(form.yearsExperience),
        completeOnboarding: true,
        ...(profileImageData ? { profileImageData } : {}),
        ...(removeProfileImage ? { removeProfileImage: true } : {}),
      });
      showNotification({ message: 'Onboarding completed successfully', variant: 'success' });
      navigate('/');
    } catch (err) {
      showNotification({
        message: err.response?.data?.error || 'Failed to save profile',
        variant: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fullName = [userInfo.firstName, userInfo.lastName].filter(Boolean).join(' ') || 'Technician';
  const initials = `${userInfo.firstName?.[0] || ''}${userInfo.lastName?.[0] || ''}`.toUpperCase() || 'TC';

  if (loading) return <p className="text-muted">Loading onboarding...</p>;

  return (
    <>
      <PageMetaData title="Technician Onboarding" />
      <ComponentContainerCard
        title="Technician Profile"
        description="Add your profile photo, experience, and select electrical service expertise from the GTA Electric Services catalog."
      >
        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4 mb-4 pb-4 border-bottom">
            <div className="position-relative">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt={fullName}
                  className="img-fluid avatar-xxl rounded-circle border border-2 border-light shadow-sm"
                />
              ) : (
                <div
                  className="avatar-xxl rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center border border-2 border-light shadow-sm"
                  style={{ width: 96, height: 96, fontSize: '2rem', fontWeight: 600 }}
                >
                  {initials}
                </div>
              )}
            </div>

            <div className="text-center text-md-start">
              <h5 className="mb-1">{fullName}</h5>
              <p className="text-muted mb-3">{userInfo.email}</p>
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
                <Button
                  type="button"
                  variant="outline-primary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IconifyIcon icon="bx:camera" className="me-1" />
                  {profileImagePreview ? 'Change Photo' : 'Upload Photo'}
                </Button>
                {profileImagePreview && (
                  <Button type="button" variant="outline-danger" size="sm" onClick={handleRemoveImage}>
                    Remove
                  </Button>
                )}
              </div>
              <Form.Text className="d-block mt-2">
                JPG, PNG, WebP, or GIF. Max 2MB.
              </Form.Text>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="d-none"
                onChange={handleImageSelect}
              />
            </div>
          </div>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Years of Experience</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  value={form.yearsExperience}
                  onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Certifications</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={form.certifications}
              onChange={(e) => setForm({ ...form, certifications: e.target.value })}
            />
          </Form.Group>

          <h5 className="mb-3">Service Expertise</h5>
          {categories.map((category) => (
            <div key={category.id} className="mb-4">
              <h6>{category.name}</h6>
              <Row>
                {category.services.map((service) => (
                  <Col md={6} lg={4} key={service.id} className="mb-2">
                    <Form.Check
                      type="checkbox"
                      id={`service-${service.id}`}
                      label={service.name}
                      checked={form.serviceIds.includes(service.id)}
                      onChange={() => toggleService(service.id)}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          ))}

          <Button type="submit" disabled={submitting || form.serviceIds.length === 0}>
            {submitting ? 'Saving...' : 'Complete Onboarding'}
          </Button>
        </form>
      </ComponentContainerCard>
    </>
  );
};

export default TechnicianOnboardingPage;
