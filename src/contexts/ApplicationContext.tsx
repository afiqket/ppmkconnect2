import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

export interface Application {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  clubId: string;
  clubName: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  motivation: string;
  experience: string;
  skills: string[];
  additionalInfo?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  feedback?: string;
}

interface ApplicationContextType {
  applications: Application[];
  submitApplication: (applicationData: Omit<Application, 'id' | 'appliedAt' | 'status'>) => Promise<boolean>;
  approveApplication: (applicationId: string, feedback?: string) => void;
  rejectApplication: (applicationId: string, feedback?: string) => void;
  updateApplication: (applicationId: string, updates: Partial<Application>) => void;
  deleteApplication: (applicationId: string) => void;
  getUserApplications: (userId: string) => Application[];
  getClubApplications: (clubId: string) => Application[];
  refreshApplications: () => void;
  canViewApplication: (application: Application) => boolean;
  canEditApplication: (application: Application) => boolean;
  canDeleteApplication: (application: Application) => boolean;
  getVisibleApplications: () => Application[];
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [applications, setApplications] = useState<Application[]>([]);

  // Load applications from localStorage on mount
  useEffect(() => {
    const loadApplications = () => {
      const stored = localStorage.getItem('ppmk_applications');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          console.log('ApplicationContext: Loaded applications from localStorage:', parsed.length);
          setApplications(parsed);
        } catch (error) {
          console.error('ApplicationContext: Error parsing stored applications:', error);
          setApplications([]);
        }
      } else {
        console.log('ApplicationContext: No stored applications found');
        setApplications([]);
      }
    };

