import React, { useState } from 'react';
import { X, FileText, DollarSign, Calendar, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProposals } from '../../contexts/ProposalContext';
import { useClubs } from '../../contexts/ClubContext';

interface CreateProposalModalProps {
  onClose: () => void;
}

const CreateProposalModal: React.FC<CreateProposalModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { addProposal, canCreateProposal } = useProposals();
  const { clubs } = useClubs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    justification: '',
    timeline: '',
    expectedOutcome: '',
    targetParticipants: ''
  });

  const getUserClub = () => {
    if (!user) return null;
    return clubs.find(club => 
      club.hicomEmail === user.email || 
      club.hicomName === user.name ||
      club.id === user.clubId
    );
  };

  const userClub = getUserClub();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreateProposal()) {
      alert('You do not have permission to create proposals');
      return;
    }

    if (!userClub) {
      alert('Unable to identify your club. Please contact support.');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.budget.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const budgetAmount = parseFloat(formData.budget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const newProposal = {
        id: `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: budgetAmount,
        justification: formData.justification.trim(),
        timeline: formData.timeline.trim(),
        expectedOutcome: formData.expectedOutcome.trim(),
        targetParticipants: formData.targetParticipants.trim(),
        clubId: userClub.id,
        clubName: userClub.name,
        submittedBy: user?.name || 'Unknown',
        submittedById: user?.id || '',
        submittedAt: new Date().toLocaleDateString('en-MY', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      console.log('Creating proposal:', newProposal);
      addProposal(newProposal);
      
      // Show success message
      alert('Proposal submitted successfully! It will be reviewed by PPMK HiCom.');
      onClose();
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Failed to submit proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!canCreateProposal()) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You do not have permission to create proposals.</p>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Submit Proposal</h2>
                <p className="text-sm text-gray-600">
                  Submit a funding proposal for {userClub?.name || 'your club'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter proposal title..."
                    required
                  />
                </div>

                {/* Budget */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Requested Budget (RM) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Timeline
                  </label>
                  <input
                    type="text"
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 3 months, January - March 2024"
                  />
                </div>

                {/* Target Participants */}
                <div>
                  <label htmlFor="targetParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                    Target Participants
                  </label>
                  <input
                    type="text"
                    id="targetParticipants"
                    name="targetParticipants"
                    value={formData.targetParticipants}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 50 club members, All PPMK students"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your project in detail..."
                    required
                  />
                </div>

                {/* Justification */}
                <div>
                  <label htmlFor="justification" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Justification
                  </label>
                  <textarea
                    id="justification"
                    name="justification"
                    value={formData.justification}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Explain how the budget will be used..."
                  />
                </div>

                {/* Expected Outcome */}
                <div>
                  <label htmlFor="expectedOutcome" className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Outcome
                  </label>
                  <textarea
                    id="expectedOutcome"
                    name="expectedOutcome"
                    value={formData.expectedOutcome}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="What do you expect to achieve?"
                  />
                </div>
              </div>
            </div>

            {/* Club Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Submitting Club</h3>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{userClub?.name}</p>
                  <p className="text-sm text-gray-600">HiCom: {user?.name}</p>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Proposal Summary</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {formData.title || 'Proposal Title'}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {formData.description || 'Project description will appear here...'}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Budget:</span>
                    <span className="font-medium ml-2">
                      RM {formData.budget || '0.00'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Timeline:</span>
                    <span className="font-medium ml-2">
                      {formData.timeline || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.description.trim() || !formData.budget.trim()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Submit Proposal
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProposalModal;
