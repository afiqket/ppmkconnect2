import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { Calendar, Clock, MapPin, Users, Search, Filter, Plus, Eye, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import EventModal from './EventModal';
import EventDetailsModal from './EventDetailsModal';
import { Event } from '../../types';

const Events: React.FC = () => {
  const { user } = useAuth();
  const { 
    events, 
    rsvpToEvent, 
    cancelRSVP, 
    deleteEvent, 
    getUserRSVPs,
    canManageEvents,
    canViewEvent 
  } = useEvents();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const userRSVPs = getUserRSVPs();

  const getFilteredEvents = () => {
    return events.filter(event => {
      // Check if user can view this event
      if (!canViewEvent(event)) return false;

      // Filter by search term
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by type
      const matchesType = filterType === 'all' || event.type === filterType;

      // Filter by status
      const now = new Date();
      const eventDate = new Date(event.date);
      const isUpcoming = eventDate > now;
      const isPast = eventDate <= now;
      const hasRSVP = userRSVPs.includes(event.id);

      const matchesStatus = filterStatus === 'all' ||
                           (filterStatus === 'upcoming' && isUpcoming) ||
                           (filterStatus === 'past' && isPast) ||
                           (filterStatus === 'rsvp' && hasRSVP);

      return matchesSearch && matchesType && matchesStatus;
    });
  };

  const filteredEvents = getFilteredEvents();
  const eventTypes = [...new Set(events.map(event => event.type))];

  const handleRSVP = (eventId: string) => {
    if (userRSVPs.includes(eventId)) {
      cancelRSVP(eventId);
    } else {
      rsvpToEvent(eventId);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEvent(eventId);
    }
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
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

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    
    if (eventDate > now) {
      return { status: 'upcoming', color: 'bg-green-100 text-green-800', text: 'Upcoming' };
    } else {
      return { status: 'past', color: 'bg-gray-100 text-gray-800', text: 'Past' };
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">
            Discover and participate in upcoming events ({filteredEvents.length} events)
          </p>
        </div>
        
        {canManageEvents() && (
          <button
            onClick={() => {
              setEditingEvent(null);
              setShowEventModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </button>
        )}
      </div>

      {/* RSVP Summary for regular users */}
      {!canManageEvents() && userRSVPs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-3">Your RSVPs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {userRSVPs.filter(eventId => {
                  const event = events.find(e => e.id === eventId);
                  return event && new Date(event.date) > new Date();
                }).length}
              </div>
              <div className="text-sm text-green-700">Upcoming Events</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{userRSVPs.length}</div>
              <div className="text-sm text-blue-700">Total RSVPs</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {userRSVPs.filter(eventId => {
                  const event = events.find(e => e.id === eventId);
                  return event && new Date(event.date) <= new Date();
                }).length}
              </div>
              <div className="text-sm text-gray-700">Past Events</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Types</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="rsvp">My RSVPs</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const eventStatus = getEventStatus(event);
          const hasRSVP = userRSVPs.includes(event.id);
          const canManage = canManageEvents() && (
            user?.role === 'ppmk_hicom' || 
            (user?.role === 'club_hicom' && event.organizerId === user.id)
          );

          return (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${eventStatus.color}`}>
                    {eventStatus.text}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees?.length || 0} attending</span>
                  </div>
                </div>

                {hasRSVP && (
                  <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-700">
                      <UserCheck className="h-4 w-4" />
                      <span className="text-sm font-medium">You're attending this event</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {/* Management buttons for organizers */}
                  {canManage && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="flex-1 py-2 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}

                  {/* RSVP button for non-organizers */}
                  {!canManage && eventStatus.status === 'upcoming' && (
                    <button
                      onClick={() => handleRSVP(event.id)}
                      className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                        hasRSVP
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {hasRSVP ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      <span>{hasRSVP ? 'Cancel RSVP' : 'RSVP'}</span>
                    </button>
                  )}

                  {/* View Details button */}
                  <button
                    onClick={() => handleViewDetails(event)}
                    className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Check back later for new events.'
            }
          </p>
        </div>
      )}

      {/* Event Modal */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
      />

      {/* Event Details Modal */}
      {showDetailsModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Events;
