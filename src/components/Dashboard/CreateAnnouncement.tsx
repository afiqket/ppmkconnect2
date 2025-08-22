import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockClubs } from '../../data/mockData';
import { X, Send, Users, Globe, Building2, AlertCircle, CheckCircle } from 'lucide-react';

interface CreateAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (announcement: any) => void;
}

const CreateAnnouncement: React.FC<CreateAnnouncementProps> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general' as 'general' | 'event' | 'urgent' | 'club',
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetAudience: 'all' as 'all' | 'club_specific' | 'selected_clubs' | 'club_members',
    selectedClubs: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const canCreateAnnouncements = user?.role === 'ppmk_hicom' || user?.role === 'club_hicom';

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
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newAnnouncement = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        content: formData.content.trim(),
        type: formData.type,
        priority: formData.priority,
        targetAudience: formData.targetAudience,
        clubIds: formData.targetAudience === 'selected_clubs' ? formData.selectedClubs : 
                 formData.targetAudience === 'club_members' ? [user?.clubId] : undefined,
        createdBy: user?.id,
        createdByName: user?.name,
        author: user?.name,
        createdAt: new Date().toISOString()
      };

      onSubmit(newAnnouncement);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'general',
        priority: 'medium',
        targetAudience: 'all',
        selectedClubs: []
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating announcement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTargetAudienceChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: value as any,
      selectedClubs: [] // Reset selected clubs when changing audience
    }));
  };

  const handleClubSelection = (clubId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedClubs: prev.selectedClubs.includes(clubId)
        ? prev.selectedClubs.filter(id => id !== clubId)
        : [...prev.selectedClubs, clubId]
    }));
  };

  const getTargetAudienceOptions = () => {
    if (user?.role === 'ppmk_hicom') {
      return [
        { value: 'all', label: 'Everyone', icon: Globe },
        { value: 'selected_clubs', label: 'Selected Clubs', icon: Building2 }
      ];
    } else if (user?.role === 'club_hicom') {
      return [
        { value: 'club_members', label: 'My Club Members', icon: Users }
      ];
    }
    return [];
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'event': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'club': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Announcement</h2>
              <p className="text-sm text-gray-500">Share important information with your community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!canCreateAnnouncements ? (
            <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Access Denied</h3>
                <p className="text-sm text-red-700 mt-1">
                  You don't have permission to create announcements. Only PPMK HiCom and Club HiCom can create announcements.
                </p>
                <p className="text-xs text-red-600 mt-2">
                  Your current role: <span className="font-medium">{user?.role || 'Unknown'}</span>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter a clear and descriptive title..."
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical ${
                    errors.content ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Write your announcement content here..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.content}
                  </p>
                )}
              </div>

              {/* Type and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getTypeColor(formData.type)}`}
                  >
                    <option value="general">General</option>
                    <option value="event">Event</option>
                    <option value="urgent">Urgent</option>
                    <option value="club">Club</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${getPriorityColor(formData.priority)}`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Target Audience
                </label>
                <div className="space-y-3">
                  {getTargetAudienceOptions().map(option => {
                    const Icon = option.icon;
                    return (
                      <label
                        key={option.value}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.targetAudience === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="targetAudience"
                          value={option.value}
                          checked={formData.targetAudience === option.value}
                          onChange={(e) => handleTargetAudienceChange(e.target.value)}
                          className="sr-only"
                        />
                        <Icon className={`w-5 h-5 mr-3 ${
                          formData.targetAudience === option.value ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className={`font-medium ${
                          formData.targetAudience === option.value ? 'text-blue-900' : 'text-gray-700'
                        }`}>
                          {option.label}
                        </span>
                        {formData.targetAudience === option.value && (
                          <CheckCircle className="w-5 h-5 ml-auto text-blue-600" />
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Club Selection */}
              {formData.targetAudience === 'selected_clubs' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Clubs *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {mockClubs.map(club => (
                      <label
                        key={club.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.selectedClubs.includes(club.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedClubs.includes(club.id)}
                          onChange={() => handleClubSelection(club.id)}
                          className="sr-only"
                        />
                        <Building2 className={`w-4 h-4 mr-2 ${
                          formData.selectedClubs.includes(club.id) ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm ${
                          formData.selectedClubs.includes(club.id) ? 'text-blue-900 font-medium' : 'text-gray-700'
                        }`}>
                          {club.name}
                        </span>
                        {formData.selectedClubs.includes(club.id) && (
                          <CheckCircle className="w-4 h-4 ml-auto text-blue-600" />
                        )}
                      </label>
                    ))}
                  </div>
                  {errors.selectedClubs && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.selectedClubs}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Create Announcement
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncement;
