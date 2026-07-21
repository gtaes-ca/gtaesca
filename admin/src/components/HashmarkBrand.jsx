import hashmarkLightLogo from '@/assets/images/brand/hashmark-light-logo.png';

const HashmarkBrand = ({ className = '' }) => {
  return (
    <a
      href="https://hashmark.tech"
      target="_blank"
      rel="noopener noreferrer"
      className={`hashmark-brand ${className}`.trim()}
      aria-label="Visit Hashmark"
    >
      <span className="hashmark-brand__text">Hashmark</span>
      <img
        src={hashmarkLightLogo}
        alt="Hashmark logo"
        className="hashmark-brand__logo"
      />
    </a>
  );
};

export default HashmarkBrand;