    loadApplications();
  }, []);

  // Save applications to localStorage whenever they change
  useEffect(() => {
    if (applications.length >= 0) {
      try {
        localStorage.setItem('ppmk_applications', JSON.stringify(applications));
        console.log('ApplicationContext: Saved applications to localStorage:', applications.length);
        
        // Dispatch custom event for cross-component synchronization
        const event = new CustomEvent('applicationsUpdated', { 
          detail: { applications, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
        console.log('ApplicationContext: Dispatched applicationsUpdated event');
      } catch (error) {
        console.error('ApplicationContext: Error saving applications to localStorage:', error);
      }
    }
  }, [applications]);

  // Listen for localStorage changes (cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ppmk_applications' && e.newValue) {
        try {
          const newApplications = JSON.parse(e.newValue);
          console.log('ApplicationContext: Applications updated from storage event:', newApplications.length);
          setApplications(newApplications);
        } catch (error) {
          console.error('ApplicationContext: Error parsing applications from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Custom event listener for same-tab updates
  useEffect(() => {
    const handleApplicationUpdate = (e: CustomEvent) => {
      console.log('ApplicationContext: Applications updated via custom event:', e.detail);
      if (e.detail && e.detail.applications) {
        setApplications(e.detail.applications);
      }
    };

    window.addEventListener('applicationsUpdated', handleApplicationUpdate as EventListener);
    return () => window.removeEventListener('applicationsUpdated', handleApplicationUpdate as EventListener);
  }, []);

  // Periodic refresh to ensure sync
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem('ppmk_applications');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (JSON.stringify(parsed) !== JSON.stringify(applications)) {
            console.log('ApplicationContext: Periodic sync - updating applications');
            setApplications(parsed);
          }
        } catch (error) {
          console.error('ApplicationContext: Error in periodic sync:', error);
        }
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, [applications]);

  const syncApplications = (updatedApplications: Application[]) => {
    setApplications(updatedApplications);
    localStorage.setItem('ppmk_applications', JSON.stringify(updatedApplications));
    
    // Dispatch custom event for same-tab synchronization
    const event = new CustomEvent('applicationsUpdated', { 
      detail: { applications: updatedApplications, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  };

  const canViewApplication = (application: Application): boolean => {
    if (!user) return false;

    // Applicants can always see their own applications
    if (application.applicantId === user.id) return true;

    // Club HiCom can see applications for their club
    if (user.role === 'club_hicom' && application.clubId === user.clubId) return true;

    // PPMK HiCom and Biro can see all applications
    if (user.role === 'ppmk_hicom' || user.role === 'ppmk_biro') return true;

    return false;
  };

  const canEditApplication = (application: Application): boolean => {
    if (!user) return false;

    // Applicants can edit their own pending applications
    if (application.applicantId === user.id && application.status === 'pending') return true;

    // Club HiCom can edit applications for their club (for review purposes)
    if (user.role === 'club_hicom' && application.clubId === user.clubId) return true;

    // PPMK HiCom can edit all applications
    if (user.role === 'ppmk_hicom') return true;

    return false;
  };

  const canDeleteApplication = (application: Application): boolean => {
    if (!user) return false;

    // Applicants can delete their own pending applications
    if (application.applicantId === user.id && application.status === 'pending') return true;

    // PPMK HiCom can delete all applications
    if (user.role === 'ppmk_hicom') return true;

    return false;
  };

  const getVisibleApplications = (): Application[] => {
    return applications.filter(application => canViewApplication(application));
  };

  const refreshApplications = () => {
    console.log('ApplicationContext: Manual refresh requested');
    const stored = localStorage.getItem('ppmk_applications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('ApplicationContext: Refreshed applications:', parsed.length);
        setApplications(parsed);
        
        // Force update event
        const event = new CustomEvent('applicationsUpdated', { 
          detail: { applications: parsed, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error('ApplicationContext: Error refreshing applications:', error);
      }
    }
  };

  const submitApplication = async (applicationData: Omit<Application, 'id' | 'appliedAt' | 'status'>): Promise<boolean> => {
    try {
      console.log('ApplicationContext: Submitting application:', applicationData);
      
      // Check if user already has a pending application for this club
      const existingApplication = applications.find(
        app => app.applicantId === applicationData.applicantId && 
               app.clubId === applicationData.clubId && 
               app.status === 'pending'
      );

      if (existingApplication) {
        console.log('ApplicationContext: Existing pending application found:', existingApplication);
        throw new Error('You already have a pending application for this club');
      }

      const newApplication: Application = {
        ...applicationData,
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        appliedAt: new Date().toISOString(),
        status: 'pending'
      };

      console.log('ApplicationContext: Created new application:', newApplication);

      // Update applications state immediately
      const updatedApplications = [...applications, newApplication];
      syncApplications(updatedApplications);

      console.log('ApplicationContext: Application submitted successfully, total applications:', updatedApplications.length);

      // Add notification for successful submission
      addNotification({
        title: 'Application Submitted',
        message: `Your application to ${applicationData.clubName} has been submitted successfully`,
        type: 'success',
        actionUrl: '/applications',
        actionText: 'View Applications'
      });

      return true;
    } catch (error) {
      console.error('ApplicationContext: Error submitting application:', error);
      
      // Add notification for failed submission
      addNotification({
        title: 'Application Failed',
        message: error instanceof Error ? error.message : 'Failed to submit application. Please try again.',
        type: 'error'
      });

      return false;
    }
  };

  const updateApplication = (applicationId: string, updates: Partial<Application>) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application || !canEditApplication(application)) {
      console.error('Cannot edit this application');
      return;
    }

    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, ...updates } : app
    );

    syncApplications(updatedApplications);
    console.log('ApplicationContext: Application updated successfully');
  };

  const deleteApplication = (applicationId: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application || !canDeleteApplication(application)) {
      console.error('Cannot delete this application');
      return;
    }

    const updatedApplications = applications.filter(app => app.id !== applicationId);
    syncApplications(updatedApplications);
    console.log('ApplicationContext: Application deleted successfully');
  };

  const approveApplication = (applicationId: string, feedback?: string) => {
    console.log('ApplicationContext: Approving application:', applicationId, 'with feedback:', feedback);
    
    const updatedApplications = applications.map(app =>
      app.id === applicationId
        ? {
            ...app,
            status: 'approved' as const,
            reviewedBy: user?.name || 'System',
            reviewedAt: new Date().toISOString(),
            feedback
          }
        : app
    );

    syncApplications(updatedApplications);

    // Find the application to get applicant details
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      addNotification({
        title: 'Application Approved',
        message: `Your application to ${application.clubName} has been approved!`,
        type: 'success',
        actionUrl: '/applications',
        actionText: 'View Applications'
      });
    }

    console.log('ApplicationContext: Application approved successfully');
  };

  const rejectApplication = (applicationId: string, feedback?: string) => {
    console.log('ApplicationContext: Rejecting application:', applicationId, 'with feedback:', feedback);
    
    const updatedApplications = applications.map(app =>
      app.id === applicationId
        ? {
            ...app,
            status: 'rejected' as const,
            reviewedBy: user?.name || 'System',
            reviewedAt: new Date().toISOString(),
            feedback
          }
        : app
    );

    syncApplications(updatedApplications);

    // Find the application to get applicant details
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      addNotification({
        title: 'Application Update',
        message: `Your application to ${application.clubName} has been reviewed`,
        type: 'info',
        actionUrl: '/applications',
        actionText: 'View Applications'
      });
    }

    console.log('ApplicationContext: Application rejected successfully');
  };

  const getUserApplications = (userId: string) => {
    const userApps = getVisibleApplications().filter(app => app.applicantId === userId);
    console.log('ApplicationContext: Getting user applications for:', userId, 'found:', userApps.length);
    return userApps;
  };

  const getClubApplications = (clubId: string) => {
    const clubApps = getVisibleApplications().filter(app => app.clubId === clubId);
    console.log('ApplicationContext: Getting club applications for:', clubId, 'found:', clubApps.length);
    return clubApps;
  };

  return (
    <ApplicationContext.Provider value={{
      applications: getVisibleApplications(),
      submitApplication,
      approveApplication,
      rejectApplication,
      updateApplication,
      deleteApplication,
      getUserApplications,
      getClubApplications,
      refreshApplications,
      canViewApplication,
      canEditApplication,
      canDeleteApplication,
      getVisibleApplications
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationProvider');
  }
  return context;
};
