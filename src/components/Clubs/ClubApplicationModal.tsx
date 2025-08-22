import React, { useState } from 'react';
import { X, User, Mail, FileText, Award, Target, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApplications } from '../../contexts/ApplicationContext';

interface Club {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  memberCount: number;
  hicomName: string;
  hicomEmail: string;
  requirements: string[];
}

interface ClubApplicationModalProps {
  club: Club;
  isOpen: boolean;
  onClose: () => void;
}

const ClubApplicationModal: React.FC<ClubApplicationModalProps> = ({ club, isOpen, onClose }) => {
  const { user } = useAuth();
  const { submitApplication } = useApplications();
  
  const [formData, setFormData] = useState({
    motivation: '',
    experience: '',
    skills: [] as string[],
    skillInput: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.motivation.trim()) {
      newErrors.motivation = 'Please explain why you want to join this club';
    } else if (formData.motivation.trim().length < 50) {
      newErrors.motivation = 'Please provide at least 50 characters explaining your motivation';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Please describe your relevant experience';
    } else if (formData.experience.trim().length < 30) {
      newErrors.experience = 'Please provide at least 30 characters describing your experience';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please add at least one relevant skill';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting application with data:', {
        applicantId: user.id,
        applicantName: user.name,
        applicantEmail: user.email,
        clubId: club.id,
        clubName: club.name,
        motivation: formData.motivation.trim(),
        experience: formData.experience.trim(),
        skills: formData.skills,
        additionalInfo: formData.additionalInfo.trim()
      });

      const success = await submitApplication({
        applicantId: user.id,
        applicantName: user.name,
        applicantEmail: user.email,
        clubId: club.id,
        clubName: club.name,
        motivation: formData.motivation.trim(),
        experience: formData.experience.trim(),
        skills: formData.skills,
        additionalInfo: formData.additionalInfo.trim()
      });

      if (success) {
        // Reset form
        setFormData({
          motivation: '',
          experience: '',
          skills: [],
          skillInput: '',
          additionalInfo: ''
        });
        setErrors({});
        
        // Show success message
        alert(`Your application to ${club.name} has been submitted successfully! You will be notified once it's reviewed.`);
        
        // Close modal
        onClose();
      } else {
        throw new Error('Application submission failed');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error instanceof Error ? error.message : 'There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addSkill = () => {
    const skill = formData.skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill],
        skillInput: ''
      }));
      
      // Clear skills error if it exists
      if (errors.skills) {
        setErrors(prev => ({ ...prev, skills: '' }));
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Apply to Join {club.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Fill out this application form to join the club
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Club Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <img
                src={club.image}
                alt={club.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{club.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{club.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>{club.memberCount} members</span>
                  <span>HiCom: {club.hicomName}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {club.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Applicant Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Your Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-gray-600 mb-1">Full Name</label>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Email Address</label>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Club Requirements */}
          {club.requirements && club.requirements.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span>Club Requirements</span>
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {club.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Motivation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why do you want to join {club.name}? *
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                value={formData.motivation}
                onChange={(e) => handleInputChange('motivation', e.target.value)}
                rows={4}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.motivation ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Explain your motivation, interests, and what you hope to achieve by joining this club..."
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              {errors.motivation && <p className="text-red-600 text-sm">{errors.motivation}</p>}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.motivation.length}/500 characters (minimum 50)
              </p>
            </div>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relevant Experience *
            </label>
            <div className="relative">
              <Award className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                rows={4}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.experience ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe any relevant experience, projects, courses, or activities related to this club..."
              />
            </div>
            <div className="flex justify-between items-center mt-1">
              {errors.experience && <p className="text-red-600 text-sm">{errors.experience}</p>}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.experience.length}/500 characters (minimum 30)
              </p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relevant Skills *
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.skillInput}
                  onChange={(e) => setFormData(prev => ({ ...prev, skillInput: e.target.value }))}
                  onKeyPress={handleSkillInputKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a skill and press Enter"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {errors.skills && <p className="text-red-600 text-sm mt-1">{errors.skills}</p>}
            <p className="text-xs text-gray-500 mt-1">
              Add skills relevant to {club.category.toLowerCase()} and club activities
            </p>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Any additional information you'd like to share (optional)..."
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Optional: Share anything else that might be relevant to your application
            </p>
          </div>

          {/* Application Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Application Process</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• Your application will be reviewed by the club HiCom</li>
                  <li>• You will be notified via email about the decision</li>
                  <li>• The review process typically takes 3-5 business days</li>
                  <li>• You can check your application status in your dashboard</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClubApplicationModal;
