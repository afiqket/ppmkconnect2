import React from 'react';
import { NavigationTab } from '../../contexts/NavigationContext';
import OverviewTab from '../Tabs/OverviewTab';
import NotificationsTab from './Tabs/NotificationsTab';
import AnnouncementsTab from './Tabs/AnnouncementsTab';
import ClubsTab from './Tabs/ClubsTab';
import EventsTab from './Tabs/EventsTab';

interface ClubMemberDashboardProps {
  activeTab: NavigationTab;
}

const ClubMemberDashboard: React.FC<ClubMemberDashboardProps> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab userRole="club_member" />;
      case 'notifications':
        return <NotificationsTab />;
      case 'announcements':
        return <AnnouncementsTab />;
      case 'clubs':
        return <ClubsTab userRole="club_member" />;
      case 'events':
        return <EventsTab userRole="club_member" />;
      default:
        return <OverviewTab userRole="club_member" />;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default ClubMemberDashboard;
