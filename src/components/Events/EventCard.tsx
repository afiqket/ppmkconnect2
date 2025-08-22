import React from 'react';
import { Calendar, Clock, MapPin, Users, User, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onViewDetails: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  const { user } = useAuth();
  const { rsvpToEvent, cancelRSVP, getUserRSVPs, canRSVPToEvent, getAttendeeCount } = useEvents();

  const userRSVPs = getUserRSVPs();
  const hasRSVP = userRSVPs.includes(event.id);
  const canRSVP = canRSVPToEvent(event);
  const attendeeCount = getAttendeeCount(event.id);
  const isUpcoming = new Date(event.date) > new Date();
  const isAtCapacity = event.maxAttendees && attendeeCount >= event.maxAttendees;

  const handleRSVP = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasRSVP) {
      cancelRSVP(event.id);
    } else {
      rsvpToEvent(event.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'seminar': return 'bg-purple-100 text-purple-800';
      case 'competition': return 'bg-red-100 text-red-800';
      case 'social': return 'bg-green-100 text-green-800';
      case 'meeting': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
      onClick={() => onViewDetails(event)}
    >
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
              {event.type}
            </span>
            {event.clubName && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {event.clubName}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">{formatDate(event.date)}</div>
            <div className="text-sm text-gray-600">{formatTime(event.date)}</div>
          </div>
        </div>

        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            {event.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            {attendeeCount} {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} attendees
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            {event.organizerName}
          </div>
        </div>

        {/* RSVP Status and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {hasRSVP && (
              <div className="flex items-center text-green-600 text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                You're attending
              </div>
            )}
            {!isUpcoming && (
              <span className="text-gray-500 text-sm">Past event</span>
            )}
            {isAtCapacity && !hasRSVP && isUpcoming && (
              <div className="flex items-center text-red-600 text-sm">
                <XCircle className="h-4 w-4 mr-1" />
                Event full
              </div>
            )}
          </div>

          {/* RSVP Button */}
          {canRSVP && isUpcoming && (
            <button
              onClick={handleRSVP}
              disabled={!hasRSVP && isAtCapacity}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                hasRSVP
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : isAtCapacity
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {hasRSVP ? 'Cancel RSVP' : isAtCapacity ? 'Full' : 'RSVP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
