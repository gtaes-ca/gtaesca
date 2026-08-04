import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import ServiceAreasBannerForm from './components/ServiceAreasBannerForm';

const TABS = {
  BANNER: 'banner',
};

const ServiceAreasCmsPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.BANNER);

  return (
    <>
      <PageTitle title="Service Areas Page" subTitle="Website CMS" />
      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || TABS.BANNER)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey={TABS.BANNER}>Page Banner</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey={TABS.BANNER}>
            <ServiceAreasBannerForm />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default ServiceAreasCmsPage;
