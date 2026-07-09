import { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import PageTitle from '@/components/PageTitle';
import TeamBannerForm from './components/TeamBannerForm';
import TeamDetailsBannerForm from './components/TeamDetailsBannerForm';

const TABS = {
  TEAM: 'team',
  DETAILS: 'details',
};

const TeamCmsPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.TEAM);

  return (
    <>
      <PageTitle title="Team Page" subTitle="Website CMS" />
      <Tab.Container activeKey={activeTab} onSelect={(key) => setActiveTab(key || TABS.TEAM)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey={TABS.TEAM}>Team Page Banner</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={TABS.DETAILS}>Member Details Banner</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey={TABS.TEAM}>
            <TeamBannerForm />
          </Tab.Pane>
          <Tab.Pane eventKey={TABS.DETAILS}>
            <TeamDetailsBannerForm />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
};

export default TeamCmsPage;
