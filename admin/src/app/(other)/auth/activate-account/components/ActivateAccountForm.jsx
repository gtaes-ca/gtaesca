import PasswordFormInput from '@/components/form/PasswordFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const ActivateAccountForm = () => {
  const [loading, setLoading] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotificationContext();
  const token = searchParams.get('token') || '';

  const schema = yup.object({
    password: yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required(),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!token) return;
    httpClient.get(`/api/auth/customer-activation/${token}`)
      .then((res) => setAccountInfo(res.data))
      .catch((e) => {
        showNotification({
          message: e.response?.data?.error || 'Invalid activation link',
          variant: 'danger',
        });
      });
  }, [token, showNotification]);

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      const res = await httpClient.post('/api/auth/customer-activation', {
        token,
        password: values.password,
      });
      setCompleted(true);
      showNotification({
        message: res.data.message || 'Account activated successfully',
        variant: 'success',
      });
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Unable to activate account',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  });

  if (!token) {
    return <Alert variant="danger">Invalid activation link.</Alert>;
  }

  if (completed) {
    return (
      <Alert variant="success">
        <p className="mb-2">Your customer account is now active.</p>
        <p className="mb-3">Sign in to view your bookings and itemized service charges.</p>
        <Button as={Link} to="/auth/customer-sign-in" variant="primary">
          Sign In to Customer Portal
        </Button>
      </Alert>
    );
  }

  return (
    <form className="authentication-form" onSubmit={onSubmit}>
      {accountInfo && (
        <Alert variant="info">
          Activating account for <strong>{accountInfo.firstName} {accountInfo.lastName}</strong>
          {' '}({accountInfo.email})
        </Alert>
      )}
      <PasswordFormInput control={control} name="password" containerClassName="mb-3" label="Password" placeholder="Create password" />
      <PasswordFormInput control={control} name="confirmPassword" containerClassName="mb-3" label="Confirm Password" placeholder="Confirm password" />
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={loading || !accountInfo}>
          {loading ? 'Activating...' : 'Activate Account'}
        </Button>
      </div>
      <p className="text-center mt-3 mb-0 text-muted small">
        After activation you can sign in at the{' '}
        <Link to="/auth/customer-sign-in">customer portal</Link>.
      </p>
    </form>
  );
};

export default ActivateAccountForm;
