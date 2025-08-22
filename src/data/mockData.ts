export const mockUsers = [
  {
    id: '1',
    email: 'admin@ppmk.edu.my',
    name: 'Ahmad Rahman',
    role: 'ppmk_hicom' as const,
    clubId: null,
    clubName: null
  },
  {
    id: '2',
    email: 'member@ppmk.edu.my',
    name: 'Siti Nurhaliza',
    role: 'ppmk_member' as const,
    clubId: null,
    clubName: null
  },
  {
    id: '3',
    email: 'club@ppmk.edu.my',
    name: 'Muhammad Ali',
    role: 'club_member' as const,
    clubId: 'club_1',
    clubName: 'Photography Club'
  },
  {
    id: '4',
    email: 'hicom@ppmk.edu.my',
    name: 'Fatimah Zahra',
    role: 'club_hicom' as const,
    clubId: 'club_1',
    clubName: 'Photography Club'
  },
  {
    id: '5',
    email: 'biro@ppmk.edu.my',
    name: 'Hassan Ibrahim',
    role: 'ppmk_biro' as const,
    clubId: null,
    clubName: null
  }
];

export const mockProposals = [
  {
    id: 'prop_1',
    title: 'Photography Exhibition 2024',
    description: 'Annual photography exhibition showcasing student works from various genres including landscape, portrait, and street photography. The exhibition will feature 50+ photographs from club members and will be open to the public for one week.',
    submittedBy: '4',
    submitterName: 'Fatimah Zahra',
    clubId: 'club_1',
    clubName: 'Photography Club',
    status: 'pending' as const,
    submittedAt: '2024-01-15T10:30:00Z',
    budget: 2500,
    timeline: '3 months preparation, 1 week exhibition',
    expectedOutcome: 'Showcase student talent, attract new members, strengthen club reputation'
  },
  {
    id: 'prop_2',
    title: 'Inter-University Debate Tournament',
    description: 'Host a prestigious debate tournament inviting teams from 8 universities across Malaysia. Topics will cover current affairs, technology ethics, and social issues. Prize pool of RM 10,000 for winners.',
    submittedBy: '3',
    submitterName: 'Muhammad Ali',
    clubId: 'club_2',
    clubName: 'Debate Society',
    status: 'approved' as const,
    submittedAt: '2024-01-10T14:20:00Z',
    reviewedAt: '2024-01-12T09:15:00Z',
    reviewedBy: '1',
    feedback: 'Excellent proposal with clear objectives and realistic budget. Approved for execution.',
    budget: 15000,
    timeline: '4 months preparation, 3 days tournament',
    expectedOutcome: 'Enhance university reputation, develop student skills, networking opportunities'
  },
  {
    id: 'prop_3',
    title: 'Music Festival - Harmony 2024',
    description: 'A day-long music festival featuring student bands, solo performances, and guest artists. Multiple genres including traditional Malaysian music, contemporary, and fusion. Food stalls and merchandise booths included.',
    submittedBy: '4',
    submitterName: 'Fatimah Zahra',
    clubId: 'club_3',
    clubName: 'Music Club',
    status: 'rejected' as const,
    submittedAt: '2024-01-08T16:45:00Z',
    reviewedAt: '2024-01-11T11:30:00Z',
    reviewedBy: '1',
    feedback: 'Budget exceeds allocated funds for single events. Please revise and resubmit with reduced scope or seek additional sponsorship.',
    budget: 25000,
    timeline: '5 months preparation, 1 day event',
    expectedOutcome: 'Cultural celebration, community engagement, fundraising for club activities'
  },
  {
    id: 'prop_4',
    title: 'Tech Innovation Workshop Series',
    description: 'Monthly workshop series covering emerging technologies: AI/ML, blockchain, IoT, and cybersecurity. Industry experts as speakers, hands-on coding sessions, and project showcases.',
    submittedBy: '3',
    submitterName: 'Muhammad Ali',
    clubId: 'club_4',
    clubName: 'Tech Innovation',
    status: 'pending' as const,
    submittedAt: '2024-01-14T13:15:00Z',
    budget: 8000,
    timeline: '6 months series, monthly sessions',
    expectedOutcome: 'Skill development, industry connections, innovation projects'
  },
  {
    id: 'prop_5',
    title: 'Community Service - Digital Literacy Program',
    description: 'Outreach program to teach basic digital skills to elderly residents in nearby communities. Weekly sessions covering smartphone usage, online banking safety, and social media basics.',
    submittedBy: '4',
    submitterName: 'Fatimah Zahra',
    clubId: 'club_4',
    clubName: 'Tech Innovation',
    status: 'approved' as const,
    submittedAt: '2024-01-12T08:00:00Z',
    reviewedAt: '2024-01-13T15:45:00Z',
    reviewedBy: '1',
    feedback: 'Commendable community service initiative. Approved with full support from PPMK.',
    budget: 1200,
    timeline: '3 months program, weekly sessions',
    expectedOutcome: 'Community impact, student volunteer experience, social responsibility'
  }
];

