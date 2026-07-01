import TextFormInput from '@/components/form/TextFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const ResetPassForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotificationContext();
  const resetPasswordSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('please enter your email')
  });
  const {
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(resetPasswordSchema)
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    setLoading(true);
    try {
      await httpClient.post('/api/auth/forgot-password', { email });
      showNotification({
        message: 'If an account exists, an OTP has been sent to your email.',
        variant: 'success'
      });
      navigate(`/auth/reset-pass-confirm?email=${encodeURIComponent(email)}`);
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Unable to send reset email',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  });

  return <form className="authentication-form" onSubmit={onSubmit}>
      <TextFormInput control={control} name="email" containerClassName="mb-3" label="Email" id="email-id" placeholder="Enter your email" />
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Reset Password'}
        </Button>
      </div>
    </form>;
};
export default ResetPassForm;
