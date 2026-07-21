import LogoBox from '@/components/LogoBox';

const AuthPageSidebar = () => {
  return (
    <div className="auth-page-sidebar">
      <LogoBox
        useFullLogo
        showSquareLogo={false}
        textLogo={{ height: 72, className: 'logo-lg auth-page-sidebar__logo-image' }}
        containerClassName="auth-page-sidebar__logo"
      />
    </div>
  );
};

export default AuthPageSidebar;
