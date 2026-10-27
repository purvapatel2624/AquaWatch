import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  PollutionObservation, 
  FilterState, 
  CommunityReport, 
  SeverityLevel,
  WaterbodyType,
  PlasticWasteCategory 
} from '../types/pollution';
import { AUTHENTIC_POLLUTION_DATA } from '../data/authenticDatasets';
import { calculateConfidence } from '../utils/confidenceScore';

interface PollutionContextType {
  observations: PollutionObservation[];
  filteredObservations: PollutionObservation[];
  selectedLocation: PollutionObservation | null;
  setSelectedLocation: (loc: PollutionObservation | null) => void;
  compareLocation: PollutionObservation | null;
  setCompareLocation: (loc: PollutionObservation | null) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  communityReports: CommunityReport[];
  submitCommunityReport: (report: Omit<CommunityReport, 'id' | 'status' | 'submittedAt'>) => void;
  verifyCommunityReport: (id: string) => void;
  demoMode: boolean;
  setDemoMode: (val: boolean) => void;
  showHotspotsOnly: boolean;
  setShowHotspotsOnly: (val: boolean) => void;
}

const initialFilters: FilterState = {
  searchQuery: '',
  country: 'all',
  waterbodyType: 'all',
  severity: 'all',
  provenance: 'all',
  wasteCategory: 'all',
  minConfidence: 0,
  yearRange: [2018, 2024],
};

const PollutionContext = createContext<PollutionContextType | undefined>(undefined);

