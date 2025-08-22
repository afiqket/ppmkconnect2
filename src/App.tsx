import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AnnouncementProvider } from './contexts/AnnouncementContext';
import { ProposalProvider } from './contexts/ProposalContext';
import { EventProvider } from './contexts/EventContext';
import { ApplicationProvider } from './contexts/ApplicationContext';
import { ClubProvider } from './contexts/ClubContext';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ClubProvider>
            <AnnouncementProvider>
              <ProposalProvider>
                <EventProvider>
                  <ApplicationProvider>
                    <AppRoutes />
                  </ApplicationProvider>
                </EventProvider>
              </ProposalProvider>
            </AnnouncementProvider>
          </ClubProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
