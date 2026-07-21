import { APP_NAME, currentYear } from '@/context/constants';
import HashmarkBrand from '@/components/HashmarkBrand';

const AuthFormFooter = () => {
  return (
    <div className="auth-form-footer">
      <div className="auth-form-footer__brand">
        <span className="auth-form-footer__copyright">
          {currentYear} © {APP_NAME}. All rights reserved.
        </span>
      </div>
      <div className="auth-form-footer__hashmark">
        <HashmarkBrand />
      </div>
    </div>
  );
};

export default AuthFormFooter;
