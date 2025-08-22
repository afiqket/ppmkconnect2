import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../Layout/Layout';
import PPMKMemberDashboard from './PPMKMemberDashboard';
import ClubMemberDashboard from './ClubMemberDashboard';
import ClubHiComDashboard from './ClubHiComDashboard';
import PPMKBiroDashboard from './PPMKBiroDashboard';
import PPMKHiComDashboard from './PPMKHiComDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'ppmk_member':
        return <PPMKMemberDashboard />;
      case 'club_member':
        return <ClubMemberDashboard />;
      case 'club_hicom':
        return <ClubHiComDashboard activeTab="overview" />;
      case 'ppmk_biro':
        return <PPMKBiroDashboard />;
      case 'ppmk_hicom':
        return <PPMKHiComDashboard />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Unknown Role</h2>
              <p className="text-gray-600">Your user role is not recognized.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout>
      {renderDashboard()}
    </Layout>
  );
};

export default Dashboard;
