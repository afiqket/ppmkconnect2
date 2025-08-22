import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApplications } from '../../contexts/ApplicationContext';
import { mockClubs } from '../../data/mockData';
import { Users, Calendar, Award, Search, Filter, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import ClubApplicationModal from './ClubApplicationModal';
import ClubDetailsModal from './ClubDetailsModal';
import { Club } from '../../types';

const Clubs: React.FC = () => {
  const { user } = useAuth();
  const { hasAppliedToClub, getUserApplications } = useApplications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const userApplications = getUserApplications();

  const getFilteredClubs = () => {
    return mockClubs.filter(club => {
      const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           club.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || club.category === filterCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const filteredClubs = getFilteredClubs();
  const categories = [...new Set(mockClubs.map(club => club.category))];

  const handleJoinClub = (club: Club) => {
    if (user?.role !== 'ppmk_member') {
      alert('Only PPMK Members can apply to join clubs.');
      return;
    }

    if (hasAppliedToClub(club.id)) {
      alert('You have already applied to this club. Please wait for the review process to complete.');
      return;
    }

    setSelectedClub(club);
    setShowApplicationModal(true);
  };

  const handleViewDetails = (club: Club) => {
    setSelectedClub(club);
    setShowDetailsModal(true);
  };

  const getApplicationStatus = (clubId: string) => {
    const application = userApplications.find(app => app.clubId === clubId);
    return application?.status;
  };

  const getApplicationStatusInfo = (status: string | undefined) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: 'Application Pending',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          text: 'Application Approved',
          color: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'rejected':
        return {
          icon: XCircle,
          text: 'Application Rejected',
          color: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return null;
    }
  };

  const getButtonText = (club: Club) => {
    if (user?.role === 'club_hicom') {
      return 'Manage Club';
    }
    
    if (user?.role === 'ppmk_member') {
      const status = getApplicationStatus(club.id);
      if (status === 'pending') return 'Application Pending';
      if (status === 'approved') return 'Already Member';
      if (status === 'rejected') return 'Apply Again';
      return 'Join Club';
    }
    
    return 'View Club';
  };

  const getButtonStyle = (club: Club) => {
    if (user?.role === 'ppmk_member') {
      const status = getApplicationStatus(club.id);
      if (status === 'pending') {
        return 'bg-yellow-600 text-white cursor-not-allowed';
      }
      if (status === 'approved') {
        return 'bg-green-600 text-white cursor-not-allowed';
      }
    }
    return 'bg-blue-600 text-white hover:bg-blue-700';
  };

  const isButtonDisabled = (club: Club) => {
    if (user?.role === 'ppmk_member') {
      const status = getApplicationStatus(club.id);
      return status === 'pending' || status === 'approved';
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === 'club_hicom' ? 'Club Management' : 'Browse Clubs'}
        </h1>
        <p className="text-gray-600 mt-1">
          {user?.role === 'club_hicom' 
            ? 'Manage your club and engage with members'
            : user?.role === 'ppmk_member'
            ? 'Discover clubs that match your interests and apply to join'
            : 'Discover clubs that match your interests'
          }
        </p>
      </div>

      {/* Application Status Summary for PPMK Members */}
      {user?.role === 'ppmk_member' && userApplications.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-3">Your Applications</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {userApplications.filter(app => app.status === 'pending').length}
              </div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {userApplications.filter(app => app.status === 'approved').length}
              </div>
              <div className="text-sm text-green-700">Approved</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {userApplications.filter(app => app.status === 'rejected').length}
              </div>
              <div className="text-sm text-red-700">Rejected</div>
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
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => {
          const applicationStatus = getApplicationStatus(club.id);
          const statusInfo = getApplicationStatusInfo(applicationStatus);

          return (
            <div key={club.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <img
                src={club.image}
                alt={club.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {club.category}
                  </span>
                  <span className="text-sm text-gray-500">Est. {club.establishedYear}</span>
                </div>

                {/* Application Status Badge */}
                {statusInfo && (
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border mb-3 ${statusInfo.color}`}>
                    <statusInfo.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{statusInfo.text}</span>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{club.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{club.description}</p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>{club.memberCount} members</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span>HiCom: {club.hicomName}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Activities:</h4>
                  <div className="flex flex-wrap gap-1">
                    {club.activities.slice(0, 3).map((activity, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {activity}
                      </span>
                    ))}
                    {club.activities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        +{club.activities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <button 
                    onClick={() => handleJoinClub(club)}
                    disabled={isButtonDisabled(club)}
                    className={`w-full py-2 px-4 rounded-lg transition-colors ${getButtonStyle(club)}`}
                  >
                    {getButtonText(club)}
                  </button>
                  
                  <button
                    onClick={() => handleViewDetails(club)}
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

      {filteredClubs.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs found</h3>
          <p className="text-gray-600">
            {searchTerm || filterCategory !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Check back later for new clubs.'
            }
          </p>
        </div>
      )}

      {/* Club Application Modal */}
      {showApplicationModal && selectedClub && (
        <ClubApplicationModal
          club={selectedClub}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedClub(null);
          }}
        />
      )}

      {/* Club Details Modal */}
      {showDetailsModal && selectedClub && (
        <ClubDetailsModal
          club={selectedClub}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedClub(null);
          }}
        />
      )}
    </div>
  );
};

export default Clubs;
