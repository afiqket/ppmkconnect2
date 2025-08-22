import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'seminar' | 'competition' | 'social' | 'meeting' | 'other';
  maxAttendees?: number;
  isPublic: boolean;
  visibility: 'public' | 'private';
  image?: string;
  agenda?: string;
  requirements?: string;
  clubId?: string;
  clubName: string;
  organizerId: string;
  organizerName: string;
  organizerRole: string;
  rsvpList: string[];
  attendees: string[];
  createdAt: string;
  updatedAt: string;
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  rsvpToEvent: (eventId: string, userId: string) => void;
  cancelRSVP: (eventId: string, userId: string) => void;
  getEventById: (id: string) => Event | undefined;
  getUserEvents: (userId: string) => Event[];
  getClubEvents: (clubId: string) => Event[];
  canCreateEvent: () => boolean;
  canEditEvent: (eventId: string) => boolean;
  canDeleteEvent: (eventId: string) => boolean;
  user: any;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

const mockEvents: Event[] = [
  {
    id: 'event_1',
    title: 'React Workshop: Building Modern Web Applications',
    description: 'Learn the fundamentals of React development including hooks, state management, and component architecture. Perfect for beginners and intermediate developers.',
    date: '2024-02-15',
    time: '14:00',
    location: 'Computer Lab A, Block C',
    type: 'workshop',
    maxAttendees: 30,
    isPublic: true,
    visibility: 'public',
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    agenda: '1. Introduction to React\n2. Components and JSX\n3. State and Props\n4. Hooks Overview\n5. Building a Simple App',
    requirements: 'Laptop with Node.js installed, Basic JavaScript knowledge',
    clubId: 'robotics_club',
    clubName: 'Robotics Club',
    organizerId: 'siti@robotics.ppmk.edu.my',
    organizerName: 'Siti Rahman',
    organizerRole: 'club_hicom',
    rsvpList: ['ahmad@ppmk.edu.my'],
    attendees: ['ahmad@ppmk.edu.my'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'event_2',
    title: 'PPMK Annual General Meeting',
    description: 'Annual meeting to discuss PPMK activities, budget allocation, and upcoming initiatives for the academic year.',
    date: '2024-02-20',
    time: '10:00',
    location: 'Main Auditorium',
    type: 'meeting',
    isPublic: true,
    visibility: 'public',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
    clubName: 'PPMK',
    organizerId: 'ibrahim@hicom.ppmk.edu.my',
    organizerName: 'Ibrahim Hassan',
    organizerRole: 'ppmk_hicom',
    rsvpList: ['ahmad@ppmk.edu.my', 'siti@robotics.ppmk.edu.my'],
    attendees: ['ahmad@ppmk.edu.my', 'siti@robotics.ppmk.edu.my'],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 'event_3',
    title: 'Programming Competition 2024',
    description: 'Annual programming competition featuring algorithmic challenges and problem-solving tasks. Open to all skill levels with different categories.',
    date: '2024-03-01',
    time: '09:00',
    location: 'Computer Labs B & C',
    type: 'competition',
    maxAttendees: 50,
    isPublic: true,
    visibility: 'public',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    agenda: '9:00 AM - Registration\n10:00 AM - Competition Begins\n12:00 PM - Lunch Break\n1:00 PM - Final Round\n3:00 PM - Results & Awards',
    requirements: 'Programming knowledge in any language, Laptop with development environment',
    clubId: 'robotics_club',
    clubName: 'Robotics Club',
    organizerId: 'farid@robotics.ppmk.edu.my',
    organizerName: 'Farid Ahmad',
    organizerRole: 'club_member',
    rsvpList: [],
    attendees: [],
    createdAt: '2024-01-20T14:00:00Z',
    updatedAt: '2024-01-20T14:00:00Z'
  },
  {
    id: 'event_4',
    title: 'Social Mixer: Welcome New Members',
    description: 'Casual social event to welcome new PPMK members and foster connections between different clubs and students.',
    date: '2024-02-10',
    time: '18:00',
    location: 'Student Lounge',
    type: 'social',
    isPublic: true,
    visibility: 'public',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
    clubName: 'PPMK',
    organizerId: 'aminah@biro.ppmk.edu.my',
    organizerName: 'Aminah Yusof',
    organizerRole: 'ppmk_biro',
    rsvpList: ['ahmad@ppmk.edu.my'],
    attendees: ['ahmad@ppmk.edu.my'],
    createdAt: '2024-01-05T16:00:00Z',
    updatedAt: '2024-01-05T16:00:00Z'
  }
];

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem('ppmk_events');
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error('Error loading events from localStorage:', error);
        setEvents(mockEvents);
      }
    } else {
      setEvents(mockEvents);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ppmk_events', JSON.stringify(events));
  }, [events]);

  const addEvent = (event: Event) => {
    const newEvent = {
      ...event,
      id: event.id || `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rsvpList: event.rsvpList || [],
      attendees: event.attendees || [],
      visibility: event.isPublic ? 'public' : 'private'
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { 
            ...event, 
            ...eventData, 
            updatedAt: new Date().toISOString(),
            visibility: eventData.isPublic !== undefined ? (eventData.isPublic ? 'public' : 'private') : event.visibility
          }
        : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const rsvpToEvent = (eventId: string, userId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId && !event.rsvpList.includes(userId)) {
        return {
          ...event,
          rsvpList: [...event.rsvpList, userId],
          attendees: [...event.attendees, userId],
          updatedAt: new Date().toISOString()
        };
      }
      return event;
    }));
  };

  const cancelRSVP = (eventId: string, userId: string) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          rsvpList: event.rsvpList.filter(id => id !== userId),
          attendees: event.attendees.filter(id => id !== userId),
          updatedAt: new Date().toISOString()
        };
      }
      return event;
    }));
  };

  const getEventById = (id: string): Event | undefined => {
    return events.find(event => event.id === id);
  };

  const getUserEvents = (userId: string): Event[] => {
    return events.filter(event => event.organizerId === userId);
  };

  const getClubEvents = (clubId: string): Event[] => {
    return events.filter(event => event.clubId === clubId);
  };

  const canCreateEvent = (): boolean => {
    if (!user) return false;
    return ['club_hicom', 'ppmk_biro', 'ppmk_hicom'].includes(user.role);
  };

  const canEditEvent = (eventId: string): boolean => {
    if (!user) return false;
    const event = getEventById(eventId);
    if (!event) return false;
    
    // Event organizer can always edit
    if (event.organizerId === user.id) return true;
    
    // PPMK HiCom can edit any event
    if (user.role === 'ppmk_hicom') return true;
    
    // Club HiCom can edit their club's events
    if (user.role === 'club_hicom' && event.clubId === user.clubId) return true;
    
    return false;
  };

  const canDeleteEvent = (eventId: string): boolean => {
    if (!user) return false;
    const event = getEventById(eventId);
    if (!event) return false;
    
    // Event organizer can always delete
    if (event.organizerId === user.id) return true;
    
    // PPMK HiCom can delete any event
    if (user.role === 'ppmk_hicom') return true;
    
    return false;
  };

  const value: EventContextType = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    rsvpToEvent,
    cancelRSVP,
    getEventById,
    getUserEvents,
    getClubEvents,
    canCreateEvent,
    canEditEvent,
    canDeleteEvent,
    user
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
