import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockClubs } from '../data/mockData';

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

interface ClubContextType {
  clubs: Club[];
  getClubById: (id: string) => Club | undefined;
  refreshClubs: () => void;
}

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export const ClubProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    // Initialize clubs from mockData
    setClubs(mockClubs);
  }, []);

  const getClubById = (id: string): Club | undefined => {
    return clubs.find(club => club.id === id);
  };

  const refreshClubs = () => {
    // In a real app, this would fetch from an API
    setClubs(mockClubs);
  };

  return (
    <ClubContext.Provider value={{
      clubs,
      getClubById,
      refreshClubs
    }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClubs = () => {
  const context = useContext(ClubContext);
  if (context === undefined) {
    throw new Error('useClubs must be used within a ClubProvider');
  }
  return context;
};
