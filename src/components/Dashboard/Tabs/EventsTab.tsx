import React from 'react';
import { Calendar, Clock, MapPin, Users, Filter } from 'lucide-react';

const EventsTab: React.FC = () => {
  const events = [
    {
      id: '1',
      title: 'Photography Workshop',
      description: 'Learn advanced photography techniques with professional photographers',
      date: '2024-01-15',
      time: '14:00',
      location: 'Art Studio, Block A',
      attendees: 25,
      maxAttendees: 30,
      club: 'Photography Club',
      type: 'workshop',
      image: 'https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Debate Championship',
      description: 'Annual inter-club debate competition on current affairs',
      date: '2024-01-18',
      time: '19:00',
      location: 'Main Auditorium',
      attendees: 120,
      maxAttendees: 150,
      club: 'Debate Society',
      type: 'competition',
      image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Music Concert',
      description: 'Evening of classical and contemporary music performances',
      date: '2024-01-20',
      time: '20:00',
      location: 'Concert Hall',
      attendees: 85,
      maxAttendees: 100,
      club: 'Music Club',
      type: 'performance',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '4',
      title: 'Tech Innovation Summit',
      description: 'Showcase of student tech projects and startup ideas',
      date: '2024-01-22',
      time: '09:00',
      location: 'Innovation Lab',
      attendees: 45,
      maxAttendees: 60,
      club: 'Tech Innovation',
      type: 'conference',
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workshop':
        return 'bg-blue-100 text-blue-800';
      case 'competition':
        return 'bg-red-100 text-red-800';
      case 'performance':
        return 'bg-purple-100 text-purple-800';
      case 'conference':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Events</h1>
            <p className="text-gray-600">Discover and participate in exciting club events</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter Events</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-600">This Week</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">28</p>
            <p className="text-sm text-gray-600">This Month</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">5</p>
            <p className="text-sm text-gray-600">Registered</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">3</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(event.type)}`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 mt-2">{event.title}</h3>
                    <p className="text-sm text-blue-600 font-medium">{event.club}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{event.attendees}/{event.maxAttendees} attendees</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Register
                  </button>
                </div>

                {/* Progress bar for attendance */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsTab;
