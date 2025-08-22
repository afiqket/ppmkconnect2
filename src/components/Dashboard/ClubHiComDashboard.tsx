import React from 'react';
import { NavigationTab } from '../../contexts/NavigationContext';
import OverviewTab from '../Tabs/OverviewTab';
import NotificationsTab from './Tabs/NotificationsTab';
import AnnouncementsTab from './Tabs/AnnouncementsTab';
import ApplicationsTab from './Tabs/ApplicationsTab';
import ProposalsTab from './Tabs/ProposalsTab';
import EventsTab from './Tabs/EventsTab';

interface ClubHiComDashboardProps {
  activeTab: NavigationTab;
}

const ClubHiComDashboard: React.FC<ClubHiComDashboardProps> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab userRole="club_hicom" />;
      case 'notifications':
        return <NotificationsTab />;
      case 'announcements':
        return <AnnouncementsTab />;
      case 'applications':
        return <ApplicationsTab userRole="club_hicom" />;
      case 'proposals':
        return <ProposalsTab userRole="club_hicom" />;
      case 'events':
        return <EventsTab userRole="club_hicom" />;
      default:
        return <OverviewTab userRole="club_hicom" />;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default ClubHiComDashboard;
