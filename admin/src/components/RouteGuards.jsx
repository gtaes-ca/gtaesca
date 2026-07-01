import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import { isSuperAdmin, canAccessPage, getDefaultRedirectPath } from '@/helpers/auth';

export function SuperAdminGuard({ children }) {
  const { user } = useAuthContext();
  if (!isSuperAdmin(user)) {
    return <Navigate to={getDefaultRedirectPath(user)} replace />;
  }
  return children;
}

export function PageAccessGuard({ pageKey, children }) {
  const { user } = useAuthContext();
  if (!canAccessPage(user, pageKey)) {
    return <Navigate to={getDefaultRedirectPath(user)} replace />;
  }
  return children;
}
