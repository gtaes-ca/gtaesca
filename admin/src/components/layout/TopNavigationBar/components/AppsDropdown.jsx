import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useAuthContext } from '@/context/useAuthContext';
import { getQuickLaunchPages } from '@/helpers/menu';

const AppsDropdown = () => {
  const { user } = useAuthContext();
  const quickPages = getQuickLaunchPages(user);

  return (
    <Dropdown className="topbar-item d-none d-lg-flex" align="end">
      <DropdownToggle as="button" className="topbar-button content-none" aria-haspopup="true">
        <IconifyIcon icon="iconamoon:apps" className="fs-24 align-middle" />
      </DropdownToggle>
      <DropdownMenu className="p-0 dropdown-menu-end" style={{ minWidth: 240 }}>
        <div className="px-3 py-2 border-bottom">
          <span className="fw-semibold small text-uppercase text-muted">Quick Launch</span>
        </div>
        <div className="p-1">
          {quickPages.map((page) => (
            <DropdownItem key={page.url} as={Link} to={page.url} className="py-2 d-flex align-items-center gap-2">
              <IconifyIcon icon={page.icon} className="fs-20 text-primary" />
              <span>{page.label}</span>
            </DropdownItem>
          ))}
          {quickPages.length === 0 && (
            <div className="px-3 py-2 text-muted small">No pages available</div>
          )}
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AppsDropdown;
