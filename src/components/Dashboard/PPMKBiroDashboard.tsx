import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAnnouncements } from '../../contexts/AnnouncementContext';
import { useEvents } from '../../contexts/EventContext';
import { useClubs } from '../../contexts/ClubContext';
import { Bell, Users, Calendar, FileText, TrendingUp, Plus, Search, MapPin, Eye } from 'lucide-react';
import CreateAnnouncement from '../Announcements/CreateAnnouncement';
import EventModal from '../Events/EventModal';

interface PPMKBiroDashboardProps {
  activeTab: string;
}

const PPMKBiroDashboard: React.FC<PPMKBiroDashboardProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const { announcements, markAnnouncementAsRead, createAnnouncement } = useAnnouncements();
  const { events } = useEvents();
  const { clubs } = useClubs();
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState<any>(null);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const totalAnnouncements = announcements.length;
  const totalEvents = events.length;
  const totalClubs = clubs.length;

  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAnnouncement = (announcementData: any) => {
    createAnnouncement(announcementData);
  };

  if (activeTab === 'overview') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PPMK Biro Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Clubs</p>
                <p className="text-2xl font-semibold text-gray-900">{totalClubs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Announcements</p>
                <p className="text-2xl font-semibold text-gray-900">{totalAnnouncements}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Events</p>
                <p className="text-2xl font-semibold text-gray-900">{totalEvents}</p>
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

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Announcements</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {announcements.slice(0, 5).map((announcement) => (
                <div key={announcement.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${announcement.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                      <p className="text-sm text-gray-600">Target: {announcement.targetRole}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{announcement.createdAt}</span>
                </div>
              ))}
              {announcements.length === 0 && (
                <p className="text-gray-500 text-center py-4">No announcements yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'clubs') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Club Management</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <div key={club.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={club.image} 
                alt={club.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{club.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{club.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{club.memberCount} members</span>
                  <button
                    onClick={() => setSelectedClub(club)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedClub && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Club Details</h2>
                  <button
                    onClick={() => setSelectedClub(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <img 
                  src={selectedClub.image} 
                  alt={selectedClub.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedClub.name}</h3>
                    <p className="text-gray-600 mt-1">{selectedClub.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Members</span>
                      <p className="font-medium">{selectedClub.memberCount}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Category</span>
                      <p className="font-medium">{selectedClub.category}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'events') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <button
            onClick={() => setShowEventModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.isPublic ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {event.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
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
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {event.clubName}
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
        
        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No events available</p>
          </div>
        )}

        {showEventModal && (
          <EventModal 
            isOpen={showEventModal}
            onClose={() => setShowEventModal(false)} 
          />
        )}
      </div>
    );
  }

  if (activeTab === 'announcements') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <button
            onClick={() => setShowAnnouncementModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </button>
        </div>
        
        <div className="space-y-4">
          {announcements.map((announcement) => (
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
                  Target: {announcement.targetRole === 'all' ? 'All Members' : announcement.targetRole.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {announcements.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No announcements yet</p>
          </div>
        )}

        {showAnnouncementModal && (
          <CreateAnnouncement
            isOpen={showAnnouncementModal}
            onClose={() => setShowAnnouncementModal(false)}
            onSubmit={handleCreateAnnouncement}
          />
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

export default PPMKBiroDashboard;
