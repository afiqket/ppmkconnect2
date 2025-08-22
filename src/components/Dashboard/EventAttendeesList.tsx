import React, { useState } from 'react';
import { Users, Calendar, Clock, MapPin, UserCheck, Eye, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { mockUsers } from '../../data/mockData';
import EventDetailsModal from '../Events/EventDetailsModal';

const EventAttendeesList: React.FC = () => {
  const { user } = useAuth();
  const { events, canManageEvents, getEventAttendees, getAttendeeCount } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const canManage = canManageEvents();

  // Filter events based on user role and search
  const visibleEvents = events.filter(event => {
    // Role-based filtering
    if (!canManage && event.organizerId !== user?.id) {
      return false;
    }

    // Search filtering
    if (searchTerm) {
      return event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
             event.location.toLowerCase().includes(searchTerm.toLowerCase());
    }

    return true;
  });

  const upcomingEvents = visibleEvents.filter(event => new Date(event.date) > new Date());
  const pastEvents = visibleEvents.filter(event => new Date(event.date) <= new Date());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-MY', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAttendeeDetails = (attendeeId: string) => {
    const attendeeUser = mockUsers.find(u => u.id === attendeeId);
    if (attendeeUser) {
      return {
        name: attendeeUser.name,
        role: attendeeUser.role,
        clubName: attendeeUser.clubName,
        avatar: attendeeUser.avatar
      };
    }
    return {
      name: `User ${attendeeId.slice(-4)}`,
      role: 'member',
      clubName: '',
      avatar: null
    };
  };

  const EventItem = ({ event, isPast = false }: { event: any; isPast?: boolean }) => {
    const attendees = getEventAttendees(event.id);
    const attendeeCount = getAttendeeCount(event.id);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                event.type === 'workshop' ? 'bg-blue-100 text-blue-800' :
                event.type === 'seminar' ? 'bg-purple-100 text-purple-800' :
                event.type === 'competition' ? 'bg-red-100 text-red-800' :
                event.type === 'social' ? 'bg-green-100 text-green-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {event.type}
              </span>
              {event.clubName && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  {event.clubName}
                </span>
              )}
              {isPast && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  Past Event
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(event.date)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(event.date)}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {event.location}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setSelectedEvent(event)}
            className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </button>
        </div>

        {/* Attendee Summary */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900 flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              Attendees ({attendeeCount})
            </h4>
            {event.maxAttendees && (
              <span className="text-sm text-gray-600">
                {event.maxAttendees - attendeeCount} spots remaining
              </span>
            )}
          </div>

          {attendeeCount > 0 ? (
            <div className="space-y-2">
              {/* Show first 3 attendees */}
              {attendees.slice(0, 3).map((attendeeId) => {
                const attendeeDetails = getAttendeeDetails(attendeeId);
                
                return (
                  <div key={attendeeId} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    {attendeeDetails.avatar ? (
                      <img
                        src={attendeeDetails.avatar}
                        alt={attendeeDetails.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-xs">
                          {attendeeDetails.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{attendeeDetails.name}</div>
                      <div className="text-xs text-gray-500 capitalize">
                        {attendeeDetails.role.replace('_', ' ')}
                        {attendeeDetails.clubName && ` • ${attendeeDetails.clubName}`}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {attendeeCount > 3 && (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-600">
                    +{attendeeCount - 3} more attendees
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No attendees yet</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please log in to view event attendees</p>
      </div>
    );
  }

  if (!canManage && !events.some(e => e.organizerId === user.id)) {
    return (
      <div className="text-center py-8">
        <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">You don't have permission to view event attendees</p>
        <p className="text-sm text-gray-400">Only HiCom and event organizers can view attendee lists</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Upcoming Events ({upcomingEvents.length})
        </h2>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming events</p>
            <p className="text-sm text-gray-400">Events you organize will appear here</p>
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Past Events ({pastEvents.length})
          </h2>
          <div className="space-y-4">
            {pastEvents.map(event => (
              <EventItem key={event.id} event={event} isPast />
            ))}
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default EventAttendeesList;
