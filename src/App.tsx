import React, { useState } from 'react';
import { PollutionProvider, usePollution } from './context/PollutionContext';
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
import { PollutionObservation } from './types/pollution';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('map');
  const [inspectModalOpen, setInspectModalOpen] = useState<boolean>(false);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [hackathonModalOpen, setHackathonModalOpen] = useState<boolean>(false);
  const [inspectedLocation, setInspectedLocation] = useState<PollutionObservation | null>(null);
  const [clickedMapCoords, setClickedMapCoords] = useState<[number, number] | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Top Navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenReportModal={() => setReportModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 flex flex-col">
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
    <PollutionProvider>
      <MainApp />
    </PollutionProvider>
  );
}

export default App;
