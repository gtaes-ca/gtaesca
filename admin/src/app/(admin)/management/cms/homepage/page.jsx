import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import PageMetaData from '@/components/PageTitle';
import HomeAboutForm from './components/HomeAboutForm';
import HomeFeaturedServicesForm from './components/HomeFeaturedServicesForm';
import HomeGalleryForm from './components/HomeGalleryForm';
import HomeServicesForm from './components/HomeServicesForm';
import HomeSliderForm from './components/HomeSliderForm';

const TABS = {
  SLIDER: 'slider',
  FEATURES: 'features',
  ABOUT: 'about',
  FEATURED_SERVICES: 'featured-services',
  GALLERY: 'gallery',
};

const HomepageCmsPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.SLIDER);

  return (
    <>
      <PageMetaData title="Website CMS - Homepage" />
      <Tab.Container
        activeKey={activeTab}
        onSelect={(key) => key && setActiveTab(key)}
      >
        <Nav variant="tabs" className="nav-tabs card-tabs mb-3 flex-wrap">
          <Nav.Item>
            <Nav.Link eventKey={TABS.SLIDER}>Hero Slider</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.FEATURES}>Service Features</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.ABOUT}>Get To Know Us</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.FEATURED_SERVICES}>Featured Services</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.GALLERY}>Our Gallery</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey={TABS.SLIDER}>
            {activeTab === TABS.SLIDER && <HomeSliderForm />}
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.FEATURES}>
            {activeTab === TABS.FEATURES && <HomeServicesForm />}
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.ABOUT}>
            {activeTab === TABS.ABOUT && <HomeAboutForm />}
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.FEATURED_SERVICES}>
            {activeTab === TABS.FEATURED_SERVICES && <HomeFeaturedServicesForm />}
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.GALLERY}>
            {activeTab === TABS.GALLERY && <HomeGalleryForm />}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default HomepageCmsPage;
