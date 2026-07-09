import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import ContactBannerForm from './components/ContactBannerForm';
import ContactSettingsForm from './components/ContactSettingsForm';

const TABS = {
  BANNER: 'banner',
  SETTINGS: 'settings',
};

const ContactCmsPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.BANNER);

  return (
    <>
      <PageTitle title="Contact Page" subTitle="Website CMS" />
      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || TABS.BANNER)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey={TABS.BANNER}>Page Banner</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.SETTINGS}>Quote Form & Map</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey={TABS.BANNER}>
            <ContactBannerForm />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.SETTINGS}>
            <ContactSettingsForm />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default ContactCmsPage;
