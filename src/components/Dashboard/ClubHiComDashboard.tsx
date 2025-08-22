import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useProposals } from '../../contexts/ProposalContext';
import { useEvents } from '../../contexts/EventContext';
import { useApplications } from '../../contexts/ApplicationContext';
import { useAnnouncements } from '../../contexts/AnnouncementContext';
import { useClubs } from '../../contexts/ClubContext';
import { Bell, Users, Calendar, FileText, TrendingUp, CheckCircle, XCircle, Eye, Plus, MapPin } from 'lucide-react';
import CreateProposalModal from './CreateProposalModal';
import EventModal from '../Events/EventModal';
import CreateAnnouncementModal from './CreateAnnouncementModal';

interface ClubHiComDashboardProps {
  activeTab: string;
}

const ClubHiComDashboard: React.FC<ClubHiComDashboardProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const { proposals } = useProposals();
  const { events, createEvent } = useEvents();
  const { applications, approveApplication, rejectApplication, getClubApplications, refreshApplications } = useApplications();
  const { announcements, markAsRead: markAnnouncementAsRead } = useAnnouncements();
  const { clubs } = useClubs();
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);

  // Get user's club ID
  const getUserClubId = () => {
    if (!user) return null;
    
    // Find club by matching hicom email or name
    const userClub = clubs.find(club => 
      club.hicomEmail === user.email || 
      club.hicomName === user.name
    );
    
    console.log('ClubHiComDashboard: Finding club for user:', user.email, 'Found:', userClub?.name);
    return userClub?.id || null;
  };

  const userClubId = getUserClubId();

  // Refresh applications when component mounts or user changes
  useEffect(() => {
    if (user && userClubId) {
      console.log('ClubHiComDashboard: Refreshing applications for club:', userClubId);
      refreshApplications();
    }
  }, [user, userClubId, refreshApplications]);

  // Listen for application updates with multiple event types
  useEffect(() => {
    const handleApplicationUpdate = (e: CustomEvent) => {
      console.log('ClubHiComDashboard: Applications updated via custom event:', e.detail);
      refreshApplications();
    };

    const handleClubApplicationUpdate = (e: CustomEvent) => {
      console.log('ClubHiComDashboard: Club applications updated:', e.detail);
      if (e.detail && e.detail.clubId === userClubId) {
        refreshApplications();
      }
    };

    const handleForceSync = (e: CustomEvent) => {
      console.log('ClubHiComDashboard: Force sync triggered:', e.detail);
      refreshApplications();
    };

    // Listen to multiple event types for better synchronization
    window.addEventListener('applicationsUpdated', handleApplicationUpdate as EventListener);
    window.addEventListener('clubApplicationsUpdated', handleClubApplicationUpdate as EventListener);
    window.addEventListener('forceApplicationSync', handleForceSync as EventListener);
    
    return () => {
      window.removeEventListener('applicationsUpdated', handleApplicationUpdate as EventListener);
      window.removeEventListener('clubApplicationsUpdated', handleClubApplicationUpdate as EventListener);
      window.removeEventListener('forceApplicationSync', handleForceSync as EventListener);
    };
  }, [refreshApplications, userClubId]);

  // Periodic refresh for real-time sync
  useEffect(() => {
    if (userClubId && activeTab === 'applications') {
      const interval = setInterval(() => {
        console.log('ClubHiComDashboard: Periodic refresh for applications tab');
        refreshApplications();
      }, 3000); // Refresh every 3 seconds when on applications tab

      return () => clearInterval(interval);
    }
  }, [userClubId, activeTab, refreshApplications]);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const myProposals = proposals.filter(p => p.clubId === userClubId);
  const clubEvents = events.filter(e => e.clubId === userClubId);
  
  // Get club applications with proper filtering and real-time updates
  const clubApplications = userClubId ? getClubApplications(userClubId) : [];
  const pendingApplications = clubApplications.filter(app => app.status === 'pending').length;

  console.log('ClubHiComDashboard: Club applications:', clubApplications.length, 'Pending:', pendingApplications);
  console.log('ClubHiComDashboard: All applications for club', userClubId, ':', clubApplications);

  // Get filtered announcements using the same logic as Announcements component
  const getFilteredAnnouncements = () => {
    if (!user) return [];
    
    return announcements.filter(announcement => {
      return announcement.targetAudience === 'all' || 
             announcement.targetAudience === user.role ||
             (announcement.targetAudience === 'club_members' && 
              (user.role === 'club_member' || user.role === 'club_hicom') &&
              announcement.clubIds?.includes(user.clubId)) ||
             (announcement.targetAudience === 'selected_clubs' && 
              announcement.clubIds?.includes(user.clubId)) ||
             announcement.targetRole === 'all' || 
             announcement.targetRole === user.role ||
             announcement.clubId === userClubId;
    });
  };

  const filteredAnnouncements = getFilteredAnnouncements();
  const unreadAnnouncements = filteredAnnouncements.filter(a => !a.read).length;

  const handleApproveApplication = (applicationId: string) => {
    console.log('ClubHiComDashboard: Approving application:', applicationId);
    approveApplication(applicationId, 'Application approved by club committee');
  };

  const handleRejectApplication = (applicationId: string) => {
    console.log('ClubHiComDashboard: Rejecting application:', applicationId);
    rejectApplication(applicationId, 'Application rejected after review');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (activeTab === 'overview') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.clubName || 'Club'} High Committee</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-400" />
            {unreadNotifications > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadNotifications}
              </span>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Proposals</p>
                <p className="text-2xl font-semibold text-gray-900">{myProposals.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Club Events</p>
                <p className="text-2xl font-semibold text-gray-900">{clubEvents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread Announcements</p>
                <p className="text-2xl font-semibold text-gray-900">{unreadAnnouncements}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Create Announcement</h3>
                  <p className="text-sm text-gray-600">Notify club members</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowProposalModal(true)}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Submit Proposal</h3>
                  <p className="text-sm text-gray-600">Request funding</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowEventModal(true)}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Create Event</h3>
                  <p className="text-sm text-gray-600">Organize activities</p>
                </div>
              </div>
            </button>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Manage Applications</h3>
                  <p className="text-sm text-gray-600">{pendingApplications} pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Proposals */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Proposals</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {myProposals.slice(0, 3).map((proposal) => (
                <div key={proposal.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      proposal.status === 'approved' ? 'bg-green-500' :
                      proposal.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <h3 className="font-medium text-gray-900">{proposal.title}</h3>
                      <p className="text-sm text-gray-600">Budget: RM {proposal.budget}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                      proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {proposal.status}
                    </span>
                    <span className="text-sm text-gray-500">{proposal.submittedAt}</span>
                  </div>
                </div>
              ))}
              {myProposals.length === 0 && (
                <p className="text-gray-500 text-center py-4">No proposals yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Applications</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {clubApplications.filter(app => app.status === 'pending').slice(0, 3).map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div>
                      <h3 className="font-medium text-gray-900">{application.applicantName}</h3>
                      <p className="text-sm text-gray-600">{application.applicantEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                      Pending Review
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(application.appliedAt)}</span>
                  </div>
                </div>
              ))}
              {pendingApplications === 0 && (
                <p className="text-gray-500 text-center py-4">No pending applications</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'my-clubs') {
    const userClub = clubs.find(club => club.id === userClubId);
    
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Club Management</h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600"></div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{userClub?.name || 'Club'}</h2>
            <p className="text-gray-600 mb-4">High Committee Dashboard</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{myProposals.length}</div>
                <div className="text-sm text-gray-600">Proposals</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{clubEvents.length}</div>
                <div className="text-sm text-gray-600">Events</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{pendingApplications}</div>
                <div className="text-sm text-gray-600">Pending Apps</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{unreadAnnouncements}</div>
                <div className="text-sm text-gray-600">Unread Announcements</div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Announcement
              </button>
              <button
                onClick={() => setShowProposalModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Proposal
              </button>
              <button
                onClick={() => setShowEventModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'applications') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Club Applications</h1>
          <button
            onClick={refreshApplications}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Manage Applications ({clubApplications.length})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Applications for {clubs.find(club => club.id === userClubId)?.name || 'your club'}
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {clubApplications.map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{application.applicantName}</h3>
                      <p className="text-sm text-gray-600">{application.applicantEmail}</p>
                      <p className="text-xs text-gray-500">Applied on {formatDate(application.appliedAt)}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      application.status === 'approved' ? 'bg-green-100 text-green-800' :
                      application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                  
                  {application.motivation && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700"><strong>Motivation:</strong> {application.motivation}</p>
                    </div>
                  )}
                  
                  {application.experience && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700"><strong>Experience:</strong> {application.experience}</p>
                    </div>
                  )}
                  
                  {application.skills && application.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {application.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {application.additionalInfo && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700"><strong>Additional Info:</strong> {application.additionalInfo}</p>
                    </div>
                  )}
                  
                  {application.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveApplication(application.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectApplication(application.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                  
                  {application.feedback && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700"><strong>Decision Feedback:</strong> {application.feedback}</p>
                      {application.reviewedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reviewed by {application.reviewedBy} on {formatDate(application.reviewedAt || '')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {clubApplications.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No applications yet</p>
                  <p className="text-gray-400 text-sm">Applications will appear here when members apply to join your club</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'proposals') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Proposals</h1>
          <button
            onClick={() => setShowProposalModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Proposal
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProposals.map((proposal) => (
            <div key={proposal.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{proposal.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                  proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {proposal.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{proposal.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Budget:</span>
                  <span className="font-medium">RM {proposal.budget}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Submitted:</span>
                  <span className="font-medium">{proposal.submittedAt}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProposal(proposal)}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </button>
            </div>
          ))}
        </div>
        
        {myProposals.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No proposals yet</p>
          </div>
        )}

        {showProposalModal && (
          <CreateProposalModal onClose={() => setShowProposalModal(false)} />
        )}

        {selectedProposal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Proposal Details</h2>
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedProposal.title}</h3>
                    <p className="text-gray-600 mt-1">{selectedProposal.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Budget</span>
                      <p className="font-medium">RM {selectedProposal.budget}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status</span>
                      <p className={`font-medium ${
                        selectedProposal.status === 'approved' ? 'text-green-600' :
                        selectedProposal.status === 'rejected' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {selectedProposal.status.charAt(0).toUpperCase() + selectedProposal.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Submitted</span>
                    <p className="font-medium">{selectedProposal.submittedAt}</p>
                  </div>
                  {selectedProposal.feedback && (
                    <div>
                      <span className="text-sm text-gray-500">Feedback</span>
                      <p className="text-gray-700 mt-1">{selectedProposal.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'events') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Club Events</h1>
          <button
            onClick={() => setShowEventModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date} at {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.isPublic ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {event.isPublic ? 'Public' : 'Private'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    new Date(event.date) > new Date() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {clubEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No events yet</p>
          </div>
        )}

        {showEventModal && (
          <EventModal 
            isOpen={showEventModal}
            onClose={() => setShowEventModal(false)} 
          />
        )}
      </div>
    );
  }

  if (activeTab === 'announcements') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Announcement
            </button>
            {unreadAnnouncements > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {unreadAnnouncements} unread
              </span>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`bg-white rounded-lg shadow p-6 border-l-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                announcement.read ? 'border-gray-300' : 'border-blue-500'
              }`}
              onClick={() => markAnnouncementAsRead(announcement.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                <div className="flex items-center space-x-2">
                  {!announcement.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                  <span className="text-sm text-gray-500">{announcement.createdAt}</span>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{announcement.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">By {announcement.author}</span>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {announcement.targetRole === 'all' || announcement.targetAudience === 'all' ? 'All Members' : 'Club HiCom'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No announcements available</p>
          </div>
        )}

        {showAnnouncementModal && (
          <CreateAnnouncementModal onClose={() => setShowAnnouncementModal(false)} />
        )}
      </div>
    );
  }

  if (activeTab === 'notifications') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 cursor-pointer ${
                notification.read ? 'border-gray-300' : 'border-blue-500'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {!notification.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{notification.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
        
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No notifications</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      <p className="text-gray-600 mt-2">Settings panel coming soon</p>
    </div>
  );
};

export default ClubHiComDashboard;
