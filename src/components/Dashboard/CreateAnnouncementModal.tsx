import React, { useState } from 'react';
import { X, Bell, Users, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAnnouncements } from '../../contexts/AnnouncementContext';
import { useClubs } from '../../contexts/ClubContext';

interface CreateAnnouncementModalProps {
  onClose: () => void;
}

const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { addAnnouncement, canCreateAnnouncement } = useAnnouncements();
  const { clubs } = useClubs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetAudience: 'all',
    targetRole: 'all',
    clubIds: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreateAnnouncement()) {
      alert('You do not have permission to create announcements');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const newAnnouncement = {
        id: `announcement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: formData.title.trim(),
        content: formData.content.trim(),
        author: user?.name || 'Unknown',
        createdAt: new Date().toLocaleDateString('en-MY', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        targetRole: formData.targetRole,
        targetAudience: formData.targetAudience,
        clubIds: formData.targetAudience === 'selected_clubs' ? formData.clubIds : undefined,
        clubId: user?.role === 'club_hicom' ? user.clubId : undefined,
        read: false
      };

      console.log('Creating announcement:', newAnnouncement);
      addAnnouncement(newAnnouncement);
      
      // Show success message
      alert('Announcement created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClubSelection = (clubId: string) => {
    setFormData(prev => ({
      ...prev,
      clubIds: prev.clubIds.includes(clubId)
        ? prev.clubIds.filter(id => id !== clubId)
        : [...prev.clubIds, clubId]
    }));
  };

  if (!canCreateAnnouncement()) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You do not have permission to create announcements.</p>
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
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create Announcement</h2>
                <p className="text-sm text-gray-600">Share important information with members</p>
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
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Announcement Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter announcement title..."
                required
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your announcement content here..."
                required
              />
            </div>

            {/* Target Audience */}
            <div>
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <select
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Members</option>
                {user?.role === 'ppmk_hicom' && (
                  <>
                    <option value="ppmk_member">PPMK Members Only</option>
                    <option value="club_members">All Club Members</option>
                    <option value="club_hicom">Club HiCom Only</option>
                    <option value="ppmk_biro">PPMK Biro Only</option>
                    <option value="selected_clubs">Selected Clubs</option>
                  </>
                )}
                {user?.role === 'ppmk_biro' && (
                  <>
                    <option value="ppmk_member">PPMK Members Only</option>
                    <option value="club_members">All Club Members</option>
                    <option value="selected_clubs">Selected Clubs</option>
                  </>
                )}
                {user?.role === 'club_hicom' && (
                  <option value="club_members">My Club Members</option>
                )}
              </select>
            </div>

            {/* Club Selection for Selected Clubs */}
            {formData.targetAudience === 'selected_clubs' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Clubs
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {clubs.map((club) => (
                    <label key={club.id} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        checked={formData.clubIds.includes(club.id)}
                        onChange={() => handleClubSelection(club.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{club.name}</span>
                    </label>
                  ))}
                </div>
                {formData.clubIds.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">Please select at least one club</p>
                )}
              </div>
            )}

            {/* Target Role */}
            <div>
              <label htmlFor="targetRole" className="block text-sm font-medium text-gray-700 mb-2">
                Target Role
              </label>
              <select
                id="targetRole"
                name="targetRole"
                value={formData.targetRole}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="ppmk_member">PPMK Members</option>
                <option value="club_member">Club Members</option>
                <option value="club_hicom">Club HiCom</option>
                {user?.role === 'ppmk_hicom' && (
                  <>
                    <option value="ppmk_biro">PPMK Biro</option>
                    <option value="ppmk_hicom">PPMK HiCom</option>
                  </>
                )}
              </select>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {formData.title || 'Announcement Title'}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {formData.content || 'Announcement content will appear here...'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>By {user?.name}</span>
                  <span>
                    Target: {formData.targetAudience === 'all' ? 'All Members' : 
                            formData.targetAudience === 'selected_clubs' ? `${formData.clubIds.length} Selected Clubs` :
                            formData.targetAudience.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
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
                disabled={isSubmitting || !formData.title.trim() || !formData.content.trim() || 
                         (formData.targetAudience === 'selected_clubs' && formData.clubIds.length === 0)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Create Announcement
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

export default CreateAnnouncementModal;
