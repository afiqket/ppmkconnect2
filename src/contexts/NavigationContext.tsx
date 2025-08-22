import React, { createContext, useContext, useState, ReactNode } from 'react';

export type NavigationTab = 
  | 'overview' 
  | 'notifications' 
  | 'announcements' 
  | 'clubs' 
  | 'events' 
  | 'applications' 
  | 'proposals';

interface NavigationContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');

  return (
    <NavigationContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </NavigationContext.Provider>
  );
};
