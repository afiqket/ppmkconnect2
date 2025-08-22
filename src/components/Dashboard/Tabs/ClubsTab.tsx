import React, { useState } from 'react';
import { Users, Calendar, MapPin, Search, Filter, Star, UserPlus } from 'lucide-react';

interface ClubsTabProps {
  userRole: string;
}

const ClubsTab: React.FC<ClubsTabProps> = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock clubs data
  const clubs = [
    {
      id: '1',
      name: 'Photography Club',
      description: 'Capture moments, create memories. Join us for photography workshops and photo walks.',
      category: 'Arts',
      members: 45,
      nextEvent: '2024-02-15',
      location: 'Art Building',
      image: 'https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg?auto=compress&cs=tinysrgb&w=400',
      isJoined: userRole === 'club_member',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Debate Society',
      description: 'Sharpen your argumentative skills and engage in intellectual discussions.',
      category: 'Academic',
      members: 32,
      nextEvent: '2024-02-18',
      location: 'Main Hall',
      image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400',
      isJoined: false,
      rating: 4.6
    },
    {
      id: '3',
      name: 'Environmental Club',
      description: 'Making a difference for our planet through awareness and action.',
      category: 'Social',
      members: 67,
      nextEvent: '2024-02-20',
      location: 'Science Building',
      image: 'https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg?auto=compress&cs=tinysrgb&w=400',
      isJoined: false,
      rating: 4.9
    },
    {
      id: '4',
      name: 'Tech Innovation Hub',
      description: 'Explore cutting-edge technology and build innovative solutions.',
      category: 'Technology',
      members: 89,
      nextEvent: '2024-02-22',
      location: 'Computer Lab',
      image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
      isJoined: userRole === 'club_member',
      rating: 4.7
    },
    {
      id: '5',
      name: 'Cultural Dance Group',
      description: 'Celebrate diversity through traditional and modern dance forms.',
      category: 'Arts',
      members: 28,
      nextEvent: '2024-02-25',
      location: 'Dance Studio',
      image: 'https://images.pexels.com/photos/1701194/pexels-photo-1701194.jpeg?auto=compress&cs=tinysrgb&w=400',
      isJoined: false,
      rating: 4.5
    },
    {
      id: '6',
      name: 'Business Club',
      description: 'Network with future entrepreneurs and learn business fundamentals.',
      category: 'Academic',
      members: 54,
      nextEvent: '2024-02-28',
      location: 'Business Building',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
      isJoined: false,
      rating: 4.4
    }
  ];

  const categories = ['all', 'Arts', 'Academic', 'Social', 'Technology', 'Sports'];

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || club.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinClub = (clubId: string) => {
    console.log('Joining club:', clubId);
    // Handle join club logic
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Clubs</h1>
        <p className="text-gray-600">
          {userRole === 'club_member' 
            ? 'Discover new clubs and manage your memberships.'
            : 'Explore and join clubs that match your interests.'}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => (
          <div key={club.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <img
                src={club.image}
                alt={club.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                  {club.category}
                </span>
              </div>
              {club.isJoined && (
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Joined
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{club.name}</h3>
                <div className="flex items-center space-x-1">
                  {renderStars(club.rating)}
                  <span className="text-sm text-gray-600 ml-1">{club.rating}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                {club.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {club.members} members
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Next event: {new Date(club.nextEvent).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {club.location}
                </div>
              </div>

              {!club.isJoined && userRole === 'ppmk_member' && (
                <button
                  onClick={() => handleJoinClub(club.id)}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Club
                </button>
              )}

              {club.isJoined && (
                <div className="w-full flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                  <Users className="h-4 w-4 mr-2" />
                  Member
                </div>
              )}

              {userRole !== 'ppmk_member' && (
                <div className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                  <Filter className="h-4 w-4 mr-2" />
                  View Details
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredClubs.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs found</h3>
          <p className="text-gray-600">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No clubs are available at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClubsTab;
