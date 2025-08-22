import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useClubs } from '../../contexts/ClubContext';
import { useEvents } from '../../contexts/EventContext';
import { useApplications } from '../../contexts/ApplicationContext';
import { 
  Users, 
  Calendar, 
  Award, 
  Settings, 
  UserPlus, 
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  TrendingUp,
  Star
} from 'lucide-react';
import EventDetailsModal from '../Events/EventDetailsModal';
import { Event } from '../../types';

const MyClubs: React.FC = () => {
  const { user } = useAuth();
  const { getUserClub } = useClubs();
  const { events } = useEvents();
  const { getUserApplications } = useApplications();
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const userClub = getUserClub();
  const userApplications = getUserApplications();
  
  // Get club-specific events
  const clubEvents = events.filter(event => event.clubId === user?.clubId);
  const upcomingEvents = clubEvents.filter(event => new Date(event.date) > new Date());
  const pastEvents = clubEvents.filter(event => new Date(event.date) <= new Date());

  // Get recent applications for the club (if user is HiCom)
  const clubApplications = user?.role === 'club_hicom' 
    ? userApplications.filter(app => app.clubId === user.clubId)
    : [];

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  if (!userClub) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Clubs</h1>
          <p className="text-gray-600 mt-1">Manage your club affairs and activities</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Club Membership</h3>
          <p className="text-gray-600 mb-4">
            You are not currently a member of any club. Join a club to access club-specific features.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Browse Available Clubs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Clubs</h1>
        <p className="text-gray-600 mt-1">
          {user?.role === 'club_hicom' 
            ? 'Manage your club and engage with members'
            : 'Stay connected with your club activities and events'
          }
        </p>
      </div>

      {/* Club Overview Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-sm text-white overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{userClub.name}</h2>
              <p className="text-blue-100 mt-1">{userClub.category} • Est. {userClub.establishedYear}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{userClub.memberCount}</div>
              <div className="text-blue-100 text-sm">Members</div>
            </div>
          </div>
          
          <p className="text-blue-100 mb-4">{userClub.description}</p>
          
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4" />
              <span>HiCom: {userClub.hicomName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Your Role: {user?.role === 'club_hicom' ? 'HiCom' : 'Member'}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-black bg-opacity-20 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-100">Club Status: Active</span>
            {user?.role === 'club_hicom' && (
              <button className="flex items-center space-x-2 text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors">
                <Settings className="h-4 w-4" />
                <span>Manage Club</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{upcomingEvents.length}</div>
              <div className="text-sm text-gray-600">Upcoming Events</div>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{pastEvents.length}</div>
              <div className="text-sm text-gray-600">Past Events</div>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">{userClub.activities.length}</div>
              <div className="text-sm text-gray-600">Activities</div>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        {user?.role === 'club_hicom' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{clubApplications.length}</div>
                <div className="text-sm text-gray-600">Applications</div>
              </div>
              <UserPlus className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        )}
      </div>

      {/* Club Activities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Club Activities</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {userClub.activities.map((activity, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-sm font-medium text-gray-900">{activity}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                    <span>{event.location}</span>
                    <span className="capitalize">{event.type}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleViewEvent(event)}
                  className="ml-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
              </div>
            ))}
          </div>
          
          {upcomingEvents.length > 3 && (
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All Events ({upcomingEvents.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Recent Applications (HiCom only) */}
      {user?.role === 'club_hicom' && clubApplications.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            <UserPlus className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {clubApplications.slice(0, 3).map((application) => {
              const getStatusIcon = (status: string) => {
                switch (status) {
                  case 'pending':
                    return <Clock className="h-4 w-4 text-yellow-600" />;
                  case 'approved':
                    return <CheckCircle className="h-4 w-4 text-green-600" />;
                  case 'rejected':
                    return <XCircle className="h-4 w-4 text-red-600" />;
                  default:
                    return <Clock className="h-4 w-4 text-gray-400" />;
                }
              };

              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'pending':
                    return 'bg-yellow-100 text-yellow-800';
                  case 'approved':
                    return 'bg-green-100 text-green-800';
                  case 'rejected':
                    return 'bg-red-100 text-red-800';
                  default:
                    return 'bg-gray-100 text-gray-800';
                }
              };

              return (
                <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{application.applicantName}</h4>
                    <p className="text-sm text-gray-600 mt-1">{application.applicantEmail}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Applied: {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="capitalize">{application.status}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          {clubApplications.length > 3 && (
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All Applications ({clubApplications.length})
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Calendar className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">View All Events</div>
              <div className="text-sm text-gray-600">Browse club events</div>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <MessageSquare className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Club Discussion</div>
              <div className="text-sm text-gray-600">Join conversations</div>
            </div>
          </button>
          
          {user?.role === 'club_hicom' && (
            <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Settings className="h-6 w-6 text-purple-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Club Settings</div>
                <div className="text-sm text-gray-600">Manage club details</div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default MyClubs;
