import React from 'react';
import { NavigationTab } from '../../contexts/NavigationContext';
import OverviewTab from '../Tabs/OverviewTab';
import NotificationsTab from './Tabs/NotificationsTab';
import AnnouncementsTab from './Tabs/AnnouncementsTab';
import ClubsTab from './Tabs/ClubsTab';
import EventsTab from './Tabs/EventsTab';
import ApplicationsTab from './Tabs/ApplicationsTab';

interface PPMKMemberDashboardProps {
  activeTab: NavigationTab;
}

const PPMKMemberDashboard: React.FC<PPMKMemberDashboardProps> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab userRole="ppmk_member" />;
      case 'notifications':
        return <NotificationsTab />;
      case 'announcements':
        return <AnnouncementsTab />;
      case 'clubs':
        return <ClubsTab userRole="ppmk_member" />;
      case 'events':
        return <EventsTab userRole="ppmk_member" />;
      case 'applications':
        return <ApplicationsTab userRole="ppmk_member" />;
      default:
        return <OverviewTab userRole="ppmk_member" />;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default PPMKMemberDashboard;
