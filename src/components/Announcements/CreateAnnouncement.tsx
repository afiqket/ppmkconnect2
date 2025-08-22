import React, { useState } from 'react';
import { X, Send, Users, Building, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useClubs } from '../../contexts/ClubContext';

interface CreateAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (announcement: any) => void;
}

const CreateAnnouncement: React.FC<CreateAnnouncementProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const { clubs } = useClubs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    targetAudience: 'all',
    selectedClubs: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClubSelection = (clubId: string) => {
    const updatedClubs = formData.selectedClubs.includes(clubId)
      ? formData.selectedClubs.filter(id => id !== clubId)
      : [...formData.selectedClubs, clubId];
    
    handleInputChange('selectedClubs', updatedClubs);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.targetAudience === 'selected_clubs' && formData.selectedClubs.length === 0) {
      newErrors.selectedClubs = 'Please select at least one club';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const announcementData = {
        id: `announcement_${Date.now()}`,
        title: formData.title.trim(),
        content: formData.content.trim(),
        type: formData.type,
        targetAudience: formData.targetAudience,
        clubIds: formData.targetAudience === 'selected_clubs' ? formData.selectedClubs : undefined,
        author: user?.name || 'Unknown',
        authorRole: user?.role || 'unknown',
        createdAt: new Date().toISOString(),
        readBy: []
      };

      onSubmit(announcementData);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'general',
        targetAudience: 'all',
        selectedClubs: []
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTargetAudienceOptions = () => {
    const options = [
      { value: 'all', label: 'All Users', icon: Users },
      { value: 'ppmk_member', label: 'PPMK Members', icon: Users },
      { value: 'club_member', label: 'Club Members', icon: Building },
      { value: 'club_hicom', label: 'Club HiCom', icon: Building },
      { value: 'ppmk_biro', label: 'PPMK Biro', icon: Users },
      { value: 'ppmk_hicom', label: 'PPMK HiCom', icon: Users }
    ];

    // Filter options based on user role
    if (user?.role === 'club_hicom') {
      return options.filter(option => 
        ['all', 'club_member', 'club_hicom', 'selected_clubs'].includes(option.value)
      ).concat([{ value: 'selected_clubs', label: 'Selected Clubs', icon: Building }]);
    }

    if (user?.role === 'ppmk_hicom') {
      return options.concat([{ value: 'selected_clubs', label: 'Selected Clubs', icon: Building }]);
    }

    return options;
  };

  const targetAudienceOptions = getTargetAudienceOptions();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Announcement</h2>
            <p className="text-gray-600 text-sm mt-1">Share important information with your community</p>
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
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter announcement title"
              maxLength={100}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Write your announcement content here..."
              maxLength={1000}
            />
            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
            <p className="text-xs text-gray-500 mt-1">{formData.content.length}/1000 characters</p>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="general">General</option>
              <option value="event">Event</option>
              <option value="urgent">Urgent</option>
              <option value="club">Club</option>
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <select
              value={formData.targetAudience}
              onChange={(e) => handleInputChange('targetAudience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {targetAudienceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Club Selection (if selected_clubs is chosen) */}
          {formData.targetAudience === 'selected_clubs' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Clubs *
              </label>
              <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                {clubs.map((club) => (
                  <label key={club.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.selectedClubs.includes(club.id)}
                      onChange={() => handleClubSelection(club.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-2">
                      <img
                        src={club.image}
                        alt={club.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{club.name}</div>
                        <div className="text-xs text-gray-500">{club.category}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.selectedClubs && <p className="text-red-500 text-xs mt-1">{errors.selectedClubs}</p>}
              <p className="text-xs text-gray-500 mt-1">
                {formData.selectedClubs.length} club(s) selected
              </p>
            </div>
          )}

          {/* Preview */}
          {(formData.title || formData.content) && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formData.type === 'urgent' ? 'bg-red-100 text-red-800' :
                    formData.type === 'event' ? 'bg-green-100 text-green-800' :
                    formData.type === 'club' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {formData.type}
                  </span>
                  {formData.type === 'urgent' && (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <h5 className="font-semibold text-gray-900 mb-2">{formData.title || 'Announcement Title'}</h5>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {formData.content || 'Announcement content will appear here...'}
                </p>
                <div className="mt-3 text-xs text-gray-500">
                  By {user?.name} • {new Date().toLocaleDateString()}
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
              <span>{isSubmitting ? 'Creating...' : 'Create Announcement'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
