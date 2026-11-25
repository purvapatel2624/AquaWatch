import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { 
  PollutionObservation, 
  FilterState, 
  CommunityReport, 
  CommunityReportStatus,
  SeverityLevel,
  WaterbodyType,
  PlasticWasteCategory 
} from '../types/pollution';
import { CleanupDrive } from '../types/auth';
import { AUTHENTIC_POLLUTION_DATA } from '../data/authenticDatasets';
import { INITIAL_CLEANUP_DRIVES } from '../data/mockAuthData';
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
  updateReportStatus: (
    reportId: string,
    newStatus: CommunityReportStatus,
    reviewerName?: string,
    reviewerId?: string,
    notes?: string
  ) => void;
  cleanupDrives: CleanupDrive[];
  createCleanupDrive: (drive: Omit<CleanupDrive, 'id' | 'registeredVolunteers' | 'status'>) => void;
  registerForCleanupDrive: (driveId: string, userEmail: string) => boolean;
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

const REPORTS_STORAGE_KEY = 'aquawatch_community_reports_v1';
const DRIVES_STORAGE_KEY = 'aquawatch_cleanup_drives_v1';

const INITIAL_COMMUNITY_REPORTS: CommunityReport[] = [
  {
    id: 'comm-rep-101',
    userId: 'user-elena-01',
    locationName: 'Brighton Pier Shingle Beach',
    waterbodyType: 'beach',
    coordinates: [50.8166, -0.1372],
    date: '2024-03-01',
    time: '14:30',
    wasteCategory: 'bottles',
    estimatedPieces: 85,
    severity: 'Moderate',
    description: 'Accumulation of plastic bottle caps, broken drink bottles, and disposable coffee cups along the high-tide driftline.',
    reporterName: 'Elena Rostova',
    reporterEmail: 'elena.citizen@aquawatch.org',
    photoUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=500&auto=format&fit=crop&q=60',
    status: 'verified',
    submittedAt: '2024-03-01T15:00:00Z',
    reviewedByNgoName: 'Pacific Ocean Cleanup Alliance',
    reviewNotes: 'Transect audit confirmed. Density matches seasonal tidal accumulation.',
    updatedAt: '2024-03-02T10:30:00Z',
  },
  {
    id: 'comm-rep-102',
    userId: 'user-elena-01',
    locationName: 'Santa Monica Pier Driftline',
    waterbodyType: 'beach',
    coordinates: [34.0099, -118.4960],
    date: '2024-03-10',
    time: '16:45',
    wasteCategory: 'packaging',
    estimatedPieces: 120,
    severity: 'High',
    description: 'Dense cluster of fast food containers, polystyrene fragments, and plastic wrappers washed onto the upper dry sand zone after weekend swells.',
    reporterName: 'Elena Rostova',
    reporterEmail: 'elena.citizen@aquawatch.org',
    photoUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=500&auto=format&fit=crop&q=60',
    status: 'cleanup_scheduled',
    submittedAt: '2024-03-10T17:15:00Z',
    reviewedByNgoName: 'Pacific Ocean Cleanup Alliance',
    reviewNotes: 'Scheduled for upcoming beach volunteer sweep.',
    updatedAt: '2024-03-11T09:00:00Z',
  },
  {
    id: 'comm-rep-103',
    userId: 'user-arun-02',
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
    photoUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=500&auto=format&fit=crop&q=60',
    status: 'pending_review',
    submittedAt: '2024-03-12T10:00:00Z',
  }
];

const PollutionContext = createContext<PollutionContextType | undefined>(undefined);

export const PollutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [observations, setObservations] = useState<PollutionObservation[]>(AUTHENTIC_POLLUTION_DATA);
  const [selectedLocation, setSelectedLocation] = useState<PollutionObservation | null>(AUTHENTIC_POLLUTION_DATA[0]);
  const [compareLocation, setCompareLocation] = useState<PollutionObservation | null>(AUTHENTIC_POLLUTION_DATA[1]);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [showHotspotsOnly, setShowHotspotsOnly] = useState<boolean>(false);

  // Community reports with local storage backup
  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(() => {
    try {
      const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COMMUNITY_REPORTS;
  });

  // Cleanup drives with local storage backup
  const [cleanupDrives, setCleanupDrives] = useState<CleanupDrive[]>(() => {
    try {
      const stored = localStorage.getItem(DRIVES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CLEANUP_DRIVES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(communityReports));
    } catch (e) {
      console.error(e);
    }
  }, [communityReports]);

  useEffect(() => {
    try {
      localStorage.setItem(DRIVES_STORAGE_KEY, JSON.stringify(cleanupDrives));
    } catch (e) {
      console.error(e);
    }
  }, [cleanupDrives]);

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
    updateReportStatus(id, 'verified', 'AquaWatch Regional Moderator', undefined, 'Verified community audit');
  };

  const updateReportStatus = (
    reportId: string,
    newStatus: CommunityReportStatus,
    reviewerName?: string,
    reviewerId?: string,
    notes?: string
  ) => {
    const updatedAt = new Date().toISOString();

    setCommunityReports(prev => prev.map(rep => {
      if (rep.id === reportId) {
        return {
          ...rep,
          status: newStatus,
          reviewedByNgoName: reviewerName || rep.reviewedByNgoName,
          reviewedByNgoId: reviewerId || rep.reviewedByNgoId,
          reviewNotes: notes !== undefined ? notes : rep.reviewNotes,
          updatedAt,
        };
      }
      return rep;
    }));

    // Update corresponding observation if present
    setObservations(prev => prev.map(obs => {
      if (obs.id === reportId) {
        const isVerified = newStatus === 'verified' || newStatus === 'cleanup_scheduled' || newStatus === 'resolved';
        return {
          ...obs,
          provenance: isVerified ? 'community_verified' : 'community_unverified',
          confidence: calculateConfidence(
            isVerified ? 'community_verified' : 'community_unverified', 
            obs.reportedDate, 
            isVerified ? 'Verified by accredited environmental NGO' : 'Pending review'
          ),
        };
      }
      return obs;
    }));
  };

  const createCleanupDrive = (driveData: Omit<CleanupDrive, 'id' | 'registeredVolunteers' | 'status'>) => {
    const newDrive: CleanupDrive = {
      ...driveData,
      id: `drive-${Date.now()}`,
      registeredVolunteers: [],
      status: 'upcoming',
    };
    setCleanupDrives(prev => [newDrive, ...prev]);
  };

  const registerForCleanupDrive = (driveId: string, userEmail: string): boolean => {
    let alreadyRegistered = false;
    setCleanupDrives(prev => prev.map(d => {
      if (d.id === driveId) {
        if (d.registeredVolunteers.includes(userEmail)) {
          alreadyRegistered = true;
          return d;
        }
        return {
          ...d,
          registeredVolunteers: [...d.registeredVolunteers, userEmail]
        };
      }
      return d;
    }));
    return !alreadyRegistered;
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
        updateReportStatus,
        cleanupDrives,
        createCleanupDrive,
        registerForCleanupDrive,
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
