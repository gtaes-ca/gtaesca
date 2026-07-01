import clsx from 'clsx';
import { getInitials, resolveImageUrl } from '@/helpers/profileImage';

const UserAvatar = ({ user, profile, size = 'sm', className }) => {
  const profileImageUrl = resolveImageUrl(profile?.profileImageUrl || user?.profileImageUrl);
  const initials = getInitials(user, profile);
  const sizeClass = `avatar-${size}`;

  if (profileImageUrl) {
    return (
      <img
        src={profileImageUrl}
        alt={initials}
        className={clsx('rounded-circle object-fit-cover', sizeClass, className)}
      />
    );
  }

  return (
    <span
      className={clsx(
        'rounded-circle bg-primary-subtle text-primary d-inline-flex align-items-center justify-content-center fw-semibold',
        sizeClass,
        className
      )}
      style={{ fontSize: size === 'xs' ? '0.65rem' : size === 'sm' ? '0.75rem' : '1rem' }}
    >
      {initials}
    </span>
  );
};

export default UserAvatar;
