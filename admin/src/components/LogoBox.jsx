import { Link } from 'react-router-dom';
import logoDark from '@/assets/images/logo-dark.png';
import logoDarkFull from '@/assets/images/logo-dark-full.png';
import logoLight from '@/assets/images/logo-light.png';
import logoLightFull from '@/assets/images/logo-light-full.png';
import logoSm from '@/assets/images/logo-sm.png';

const LOGO_ASPECT = 512 / 300;

const LogoBox = ({
  containerClassName,
  squareLogo,
  textLogo,
  showSquareLogo = true,
  useFullLogo = false,
}) => {
  const logoHeight = textLogo?.height ?? 48;
  const logoWidth = textLogo?.width ?? Math.round(logoHeight * LOGO_ASPECT);
  const smSize = squareLogo?.height ?? 38;
  const darkLogoSrc = useFullLogo ? logoDarkFull : logoDark;
  const lightLogoSrc = useFullLogo ? logoLightFull : logoLight;

  return (
    <div className={containerClassName ?? ''}>
      <Link to="/" className="logo-dark">
        {showSquareLogo ? (
          <img
            src={logoSm}
            className={squareLogo?.className ?? 'logo-sm'}
            height={smSize}
            alt="GTA Electric Services"
            style={{ width: 'auto', objectFit: 'contain' }}
          />
        ) : null}
        <img
          src={darkLogoSrc}
          className={textLogo?.className ?? 'logo-lg'}
          height={logoHeight}
          width={useFullLogo ? undefined : logoWidth}
          alt="GTA Electric Services"
          style={{ width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
        />
      </Link>
      <Link to="/" className="logo-light">
        {showSquareLogo ? (
          <img
            src={logoSm}
            className={squareLogo?.className ?? 'logo-sm'}
            height={smSize}
            alt="GTA Electric Services"
            style={{ width: 'auto', objectFit: 'contain' }}
          />
        ) : null}
        <img
          src={lightLogoSrc}
          className={textLogo?.className ?? 'logo-lg'}
          height={logoHeight}
          width={useFullLogo ? undefined : logoWidth}
          alt="GTA Electric Services"
          style={{ width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
        />
      </Link>
    </div>
  );
};

export default LogoBox;
