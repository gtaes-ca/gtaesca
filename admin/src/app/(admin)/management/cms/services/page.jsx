import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import CategoryServicesBannerForm from './components/CategoryServicesBannerForm';
import CategoryServicesDetailsForm from './components/CategoryServicesDetailsForm';
import CategoryServicesGalleryForm from './components/CategoryServicesGalleryForm';

const TABS = {
  RESIDENTIAL_BANNER: 'residential-banner',
  RESIDENTIAL_DETAILS: 'residential-details',
  RESIDENTIAL_GALLERY: 'residential-gallery',
  COMMERCIAL_BANNER: 'commercial-banner',
  COMMERCIAL_DETAILS: 'commercial-details',
  COMMERCIAL_GALLERY: 'commercial-gallery',
};

const ServicesCmsPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.RESIDENTIAL_BANNER);

  return (
    <>
      <PageTitle title="Services Pages" subTitle="Website CMS" />
      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || TABS.RESIDENTIAL_BANNER)}>
        <Nav variant="tabs" className="mb-4 flex-wrap">
          <Nav.Item>
            <Nav.Link eventKey={TABS.RESIDENTIAL_BANNER}>Residential Banner</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.RESIDENTIAL_DETAILS}>Residential Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.RESIDENTIAL_GALLERY}>Residential Gallery</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.COMMERCIAL_BANNER}>Commercial Banner</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.COMMERCIAL_DETAILS}>Commercial Details</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.COMMERCIAL_GALLERY}>Commercial Gallery</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey={TABS.RESIDENTIAL_BANNER}>
            <CategoryServicesBannerForm
              pageKey="residential"
              title="Residential Page Banner"
              description="Header title and background for the Residential services page (/residential)."
              imageUploadKey="residential-banner-background"
            />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.RESIDENTIAL_DETAILS}>
            <CategoryServicesDetailsForm
              pageKey="residential"
              title="Residential Page Details"
              description="Intro section shown above the residential services list."
            />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.RESIDENTIAL_GALLERY}>
            <CategoryServicesGalleryForm
              pageKey="residential"
              title="Residential Services Gallery"
              description="Photo gallery shown below the residential services list on /residential."
            />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.COMMERCIAL_BANNER}>
            <CategoryServicesBannerForm
              pageKey="commercial"
              title="Commercial Page Banner"
              description="Header title and background for the Commercial services page (/commercial)."
              imageUploadKey="commercial-banner-background"
            />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.COMMERCIAL_DETAILS}>
            <CategoryServicesDetailsForm
              pageKey="commercial"
              title="Commercial Page Details"
              description="Intro section shown above the commercial services list."
            />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.COMMERCIAL_GALLERY}>
            <CategoryServicesGalleryForm
              pageKey="commercial"
              title="Commercial Services Gallery"
              description="Photo gallery shown below the commercial services list on /commercial."
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default ServicesCmsPage;
