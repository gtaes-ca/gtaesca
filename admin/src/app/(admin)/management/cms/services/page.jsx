import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import ServicesBannerForm from './components/ServicesBannerForm';
import ServiceDetailsBannerForm from './components/ServiceDetailsBannerForm';

const TABS = {
  SERVICES: 'services',
  DETAILS: 'details',
};

const ServicesCmsPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.SERVICES);

  return (
    <>
      <PageTitle title="Services Page" subTitle="Website CMS" />
      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || TABS.SERVICES)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey={TABS.SERVICES}>Services Page Banner</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.DETAILS}>Service Details Banner</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey={TABS.SERVICES}>
            <ServicesBannerForm />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.DETAILS}>
            <ServiceDetailsBannerForm />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default ServicesCmsPage;
