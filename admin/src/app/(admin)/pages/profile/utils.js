export const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin: 'Operation Admin',
  support: 'Operation Support',
  viewer: 'Operation Viewer',
  technician: 'Technician',
  customer: 'Customer',
};

export const USER_TYPE_LABELS = {
  super_admin: 'Super Admin',
  operation_team: 'Operation Team',
  technician: 'Technicians',
  customer: 'Customer',
};

export { getInitials, resolveImageUrl } from '@/helpers/profileImage';

export function getDisplayName(user, profile) {
  const firstName = profile?.firstName || user?.firstName;
  const lastName = profile?.lastName || user?.lastName;
  const name = [firstName, lastName].filter(Boolean).join(' ');
  return name || user?.email || 'User';
}

export function getRoleLabel(user) {
  if (!user) return '';
  return ROLE_LABELS[user.role] || USER_TYPE_LABELS[user.userType] || user.role;
}

export function groupExpertiseByCategory(expertise = []) {
  return expertise.reduce((groups, item) => {
    const category = item.categoryName || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

export function canEditOwnProfile(user) {
  return user?.userType === 'operation_team' || user?.userType === 'super_admin';
}
