import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/useAuthContext';
import httpClient from '@/helpers/httpClient';

export default function useProfilePage() {
  const { user } = useAuthContext();
  const [technicianProfile, setTechniciansProfile] = useState(null);
  const [expertise, setExpertise] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isTechnician = user?.userType === 'technician';

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        if (isTechnician) {
          const res = await httpClient.get('/api/technician/profile');
          if (!cancelled) {
            setTechniciansProfile(res.data.profile || null);
            setExpertise(res.data.expertise || []);
          }
        } else if (!cancelled) {
          setTechniciansProfile(null);
          setExpertise([]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || 'Failed to load profile');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.token, isTechnician]);

  return {
    user,
    technicianProfile,
    expertise,
    loading,
    error,
    isTechnician,
  };
}
