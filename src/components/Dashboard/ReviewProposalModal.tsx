import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProposals } from '../../contexts/ProposalContext';
import { X, CheckCircle, XCircle, Eye, DollarSign, Calendar, Target, FileText, User, Clock } from 'lucide-react';
import { Proposal } from '../../types';

interface ReviewProposalModalProps {
  proposal: Proposal;
  onClose: () => void;
}

const ReviewProposalModal: React.FC<ReviewProposalModalProps> = ({ proposal, onClose }) => {
  const { user } = useAuth();
  const { updateProposal } = useProposals();
  
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReview = async (status: 'approved' | 'rejected' | 'under_review') => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      updateProposal(proposal.id, {
        status,
        reviewedBy: user.id,
        reviewedAt: new Date().toISOString()
      });

      onClose();
    } catch (error) {
      console.error('Error reviewing proposal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'under_review':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const canReview = user?.role === 'ppmk_hicom' && (proposal.status === 'pending' || proposal.status === 'under_review');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Review Proposal</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(proposal.status)}`}>
              {getStatusIcon(proposal.status)}
              {proposal.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Proposal Header */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{proposal.title}</h1>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>{proposal.clubName}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>By {proposal.createdByName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Created {new Date(proposal.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Proposal Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{proposal.description}</p>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objectives
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <ul className="space-y-2">
                    {proposal.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Project Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Timeline</p>
                      <p className="font-medium text-gray-900">{proposal.timeline}</p>
                    </div>
                  </div>
                  
                  {proposal.budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="font-medium text-gray-900">RM {proposal.budget.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Objectives</p>
                      <p className="font-medium text-gray-900">{proposal.objectives.length} items</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review History */}
              {proposal.reviewedAt && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Review History</h3>
                  <div className="text-sm text-gray-600">
                    <p>Reviewed on {new Date(proposal.reviewedAt).toLocaleDateString()}</p>
                    {proposal.reviewedBy && (
                      <p>Reviewed by: {proposal.reviewedBy}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Review Actions */}
          {canReview && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Actions</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes (Optional)
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes or feedback for this proposal..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleReview('under_review')}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Mark Under Review
                </button>
                
                <button
                  onClick={() => handleReview('approved')}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                
                <button
                  onClick={() => handleReview('rejected')}
                  disabled={isSubmitting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewProposalModal;
