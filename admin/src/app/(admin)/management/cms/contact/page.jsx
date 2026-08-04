import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import HomeTopbarForm from '../homepage/components/HomeTopbarForm';
import ContactBannerForm from './components/ContactBannerForm';
import ContactSettingsForm from './components/ContactSettingsForm';
import ContactSpecificationForm from './components/ContactSpecificationForm';

const TABS = {
  TOPBAR: 'topbar',
  BANNER: 'banner',
  SETTINGS: 'settings',
  SPECIFICATION: 'specification',
};

const ContactCmsPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.TOPBAR);

  return (
    <>
      <PageTitle title="Contact Page" subTitle="Website CMS" />
      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || TABS.TOPBAR)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey={TABS.TOPBAR}>Contact Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.BANNER}>Page Banner</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.SETTINGS}>Quote Form & Map</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.SPECIFICATION}>Specification</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey={TABS.TOPBAR}>
            {activeTab === TABS.TOPBAR && <HomeTopbarForm />}
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.BANNER}>
            {activeTab === TABS.BANNER && <ContactBannerForm />}
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.SETTINGS}>
            {activeTab === TABS.SETTINGS && <ContactSettingsForm />}
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.SPECIFICATION}>
            {activeTab === TABS.SPECIFICATION && <ContactSpecificationForm />}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default ContactCmsPage;