export const PollutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [observations, setObservations] = useState<PollutionObservation[]>(AUTHENTIC_POLLUTION_DATA);
  const [selectedLocation, setSelectedLocation] = useState<PollutionObservation | null>(AUTHENTIC_POLLUTION_DATA[0]);
  const [compareLocation, setCompareLocation] = useState<PollutionObservation | null>(AUTHENTIC_POLLUTION_DATA[1]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [showHotspotsOnly, setShowHotspotsOnly] = useState<boolean>(false);

  // Initial community reports (transparently labeled)
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>([
    {
      id: 'comm-rep-101',
      locationName: 'Brighton Pier Shingle Beach',
      waterbodyType: 'beach',
      coordinates: [50.8166, -0.1372],
      date: '2024-03-01',
      time: '14:30',
      wasteCategory: 'bottles',
      estimatedPieces: 85,
      severity: 'Moderate',
      description: 'Accumulation of plastic bottle caps, broken drink bottles, and disposable coffee cups along the high-tide driftline.',
      reporterName: 'Marine Watch Volunteer Club',
      reporterEmail: 'volunteer@marinewatch.org',
      photoUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=500&auto=format&fit=crop&q=60',
      status: 'verified',
      submittedAt: '2024-03-01T15:00:00Z',
    },
    {
      id: 'comm-rep-102',
      locationName: 'Ganges River Ghats, Varanasi',
      waterbodyType: 'river',
      coordinates: [25.3176, 82.9739],
      date: '2024-03-12',
      time: '09:15',
      wasteCategory: 'bags',
      estimatedPieces: 210,
      severity: 'High',
      description: 'Thin polyethylene packaging films and polythene shopping bags caught around river edge mooring posts.',
      reporterName: 'Arun K.',
      reporterEmail: 'arunk@cleanwater.org',
      photoUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=500&auto=format&fit=crop&q=60',
      status: 'pending_review',
      submittedAt: '2024-03-12T10:00:00Z',
    }
  ]);

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const submitCommunityReport = (report: Omit<CommunityReport, 'id' | 'status' | 'submittedAt'>) => {
    const newId = `comm-rep-${Date.now()}`;
    const newReport: CommunityReport = {
      ...report,
      id: newId,
      status: 'pending_review',
      submittedAt: new Date().toISOString(),
    };
    setCommunityReports(prev => [newReport, ...prev]);

    // Also add to active observations as 'community_unverified' so users can see it flagged with a caution badge
    const newObservation: PollutionObservation = {
      id: newId,
      locationName: report.locationName,
      waterbodyName: `${report.locationName} (${report.waterbodyType})`,
      waterbodyType: report.waterbodyType,
      coordinates: report.coordinates,
      country: 'Community Submission',
      region: 'Citizen Science Network',
      reportedDate: report.date,
      severity: report.severity,
      severityScore: report.severity === 'Critical' ? 90 : report.severity === 'High' ? 70 : report.severity === 'Moderate' ? 45 : 20,
      provenance: 'community_unverified',
      primaryDebrisCategory: report.wasteCategory,
      categoryBreakdown: {
        bottles: report.wasteCategory === 'bottles' ? 60 : 10,
        bags: report.wasteCategory === 'bags' ? 60 : 10,
        packaging: report.wasteCategory === 'packaging' ? 60 : 10,
        fishing_gear: report.wasteCategory === 'fishing_gear' ? 60 : 10,
        microplastics: report.wasteCategory === 'microplastics' ? 60 : 10,
        other: 10,
      },
      measuredValue: report.estimatedPieces,
      measurementUnit: 'estimated visible pieces (Citizen Report)',
      dataSource: `AquaWatch Citizen Observation by ${report.reporterName}`,
      methodology: 'Citizen science direct geo-tagged visual count; pending formal regional verification.',
      confidence: calculateConfidence('community_unverified', report.date, 'Visual observation by citizen'),
      description: report.description,
      imageUrl: report.photoUrl,
      isHotspot: report.severity === 'Critical' || report.severity === 'High',
    };

    setObservations(prev => [newObservation, ...prev]);
  };

  const verifyCommunityReport = (id: string) => {
    setCommunityReports(prev => prev.map(rep => {
      if (rep.id === id) {
        return { ...rep, status: 'verified' as const };
      }
      return rep;
    }));

    setObservations(prev => prev.map(obs => {
      if (obs.id === id) {
        return {
          ...obs,
          provenance: 'community_verified' as const,
          confidence: calculateConfidence('community_verified', obs.reportedDate, 'Verified community audit'),
        };
      }
      return obs;
    }));
  };

  // Filtered observations
  const filteredObservations = useMemo(() => {
    return observations.filter(item => {
      // Hotspots toggle
      if (showHotspotsOnly && !item.isHotspot && item.severityScore < 75) {
        return false;
      }

      // Demo mode filter
      if (!demoMode && item.provenance === 'demonstration_simulation') {
        return false;
      }

      // Search query (location name, country, waterbody, description)
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = item.locationName.toLowerCase().includes(query);
        const matchesCountry = item.country.toLowerCase().includes(query);
        const matchesWaterbody = item.waterbodyName.toLowerCase().includes(query);
        const matchesSource = item.dataSource.toLowerCase().includes(query);
        if (!matchesName && !matchesCountry && !matchesWaterbody && !matchesSource) {
          return false;
        }
      }

      // Country filter
      if (filters.country !== 'all' && item.country.toLowerCase() !== filters.country.toLowerCase()) {
        return false;
      }

      // Waterbody type filter
      if (filters.waterbodyType !== 'all' && item.waterbodyType !== filters.waterbodyType) {
        return false;
      }

      // Severity filter
      if (filters.severity !== 'all' && item.severity.toLowerCase() !== filters.severity.toLowerCase()) {
        return false;
      }

      // Provenance filter
      if (filters.provenance !== 'all' && item.provenance !== filters.provenance) {
        return false;
      }

      // Waste category filter
      if (filters.wasteCategory !== 'all' && item.primaryDebrisCategory !== filters.wasteCategory) {
        return false;
      }

      // Confidence score threshold
      if (item.confidence.overallScore < filters.minConfidence) {
        return false;
      }

      // Year range filter
      const itemYear = new Date(item.reportedDate).getFullYear();
      if (itemYear < filters.yearRange[0] || itemYear > filters.yearRange[1]) {
        return false;
      }

      return true;
    });
  }, [observations, filters, showHotspotsOnly, demoMode]);

  return (
    <PollutionContext.Provider
      value={{
        observations,
        filteredObservations,
        selectedLocation,
        setSelectedLocation,
        compareLocation,
        setCompareLocation,
        filters,
        setFilters,
        resetFilters,
        communityReports,
        submitCommunityReport,
        verifyCommunityReport,
        demoMode,
        setDemoMode,
        showHotspotsOnly,
        setShowHotspotsOnly,
      }}
    >
      {children}
    </PollutionContext.Provider>
  );
};

export const usePollution = () => {
  const context = useContext(PollutionContext);
  if (!context) {
    throw new Error('usePollution must be used within a PollutionProvider');
  }
  return context;
};
