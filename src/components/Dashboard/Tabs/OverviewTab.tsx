import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAnnouncements } from '../../../contexts/AnnouncementContext';
import { useApplications } from '../../../contexts/ApplicationContext';
import { useEvents } from '../../../contexts/EventContext';
import { useNotifications } from '../../../contexts/NotificationContext';
import { Calendar, Users, FileText, Bell, TrendingUp, Clock } from 'lucide-react';

interface OverviewTabProps {
  userRole: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ userRole }) => {
  const { user } = useAuth();
  const { announcements, unreadCount: announcementUnreadCount } = useAnnouncements();
  const { applications } = useApplications();
  const { events } = useEvents();
  const { unreadCount: notificationUnreadCount } = useNotifications();

  const userApplications = applications.filter(app => app.applicantId === user?.id);
  const pendingApplications = userApplications.filter(app => app.status === 'pending');
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).slice(0, 3);
  const recentAnnouncements = announcements.slice(0, 3);

  const getStatsForRole = () => {
    const baseStats = [
      {
        title: 'Unread Notifications',
        value: notificationUnreadCount,
        icon: Bell,
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600'
      },
      {
        title: 'New Announcements',
        value: announcementUnreadCount,
        icon: TrendingUp,
        color: 'bg-purple-500',
        textColor: 'text-purple-600'
      }
    ];

    switch (userRole) {
      case 'ppmk_member':
        return [
          {
            title: 'Pending Applications',
            value: pendingApplications.length,
            icon: FileText,
            color: 'bg-blue-500',
            textColor: 'text-blue-600'
          },
          {
            title: 'Upcoming Events',
            value: upcomingEvents.length,
            icon: Calendar,
            color: 'bg-green-500',
            textColor: 'text-green-600'
          },
          ...baseStats
        ];
      
      case 'club_hicom':
        return [
          {
            title: 'Pending Applications',
            value: applications.filter(app => app.status === 'pending').length,
            icon: FileText,
            color: 'bg-blue-500',
            textColor: 'text-blue-600'
          },
          {
            title: 'Upcoming Events',
            value: upcomingEvents.length,
            icon: Calendar,
            color: 'bg-green-500',
            textColor: 'text-green-600'
          },
          ...baseStats
        ];
      
      default:
        return [
          {
            title: 'Upcoming Events',
            value: upcomingEvents.length,
            icon: Calendar,
            color: 'bg-green-500',
            textColor: 'text-green-600'
          },
          {
            title: 'Total Clubs',
            value: 12,
            icon: Users,
            color: 'bg-blue-500',
            textColor: 'text-blue-600'
          },
          ...baseStats
        ];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your club activities today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {announcement.content.substring(0, 100)}...
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent announcements</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="border-l-4 border-green-500 pl-4 py-2">
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No upcoming events</p>
            )}
          </div>
        </div>
      </div>

      {/* Application Status */}
      {userRole === 'ppmk_member' && userApplications.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Application Status</h2>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {userApplications.slice(0, 3).map((application) => (
              <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{application.clubName}</h3>
                  <p className="text-sm text-gray-600">Applied on {new Date(application.appliedAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  application.status === 'approved' 
                    ? 'bg-green-100 text-green-800'
                    : application.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
