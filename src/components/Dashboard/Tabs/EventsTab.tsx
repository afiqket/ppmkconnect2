import React, { useState } from 'react';
import { useEvents } from '../../../contexts/EventContext';
import { Calendar, Clock, MapPin, Users, Search, Filter, ChevronDown } from 'lucide-react';

interface EventsTabProps {
  userRole: string;
}

const EventsTab: React.FC<EventsTabProps> = ({ userRole }) => {
  const { events } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || event.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) > new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.date) <= new Date());

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meeting':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'social':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'competition':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleEventAction = (eventId: string, action: 'register' | 'attend') => {
    console.log(`${action} for event:`, eventId);
    // Handle event action logic
  };

  const EventCard: React.FC<{ event: any; isPast?: boolean }> = ({ event, isPast = false }) => (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${isPast ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(event.type)}`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{event.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(event.date).toLocaleDateString()}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          {event.time}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-2" />
          {event.location}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-2" />
          {event.attendees} attendees
        </div>
        
        {!isPast && userRole === 'ppmk_member' && (
          <button
            onClick={() => handleEventAction(event.id, 'register')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Register
          </button>
        )}
        
        {!isPast && userRole === 'club_member' && (
          <button
            onClick={() => handleEventAction(event.id, 'attend')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Mark Attendance
          </button>
        )}

        {isPast && (
          <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
            Completed
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Events</h1>
        <p className="text-gray-600">
          {userRole === 'club_member' 
            ? 'Manage event attendance and view club events.'
            : 'Discover and register for upcoming events.'}
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
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
              <option value="workshop">Workshop</option>
              <option value="meeting">Meeting</option>
              <option value="social">Social</option>
              <option value="competition">Competition</option>
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
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Events</h2>
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        </div>
      )}

      {/* No Events */}
      {filteredEvents.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'There are no events scheduled at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
