import React, { useState } from 'react';
import { useApplications } from '../../../contexts/ApplicationContext';
import { FileText, Search, Filter, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ApplicationsTabProps {
  userRole: string;
}

const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ userRole }) => {
  const { applications, updateApplicationStatus } = useApplications();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredApplications = applications
    .filter(application => {
      const matchesSearch = application.clubName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          application.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || application.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const handleStatusUpdate = (applicationId: string, newStatus: 'approved' | 'rejected') => {
    updateApplicationStatus(applicationId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Applications</h1>
        <p className="text-gray-600">
          {userRole === 'club_hicom' || userRole === 'ppmk_hicom'
            ? 'Review and manage club membership applications.'
            : 'Track your club membership applications.'}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {application.clubName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {application.applicantName}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(application.status)}
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(application.status)}`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </div>
              </div>

              {application.reason && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Application Reason:</h4>
                  <p className="text-gray-700 text-sm">{application.reason}</p>
                </div>
              )}

              {/* Action buttons for reviewers */}
              {(userRole === 'club_hicom' || userRole === 'ppmk_hicom') && application.status === 'pending' && (
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleStatusUpdate(application.id, 'approved')}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(application.id, 'rejected')}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </div>
              )}

              {/* Status message for applicants */}
              {userRole === 'ppmk_member' && application.status !== 'pending' && (
                <div className="pt-4 border-t border-gray-200">
                  <p className={`text-sm ${
                    application.status === 'approved' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Your application has been {application.status}.
                    {application.status === 'approved' && ' Welcome to the club!'}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : userRole === 'ppmk_member'
                ? 'You haven\'t submitted any applications yet.'
                : 'No applications to review at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsTab;
