import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import { canAccessManagement } from '@/helpers/auth';

const ProtectedRoute = ({ children, superAdminOnly = false }) => {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (superAdminOnly && !canAccessManagement(user)) {
    return <Navigate to="/dashboard/analytics" replace />;
  }

  return children;
};

export default ProtectedRoute;
