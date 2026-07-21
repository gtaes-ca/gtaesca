import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import LegalBannerForm from './components/LegalBannerForm';
import LegalContentForm from './components/LegalContentForm';

const PAGES = {
  TERMS: 'terms',
  PRIVACY: 'privacy',
};

const TABS = {
  BANNER: 'banner',
  CONTENT: 'content',
};

const LegalCmsPage = () => {
  const [activePage, setActivePage] = useState(PAGES.TERMS);
  const [activeTab, setActiveTab] = useState(TABS.BANNER);

  return (
    <>
      <PageTitle title="Legal Pages" subTitle="Website CMS" />
      <Tab.Container activeKey={activePage} onSelect={(key) => setActivePage(key || PAGES.TERMS)}>
        <Nav variant="pills" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey={PAGES.TERMS}>Terms and Conditions</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={PAGES.PRIVACY}>Privacy Policy</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey={PAGES.TERMS}>
            <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || TABS.BANNER)}>
              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link eventKey={TABS.BANNER}>Page Banner</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={TABS.CONTENT}>Page Content</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey={TABS.BANNER}>
                  <LegalBannerForm pageKey={PAGES.TERMS} pageLabel="Terms and Conditions" />
                </Tab.Pane>
                <Tab.Pane eventKey={TABS.CONTENT}>
                  <LegalContentForm pageKey={PAGES.TERMS} pageLabel="Terms and Conditions" />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Tab.Pane>
          <Tab.Pane eventKey={PAGES.PRIVACY}>
            <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || TABS.BANNER)}>
              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link eventKey={TABS.BANNER}>Page Banner</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={TABS.CONTENT}>Page Content</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey={TABS.BANNER}>
                  <LegalBannerForm pageKey={PAGES.PRIVACY} pageLabel="Privacy Policy" />
                </Tab.Pane>
                <Tab.Pane eventKey={TABS.CONTENT}>
                  <LegalContentForm pageKey={PAGES.PRIVACY} pageLabel="Privacy Policy" />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default LegalCmsPage;
