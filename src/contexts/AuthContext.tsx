import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for testing
const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Ahmad Rahman',
    email: 'ahmad@ppmk.edu.my',
    role: 'ppmk_member',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    joinedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user_2',
    name: 'Siti Nurhaliza',
    email: 'siti@robotics.ppmk.edu.my',
    role: 'club_member',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    clubId: 'club_1',
    clubName: 'Robotics Club',
    joinedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'user_3',
    name: 'Farid Hassan',
    email: 'farid@robotics.ppmk.edu.my',
    role: 'club_hicom',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    clubId: 'club_1',
    clubName: 'Robotics Club',
    joinedAt: '2023-08-15T00:00:00Z'
  },
  {
    id: 'user_4',
    name: 'Aminah Binti Ali',
    email: 'aminah@biro.ppmk.edu.my',
    role: 'ppmk_biro',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    joinedAt: '2023-01-10T00:00:00Z'
  },
  {
    id: 'user_5',
    name: 'Ibrahim Ismail',
    email: 'ibrahim@hicom.ppmk.edu.my',
    role: 'ppmk_hicom',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    joinedAt: '2022-06-01T00:00:00Z'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('ppmk_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('AuthContext: Loaded user from localStorage:', parsedUser);
      } catch (error) {
        console.error('AuthContext: Error parsing stored user:', error);
        localStorage.removeItem('ppmk_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('ppmk_user', JSON.stringify(foundUser));
      console.log('AuthContext: User logged in:', foundUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ppmk_user');
    console.log('AuthContext: User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
