import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAnnouncements } from '../../contexts/AnnouncementContext';
import { mockEvents, mockClubs } from '../../data/mockData';
import { Calendar, Users, Bell, TrendingUp, Award, FileText } from 'lucide-react';

const Overview: React.FC = () => {
  const { user } = useAuth();
  const { announcements } = useAnnouncements();

  // Get filtered announcements using the same logic as Announcements component
  const getFilteredAnnouncements = () => {
    if (!user) return [];
    
    return announcements.filter(announcement => {
      return announcement.targetAudience === 'all' || 
             announcement.targetAudience === user.role ||
             (announcement.targetAudience === 'club_members' && 
              (user.role === 'club_member' || user.role === 'club_hicom') &&
              announcement.clubIds?.includes(user.clubId)) ||
             (announcement.targetAudience === 'selected_clubs' && 
              announcement.clubIds?.includes(user.clubId)) ||
             announcement.targetRole === 'all' || 
             announcement.targetRole === user.role;
    });
  };

  const getRecentAnnouncements = () => {
    return getFilteredAnnouncements().slice(0, 3);
  };

  const getUpcomingEvents = () => {
    return mockEvents
      .filter(event => new Date(event.date) > new Date())
      .slice(0, 3);
  };

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'ppmk_member':
        return 'Welcome to PPMKConnect! Explore clubs and join events.';
      case 'club_member':
        return 'Stay connected with your club activities and events.';
      case 'club_hicom':
        return 'Manage your club and engage with members effectively.';
      case 'ppmk_biro':
        return 'Monitor club activities and support member engagement.';
      case 'ppmk_hicom':
        return 'Strategic oversight of all PPMK club activities.';
      default:
        return 'Welcome to PPMKConnect!';
    }
  };

  const getQuickStats = () => {
    const filteredAnnouncements = getFilteredAnnouncements();
    const unreadAnnouncements = filteredAnnouncements.filter(a => !a.read).length;
    
    switch (user?.role) {
      case 'ppmk_member':
        return [
          { label: 'Available Clubs', value: mockClubs.length, icon: Users, color: 'blue' },
          { label: 'Upcoming Events', value: getUpcomingEvents().length, icon: Calendar, color: 'green' },
          { label: 'New Announcements', value: unreadAnnouncements, icon: Bell, color: 'yellow' }
        ];
      case 'club_member':
        return [
          { label: 'My Club Events', value: 3, icon: Calendar, color: 'blue' },
          { label: 'Club Members', value: 45, icon: Users, color: 'green' },
          { label: 'Announcements', value: unreadAnnouncements, icon: Bell, color: 'yellow' }
        ];
      case 'club_hicom':
        return [
          { label: 'Club Events', value: 5, icon: Calendar, color: 'blue' },
          { label: 'Members', value: 45, icon: Users, color: 'green' },
          { label: 'Announcements', value: unreadAnnouncements, icon: Bell, color: 'yellow' }
        ];
      case 'ppmk_biro':
        return [
          { label: 'Total Clubs', value: mockClubs.length, icon: Users, color: 'blue' },
          { label: 'Active Events', value: mockEvents.length, icon: Calendar, color: 'green' },
          { label: 'Announcements', value: unreadAnnouncements, icon: Bell, color: 'yellow' }
        ];
      case 'ppmk_hicom':
        return [
          { label: 'Strategic KPIs', value: 12, icon: Award, color: 'blue' },
          { label: 'Club Performance', value: 95, icon: TrendingUp, color: 'green' },
          { label: 'Announcements', value: unreadAnnouncements, icon: Bell, color: 'yellow' }
        ];
      default:
        return [];
    }
  };

  const stats = getQuickStats();
  const recentAnnouncements = getRecentAnnouncements();
  const upcomingEvents = getUpcomingEvents();

  const getStatColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'green': return 'bg-green-50 text-green-600 border-green-200';
      case 'yellow': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'purple': return 'bg-purple-50 text-purple-600 border-purple-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100">
          {getWelcomeMessage()}
        </p>
        <div className="mt-4 text-sm text-blue-100">
          <span className="font-medium">Role:</span> {
            user?.role === 'ppmk_member' ? 'PPMK Member' :
            user?.role === 'club_member' ? 'Club Member' :
            user?.role === 'club_hicom' ? 'Club HiCom' :
            user?.role === 'ppmk_biro' ? 'PPMK Biro' :
            user?.role === 'ppmk_hicom' ? 'PPMK HiCom' :
            'User'
          }
          {user?.clubName && (
            <span className="ml-4">
              <span className="font-medium">Club:</span> {user.clubName}
            </span>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-white rounded-lg border-2 p-6 ${getStatColor(stat.color)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${getStatColor(stat.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-medium text-gray-900 text-sm">{announcement.title}</h3>
                <p className="text-gray-600 text-xs mt-1 line-clamp-2">{announcement.content}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(announcement.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            {recentAnnouncements.length === 0 && (
              <p className="text-gray-500 text-sm">No recent announcements</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-medium text-gray-900 text-sm">{event.title}</h3>
                <p className="text-gray-600 text-xs mt-1">{event.clubName}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </p>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="text-gray-500 text-sm">No upcoming events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
