import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { mockAnnouncements } from '../data/mockData';

interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  targetRoles: string[];
  createdAt: string;
  isImportant: boolean;
  readBy: string[];
  clubId?: string;
  clubName?: string;
}

interface AnnouncementContextType {
  announcements: Announcement[];
  markAsRead: (announcementId: string) => void;
  markAsUnread: (announcementId: string) => void;
  unreadCount: number;
  addAnnouncement: (announcement: any) => void;
  updateAnnouncement: (announcementId: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (announcementId: string) => void;
  refreshAnnouncements: () => void;
  canCreateAnnouncement: () => boolean;
  canEditAnnouncement: (announcement: Announcement) => boolean;
  canDeleteAnnouncement: (announcement: Announcement) => boolean;
  getVisibleAnnouncements: () => Announcement[];
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [readAnnouncements, setReadAnnouncements] = useState<string[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Initialize announcements from localStorage or mockData
  useEffect(() => {
    const storedAnnouncements = localStorage.getItem('ppmk_announcements');
    if (storedAnnouncements) {
      try {
        const parsed = JSON.parse(storedAnnouncements);
        setAnnouncements(parsed);
      } catch (error) {
        console.error('Error parsing stored announcements:', error);
        setAnnouncements(mockAnnouncements);
        localStorage.setItem('ppmk_announcements', JSON.stringify(mockAnnouncements));
      }
    } else {
      setAnnouncements(mockAnnouncements);
      localStorage.setItem('ppmk_announcements', JSON.stringify(mockAnnouncements));
    }
  }, []);

  // Load read announcements from localStorage on mount
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`announcement_read_${user.id}`);
      if (stored) {
        setReadAnnouncements(JSON.parse(stored));
      }
    }
  }, [user]);

  // Save read announcements to localStorage whenever they change
  useEffect(() => {
    if (user && readAnnouncements.length >= 0) {
      localStorage.setItem(`announcement_read_${user.id}`, JSON.stringify(readAnnouncements));
    }
  }, [readAnnouncements, user]);

  // Listen for localStorage changes (cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ppmk_announcements' && e.newValue) {
        try {
          const newAnnouncements = JSON.parse(e.newValue);
          setAnnouncements(newAnnouncements);
        } catch (error) {
          console.error('Error parsing announcements from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Custom event listener for same-tab updates
  useEffect(() => {
    const handleAnnouncementUpdate = (e: CustomEvent) => {
      setAnnouncements(e.detail);
    };

    window.addEventListener('announcementsUpdated', handleAnnouncementUpdate as EventListener);
    return () => window.removeEventListener('announcementsUpdated', handleAnnouncementUpdate as EventListener);
  }, []);

  const syncAnnouncements = (updatedAnnouncements: Announcement[]) => {
    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('ppmk_announcements', JSON.stringify(updatedAnnouncements));
    
    // Dispatch custom event for same-tab synchronization
    window.dispatchEvent(new CustomEvent('announcementsUpdated', { 
      detail: updatedAnnouncements 
    }));
  };

  const canCreateAnnouncement = (): boolean => {
    if (!user) return false;
    
    // Allow PPMK HiCom, PPMK Biro, and Club HiCom to create announcements
    return user.role === 'ppmk_hicom' || user.role === 'ppmk_biro' || user.role === 'club_hicom';
  };

  const canEditAnnouncement = (announcement: Announcement): boolean => {
    if (!user) return false;
    
    // Senders can always edit their own announcements
    if (announcement.authorId === user.id) return true;
    
    // PPMK HiCom can edit all announcements
    if (user.role === 'ppmk_hicom') return true;
    
    return false;
  };

  const canDeleteAnnouncement = (announcement: Announcement): boolean => {
    if (!user) return false;
    
    // Senders can always delete their own announcements
    if (announcement.authorId === user.id) return true;
    
    // PPMK HiCom can delete all announcements
    if (user.role === 'ppmk_hicom') return true;
    
    return false;
  };

  const isAnnouncementVisibleToUser = (announcement: Announcement): boolean => {
    if (!user) return false;

    // Senders can always see their own announcements
    if (announcement.authorId === user.id) return true;

    // Check if user's role is in the target roles
    if (announcement.targetRoles.includes(user.role)) return true;

    // Check for 'all' targeting
    if (announcement.targetRoles.includes('all')) return true;

    // Club-specific announcements
    if (announcement.clubId && user.clubId === announcement.clubId) {
      return true;
    }

    // PPMK HiCom can see all announcements
    if (user.role === 'ppmk_hicom') return true;

    return false;
  };

  const getVisibleAnnouncements = (): Announcement[] => {
    return announcements.filter(announcement => isAnnouncementVisibleToUser(announcement));
  };

  const addAnnouncement = (announcement: any) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: announcement.id || `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: user?.id || '',
      authorName: user?.name || 'Unknown',
      authorRole: user?.role || 'unknown',
      createdAt: announcement.createdAt || new Date().toISOString(),
      readBy: []
    };

    const updatedAnnouncements = [newAnnouncement, ...announcements];
    syncAnnouncements(updatedAnnouncements);
    
    console.log('Announcement added and synced:', newAnnouncement);
  };

  const updateAnnouncement = (announcementId: string, updates: Partial<Announcement>) => {
    const announcement = announcements.find(a => a.id === announcementId);
    if (!announcement || !canEditAnnouncement(announcement)) {
      console.error('Cannot edit this announcement');
      return;
    }

    const updatedAnnouncements = announcements.map(ann =>
      ann.id === announcementId ? { ...ann, ...updates } : ann
    );
    
    syncAnnouncements(updatedAnnouncements);
    console.log('Announcement updated:', announcementId, updates);
  };

  const deleteAnnouncement = (announcementId: string) => {
    const announcement = announcements.find(a => a.id === announcementId);
    if (!announcement || !canDeleteAnnouncement(announcement)) {
      console.error('Cannot delete this announcement');
      return;
    }

    const updatedAnnouncements = announcements.filter(ann => ann.id !== announcementId);
    syncAnnouncements(updatedAnnouncements);
    console.log('Announcement deleted:', announcementId);
  };

  const refreshAnnouncements = () => {
    const storedAnnouncements = localStorage.getItem('ppmk_announcements');
    if (storedAnnouncements) {
      try {
        const parsed = JSON.parse(storedAnnouncements);
        setAnnouncements(parsed);
      } catch (error) {
        console.error('Error refreshing announcements:', error);
      }
    }
  };

  const markAsRead = (announcementId: string) => {
    console.log('AnnouncementContext: Marking announcement as read:', announcementId);
    if (!readAnnouncements.includes(announcementId)) {
      setReadAnnouncements(prev => [...prev, announcementId]);
    }
  };

  const markAsUnread = (announcementId: string) => {
    console.log('AnnouncementContext: Marking announcement as unread:', announcementId);
    setReadAnnouncements(prev => prev.filter(id => id !== announcementId));
  };

  // Create announcements with read status for the current user
  const visibleAnnouncements = React.useMemo(() => {
    const visible = getVisibleAnnouncements();
    return visible.map(announcement => ({
      ...announcement,
      read: readAnnouncements.includes(announcement.id)
    }));
  }, [announcements, readAnnouncements, user]);

  // Calculate unread count based on visible announcements
  const unreadCount = React.useMemo(() => {
    return visibleAnnouncements.filter(announcement => !announcement.read).length;
  }, [visibleAnnouncements]);

  return (
    <AnnouncementContext.Provider value={{ 
      announcements: visibleAnnouncements,
      markAsRead, 
      markAsUnread, 
      unreadCount,
      addAnnouncement,
      updateAnnouncement,
      deleteAnnouncement,
      refreshAnnouncements,
      canCreateAnnouncement,
      canEditAnnouncement,
      canDeleteAnnouncement,
      getVisibleAnnouncements
    }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
};
