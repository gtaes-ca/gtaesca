import { APP_NAME, currentYear } from '@/context/constants';
import HashmarkBrand from '@/components/HashmarkBrand';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <div className="footer-inner">
          <span className="footer-inner__copyright">
            {currentYear} © {APP_NAME}. All rights reserved.
          </span>
          <HashmarkBrand />
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
