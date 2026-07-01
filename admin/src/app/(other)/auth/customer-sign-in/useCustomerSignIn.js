import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import httpClient from '@/helpers/httpClient';

const useCustomerSignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveSession } = useAuthContext();
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotificationContext();

  const schema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string().required('Please enter your password'),
  });

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const login = handleSubmit(async (values) => {
    setLoading(true);
    try {
      const res = await httpClient.post('/api/auth/customer/login', values);
      if (res.data.token) {
        saveSession({ ...(res.data ?? {}), token: res.data.token });
        const redirectLink = searchParams.get('redirectTo');
        navigate(redirectLink || '/customer/bookings');
        showNotification({ message: 'Signed in successfully', variant: 'success' });
      }
    } catch (e) {
      showNotification({
        message: e.response?.data?.error || 'Login failed',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
    }
  });

  return { loading, login, control };
};

export default useCustomerSignIn;
