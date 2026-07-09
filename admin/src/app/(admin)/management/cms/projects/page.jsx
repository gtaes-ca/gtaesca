import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import ProjectsBannerForm from './components/ProjectsBannerForm';
import ProjectsGalleryForm from './components/ProjectsGalleryForm';
import ProjectDetailsBannerForm from './components/ProjectDetailsBannerForm';

const TABS = {
  BANNER: 'banner',
  GALLERY: 'gallery',
  DETAILS: 'details',
};

const ProjectsCmsPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.BANNER);

  return (
    <>
      <PageTitle title="Projects Page" subTitle="Website CMS" />
      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || TABS.BANNER)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey={TABS.BANNER}>Projects Page Banner</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.GALLERY}>Projects Gallery</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.DETAILS}>Project Details Banner</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey={TABS.BANNER}>
            <ProjectsBannerForm />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.GALLERY}>
            <ProjectsGalleryForm />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.DETAILS}>
            <ProjectDetailsBannerForm />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default ProjectsCmsPage;
