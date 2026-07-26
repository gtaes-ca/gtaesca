import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import AboutBannerForm from './components/AboutBannerForm';
import AboutIntroForm from './components/AboutIntroForm';
import AboutValuesForm from './components/AboutValuesForm';
import AboutCredentialsForm from './components/AboutCredentialsForm';

const TABS = {
  BANNER: 'banner',
  INTRO: 'intro',
  VALUES: 'values',
  CREDENTIALS: 'credentials',
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
            <Nav.Link eventKey={TABS.INTRO}>Page Intro</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.VALUES}>Our Values</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.CREDENTIALS}>Licensed & Certified</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey={TABS.BANNER}>
            {activeTab === TABS.BANNER && <AboutBannerForm />}
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.INTRO}>
            {activeTab === TABS.INTRO && <AboutIntroForm />}
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.VALUES}>
            {activeTab === TABS.VALUES && <AboutValuesForm />}
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.CREDENTIALS}>
            {activeTab === TABS.CREDENTIALS && <AboutCredentialsForm />}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default AboutCmsPage;
