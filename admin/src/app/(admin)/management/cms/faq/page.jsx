import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import FaqBannerForm from './components/FaqBannerForm';
import FaqItemsForm from './components/FaqItemsForm';
import FaqSettingsForm from './components/FaqSettingsForm';

const TABS = {
  BANNER: 'banner',
  SETTINGS: 'settings',
  ITEMS: 'items',
};

const FaqCmsPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.BANNER);

  return (
    <>
      <PageTitle title="FAQ Page" subTitle="Website CMS" />
      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || TABS.BANNER)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey={TABS.BANNER}>Page Banner</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.SETTINGS}>Page Intro</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.ITEMS}>FAQ Items</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey={TABS.BANNER}>
            <FaqBannerForm />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.SETTINGS}>
            <FaqSettingsForm />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.ITEMS}>
            <FaqItemsForm />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default FaqCmsPage;
