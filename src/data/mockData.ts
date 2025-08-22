import { Announcement, Proposal, Event, Club } from '../types';

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann_1',
    title: 'Welcome to New Academic Year 2024/2025',
    content: 'We are excited to welcome all students to the new academic year. Please check your schedules and prepare for an amazing year ahead!',
    authorId: 'user_5',
    authorName: 'Ibrahim Ismail',
    authorRole: 'ppmk_hicom',
    targetRoles: ['all'],
    createdAt: '2024-01-15T10:00:00Z',
    isImportant: true,
    readBy: []
  },
  {
    id: 'ann_2',
    title: 'Robotics Club Meeting This Friday',
    content: 'All robotics club members are invited to attend our weekly meeting this Friday at 2 PM in Lab 3. We will discuss upcoming competitions.',
    authorId: 'user_3',
    authorName: 'Farid Hassan',
    authorRole: 'club_hicom',
    targetRoles: ['club_member'],
    clubId: 'club_1',
    clubName: 'Robotics Club',
    createdAt: '2024-01-14T14:30:00Z',
    isImportant: false,
    readBy: []
  },
  {
    id: 'ann_3',
    title: 'Student Registration Deadline Extended',
    content: 'The deadline for student registration has been extended to January 30th. Please complete your registration as soon as possible.',
    authorId: 'user_4',
    authorName: 'Aminah Binti Ali',
    authorRole: 'ppmk_biro',
    targetRoles: ['ppmk_member', 'club_member'],
    createdAt: '2024-01-13T09:15:00Z',
    isImportant: true,
    readBy: []
  }
];

export const mockProposals: Proposal[] = [
  {
    id: 'prop_1',
    title: 'Annual Robotics Competition 2024',
    description: 'We propose to organize an annual robotics competition to showcase student talents and promote STEM education.',
    submittedBy: 'user_3',
    submitterName: 'Farid Hassan',
    clubId: 'club_1',
    clubName: 'Robotics Club',
    status: 'pending',
    submittedAt: '2024-01-12T16:20:00Z',
    budget: 5000,
    timeline: '3 months',
    expectedOutcome: 'Increased student engagement in robotics and STEM fields'
  },
  {
    id: 'prop_2',
    title: 'Photography Workshop Series',
    description: 'A series of photography workshops for students interested in developing their photography skills.',
    submittedBy: 'user_3',
    submitterName: 'Farid Hassan',
    clubId: 'club_2',
    clubName: 'Photography Club',
    status: 'approved',
    submittedAt: '2024-01-10T11:45:00Z',
    reviewedAt: '2024-01-11T14:30:00Z',
    reviewedBy: 'Ibrahim Ismail',
    feedback: 'Great initiative! Approved with full budget allocation.',
    budget: 2000,
    timeline: '2 months',
    expectedOutcome: 'Enhanced photography skills among students'
  }
];

export const mockEvents: Event[] = [
  {
    id: 'event_1',
    title: 'Robotics Workshop: Introduction to Arduino',
    description: 'Learn the basics of Arduino programming and build your first robot. Perfect for beginners!',
    date: '2024-02-15',
    time: '14:00',
    location: 'Engineering Lab 3',
    organizerId: 'user_3',
    organizerName: 'Farid Hassan',
    clubId: 'club_1',
    clubName: 'Robotics Club',
    maxAttendees: 25,
    attendees: ['user_2'],
    isPublic: true,
    category: 'Workshop',
    image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=400',
    requirements: ['Laptop', 'Basic programming knowledge (optional)'],
    contactInfo: 'farid@robotics.ppmk.edu.my'
  },
  {
    id: 'event_2',
    title: 'Photography Contest: Campus Life',
    description: 'Capture the essence of campus life through your lens. Prizes for top 3 winners!',
    date: '2024-02-20',
    time: '09:00',
    location: 'Main Campus',
    organizerId: 'user_5',
    organizerName: 'Ibrahim Ismail',
    clubId: 'club_2',
    clubName: 'Photography Club',
    maxAttendees: 50,
    attendees: [],
    isPublic: true,
    category: 'Competition',
    image: 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=400',
    requirements: ['Camera or smartphone', 'Creative eye'],
    contactInfo: 'ibrahim@hicom.ppmk.edu.my'
  },
  {
    id: 'event_3',
    title: 'PPMK General Assembly',
    description: 'Annual general assembly for all PPMK members. Important updates and announcements will be shared.',
    date: '2024-02-25',
    time: '10:00',
    location: 'Main Auditorium',
    organizerId: 'user_5',
    organizerName: 'Ibrahim Ismail',
    maxAttendees: 200,
    attendees: [],
    isPublic: true,
    category: 'Meeting',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
    requirements: ['Student ID'],
    contactInfo: 'ibrahim@hicom.ppmk.edu.my'
  }
];

