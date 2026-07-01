const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  return `${apiBaseUrl}${url}`;
}

export function getInitials(user, profile) {
  const first = profile?.firstName || user?.firstName;
  const last = profile?.lastName || user?.lastName;
  const initials = `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
  return initials || user?.email?.[0]?.toUpperCase() || 'U';
}

export const MAX_PROFILE_IMAGE_BYTES = 2 * 1024 * 1024;
