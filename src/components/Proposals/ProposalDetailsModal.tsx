import React from 'react';
import { X, FileText, Calendar, DollarSign, Target, User, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ProposalDetailsModalProps {
  proposal: any;
  onClose: () => void;
  onReview?: (proposalId: string, status: 'approved' | 'rejected') => void;
}

const ProposalDetailsModal: React.FC<ProposalDetailsModalProps> = ({ 
  proposal, 
  onClose, 
  onReview 
}) => {
  const { user } = useAuth();

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const StatusIcon = getStatusIcon(proposal.status);
  const canReview = onReview && user?.role === 'ppmk_hicom' && proposal.status === 'pending';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-bold text-gray-900">{proposal.title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(proposal.status)}`}>
                <StatusIcon className="w-4 h-4 inline mr-1" />
                {proposal.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Submitted by {proposal.submitterName} from {proposal.clubName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Review Actions */}
          {canReview && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900">Review Required</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    This proposal is awaiting your review and decision.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => onReview(proposal.id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => onReview(proposal.id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Description
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{proposal.description}</p>
                </div>
              </div>

              {/* Objectives */}
              {proposal.objectives && proposal.objectives.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Objectives
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {proposal.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Justification */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Justification</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{proposal.justification}</p>
                </div>
              </div>

              {/* Expected Outcomes */}
              {proposal.expectedOutcomes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Expected Outcomes</h3>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-green-900 leading-relaxed whitespace-pre-wrap">{proposal.expectedOutcomes}</p>
                  </div>
                </div>
              )}

              {/* Required Resources */}
              {proposal.resources && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Resources</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-900 leading-relaxed whitespace-pre-wrap">{proposal.resources}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Proposal Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Club</div>
                      <div className="text-sm text-gray-600">{proposal.clubName}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">Timeline</div>
                      <div className="text-sm text-gray-600">{proposal.timeline}</div>
                    </div>
                  </div>
                  
                  {proposal.budget && (
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="font-medium text-gray-900">Budget</div>
                        <div className="text-sm text-gray-600">RM {proposal.budget.toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submission Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Info</h3>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-gray-900">Submitted By</div>
                    <div className="text-sm text-gray-600">{proposal.submitterName}</div>
                    <div className="text-xs text-gray-500 capitalize">{proposal.submitterRole?.replace('_', ' ')}</div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-gray-900">Submitted On</div>
                    <div className="text-sm text-gray-600">{formatDate(proposal.submittedAt)}</div>
                  </div>
                  
                  {proposal.reviewedAt && (
                    <div>
                      <div className="font-medium text-gray-900">Reviewed On</div>
                      <div className="text-sm text-gray-600">{formatDate(proposal.reviewedAt)}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status History */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Submitted</div>
                      <div className="text-xs text-gray-500">{formatDate(proposal.createdAt)}</div>
                    </div>
                  </div>
                  
                  {proposal.status !== 'pending' && (
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        proposal.status === 'approved' ? 'bg-green-500' : 
                        proposal.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {proposal.status.replace('_', ' ')}
                        </div>
                        {proposal.reviewedAt && (
                          <div className="text-xs text-gray-500">{formatDate(proposal.reviewedAt)}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsModal;
