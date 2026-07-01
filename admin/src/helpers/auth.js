export const USER_TYPES = {
  SUPER_ADMIN: 'super_admin',
  OPERATION_TEAM: 'operation_team',
  TECHNICIAN: 'technician',
  CUSTOMER: 'customer',
};

export const PAGE_PATH_BY_KEY = {
  'dashboard.analytics': '/dashboard/analytics',
  'management.invitations': '/management/invitations',
  'management.users': '/management/users',
  'management.customers': '/management/customers',
  'management.service-categories': '/management/service-categories',
  'management.services': '/management/services',
  'management.materials': '/management/materials',
  'management.service-locations': '/management/service-locations',
  'management.bookings': '/management/bookings',
  'management.booking-settings': '/management/booking-settings',
  'technician.jobs': '/technician/jobs',
};

export function isSuperAdmin(user) {
  return user?.userType === USER_TYPES.SUPER_ADMIN;
}

export function isTechnician(user) {
  return user?.userType === USER_TYPES.TECHNICIAN;
}

export function isCustomer(user) {
  return user?.userType === USER_TYPES.CUSTOMER;
}

export function canAccessManagement(user) {
  return isSuperAdmin(user);
}

export function canAccessPage(user, pageKey) {
  if (!user || !pageKey) return true;
  if (isSuperAdmin(user)) return true;
  return Array.isArray(user.allowedPages) && user.allowedPages.includes(pageKey);
}

export function getDefaultRedirectPath(user) {
  const allowedPages = user?.allowedPages || [];
  const orderedKeys = Object.keys(PAGE_PATH_BY_KEY);
  for (const key of orderedKeys) {
    if (allowedPages.includes(key)) {
      return PAGE_PATH_BY_KEY[key];
    }
  }
  return '/pages/profile';
}
