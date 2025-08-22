import React, { useState } from 'react';
import { useAnnouncements } from '../../../contexts/AnnouncementContext';
import { Search, Filter, Calendar, User, ChevronDown, Bell, BellOff, Plus } from 'lucide-react';

const AnnouncementsTab: React.FC = () => {
  const { announcements, markAsRead, markAsUnread } = useAnnouncements();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredAnnouncements = announcements
    .filter(announcement => {
      const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || announcement.type === filterType;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'read' && announcement.read) ||
                           (filterStatus === 'unread' && !announcement.read);
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  const handleAnnouncementClick = (announcementId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(announcementId);
    }
  };

  const handleToggleRead = (announcementId: string, isRead: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isRead) {
      markAsUnread(announcementId);
    } else {
      markAsRead(announcementId);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'event':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'general':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'club':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Announcements</h1>
            <p className="text-gray-600">Stay updated with the latest news and updates from your clubs</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              {announcements.filter(a => !a.read).length} unread
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter by Type */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="urgent">Urgent</option>
              <option value="event">Event</option>
              <option value="general">General</option>
              <option value="club">Club</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter by Status */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              onClick={() => handleAnnouncementClick(announcement.id, announcement.read)}
              className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${
                !announcement.read ? 'border-l-4 border-blue-500 bg-blue-50/30' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(announcement.type)}`}>
                    {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                  </span>
                  {!announcement.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(announcement.createdAt)}
                  </div>
                  <button
                    onClick={(e) => handleToggleRead(announcement.id, announcement.read, e)}
                    className={`p-1 rounded transition-colors ${
                      announcement.read 
                        ? 'text-gray-400 hover:text-gray-600' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                    title={announcement.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {announcement.read ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <h3 className={`text-lg font-semibold mb-2 ${!announcement.read ? 'text-gray-900' : 'text-gray-700'}`}>
                {announcement.title}
              </h3>

              <p className={`text-gray-600 mb-4 line-clamp-3 ${!announcement.read ? 'font-medium' : ''}`}>
                {announcement.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  {announcement.authorName}
                </div>
                {announcement.clubName && (
                  <span className="text-sm text-blue-600 font-medium">
                    {announcement.clubName}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'There are no announcements at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsTab;
