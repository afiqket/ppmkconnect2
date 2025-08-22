import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAnnouncements } from '../../contexts/AnnouncementContext';
import { Bell, BellOff, Calendar, User, Filter, Search, Plus, RefreshCw } from 'lucide-react';
import CreateAnnouncement from './CreateAnnouncement';

const Announcements: React.FC = () => {
  const { user } = useAuth();
  const { 
    readAnnouncements, 
    markAsRead, 
    markAsUnread, 
    announcements, 
    addAnnouncement,
    refreshAnnouncements 
  } = useAnnouncements();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh announcements periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAnnouncements();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [refreshAnnouncements]);

  const getFilteredAnnouncements = () => {
    return announcements.filter(announcement => {
      // Filter by target audience
      const isTargeted = announcement.targetAudience === 'all' || 
                        announcement.targetAudience === user?.role ||
                        (announcement.targetAudience === 'club_members' && 
                         (user?.role === 'club_member' || user?.role === 'club_hicom') &&
                         announcement.clubIds?.includes(user?.clubId)) ||
                        (announcement.targetAudience === 'selected_clubs' && 
                         announcement.clubIds?.includes(user?.clubId));

      // Filter by search term
      const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           announcement.content.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by type
      const matchesType = filterType === 'all' || announcement.type === filterType;

      // Filter by read status
      const isRead = readAnnouncements.includes(announcement.id);
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'read' && isRead) ||
                           (filterStatus === 'unread' && !isRead);

      return isTargeted && matchesSearch && matchesType && matchesStatus;
    });
  };

  const filteredAnnouncements = getFilteredAnnouncements();

  const handleToggleRead = (announcementId: string) => {
    if (readAnnouncements.includes(announcementId)) {
      markAsUnread(announcementId);
    } else {
      markAsRead(announcementId);
    }
  };

  const handleCreateAnnouncement = (newAnnouncement: any) => {
    addAnnouncement(newAnnouncement);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshAnnouncements();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'club': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'event': return Calendar;
      case 'urgent': return Bell;
      default: return Bell;
    }
  };

  const canCreateAnnouncements = user?.role === 'ppmk_hicom' || user?.role === 'club_hicom';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with the latest news and updates ({announcements.length} total)
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh announcements"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          
          {canCreateAnnouncements && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Announcement</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 font-medium">
            Real-time sync active • Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="general">General</option>
              <option value="event">Event</option>
              <option value="urgent">Urgent</option>
              <option value="club">Club</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => {
          const isRead = readAnnouncements.includes(announcement.id);
          const TypeIcon = getTypeIcon(announcement.type);

          return (
            <div
              key={announcement.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all ${
                !isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-lg ${!isRead ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <TypeIcon className={`h-6 w-6 ${!isRead ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-lg font-semibold ${!isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {announcement.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(announcement.type)}`}>
                        {announcement.type}
                      </span>
                      {!isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{announcement.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(announcement.createdAt)}</span>
                      </div>
                    </div>

                    <p className={`text-gray-700 leading-relaxed ${!isRead ? 'font-medium' : ''}`}>
                      {announcement.content}
                    </p>

                    {announcement.targetAudience !== 'all' && (
                      <div className="mt-3 text-sm text-gray-500">
                        <span className="font-medium">Target:</span> {
                          announcement.targetAudience === 'ppmk_member' ? 'PPMK Members' :
                          announcement.targetAudience === 'club_member' ? 'Club Members' :
                          announcement.targetAudience === 'club_hicom' ? 'Club HiCom' :
                          announcement.targetAudience === 'ppmk_biro' ? 'PPMK Biro' :
                          announcement.targetAudience === 'ppmk_hicom' ? 'PPMK HiCom' :
                          announcement.targetAudience === 'club_members' ? 'Club Members' :
                          announcement.targetAudience === 'selected_clubs' ? 'Selected Clubs' :
                          'All Users'
                        }
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleRead(announcement.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    isRead 
                      ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' 
                      : 'text-blue-600 hover:text-blue-700 hover:bg-blue-100'
                  }`}
                  title={isRead ? 'Mark as unread' : 'Mark as read'}
                >
                  {isRead ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAnnouncements.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Check back later for new announcements.'
            }
          </p>
        </div>
      )}

      {/* Create Announcement Modal */}
      <CreateAnnouncement
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateAnnouncement}
      />
    </div>
  );
};

export default Announcements;
