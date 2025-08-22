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
  Megaphone,
  ClipboardList,
  UserPlus
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    switch (user?.role) {
      case 'ppmk_member':
        return [
          ...baseItems,
          { id: 'clubs', label: 'Browse Clubs', icon: Users },
          { id: 'applications', label: 'My Applications', icon: ClipboardList },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
        ];
      
      case 'club_member':
        return [
          ...baseItems,
          { id: 'my-clubs', label: 'My Clubs', icon: Users },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
        ];
      
      case 'club_hicom':
        return [
          ...baseItems,
          { id: 'my-clubs', label: 'My Clubs', icon: Users },
          { id: 'applications', label: 'Applications', icon: UserPlus },
          { id: 'proposals', label: 'Proposals', icon: FileText },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
        ];
      
      case 'ppmk_biro':
        return [
          ...baseItems,
          { id: 'clubs', label: 'Clubs', icon: Users },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
        ];
      
      case 'ppmk_hicom':
        return [
          ...baseItems,
          { id: 'clubs', label: 'Clubs', icon: Users },
          { id: 'proposals', label: 'Proposals', icon: FileText },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
        ];
      
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">PPMKConnect</h1>
        <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
        <p className="text-xs text-gray-500">{user?.role?.replace('_', ' ').toUpperCase()}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors mb-2 ${
            activeTab === 'settings'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </button>
        
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-left rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
