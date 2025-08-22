import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, LogOut } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ppmk_member': return 'PPMK Member';
      case 'club_member': return 'Club Member';
      case 'club_hicom': return 'Club HiCom';
      case 'ppmk_biro': return 'PPMK Biro';
      case 'ppmk_hicom': return 'PPMK HiCom';
      default: return role;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PP</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">PPMKConnect</h1>
        </div>

        <div className="flex items-center space-x-4">
          <NotificationDropdown />

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{getRoleDisplayName(user?.role || '')}</p>
            </div>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            )}
            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
