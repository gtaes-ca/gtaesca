import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient, { authSessionKey } from '@/helpers/httpClient';

const AuthContext = createContext(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const getSession = useCallback(() => {
    const fetchedCookie = getCookie(authSessionKey)?.toString();
    if (!fetchedCookie) return;
    try {
      return JSON.parse(fetchedCookie);
    } catch {
      return undefined;
    }
  }, []);

  const [user, setUser] = useState(getSession);
  const [sessionChecked, setSessionChecked] = useState(!getSession()?.token);

  const removeSession = useCallback(() => {
    deleteCookie(authSessionKey);
    setUser(undefined);
    navigate('/auth/sign-in');
  }, [navigate]);

  const saveSession = useCallback((sessionUser) => {
    setCookie(authSessionKey, JSON.stringify(sessionUser));
    setUser(sessionUser);
    setSessionChecked(true);
  }, []);

  const refreshSession = useCallback(async () => {
    const session = getSession();
    if (!session?.token) {
      setSessionChecked(true);
      return;
    }

    try {
      const res = await httpClient.get('/api/auth/me');
      const updated = { ...session, ...res.data, token: session.token };

      if (updated.status === 'blocked') {
        deleteCookie(authSessionKey);
        setUser(undefined);
        navigate('/auth/sign-in');
        return;
      }

      setCookie(authSessionKey, JSON.stringify(updated));
      setUser(updated);
    } catch (error) {
      if (error.response?.status === 401) {
        deleteCookie(authSessionKey);
        setUser(undefined);
      }
    } finally {
      setSessionChecked(true);
    }
  }, [getSession, navigate]);

  useEffect(() => {
    refreshSession();
    const interval = setInterval(refreshSession, 30000);
    const onFocus = () => refreshSession();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [refreshSession]);

  const logout = async () => {
    try {
      await httpClient.post('/api/auth/logout');
    } catch {
      // clear local session even if API call fails
    }
    removeSession();
  };

  const isAuthenticated = Boolean(user?.token) && user?.status !== 'blocked';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        sessionChecked,
        saveSession,
        removeSession,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
