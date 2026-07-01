import { lazy } from 'react';
import { Suspense } from 'react';
import LeftSideBarToggle from './components/LeftSideBarToggle';
import ProfileDropdown from './components/ProfileDropdown';
import ThemeCustomizerToggle from './components/ThemeCustomizerToggle';
import ThemeModeToggle from './components/ThemeModeToggle';
import UserIdentity from './components/UserIdentity';

const AppsDropdown = lazy(() => import('./components/AppsDropdown'));
const Notifications = lazy(() => import('./components/Notifications'));

const TopNavigationBar = () => {
  return (
    <header className="topbar">
      <div className="container-xxl">
        <div className="navbar-header">
          <div className="d-flex align-items-center gap-2 min-w-0">
            <LeftSideBarToggle />
            <UserIdentity />
          </div>
          <div className="d-flex align-items-center gap-1">
            <ThemeModeToggle />

            <Suspense>
              <AppsDropdown />
            </Suspense>

            <Suspense>
              <Notifications />
            </Suspense>

            <ThemeCustomizerToggle />

            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigationBar;
