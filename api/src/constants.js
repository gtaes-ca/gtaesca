export const BRAND_NAME = 'GTA Electric Services';

export const USER_TYPES = {
  SUPER_ADMIN: 'super_admin',
  OPERATION_TEAM: 'operation_team',
  TECHNICIAN: 'technician',
  CUSTOMER: 'customer',
};

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  OPERATION_ADMIN: 'admin',
  OPERATION_SUPPORT: 'support',
  OPERATION_VIEWER: 'viewer',
  TECHNICIAN: 'technician',
  CUSTOMER: 'customer',
};

export const OPERATION_ROLES = [
  ROLES.OPERATION_ADMIN,
  ROLES.OPERATION_SUPPORT,
  ROLES.OPERATION_VIEWER,
];

export const INVITABLE_USER_TYPES = [
  USER_TYPES.OPERATION_TEAM,
  USER_TYPES.TECHNICIAN,
];

export const ROLE_BY_USER_TYPE = {
  [USER_TYPES.OPERATION_TEAM]: OPERATION_ROLES,
  [USER_TYPES.TECHNICIAN]: [ROLES.TECHNICIAN],
};

export function isValidRoleForUserType(userType, role) {
  const allowed = ROLE_BY_USER_TYPE[userType];
  return Array.isArray(allowed) && allowed.includes(role);
}

export function canAccessAdminPanel(user) {
  return [
    USER_TYPES.SUPER_ADMIN,
    USER_TYPES.OPERATION_TEAM,
    USER_TYPES.TECHNICIAN,
  ].includes(user?.userType);
}

export function isSuperAdmin(user) {
  return user?.userType === USER_TYPES.SUPER_ADMIN;
}

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  TECHNICIAN_ASSIGNED: 'technician_assigned',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const BOOKING_STATUS_LABELS = {
  pending: 'Pending',
  technician_assigned: 'Technician Assigned',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const VALID_BOOKING_TRANSITIONS = {
  pending: ['technician_assigned', 'cancelled'],
  technician_assigned: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};
