import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import EventDetailsModal from '../Events/EventDetailsModal';

const RSVPEventsList: React.FC = () => {
  const { user } = useAuth();
  const { events, getUserRSVPs, cancelRSVP } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const userRSVPs = getUserRSVPs();
  const rsvpEvents = events.filter(event => userRSVPs.includes(event.id));

  const upcomingEvents = rsvpEvents.filter(event => new Date(event.date) > new Date());
  const pastEvents = rsvpEvents.filter(event => new Date(event.date) <= new Date());

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

  const handleCancelRSVP = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    cancelRSVP(eventId);
  };

  const EventItem = ({ event, isPast = false }: { event: any; isPast?: boolean }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
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
            <div className="flex items-center text-green-600 text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              RSVP'd
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-1">{event.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
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
        
        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={() => setSelectedEvent(event)}
            className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </button>
          {!isPast && (
            <button
              onClick={(e) => handleCancelRSVP(event.id, e)}
              className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please log in to view your RSVPs</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <p className="text-sm text-gray-400">RSVP to events to see them here</p>
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

export default RSVPEventsList;
