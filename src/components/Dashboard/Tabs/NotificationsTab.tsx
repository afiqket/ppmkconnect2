import React, { useState } from 'react';
import { useNotifications } from '../../../contexts/NotificationContext';
import { Bell, Check, Trash2, Filter, Search } from 'lucide-react';

const NotificationsTab: React.FC = () => {
  const { notifications, markAsRead, deleteNotification, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotifications = notifications
    .filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || 
                          (filter === 'unread' && !notification.isRead) ||
                          (filter === 'read' && notification.isRead);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'application':
        return '📝';
      case 'event':
        return '📅';
      case 'announcement':
        return '📢';
      case 'system':
        return '⚙️';
      default:
        return '🔔';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'bg-blue-100 text-blue-800';
      case 'event':
        return 'bg-green-100 text-green-800';
      case 'announcement':
        return 'bg-purple-100 text-purple-800';
      case 'system':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'unread', 'read'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm p-6 transition-all ${
                !notification.isRead ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-2xl">{getTypeIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className={`mb-3 ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You\'re all caught up! No notifications at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsTab;
