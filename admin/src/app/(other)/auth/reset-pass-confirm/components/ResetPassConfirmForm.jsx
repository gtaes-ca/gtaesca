import PasswordFormInput from '@/components/form/PasswordFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const ResetPassConfirmForm = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showNotification } = useNotificationContext();
  const email = searchParams.get('email') || '';

  const schema = yup.object({
    email: yup.string().email().required(),
    otp: yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
    password: yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required()
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email, otp: '', password: '', confirmPassword: '' }
  });

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      await httpClient.post('/api/auth/reset-password', {
        email: values.email,
        otp: values.otp,
        password: values.password
      });
      showNotification({ message: 'Password reset successfully. Please sign in.', variant: 'success' });
      navigate('/auth/sign-in');
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Password reset failed',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  });

  return (
    <form className="authentication-form" onSubmit={onSubmit}>
      <TextFormInput control={control} name="email" containerClassName="mb-3" label="Email" placeholder="Enter your email" />
      <TextFormInput control={control} name="otp" containerClassName="mb-3" label="OTP" placeholder="Enter 6-digit OTP" />
      <PasswordFormInput control={control} name="password" containerClassName="mb-3" label="New Password" placeholder="Enter new password" />
      <PasswordFormInput control={control} name="confirmPassword" containerClassName="mb-3" label="Confirm Password" placeholder="Confirm new password" />
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
      <p className="text-center mt-3 mb-0">
        <Link to="/auth/sign-in">Back to Sign In</Link>
      </p>
    </form>
  );
};

export default ResetPassConfirmForm;
