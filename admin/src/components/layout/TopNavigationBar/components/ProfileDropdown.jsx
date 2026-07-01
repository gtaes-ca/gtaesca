import { Link } from 'react-router-dom';
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useAuthContext } from '@/context/useAuthContext';
import { getInitials, resolveImageUrl } from '@/helpers/profileImage';

const ProfileDropdown = () => {
  const { user, logout } = useAuthContext();
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email || 'User';
  const profileImageUrl = resolveImageUrl(user?.profileImageUrl);
  const initials = getInitials(user);

  return (
    <Dropdown className="topbar-item" align="end">
      <DropdownToggle as="button" type="button" className="topbar-button content-none" id="page-header-user-dropdown">
        <span className="d-flex align-items-center">
          {profileImageUrl ? (
            <img className="rounded-circle object-fit-cover" width={32} height={32} src={profileImageUrl} alt={displayName} />
          ) : (
            <span
              className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-semibold"
              style={{ width: 32, height: 32, fontSize: '0.8rem' }}
            >
              {initials}
            </span>
          )}
        </span>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownHeader as="h6">Welcome {displayName}!</DropdownHeader>
        <DropdownItem as={Link} to="/pages/profile">
          <IconifyIcon icon="bx:user-circle" className="text-muted fs-18 align-middle me-1" />
          <span className="align-middle">Profile</span>
        </DropdownItem>
        <DropdownDivider className="dropdown-divider my-1" />
        <DropdownItem className="text-danger" onClick={logout}>
          <IconifyIcon icon="bx:log-out" className="fs-18 align-middle me-1" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;
