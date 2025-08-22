import React from 'react';
import { NavigationTab } from '../../contexts/NavigationContext';
import OverviewTab from '../Tabs/OverviewTab';
import NotificationsTab from './Tabs/NotificationsTab';
import AnnouncementsTab from './Tabs/AnnouncementsTab';
import ClubsTab from './Tabs/ClubsTab';
import EventsTab from './Tabs/EventsTab';
import ProposalsTab from './Tabs/ProposalsTab';
import ApplicationsTab from './Tabs/ApplicationsTab';

interface PPMKHiComDashboardProps {
  activeTab: NavigationTab;
}

const PPMKHiComDashboard: React.FC<PPMKHiComDashboardProps> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab userRole="ppmk_hicom" />;
      case 'notifications':
        return <NotificationsTab />;
      case 'announcements':
        return <AnnouncementsTab />;
      case 'clubs':
        return <ClubsTab userRole="ppmk_hicom" />;
      case 'events':
        return <EventsTab userRole="ppmk_hicom" />;
      case 'proposals':
        return <ProposalsTab userRole="ppmk_hicom" />;
      case 'applications':
        return <ApplicationsTab userRole="ppmk_hicom" />;
      default:
        return <OverviewTab userRole="ppmk_hicom" />;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default PPMKHiComDashboard;
