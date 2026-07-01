import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';

export const authSessionKey = '_REBACK_AUTH_KEY_';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const httpClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use((config) => {
  const sessionCookie = getCookie(authSessionKey)?.toString();
  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie);
      if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
      }
    } catch {
      // ignore invalid session cookie
    }
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isPublicPage = window.location.pathname === '/book' || window.location.pathname.startsWith('/auth/');
    if (error.response?.status === 401 && !error.config?.url?.includes('/api/auth/login') && !isPublicPage) {
      deleteCookie(authSessionKey);
      window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  }
);

export default httpClient;
