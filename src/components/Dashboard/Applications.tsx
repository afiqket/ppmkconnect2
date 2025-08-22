import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApplications } from '../../contexts/ApplicationContext';
import { FileText, User, Calendar, Clock, Filter, Search, CheckCircle, XCircle } from 'lucide-react';

const Applications: React.FC = () => {
  const { user } = useAuth();
  const { 
    applications, 
    getUserApplications, 
    getClubApplications, 
    getUserClubId,
    approveApplication,
    rejectApplication 
  } = useApplications();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Debug logging
  useEffect(() => {
    console.log('Current user:', user);
    console.log('User club ID:', getUserClubId());
    console.log('All applications:', applications);
    if (user?.role === 'club_hicom') {
      const clubId = getUserClubId();
      console.log('Club applications for', clubId, ':', getClubApplications(clubId || ''));
    }
  }, [user, applications, getUserClubId, getClubApplications]);

  const getFilteredApplications = () => {
    let filteredApps = [];

    // Filter applications based on user role
    switch (user?.role) {
      case 'ppmk_member':
        filteredApps = getUserApplications();
        break;
      case 'club_hicom':
        const clubId = getUserClubId();
        console.log('Filtering for club hicom, clubId:', clubId);
        if (clubId) {
          filteredApps = getClubApplications(clubId);
          console.log('Filtered applications:', filteredApps);
        } else {
          filteredApps = [];
        }
        break;
      case 'ppmk_biro':
      case 'ppmk_hicom':
        filteredApps = applications;
        break;
      default:
        filteredApps = [];
    }

    // Apply search and status filters
    return filteredApps.filter(application => {
      const matchesSearch = application.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           application.clubName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || application.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  };

  const filteredApplications = getFilteredApplications();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case 'ppmk_member': return 'My Applications';
      case 'club_hicom': return 'Club Applications';
      case 'ppmk_biro': return 'Member Reports';
      case 'ppmk_hicom': return 'System Management';
      default: return 'Applications';
    }
  };

  const getPageDescription = () => {
    switch (user?.role) {
      case 'ppmk_member': return 'Track your club membership applications';
      case 'club_hicom': return 'Review and manage club membership applications';
      case 'ppmk_biro': return 'Monitor member activities and generate reports';
      case 'ppmk_hicom': return 'Oversee system-wide application management';
      default: return 'Manage applications';
    }
  };

  const handleApprove = (applicationId: string) => {
    approveApplication(applicationId, 'Application approved by club hicom');
  };

  const handleReject = (applicationId: string) => {
    rejectApplication(applicationId, 'Application rejected by club hicom');
  };

  const canReviewApplication = (application: any) => {
    return user?.role === 'club_hicom' && 
           application.status === 'pending' && 
           getUserClubId() === application.clubId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        <p className="text-gray-600 mt-1">{getPageDescription()}</p>
        {user?.role === 'club_hicom' && (
          <div className="text-sm text-blue-600 mt-1">
            <p>Showing applications for your club only</p>
            <p className="text-xs text-gray-500">
              Debug: User ID: {user.id}, Club ID: {getUserClubId()}, Total Apps: {applications.length}, Filtered: {filteredApplications.length}
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.clubName} Application
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{application.applicantName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Applied: {formatDate(application.appliedAt)}</span>
                    </div>
                    {application.reviewedAt && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Reviewed: {formatDate(application.reviewedAt)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Motivation:</h4>
                      <p className="text-gray-700 text-sm">{application.motivation}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Experience:</h4>
                      <p className="text-gray-700 text-sm">{application.experience}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {application.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {application.reviewComments && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Review Comments:</h4>
                        <p className="text-gray-700 text-sm">{application.reviewComments}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {canReviewApplication(application) && (
                <div className="flex space-x-2 ml-4">
                  <button 
                    onClick={() => handleApprove(application.id)}
                    className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button 
                    onClick={() => handleReject(application.id)}
                    className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : user?.role === 'club_hicom' 
                ? 'No applications have been submitted to your club yet.'
                : 'Check back later for new applications.'
            }
          </p>
          {user?.role === 'club_hicom' && (
            <div className="mt-4 text-xs text-gray-400">
              <p>Debug Info:</p>
              <p>User ID: {user.id}</p>
              <p>Club ID: {getUserClubId()}</p>
              <p>Total Applications: {applications.length}</p>
              <p>Applications for your club: {getClubApplications(getUserClubId() || '').length}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Applications;
