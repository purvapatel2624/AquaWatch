import React, { useState } from 'react';
import { PollutionProvider, usePollution } from './context/PollutionContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { PollutionMap } from './components/map/PollutionMap';
import { LocationDetailModal } from './components/map/LocationDetailModal';
import { PollutionDashboard } from './components/dashboard/PollutionDashboard';
import { AIInsightsPanel } from './components/insights/AIInsightsPanel';
import { LearnSection } from './components/educational/LearnSection';
import { MethodologySection } from './components/sources/MethodologySection';
import { CommunityReportModal } from './components/report/CommunityReportModal';
import { HackathonModal } from './components/common/HackathonModal';
import { AuthModal } from './components/auth/AuthModal';
import { UserProfileModal } from './components/auth/UserProfileModal';
import { NgoDashboardModal } from './components/ngo/NgoDashboardModal';
import { CleanupDrivesModal } from './components/cleanups/CleanupDrivesModal';
import { HomePage } from './components/home/HomePage';
import { PollutionObservation } from './types/pollution';
import { UserRole } from './types/auth';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [inspectModalOpen, setInspectModalOpen] = useState<boolean>(false);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [hackathonModalOpen, setHackathonModalOpen] = useState<boolean>(false);
  const [inspectedLocation, setInspectedLocation] = useState<PollutionObservation | null>(null);
  const [clickedMapCoords, setClickedMapCoords] = useState<[number, number] | null>(null);

  // Auth & Roles Modals
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<UserRole>('user');
  const [authRedirectReason, setAuthRedirectReason] = useState<string | undefined>(undefined);
  const [userProfileModalOpen, setUserProfileModalOpen] = useState<boolean>(false);
  const [ngoDashboardOpen, setNgoDashboardOpen] = useState<boolean>(false);
  const [cleanupDrivesOpen, setCleanupDrivesOpen] = useState<boolean>(false);

  const { setSelectedLocation, setCompareLocation } = usePollution();

  const handleOpenDetails = (loc: PollutionObservation) => {
    setInspectedLocation(loc);
    setSelectedLocation(loc);
    setInspectModalOpen(true);
  };

  const handleCompareFromModal = (loc: PollutionObservation) => {
    setCompareLocation(loc);
    setActiveTab('dashboard');
  };

  const handleMapCoordinateClick = (lat: number, lng: number) => {
    setClickedMapCoords([lat, lng]);
  };

  const handleOpenAuth = (role?: UserRole, reason?: string) => {
    setAuthDefaultRole(role || 'user');
    setAuthRedirectReason(reason);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenReportModal={() => setReportModalOpen(true)}
        onOpenAuthModal={handleOpenAuth}
        onOpenProfileModal={() => setUserProfileModalOpen(true)}
        onOpenNgoDashboard={() => setNgoDashboardOpen(true)}
        onOpenCleanupDrives={() => setCleanupDrivesOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && (
          <HomePage
            onNavigate={setActiveTab}
            onOpenAuth={() => handleOpenAuth('user')}
          />
        )}

        {activeTab === 'map' && (
          <PollutionMap 
            onOpenDetails={handleOpenDetails}
            onMapCoordinateClick={handleMapCoordinateClick}
          />
        )}

        {activeTab === 'dashboard' && (
          <PollutionDashboard 
            onInspect={handleOpenDetails}
          />
        )}

        {activeTab === 'insights' && (
          <AIInsightsPanel />
        )}

        {activeTab === 'learn' && (
          <LearnSection />
        )}

        {activeTab === 'methodology' && (
          <MethodologySection />
        )}
      </main>

      {/* Location Scientific Detail Modal */}
      <LocationDetailModal
        location={inspectedLocation}
        onClose={() => setInspectModalOpen(false)}
        onCompare={handleCompareFromModal}
      />

      {/* Community Report Modal */}
      <CommunityReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        initialCoordinates={clickedMapCoords}
        onTriggerAuth={(reason) => handleOpenAuth('user', reason)}
      />

      {/* Authentication Modal (Login / Sign Up for User & NGO) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={authDefaultRole}
        redirectReason={authRedirectReason}
      />

      {/* Ordinary User Profile & My Reports Modal */}
      <UserProfileModal
        isOpen={userProfileModalOpen}
        onClose={() => setUserProfileModalOpen(false)}
        onOpenReportModal={() => setReportModalOpen(true)}
        onOpenCleanupDrives={() => setCleanupDrivesOpen(true)}
      />

      {/* NGO / Organization Command Center Dashboard */}
      <NgoDashboardModal
        isOpen={ngoDashboardOpen}
        onClose={() => setNgoDashboardOpen(false)}
      />

      {/* Public Environmental Cleanup Drives Modal */}
      <CleanupDrivesModal
        isOpen={cleanupDrivesOpen}
        onClose={() => setCleanupDrivesOpen(false)}
        onTriggerAuth={(reason) => handleOpenAuth('user', reason)}
      />

      {/* Hackathon Pitch Presentation Modal */}
      <HackathonModal
        isOpen={hackathonModalOpen}
        onClose={() => setHackathonModalOpen(false)}
      />

      {/* Footer */}
      <Footer 
        onOpenHackathonModal={() => setHackathonModalOpen(true)}
        setActiveTab={setActiveTab}
      />

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <PollutionProvider>
        <MainApp />
      </PollutionProvider>
    </AuthProvider>
  );
}

export default App;
