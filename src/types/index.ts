export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ppmk_member' | 'club_member' | 'club_hicom' | 'ppmk_biro' | 'ppmk_hicom';
  avatar: string;
  clubId?: string;
  clubName?: string;
  joinedAt: string;
}

export interface Announcement {
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

export interface Proposal {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  submitterName: string;
  clubId: string;
  clubName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  feedback?: string;
  budget?: number;
  timeline?: string;
  expectedOutcome?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizerId: string;
  organizerName: string;
  clubId?: string;
  clubName?: string;
  maxAttendees?: number;
  attendees: string[];
  isPublic?: boolean;
  category: string;
  image?: string;
  requirements?: string[];
  contactInfo?: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  image: string;
  hicomMembers: string[];
  establishedYear: number;
  activities: string[];
  meetingSchedule: string;
  contactEmail: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}