export const mockAnnouncements = [
  {
    id: 'ann_1',
    title: 'Welcome to New Academic Year 2024',
    content: 'We are excited to welcome all students to the new academic year. Please check your schedules and prepare for an amazing year ahead filled with learning opportunities and exciting club activities.',
    authorId: '1',
    authorName: 'Ahmad Rahman',
    authorRole: 'ppmk_hicom',
    targetRoles: ['all'],
    createdAt: '2024-01-10T09:00:00Z',
    isImportant: true,
    readBy: [],
    type: 'general'
  },
  {
    id: 'ann_2',
    title: 'Photography Workshop This Weekend',
    content: 'Join us for an intensive photography workshop covering landscape, portrait, and street photography techniques. Professional photographers will guide you through hands-on sessions. Limited seats available!',
    authorId: '4',
    authorName: 'Fatimah Zahra',
    authorRole: 'club_hicom',
    targetRoles: ['club_member', 'ppmk_member'],
    createdAt: '2024-01-12T14:30:00Z',
    isImportant: false,
    readBy: [],
    clubId: 'club_1',
    clubName: 'Photography Club',
    type: 'event'
  },
  {
    id: 'ann_3',
    title: 'URGENT: System Maintenance Tonight',
    content: 'The student portal will be undergoing scheduled maintenance tonight from 11 PM to 3 AM. Please save your work and log out before the maintenance window. We apologize for any inconvenience.',
    authorId: '5',
    authorName: 'Hassan Ibrahim',
    authorRole: 'ppmk_biro',
    targetRoles: ['all'],
    createdAt: '2024-01-13T16:45:00Z',
    isImportant: true,
    readBy: [],
    type: 'urgent'
  },
  {
    id: 'ann_4',
    title: 'Club Registration Deadline Extended',
    content: 'Good news! We have extended the club registration deadline to January 25th. This gives new students more time to explore different clubs and make informed decisions about their extracurricular activities.',
    authorId: '1',
    authorName: 'Ahmad Rahman',
    authorRole: 'ppmk_hicom',
    targetRoles: ['ppmk_member', 'club_member'],
    createdAt: '2024-01-14T11:20:00Z',
    isImportant: false,
    readBy: [],
    type: 'general'
  },
  {
    id: 'ann_5',
    title: 'Inter-Club Debate Competition',
    content: 'The annual inter-club debate competition is scheduled for February 15th. Topics will cover current affairs, technology, and social issues. Prizes worth RM 5,000 await the winners!',
    authorId: '1',
    authorName: 'Ahmad Rahman',
    authorRole: 'ppmk_hicom',
    targetRoles: ['club_hicom', 'club_member'],
    createdAt: '2024-01-15T08:15:00Z',
    isImportant: false,
    readBy: [],
    type: 'event'
  },
  {
    id: 'ann_6',
    title: 'New Club Formation Guidelines',
    content: 'Updated guidelines for forming new student clubs are now available. The process has been streamlined and new digital forms are available on the portal. Minimum 15 founding members required.',
    authorId: '5',
    authorName: 'Hassan Ibrahim',
    authorRole: 'ppmk_biro',
    targetRoles: ['ppmk_member'],
    createdAt: '2024-01-16T13:00:00Z',
    isImportant: false,
    readBy: [],
    type: 'general'
  }
];

export const mockClubs = [
  {
    id: 'club_1',
    name: 'Photography Club',
    description: 'Capture moments, create memories',
    members: 45,
    events: 8,
    category: 'Arts & Culture'
  },
  {
    id: 'club_2',
    name: 'Debate Society',
    description: 'Where words meet wisdom',
    members: 32,
    events: 12,
    category: 'Academic'
  },
  {
    id: 'club_3',
    name: 'Music Club',
    description: 'Harmony in diversity',
    members: 28,
    events: 6,
    category: 'Arts & Culture'
  },
  {
    id: 'club_4',
    name: 'Tech Innovation',
    description: 'Building the future today',
    members: 67,
    events: 15,
    category: 'Technology'
  }
];
