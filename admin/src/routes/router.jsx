import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import CustomerLayout from '@/layouts/CustomerLayout';
import FallbackLoading from '@/components/FallbackLoading';
import { useAuthContext } from '@/context/useAuthContext';
import { appRoutes, authRoutes, customerRoutes, publicRoutes } from '@/routes/index';
import AdminLayout from '@/layouts/AdminLayout';
import { SuperAdminGuard, PageAccessGuard } from '@/components/RouteGuards';
import { isCustomer } from '@/helpers/auth';

const AppRouter = (props) => {
  const { isAuthenticated, sessionChecked, user } = useAuthContext();

  return (
    <Routes>
      {(publicRoutes || []).map((route, idx) => (
        <Route
          key={`public-${idx}`}
          path={route.path}
          element={<Suspense fallback={<FallbackLoading />}>{route.element}</Suspense>}
        />
      ))}

      {(authRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={<AuthLayout {...props}>{route.element}</AuthLayout>}
        />
      ))}

      {(customerRoutes || []).map((route, idx) => {
        let element = <FallbackLoading />;
        if (sessionChecked) {
          if (!isAuthenticated) {
            element = (
              <Navigate
                to={{
                  pathname: '/auth/customer-sign-in',
                  search: 'redirectTo=' + route.path,
                }}
              />
            );
          } else if (!isCustomer(user)) {
            element = <Navigate to="/dashboard/analytics" replace />;
          } else {
            element = <CustomerLayout {...props}>{route.element}</CustomerLayout>;
          }
        }

        return (
          <Route
            key={`customer-${idx}`}
            path={route.path}
            element={element}
          />
        );
      })}

      {(appRoutes || []).map((route, idx) => {
        const content = route.superAdminOnly ? (
          <SuperAdminGuard>{route.element}</SuperAdminGuard>
        ) : route.pageKey ? (
          <PageAccessGuard pageKey={route.pageKey}>{route.element}</PageAccessGuard>
        ) : (
          route.element
        );

        let element = <FallbackLoading />;
        if (sessionChecked) {
          if (!isAuthenticated) {
            element = (
              <Navigate
                to={{
                  pathname: '/auth/sign-in',
                  search: 'redirectTo=' + route.path,
                }}
              />
            );
          } else if (isCustomer(user)) {
            element = <Navigate to="/customer/bookings" replace />;
          } else {
            element = <AdminLayout {...props}>{content}</AdminLayout>;
          }
        }

        return (
          <Route
            key={idx + route.name}
            path={route.path}
            element={element}
          />
        );
      })}
    </Routes>
  );
};

export default AppRouter;