export const mockClubs: Club[] = [
  {
    id: 'club_1',
    name: 'Robotics Club',
    description: 'Explore the fascinating world of robotics, AI, and automation. Build robots, participate in competitions, and develop cutting-edge technology solutions.',
    category: 'Technology',
    memberCount: 45,
    image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=400',
    hicomMembers: ['user_3'],
    establishedYear: 2020,
    activities: ['Robot Building', 'Programming Workshops', 'Competitions', 'Tech Talks'],
    meetingSchedule: 'Every Friday, 2:00 PM - 4:00 PM',
    contactEmail: 'robotics@ppmk.edu.my',
    socialLinks: {
      instagram: '@ppmk_robotics',
      facebook: 'PPMK Robotics Club'
    }
  },
  {
    id: 'club_2',
    name: 'Photography Club',
    description: 'Capture moments, tell stories, and express creativity through the art of photography. From portraits to landscapes, learn all aspects of photography.',
    category: 'Arts',
    memberCount: 32,
    image: 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=400',
    hicomMembers: [],
    establishedYear: 2019,
    activities: ['Photo Walks', 'Editing Workshops', 'Exhibitions', 'Contests'],
    meetingSchedule: 'Every Wednesday, 3:00 PM - 5:00 PM',
    contactEmail: 'photography@ppmk.edu.my',
    socialLinks: {
      instagram: '@ppmk_photography',
      website: 'https://ppmkphoto.com'
    }
  },
  {
    id: 'club_3',
    name: 'Debate Society',
    description: 'Sharpen your critical thinking and public speaking skills. Engage in intellectual discussions and represent PPMK in inter-university debates.',
    category: 'Academic',
    memberCount: 28,
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
    hicomMembers: [],
    establishedYear: 2018,
    activities: ['Weekly Debates', 'Public Speaking Training', 'Competitions', 'Workshops'],
    meetingSchedule: 'Every Tuesday, 4:00 PM - 6:00 PM',
    contactEmail: 'debate@ppmk.edu.my',
    socialLinks: {
      facebook: 'PPMK Debate Society'
    }
  },
  {
    id: 'club_4',
    name: 'Environmental Club',
    description: 'Promote environmental awareness and sustainability on campus. Organize green initiatives and educate the community about environmental issues.',
    category: 'Environment',
    memberCount: 38,
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
    hicomMembers: [],
    establishedYear: 2021,
    activities: ['Tree Planting', 'Recycling Drives', 'Awareness Campaigns', 'Clean-up Events'],
    meetingSchedule: 'Every Saturday, 9:00 AM - 11:00 AM',
    contactEmail: 'environment@ppmk.edu.my',
    socialLinks: {
      instagram: '@ppmk_green',
      facebook: 'PPMK Environmental Club'
    }
  },
  {
    id: 'club_5',
    name: 'Music Society',
    description: 'Express yourself through music! Whether you play instruments, sing, or compose, join us to create beautiful music together.',
    category: 'Arts',
    memberCount: 41,
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400',
    hicomMembers: [],
    establishedYear: 2017,
    activities: ['Band Practice', 'Concerts', 'Music Theory Classes', 'Recording Sessions'],
    meetingSchedule: 'Every Thursday, 5:00 PM - 7:00 PM',
    contactEmail: 'music@ppmk.edu.my',
    socialLinks: {
      instagram: '@ppmk_music',
      youtube: 'PPMK Music Society'
    }
  }
];
