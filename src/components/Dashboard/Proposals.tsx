import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProposals } from '../../contexts/ProposalContext';
import { FileText, Plus, RefreshCw, Calendar, DollarSign, Target, User, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter, Eye } from 'lucide-react';
import CreateProposal from './CreateProposal';
import ProposalDetailsModal from './ProposalDetailsModal';

const Proposals: React.FC = () => {
  const { user } = useAuth();
  const { getProposalsForUser, updateProposal, refreshProposals } = useProposals();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const proposals = getProposalsForUser();

  // Auto-refresh proposals periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refreshProposals();
    }, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, [refreshProposals]);

  const getFilteredProposals = () => {
    return proposals.filter(proposal => {
      const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           proposal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           proposal.clubName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || proposal.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  };

  const filteredProposals = getFilteredProposals();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    refreshProposals();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleReviewProposal = (proposalId: string, status: 'approved' | 'rejected') => {
    updateProposal(proposalId, {
      status,
      reviewedBy: user?.id,
      reviewedAt: new Date().toISOString()
    });
  };

  const handleViewDetails = (proposal: any) => {
    setSelectedProposal(proposal);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'under_review': return AlertCircle;
      default: return Clock;
    }
  };

  const canCreateProposals = user?.role === 'club_hicom';
  const canReviewProposals = user?.role === 'ppmk_hicom';

  const getPageTitle = () => {
    switch (user?.role) {
      case 'club_hicom': return 'My Proposals';
      case 'ppmk_hicom': return 'Review Proposals';
      default: return 'Proposals';
    }
  };

  const getPageDescription = () => {
    switch (user?.role) {
      case 'club_hicom': return 'Submit and track your club proposals to PPMK HiCom';
      case 'ppmk_hicom': return 'Review and approve club proposals from all clubs';
      default: return 'Manage proposals';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600 mt-1">
            {getPageDescription()} ({proposals.length} total)
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh proposals"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          
          {canCreateProposals && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Proposal</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 font-medium">
            Real-time sync active • Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : canCreateProposals 
                  ? 'Get started by creating your first proposal.'
                  : 'No proposals have been submitted yet.'
              }
            </p>
            {canCreateProposals && !searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Proposal
              </button>
            )}
          </div>
        ) : (
          filteredProposals.map((proposal) => {
            const StatusIcon = getStatusIcon(proposal.status);
            const isNewProposal = new Date(proposal.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);

            return (
              <div
                key={proposal.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all ${
                  isNewProposal ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${isNewProposal ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <FileText className={`h-6 w-6 ${isNewProposal ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-lg font-semibold ${isNewProposal ? 'text-gray-900' : 'text-gray-700'}`}>
                          {proposal.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {proposal.status.replace('_', ' ')}
                        </span>
                        {isNewProposal && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            New
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{proposal.clubName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created: {formatDate(proposal.createdAt)}</span>
                        </div>
                        {proposal.reviewedAt && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>Reviewed: {formatDate(proposal.reviewedAt)}</span>
                          </div>
                        )}
                      </div>

                      <p className={`text-gray-700 leading-relaxed mb-4 ${isNewProposal ? 'font-medium' : ''}`}>
                        {proposal.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {proposal.budget && (
                          <div className="flex items-center space-x-2 text-sm">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-gray-600">Budget:</span>
                            <span className="font-medium">RM {proposal.budget.toLocaleString()}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-gray-600">Timeline:</span>
                          <span className="font-medium">{proposal.timeline}</span>
                        </div>
                      </div>

                      {proposal.objectives.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            Objectives:
                          </h4>
                          <ul className="list-disc list-inside space-y-1">
                            {proposal.objectives.slice(0, 2).map((objective, index) => (
                              <li key={index} className="text-sm text-gray-700">{objective}</li>
                            ))}
                            {proposal.objectives.length > 2 && (
                              <li className="text-sm text-blue-600 font-medium">
                                +{proposal.objectives.length - 2} more objectives
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleViewDetails(proposal)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </button>

                        {canReviewProposals && proposal.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleReviewProposal(proposal.id, 'approved')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center space-x-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReviewProposal(proposal.id, 'rejected')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center space-x-1"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateProposal
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showDetailsModal && selectedProposal && (
        <ProposalDetailsModal
          proposal={selectedProposal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedProposal(null);
          }}
          onReview={canReviewProposals ? handleReviewProposal : undefined}
        />
      )}
    </div>
  );
};

export default Proposals;
