import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import AboutBannerForm from './components/AboutBannerForm';
import AboutSectionForm from './components/AboutSectionForm';
import AboutContactForm from './components/AboutContactForm';

const TABS = {
  BANNER: 'banner',
  ABOUT: 'about',
  CONTACT: 'contact',
};

const AboutCmsPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.BANNER);

  return (
    <>
      <PageTitle title="About Us Page" subTitle="Website CMS" />
      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || TABS.BANNER)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey={TABS.BANNER}>Page Banner</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.ABOUT}>Get To Know Us</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.CONTACT}>Contact With Us</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey={TABS.BANNER}>
            <AboutBannerForm />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.ABOUT}>
            <AboutSectionForm />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.CONTACT}>
            <AboutContactForm />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default AboutCmsPage;
