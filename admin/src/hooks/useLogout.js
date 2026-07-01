import { useAuthContext } from '@/context/useAuthContext';
import httpClient from '@/helpers/httpClient';

export function useLogout() {
  const { removeSession } = useAuthContext();

  return async () => {
    try {
      await httpClient.post('/api/auth/logout');
    } catch {
      // still clear local session
    }
    removeSession();
  };
}
