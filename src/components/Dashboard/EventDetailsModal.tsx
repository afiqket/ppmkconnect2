import React from 'react';
import { Event } from '../../types';
import { X, Calendar, Clock, MapPin, Users, User, Tag, CheckCircle, AlertCircle, Star } from 'lucide-react';

interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
  onRsvp?: () => void;
  isAttending?: boolean;
  canRsvp?: boolean;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ 
  event, 
  onClose, 
  onRsvp, 
  isAttending = false,
  canRsvp = false 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isFull = event.maxAttendees && event.attendees.length >= event.maxAttendees;
  const spotsLeft = event.maxAttendees ? event.maxAttendees - event.attendees.length : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-gray-800">{event.category}</span>
          </div>
          {isAttending && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              ✓ You're attending
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Title and Status */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-3xl font-bold text-gray-900">{event.title}</h2>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                  event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-4">{event.description}</p>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Date & Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Date & Time</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">{formatDate(event.date)}</div>
                    <div className="text-sm text-gray-600">Event Date</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-gray-900">{event.time}</div>
                    <div className="text-sm text-gray-600">Start Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Organizer */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Location & Organizer</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-gray-900">{event.location}</div>
                    <div className="text-sm text-gray-600">Venue</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <User className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-medium text-gray-900">{event.clubName}</div>
                    <div className="text-sm text-gray-600">Organized by</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendance</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">
                    {event.attendees.length} attendees
                  </span>
                </div>
                {event.maxAttendees && (
                  <div className="text-sm text-gray-600">
                    {spotsLeft !== null && spotsLeft > 0 ? (
                      <span className="text-green-600 font-medium">{spotsLeft} spots left</span>
                    ) : isFull ? (
                      <span className="text-red-600 font-medium">Event Full</span>
                    ) : null}
                  </div>
                )}
              </div>
              
              {event.maxAttendees && (
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min((event.attendees.length / event.maxAttendees) * 100, 100)}%` }}
                  ></div>
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                {event.maxAttendees ? `${event.attendees.length} / ${event.maxAttendees} capacity` : 'Unlimited capacity'}
              </div>
            </div>
          </div>

          {/* Requirements */}
          {event.requirements && event.requirements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
              <div className="space-y-2">
                {event.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span key={index} className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Event Rating */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Rating</h3>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <span className="font-medium text-gray-900">4.8</span>
                <span className="text-sm text-gray-600">(12 reviews)</span>
              </div>
              <p className="text-sm text-gray-600">Based on previous similar events</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            {canRsvp && event.status === 'upcoming' && (
              <button
                onClick={onRsvp}
                disabled={!isAttending && isFull}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  isAttending
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : isFull
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isAttending ? 'Cancel RSVP' : isFull ? 'Event Full' : 'RSVP Now'}
              </button>
            )}
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Share Event
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
