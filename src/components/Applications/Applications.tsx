import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApplications } from '../../contexts/ApplicationContext';
import { useClubs } from '../../contexts/ClubContext';
import { FileText, Clock, CheckCircle, XCircle, User, Calendar, Search, Filter, Eye, Check, X } from 'lucide-react';
import ApplicationModal from './ApplicationModal';
import { Application } from '../../types';

const Applications: React.FC = () => {
  const { user } = useAuth();
  const { applications, approveApplication, rejectApplication } = useApplications();
  const { clubs } = useClubs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClub, setFilterClub] = useState('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const getFilteredApplications = () => {
    let filteredApps = applications;

    // Filter by user role
    if (user?.role === 'ppmk_member') {
      // PPMK Members see only their own applications
      filteredApps = applications.filter(app => app.userId === user.id);
    } else if (user?.role === 'club_hicom') {
      // Club HiCom sees only applications for their club
      const userClubId = clubs.find(club => 
        club.hicomName === user.name || 
        club.hicomEmail === user.email
      )?.id;
      
      if (userClubId) {
        filteredApps = applications.filter(app => app.clubId === userClubId);
      } else {
        filteredApps = [];
      }
    }
    // PPMK HiCom and PPMK Biro can see all applications

    // Apply search filter
    if (searchTerm) {
      filteredApps = filteredApps.filter(app =>
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filteredApps = filteredApps.filter(app => app.status === filterStatus);
    }

    // Apply club filter
    if (filterClub !== 'all') {
      filteredApps = filteredApps.filter(app => app.clubId === filterClub);
    }

    return filteredApps.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  };

  const filteredApplications = getFilteredApplications();

  const handleApprove = (applicationId: string) => {
    if (window.confirm('Are you sure you want to approve this application?')) {
      approveApplication(applicationId);
    }
  };

  const handleReject = (applicationId: string) => {
    if (window.confirm('Are you sure you want to reject this application?')) {
      rejectApplication(applicationId);
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canManageApplications = user?.role === 'club_hicom' || user?.role === 'ppmk_hicom' || user?.role === 'ppmk_biro';

  const getPageTitle = () => {
    switch (user?.role) {
      case 'ppmk_member':
        return 'My Applications';
      case 'club_hicom':
        return 'Club Applications';
      default:
        return 'All Applications';
    }
  };

  const getPageDescription = () => {
    switch (user?.role) {
      case 'ppmk_member':
        return 'Track the status of your club applications';
      case 'club_hicom':
        return 'Review and manage applications for your club';
      default:
        return 'Manage all club applications across the system';
    }
  };

  // Get statistics
  const stats = {
    total: filteredApplications.length,
    pending: filteredApplications.filter(app => app.status === 'pending').length,
    approved: filteredApplications.filter(app => app.status === 'approved').length,
    rejected: filteredApplications.filter(app => app.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        <p className="text-gray-600 mt-1">{getPageDescription()}</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>
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

          {(user?.role === 'ppmk_hicom' || user?.role === 'ppmk_biro') && (
            <select
              value={filterClub}
              onChange={(e) => setFilterClub(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Clubs</option>
              {clubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="p-3 bg-gray-100 rounded-lg">
                  {getStatusIcon(application.status)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{application.fullName}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{application.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Applied: {formatDate(application.submittedAt)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Club:</span>
                      <span className="ml-2 text-gray-600">{application.clubName}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Course:</span>
                      <span className="ml-2 text-gray-600">{application.course}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">Year:</span>
                      <span className="ml-2 text-gray-600">Year {application.year}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="font-medium text-gray-900 text-sm">Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {application.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {application.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          +{application.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleViewDetails(application)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  title="View details"
                >
                  <Eye className="h-5 w-5" />
                </button>

                {canManageApplications && application.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(application.id)}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                      title="Approve application"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleReject(application.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                      title="Reject application"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' || filterClub !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : user?.role === 'ppmk_member'
              ? 'You haven\'t submitted any applications yet.'
              : 'No applications have been submitted yet.'
            }
          </p>
        </div>
      )}

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedApplication(null);
          }}
          onApprove={canManageApplications ? handleApprove : undefined}
          onReject={canManageApplications ? handleReject : undefined}
        />
      )}
    </div>
  );
};

export default Applications;
