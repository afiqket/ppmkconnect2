import React from 'react';
import { NavigationTab } from '../../contexts/NavigationContext';
import OverviewTab from './Tabs/OverviewTab';
import AnnouncementsTab from './Tabs/AnnouncementsTab';
import ClubsTab from './Tabs/ClubsTab';
import EventsTab from './Tabs/EventsTab';

interface ClubMemberDashboardProps {
  activeTab: NavigationTab;
}

const ClubMemberDashboard: React.FC<ClubMemberDashboardProps> = ({ activeTab }) => {
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'announcements':
        return <AnnouncementsTab />;
      case 'clubs':
        return <ClubsTab />;
      case 'events':
        return <EventsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default ClubMemberDashboard;
