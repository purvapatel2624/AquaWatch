export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export type WaterbodyType = 'coastline' | 'beach' | 'river' | 'sea_ocean' | 'estuary';

export type ProvenanceType = 
  | 'verified_measurement'
  | 'historical_observation'
  | 'scientific_estimate'
  | 'community_verified'
  | 'community_unverified'
  | 'demonstration_simulation';

export type PlasticWasteCategory = 
  | 'bottles'
  | 'bags'
  | 'packaging'
  | 'fishing_gear'
  | 'microplastics'
  | 'mixed_macroplastics';

export interface CategoryBreakdown {
  bottles: number;
  bags: number;
  packaging: number;
  fishing_gear: number;
  microplastics: number;
  other: number;
  mixed_macroplastics?: number;
}

export interface DataConfidence {
  overallScore: number; // 0 - 100
  sourceQuality: 'Agency Verified' | 'Research Study' | 'Accredited NGO' | 'Citizen Report';
  ageQuality: 'Fresh (<1y)' | 'Recent (1-3y)' | 'Historical (>3y)';
  methodologyRigor: 'Standard 100m Transect' | 'Tally Count' | 'Hydrodynamic Model' | 'Visual Observation';
}

export interface HistoricalTrendPoint {
  year: number;
  value: number;
  unit: string;
}

export interface PollutionObservation {
  id: string;
  locationName: string;
  waterbodyName: string;
  waterbodyType: WaterbodyType;
  coordinates: [number, number]; // [lat, lng]
  country: string;
  region: string;
  reportedDate: string; // YYYY-MM-DD
  severity: SeverityLevel;
  severityScore: number; // 1 - 100
  provenance: ProvenanceType;
  primaryDebrisCategory: PlasticWasteCategory;
  categoryBreakdown: CategoryBreakdown;
  measuredValue: number;
  measurementUnit: string;
  dataSource: string;
  sourceUrl?: string;
  methodology: string;
  confidence: DataConfidence;
  description: string;
  imageUrl?: string;
  historicalTrend?: HistoricalTrendPoint[];
  isHotspot?: boolean;
}

export interface FilterState {
  searchQuery: string;
  country: string;
  waterbodyType: string;
  severity: string;
  provenance: string;
  wasteCategory: string;
  minConfidence: number;
  yearRange: [number, number];
}

export interface CommunityReport {
  id: string;
  locationName: string;
  waterbodyType: WaterbodyType;
  coordinates: [number, number];
  date: string;
  time: string;
  wasteCategory: PlasticWasteCategory;
  estimatedPieces: number;
  severity: SeverityLevel;
  description: string;
  reporterName: string;
  reporterEmail?: string;
  photoUrl?: string;
  status: 'pending_review' | 'verified' | 'flagged';
  submittedAt: string;
}

export interface LocationComparisonItem {
  location: PollutionObservation;
}
