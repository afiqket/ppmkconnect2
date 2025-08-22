import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useEvents } from '../../contexts/EventContext';
import { useAnnouncements } from '../../contexts/AnnouncementContext';
import { Bell, Users, Calendar, FileText, TrendingUp, MapPin, Clock, User } from 'lucide-react';

interface ClubMemberDashboardProps {
  activeTab: string;
}

const ClubMemberDashboard: React.FC<ClubMemberDashboardProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const { events } = useEvents();
  const { announcements, markAnnouncementAsRead } = useAnnouncements();

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadAnnouncements = announcements.filter(a => !a.read).length;
  const clubEvents = events.filter(e => e.clubId === user?.clubId);
  const upcomingEvents = clubEvents.filter(e => new Date(e.date) > new Date()).length;

  const filteredAnnouncements = announcements.filter(announcement => 
    announcement.targetRole === 'all' || 
    announcement.targetRole === 'club_member' ||
    announcement.clubId === user?.clubId
  );

  if (activeTab === 'overview') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">{user?.clubName} Member Dashboard</p>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-400" />
            {unreadNotifications > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadNotifications}
              </span>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Club</p>
                <p className="text-lg font-semibold text-gray-900">{user?.clubName}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-semibold text-gray-900">{upcomingEvents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread Announcements</p>
                <p className="text-2xl font-semibold text-gray-900">{unreadAnnouncements}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Notifications</p>
                <p className="text-2xl font-semibold text-gray-900">{unreadNotifications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Club Events</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {clubEvents.filter(e => new Date(e.date) > new Date()).slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div>
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{event.date}</p>
                    <p className="text-sm text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
              {clubEvents.filter(e => new Date(e.date) > new Date()).length === 0 && (
                <p className="text-gray-500 text-center py-4">No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'my-clubs') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Club</h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.clubName}</h2>
            <p className="text-gray-600 mb-4">Welcome to your club dashboard</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{clubEvents.length}</div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{upcomingEvents}</div>
                <div className="text-sm text-gray-600">Upcoming Events</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{unreadAnnouncements}</div>
                <div className="text-sm text-gray-600">New Announcements</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Club Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {clubEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.date} at {event.location}</p>
                  </div>
                </div>
              ))}
              {clubEvents.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent activities</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'events') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Club Events</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date} at {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    new Date(event.date) > new Date() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {clubEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No events available</p>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'announcements') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`bg-white rounded-lg shadow p-6 border-l-4 cursor-pointer ${
                announcement.read ? 'border-gray-300' : 'border-blue-500'
              }`}
              onClick={() => markAnnouncementAsRead(announcement.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                <div className="flex items-center space-x-2">
                  {!announcement.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                  <span className="text-sm text-gray-500">{announcement.createdAt}</span>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{announcement.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">By {announcement.author}</span>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {announcement.targetRole === 'all' ? 'All Members' : 'Club Members'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No announcements available</p>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'notifications') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 cursor-pointer ${
                notification.read ? 'border-gray-300' : 'border-blue-500'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {!notification.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{notification.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
        
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No notifications</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      <p className="text-gray-600 mt-2">Settings panel coming soon</p>
    </div>
  );
};

export default ClubMemberDashboard;
