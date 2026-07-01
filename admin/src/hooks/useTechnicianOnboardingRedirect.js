import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import httpClient from '@/helpers/httpClient';

export function useTechnicianOnboardingRedirect() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?.userType !== 'technician') return;
    if (location.pathname === '/technician/onboarding' || location.pathname === '/technician/jobs') return;

    httpClient.get('/api/technician/profile')
      .then((res) => {
        if (!res.data?.profile?.onboardingCompleted) {
          navigate('/technician/onboarding', { replace: true });
        }
      })
      .catch(() => {
        navigate('/technician/onboarding', { replace: true });
      });
  }, [user, location.pathname, navigate]);
}
