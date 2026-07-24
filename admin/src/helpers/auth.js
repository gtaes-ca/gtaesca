export const USER_TYPES = {
  SUPER_ADMIN: 'super_admin',
  OPERATION_TEAM: 'operation_team',
  TECHNICIAN: 'technician',
  CUSTOMER: 'customer',
};

export const BOOKING_MODES = {
  FULL: 'full',
  WHATSAPP: 'whatsapp',
};

export const BOOKING_SYSTEM_PAGE_KEYS = [
  'dashboard.analytics',
  'management.customers',
  'management.bookings',
  'management.booking-settings',
  'management.materials',
];

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
  'management.cms': '/management/cms/homepage',
  'management.cms.about': '/management/cms/about',
  'management.cms.team': '/management/cms/team',
  'management.cms.projects': '/management/cms/projects',
  'management.cms.services': '/management/cms/services',
  'management.cms.contact': '/management/cms/contact',
  'management.cms.faq': '/management/cms/faq',
  'management.cms.legal': '/management/cms/legal',
  'technician.jobs': '/technician/jobs',
};

export function isSuperAdmin(user) {
  return user?.userType === USER_TYPES.SUPER_ADMIN;
}

export function isWhatsAppBookingMode(user) {
  return user?.bookingMode === BOOKING_MODES.WHATSAPP;
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
  if (BOOKING_SYSTEM_PAGE_KEYS.includes(pageKey) && isWhatsAppBookingMode(user)) {
    // Super admin still needs booking settings to switch modes back.
    if (pageKey !== 'management.booking-settings' || !isSuperAdmin(user)) {
      return false;
    }
  }
  if (isSuperAdmin(user)) return true;
  return Array.isArray(user.allowedPages) && user.allowedPages.includes(pageKey);
}

export function getDefaultRedirectPath(user) {
  const orderedKeys = Object.keys(PAGE_PATH_BY_KEY);
  for (const key of orderedKeys) {
    if (canAccessPage(user, key)) {
      return PAGE_PATH_BY_KEY[key];
    }
  }
  return '/pages/profile';
}
