import React, { useState } from 'react';
import { useClubs } from '../../contexts/ClubContext';
import { useApplications } from '../../contexts/ApplicationContext';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Users, Calendar, MapPin, Star, Filter, ChevronDown } from 'lucide-react';

const ClubsTab: React.FC = () => {
  const { clubs } = useClubs();
  const { applications, submitApplication } = useApplications();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const userApplications = applications.filter(app => app.applicantId === user?.id);

  const filteredClubs = clubs
    .filter(club => {
      const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          club.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || club.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'members':
          return b.memberCount - a.memberCount;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const categories = [...new Set(clubs.map(club => club.category))];

  const handleApply = async (clubId: string, clubName: string) => {
    if (!user) return;
    
    try {
      await submitApplication({
        clubId,
        clubName,
        applicantId: user.id,
        applicantName: user.name,
        applicantEmail: user.email,
        message: `I would like to join ${clubName}. I'm excited to contribute to the club's activities and goals.`
      });
    } catch (error) {
      console.error('Failed to submit application:', error);
    }
  };

  const getApplicationStatus = (clubId: string) => {
    return userApplications.find(app => app.clubId === clubId)?.status;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Browse Clubs</h1>
        <p className="text-gray-600">Discover and join clubs that match your interests and passions.</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
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

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
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
              <option value="name">Sort by Name</option>
              <option value="members">Sort by Members</option>
              <option value="rating">Sort by Rating</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.length > 0 ? (
          filteredClubs.map((club) => {
            const applicationStatus = getApplicationStatus(club.id);
            
            return (
              <div key={club.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{club.name}</h3>
                    <p className="text-blue-100">{club.category}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(club.rating)}
                      <span className="text-sm text-gray-600 ml-1">({club.rating})</span>
                    </div>
                    <span className="text-sm text-gray-500">{club.memberCount} members</span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{club.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {club.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Meets {club.meetingSchedule}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {club.memberCount} members
                    </div>
                    
                    {applicationStatus ? (
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        applicationStatus === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : applicationStatus === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1)}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(club.id, club.name)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-12 text-center">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs found</h3>
            <p className="text-gray-600">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'There are no clubs available at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubsTab;
