import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import CategoryServicesBannerForm from './components/CategoryServicesBannerForm';
import CategoryServicesDetailsForm from './components/CategoryServicesDetailsForm';
import CategoryServicesGalleryForm from './components/CategoryServicesGalleryForm';
import ServicesHomepageSectionForm from './components/ServicesHomepageSectionForm';

const TABS = {
  HOMEPAGE_SECTION: 'homepage-section',
  RESIDENTIAL_BANNER: 'residential-banner',
  RESIDENTIAL_DETAILS: 'residential-details',
  RESIDENTIAL_GALLERY: 'residential-gallery',
  COMMERCIAL_BANNER: 'commercial-banner',
  COMMERCIAL_DETAILS: 'commercial-details',
  COMMERCIAL_GALLERY: 'commercial-gallery',
};

const ServicesCmsPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.HOMEPAGE_SECTION);

  return (
    <>
      <PageTitle title="Services Pages" subTitle="Website CMS" />
      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || TABS.HOMEPAGE_SECTION)}>
        <Nav variant="tabs" className="mb-4 flex-wrap">
          <Nav.Item>
            <Nav.Link eventKey={TABS.HOMEPAGE_SECTION}>Homepage Section</Nav.Link>
          </Nav.Item>
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
          <Tab.Pane eventKey={TABS.HOMEPAGE_SECTION}>
            {activeTab === TABS.HOMEPAGE_SECTION && <ServicesHomepageSectionForm />}
          </Tab.Pane>
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
              description="Upload photos linked to a specific residential service. Each photo is saved only for that service and appears on its public detail page."
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
              description="Upload photos linked to a specific commercial service. Each photo is saved only for that service and appears on its public detail page."
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default ServicesCmsPage;
