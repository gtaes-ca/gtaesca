import PasswordFormInput from '@/components/form/PasswordFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const AcceptInvitationForm = () => {
  const [loading, setLoading] = useState(false);
  const [inviteInfo, setInviteInfo] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showNotification } = useNotificationContext();
  const token = searchParams.get('token') || '';

  const schema = yup.object({
    otp: yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    phone: yup.string().nullable(),
    password: yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required()
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      otp: '',
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    if (!token) return;
    httpClient.get(`/api/invitations/verify/${token}`)
      .then((res) => setInviteInfo(res.data))
      .catch((e) => {
        showNotification({
          message: e.response?.data?.error || 'Invalid invitation link',
          variant: 'danger'
        });
      });
  }, [token, showNotification]);

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      const res = await httpClient.post('/api/invitations/accept', {
        token,
        otp: values.otp,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        password: values.password
      });
      showNotification({
        message: res.data.message || 'Account created successfully',
        variant: 'success'
      });
      navigate('/auth/sign-in');
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Unable to accept invitation',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  });

  if (!token) {
    return <Alert variant="danger">Invalid invitation link.</Alert>;
  }

  return (
    <form className="authentication-form" onSubmit={onSubmit}>
      {inviteInfo && (
        <Alert variant="info">
          Joining as <strong>{inviteInfo.userType === 'operation_team' ? 'Operation Team' : 'Technicians'}</strong>
          {' '}({inviteInfo.role}) for <strong>{inviteInfo.email}</strong>
        </Alert>
      )}
      <TextFormInput control={control} name="otp" containerClassName="mb-3" label="Email OTP" placeholder="Enter 6-digit OTP from email" />
      <TextFormInput control={control} name="firstName" containerClassName="mb-3" label="First Name" placeholder="First name" />
      <TextFormInput control={control} name="lastName" containerClassName="mb-3" label="Last Name" placeholder="Last name" />
      <TextFormInput control={control} name="phone" containerClassName="mb-3" label="Phone" placeholder="Phone number (optional)" />
      <PasswordFormInput control={control} name="password" containerClassName="mb-3" label="Password" placeholder="Create password" />
      <PasswordFormInput control={control} name="confirmPassword" containerClassName="mb-3" label="Confirm Password" placeholder="Confirm password" />
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={loading || !inviteInfo}>
          {loading ? 'Creating account...' : 'Accept Invitation'}
        </Button>
      </div>
      <p className="text-center mt-3 mb-0">
        <Link to="/auth/sign-in">Already have an account? Sign In</Link>
      </p>
    </form>
  );
};

export default AcceptInvitationForm;
