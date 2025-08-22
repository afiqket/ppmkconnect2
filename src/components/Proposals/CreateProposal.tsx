import React, { useState } from 'react';
import { X, Send, Plus, Minus, DollarSign, Calendar, Target, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useProposals } from '../../contexts/ProposalContext';
import { useClubs } from '../../contexts/ClubContext';

interface CreateProposalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProposal: React.FC<CreateProposalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { addProposal } = useProposals();
  const { clubs } = useClubs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objectives: [''],
    budget: '',
    timeline: '',
    justification: '',
    expectedOutcomes: '',
    resources: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const userClub = clubs.find(club => 
    club.hicomName === user?.name || 
    club.hicomEmail === user?.email
  );

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    handleInputChange('objectives', newObjectives);
  };

  const addObjective = () => {
    if (formData.objectives.length < 10) {
      handleInputChange('objectives', [...formData.objectives, '']);
    }
  };

  const removeObjective = (index: number) => {
    if (formData.objectives.length > 1) {
      const newObjectives = formData.objectives.filter((_, i) => i !== index);
      handleInputChange('objectives', newObjectives);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.justification.trim()) {
      newErrors.justification = 'Justification is required';
    }

    if (!formData.timeline.trim()) {
      newErrors.timeline = 'Timeline is required';
    }

    const validObjectives = formData.objectives.filter(obj => obj.trim());
    if (validObjectives.length === 0) {
      newErrors.objectives = 'At least one objective is required';
    }

    if (formData.budget && (isNaN(Number(formData.budget)) || Number(formData.budget) < 0)) {
      newErrors.budget = 'Budget must be a valid positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!userClub) {
      alert('You must be associated with a club to create proposals.');
      return;
    }

    setIsSubmitting(true);

    try {
      const proposalData = {
        id: `proposal_${Date.now()}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        objectives: formData.objectives.filter(obj => obj.trim()),
        budget: formData.budget ? Number(formData.budget) : undefined,
        timeline: formData.timeline.trim(),
        justification: formData.justification.trim(),
        expectedOutcomes: formData.expectedOutcomes.trim() || undefined,
        resources: formData.resources.trim() || undefined,
        clubId: userClub.id,
        clubName: userClub.name,
        submittedBy: user?.id || '',
        submitterName: user?.name || '',
        submitterRole: user?.role || '',
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        submittedAt: new Date().toISOString()
      };

      addProposal(proposalData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        objectives: [''],
        budget: '',
        timeline: '',
        justification: '',
        expectedOutcomes: '',
        resources: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Failed to create proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New Proposal</h2>
            <p className="text-gray-600 text-sm mt-1">
              Submit a proposal for {userClub?.name || 'your club'} to PPMK HiCom
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposal Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter a clear and descriptive title"
                  maxLength={100}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Provide a detailed description of your proposal..."
                  maxLength={1000}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/1000 characters</p>
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Objectives *
            </h3>
            
            <div className="space-y-3">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Objective ${index + 1}`}
                      maxLength={200}
                    />
                  </div>
                  
                  {formData.objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              
              {formData.objectives.length < 10 && (
                <button
                  type="button"
                  onClick={addObjective}
                  className="flex items-center space-x-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Objective</span>
                </button>
              )}
              
              {errors.objectives && <p className="text-red-500 text-xs">{errors.objectives}</p>}
            </div>
          </div>

          {/* Budget and Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget & Timeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Budget (RM) - Optional
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.budget ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Timeline *
                </label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.timeline ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 3 months, Q2 2024"
                />
                {errors.timeline && <p className="text-red-500 text-xs mt-1">{errors.timeline}</p>}
              </div>
            </div>
          </div>

          {/* Justification */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Justification *</h3>
            <textarea
              value={formData.justification}
              onChange={(e) => handleInputChange('justification', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.justification ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Explain why this proposal is important and how it benefits the club/community..."
              maxLength={1000}
            />
            {errors.justification && <p className="text-red-500 text-xs mt-1">{errors.justification}</p>}
            <p className="text-xs text-gray-500 mt-1">{formData.justification.length}/1000 characters</p>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Outcomes (Optional)
                </label>
                <textarea
                  value={formData.expectedOutcomes}
                  onChange={(e) => handleInputChange('expectedOutcomes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the expected results and impact..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.expectedOutcomes.length}/500 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Resources (Optional)
                </label>
                <textarea
                  value={formData.resources}
                  onChange={(e) => handleInputChange('resources', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List any resources, equipment, or support needed..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.resources.length}/500 characters</p>
              </div>
            </div>
          </div>

          {/* Preview */}
          {(formData.title || formData.description) && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="font-semibold text-gray-900 mb-2">{formData.title || 'Proposal Title'}</h5>
                <p className="text-gray-700 text-sm mb-3">
                  {formData.description || 'Proposal description will appear here...'}
                </p>
                
                {formData.objectives.filter(obj => obj.trim()).length > 0 && (
                  <div className="mb-3">
                    <h6 className="font-medium text-gray-900 text-sm mb-1">Objectives:</h6>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {formData.objectives.filter(obj => obj.trim()).map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>By {user?.name} • {userClub?.name}</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Proposal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProposal;
