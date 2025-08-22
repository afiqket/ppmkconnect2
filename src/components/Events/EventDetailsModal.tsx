import React from 'react';
import { X, Calendar, Clock, MapPin, Users, User, Award, CheckCircle, AlertCircle, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { Event } from '../../types';
import { mockUsers } from '../../data/mockData';

interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose }) => {
  const { user } = useAuth();
  const { rsvpToEvent, cancelRSVP, getUserRSVPs, canRSVPToEvent, getEventAttendees, getAttendeeCount, canManageEvents } = useEvents();
  
  if (!event) {
    return null;
  }

  const userRSVPs = getUserRSVPs();
  const hasRSVP = userRSVPs.includes(event.id);
  const canRSVP = canRSVPToEvent(event);
  const attendees = getEventAttendees(event.id);
  const attendeeCount = getAttendeeCount(event.id);
  const isUpcoming = new Date(event.date) > new Date();
  const isAtCapacity = event.maxAttendees && attendeeCount >= event.maxAttendees;
  const canManage = canManageEvents();

  const handleRSVP = () => {
    if (hasRSVP) {
      cancelRSVP(event.id);
    } else {
      rsvpToEvent(event.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  // Get attendee details from mock users
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
    // Fallback for unknown attendees
    return {
      name: `User ${attendeeId.slice(-4)}`,
      role: 'member',
      clubName: '',
      avatar: null
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 object-cover rounded-t-xl"
            />
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg transition-all"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="flex items-center space-x-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(event.type)}`}>
                {event.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {isUpcoming ? 'Upcoming' : 'Past Event'}
              </span>
              {event.clubName && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {event.clubName}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white">{event.title}</h1>
          </div>
        </div>

        <div className="p-6">
          {/* RSVP Status */}
          {hasRSVP && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-900">You're attending this event!</h3>
                  <p className="text-sm text-green-700">We'll send you reminders and updates.</p>
                </div>
              </div>
            </div>
          )}

          {/* Capacity Warning */}
          {isAtCapacity && !hasRSVP && isUpcoming && canRSVP && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-medium text-yellow-900">Event is at capacity</h3>
                  <p className="text-sm text-yellow-700">This event has reached its maximum number of attendees.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">About This Event</h2>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>

              {/* Agenda */}
              {event.agenda && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Agenda</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-gray-700 whitespace-pre-wrap font-sans">{event.agenda}</pre>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {event.requirements && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-900">{event.requirements}</p>
                  </div>
                </div>
              )}

              {/* Attendees - Only show to HiCom and organizers */}
              {(canManage || event.organizerId === user?.id) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <UserCheck className="h-5 w-5 mr-2" />
                    Attendees ({attendeeCount})
                  </h3>
                  {attendeeCount > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {attendees.map((attendeeId, index) => {
                        const attendeeDetails = getAttendeeDetails(attendeeId);
                        
                        return (
                          <div key={attendeeId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            {attendeeDetails.avatar ? (
                              <img
                                src={attendeeDetails.avatar}
                                alt={attendeeDetails.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {attendeeDetails.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{attendeeDetails.name}</div>
                              <div className="text-sm text-gray-500 capitalize">
                                {attendeeDetails.role.replace('_', ' ')}
                                {attendeeDetails.clubName && ` • ${attendeeDetails.clubName}`}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No attendees yet</p>
                      <p className="text-sm text-gray-400">RSVPs will appear here</p>
                    </div>
                  )}
                </div>
              )}

              {/* Public Attendee Count for Members */}
              {!canManage && event.organizerId !== user?.id && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Attendance ({attendeeCount})
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {attendeeCount} {attendeeCount === 1 ? 'person is' : 'people are'} attending this event
                    </p>
                    {event.maxAttendees && (
                      <p className="text-sm text-gray-500 mt-1">
                        {event.maxAttendees - attendeeCount} spots remaining
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{formatDate(event.date)}</div>
                      <div className="text-sm text-gray-600">{formatTime(event.date)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Location</div>
                      <div className="text-sm text-gray-600">{event.location}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Capacity</div>
                      <div className="text-sm text-gray-600">
                        {attendeeCount}{event.maxAttendees ? ` / ${event.maxAttendees}` : ''} attendees
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizer */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizer</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {event.organizerName?.split(' ').map(n => n[0]).join('') || 'O'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{event.organizerName || 'Event Organizer'}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {event.organizerRole?.replace('_', ' ') || 'Organizer'}
                    </div>
                  </div>
                </div>
              </div>

              {/* RSVP Button */}
              {canRSVP && isUpcoming && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <button
                    onClick={handleRSVP}
                    disabled={!hasRSVP && isAtCapacity}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      hasRSVP
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : isAtCapacity
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {hasRSVP ? 'Cancel RSVP' : isAtCapacity ? 'Event Full' : 'RSVP to Event'}
                  </button>
                  
                  {!hasRSVP && !isAtCapacity && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Click to confirm your attendance
                    </p>
                  )}
                </div>
              )}

              {/* Event Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total RSVPs</span>
                    <span className="font-medium text-gray-900">{attendeeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Event Type</span>
                    <span className="font-medium text-gray-900 capitalize">{event.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created</span>
                    <span className="font-medium text-gray-900">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {event.maxAttendees && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Availability</span>
                      <span className={`font-medium ${isAtCapacity ? 'text-red-600' : 'text-green-600'}`}>
                        {isAtCapacity ? 'Full' : `${event.maxAttendees - attendeeCount} spots left`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
