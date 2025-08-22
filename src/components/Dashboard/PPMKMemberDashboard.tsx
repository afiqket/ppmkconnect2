import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAnnouncements } from '../../contexts/AnnouncementContext';
import { useApplications } from '../../contexts/ApplicationContext';
import { useEvents } from '../../contexts/EventContext';
import { useNotifications } from '../../contexts/NotificationContext';
import Sidebar from '../Layout/Sidebar';
import Header from '../Layout/Header';
import OverviewTab from '../Tabs/OverviewTab';
import AnnouncementsTab from '../Tabs/AnnouncementsTab';
import ClubsTab from '../Tabs/ClubsTab';
import EventsTab from '../Tabs/EventsTab';
import ApplicationsTab from '../Tabs/ApplicationsTab';
import NotificationsTab from '../Tabs/NotificationsTab';

const PPMKMemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const { announcements, unreadCount: announcementUnreadCount } = useAnnouncements();
  const { applications } = useApplications();
  const { events } = useEvents();
  const { unreadCount: notificationUnreadCount } = useNotifications();
  const [activeTab, setActiveTab] = useState('overview');

  const userApplications = applications.filter(app => app.applicantId === user?.id);

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      count: 0 
    },
    { 
      id: 'announcements', 
      label: 'Announcements', 
      count: announcementUnreadCount 
    },
    { 
      id: 'clubs', 
      label: 'Browse Clubs', 
      count: 0 
    },
    { 
      id: 'events', 
      label: 'Events', 
      count: 0 
    },
    { 
      id: 'applications', 
      label: 'My Applications', 
      count: userApplications.filter(app => app.status === 'pending').length 
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      count: notificationUnreadCount 
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'announcements':
        return <AnnouncementsTab />;
      case 'clubs':
        return <ClubsTab />;
      case 'events':
        return <EventsTab />;
      case 'applications':
        return <ApplicationsTab />;
      case 'notifications':
        return <NotificationsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PPMKMemberDashboard;
