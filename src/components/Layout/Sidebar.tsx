import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Bell, 
  Settings, 
  LogOut,
  X,
  UserCheck,
  Building2,
  Megaphone
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { icon: Home, label: 'Overview', id: 'overview' },
      { icon: Bell, label: 'Notifications', id: 'notifications' }
    ];

    switch (user?.role) {
      case 'ppmk_member':
        return [
          ...baseItems,
          { icon: Megaphone, label: 'Announcements', id: 'announcements' },
          { icon: Users, label: 'Clubs', id: 'clubs' },
          { icon: Calendar, label: 'Events', id: 'events' },
          { icon: FileText, label: 'My Applications', id: 'applications' }
        ];
      
      case 'club_member':
        return [
          ...baseItems,
          { icon: Megaphone, label: 'Announcements', id: 'announcements' },
          { icon: Building2, label: 'My Clubs', id: 'clubs' },
          { icon: Calendar, label: 'Events', id: 'events' }
        ];
      
      case 'club_hicom':
        return [
          ...baseItems,
          { icon: Megaphone, label: 'Announcements', id: 'announcements' },
          { icon: UserCheck, label: 'Applications', id: 'applications' },
          { icon: FileText, label: 'Proposals', id: 'proposals' },
          { icon: Calendar, label: 'Events', id: 'events' }
        ];
      
      case 'ppmk_biro':
        return [
          ...baseItems,
          { icon: Megaphone, label: 'Announcements', id: 'announcements' },
          { icon: Users, label: 'Clubs', id: 'clubs' },
          { icon: Calendar, label: 'Events', id: 'events' },
          { icon: FileText, label: 'Proposals', id: 'proposals' }
        ];
      
      case 'ppmk_hicom':
        return [
          ...baseItems,
          { icon: Megaphone, label: 'Announcements', id: 'announcements' },
          { icon: Users, label: 'Clubs', id: 'clubs' },
          { icon: Calendar, label: 'Events', id: 'events' },
          { icon: FileText, label: 'Proposals', id: 'proposals' },
          { icon: UserCheck, label: 'Applications', id: 'applications' }
        ];
      
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
            
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
