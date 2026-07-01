import { useAuthContext } from '@/context/useAuthContext';
import { getDisplayName, getRoleLabel } from '@/app/(admin)/pages/profile/utils';

const UserIdentity = () => {
  const { user } = useAuthContext();

  if (!user) return null;

  const displayName = getDisplayName(user);
  const roleLabel = getRoleLabel(user);

  return (
    <div className="topbar-user-identity d-none d-md-flex align-items-center min-w-0">
      <span className="text-truncate fw-medium">
        {displayName}
        <span className="text-muted mx-1">\</span>
        <span className="text-muted">{roleLabel}</span>
      </span>
    </div>
  );
};

export default UserIdentity;
