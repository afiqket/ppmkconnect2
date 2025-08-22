import React from 'react';
import { NavigationTab } from '../../contexts/NavigationContext';
import OverviewTab from '../Tabs/OverviewTab';
import NotificationsTab from './Tabs/NotificationsTab';
import AnnouncementsTab from './Tabs/AnnouncementsTab';
import ClubsTab from './Tabs/ClubsTab';
import EventsTab from './Tabs/EventsTab';
import ProposalsTab from './Tabs/ProposalsTab';

interface PPMKBiroDashboardProps {
  activeTab: NavigationTab;
}

const PPMKBiroDashboard: React.FC<PPMKBiroDashboardProps> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab userRole="ppmk_biro" />;
      case 'notifications':
        return <NotificationsTab />;
      case 'announcements':
        return <AnnouncementsTab />;
      case 'clubs':
        return <ClubsTab userRole="ppmk_biro" />;
      case 'events':
        return <EventsTab userRole="ppmk_biro" />;
      case 'proposals':
        return <ProposalsTab userRole="ppmk_biro" />;
      default:
        return <OverviewTab userRole="ppmk_biro" />;
    }
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};

export default PPMKBiroDashboard;
