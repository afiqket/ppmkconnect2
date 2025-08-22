import React, { useState } from 'react';
import { FileText, Search, Filter, Calendar, User, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface ProposalsTabProps {
  userRole: string;
}

const ProposalsTab: React.FC<ProposalsTabProps> = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock proposals data
  const proposals = [
    {
      id: '1',
      title: 'Annual Photography Exhibition',
      description: 'Organize a campus-wide photography exhibition showcasing student work.',
      submittedBy: 'Photography Club',
      submittedAt: '2024-01-15',
      status: 'pending',
      budget: 5000,
      category: 'Event'
    },
    {
      id: '2',
      title: 'Environmental Awareness Campaign',
      description: 'Launch a month-long campaign to promote environmental consciousness.',
      submittedBy: 'Environmental Club',
      submittedAt: '2024-01-20',
      status: 'approved',
      budget: 3000,
      category: 'Campaign'
    },
    {
      id: '3',
      title: 'Tech Workshop Series',
      description: 'Conduct weekly workshops on emerging technologies for students.',
      submittedBy: 'Tech Innovation Hub',
      submittedAt: '2024-01-25',
      status: 'under_review',
      budget: 8000,
      category: 'Workshop'
    },
    {
      id: '4',
      title: 'Cultural Dance Festival',
      description: 'Host a multicultural dance festival celebrating diversity.',
      submittedBy: 'Cultural Dance Group',
      submittedAt: '2024-01-30',
      status: 'rejected',
      budget: 12000,
      category: 'Event'
    },
    {
      id: '5',
      title: 'Business Networking Event',
      description: 'Organize a networking event with industry professionals.',
      submittedBy: 'Business Club',
      submittedAt: '2024-02-05',
      status: 'pending',
      budget: 7500,
      category: 'Networking'
    }
  ];

  const filteredProposals = proposals
    .filter(proposal => {
      const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          proposal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          proposal.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || proposal.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'under_review':
        return <Eye className="h-5 w-5 text-blue-500" />;
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
      case 'under_review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'Under Review';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleProposalAction = (proposalId: string, action: 'approve' | 'reject' | 'review') => {
    console.log(`${action} proposal:`, proposalId);
    // Handle proposal action logic
  };

  const canTakeAction = (status: string) => {
    return (userRole === 'ppmk_hicom' || userRole === 'ppmk_biro') && 
           (status === 'pending' || status === 'under_review');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Proposals</h1>
        <p className="text-gray-600">
          {userRole === 'club_hicom'
            ? 'Submit and track your club proposals.'
            : userRole === 'ppmk_hicom' || userRole === 'ppmk_biro'
            ? 'Review and manage club proposals.'
            : 'View club proposals and their status.'}
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'under_review', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : getStatusText(status)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.length > 0 ? (
          filteredProposals.map((proposal) => (
            <div key={proposal.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {proposal.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{proposal.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {proposal.submittedBy}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(proposal.submittedAt).toLocaleDateString()}
                      </div>
                      <div className="font-medium">
                        Budget: ${proposal.budget.toLocaleString()}
                      </div>
                      <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {proposal.category}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  {getStatusIcon(proposal.status)}
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(proposal.status)}`}>
                    {getStatusText(proposal.status)}
                  </span>
                </div>
              </div>

              {/* Action buttons for reviewers */}
              {canTakeAction(proposal.status) && (
                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                  {proposal.status === 'pending' && (
                    <button
                      onClick={() => handleProposalAction(proposal.id, 'review')}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Start Review
                    </button>
                  )}
                  {proposal.status === 'under_review' && (
                    <>
                      <button
                        onClick={() => handleProposalAction(proposal.id, 'approve')}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleProposalAction(proposal.id, 'reject')}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Status message */}
              {proposal.status === 'approved' && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-green-600">
                    ✅ This proposal has been approved and is ready for implementation.
                  </p>
                </div>
              )}

              {proposal.status === 'rejected' && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-red-600">
                    ❌ This proposal has been rejected. Please review the feedback and consider resubmitting.
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No proposals have been submitted yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalsTab;
