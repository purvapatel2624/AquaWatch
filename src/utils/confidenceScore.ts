import { DataConfidence, ProvenanceType } from '../types/pollution';

export function calculateConfidence(
  provenance: ProvenanceType,
  reportedDate: string,
  methodologyText: string
): DataConfidence {
  // 1. Source quality score (out of 40)
  let sourceScore = 20;
  let sourceQuality: DataConfidence['sourceQuality'] = 'Accredited NGO';

  if (provenance === 'verified_measurement') {
    sourceScore = 40;
    sourceQuality = 'Agency Verified';
  } else if (provenance === 'scientific_estimate') {
    sourceScore = 36;
    sourceQuality = 'Research Study';
  } else if (provenance === 'historical_observation') {
    sourceScore = 32;
    sourceQuality = 'Accredited NGO';
  } else if (provenance === 'community_verified') {
    sourceScore = 28;
    sourceQuality = 'Citizen Report';
  } else if (provenance === 'community_unverified') {
    sourceScore = 18;
    sourceQuality = 'Citizen Report';
  }

  // 2. Age quality score (out of 30)
  const reportYear = new Date(reportedDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const ageYears = currentYear - reportYear;

  let ageScore = 15;
  let ageQuality: DataConfidence['ageQuality'] = 'Recent (1-3y)';

  if (ageYears <= 1) {
    ageScore = 30;
    ageQuality = 'Fresh (<1y)';
  } else if (ageYears <= 3) {
    ageScore = 24;
    ageQuality = 'Recent (1-3y)';
  } else {
    ageScore = 14;
    ageQuality = 'Historical (>3y)';
  }

  // 3. Methodology rigor score (out of 30)
  let methodScore = 20;
  let methodologyRigor: DataConfidence['methodologyRigor'] = 'Tally Count';

  const lower = methodologyText.toLowerCase();
  if (lower.includes('transect') || lower.includes('100m')) {
    methodScore = 30;
    methodologyRigor = 'Standard 100m Transect';
  } else if (lower.includes('model') || lower.includes('hydrodynamic')) {
    methodScore = 27;
    methodologyRigor = 'Hydrodynamic Model';
  } else if (lower.includes('tally') || lower.includes('volunteer')) {
    methodScore = 22;
    methodologyRigor = 'Tally Count';
  } else {
    methodScore = 15;
    methodologyRigor = 'Visual Observation';
  }

  const overallScore = Math.min(100, Math.max(10, sourceScore + ageScore + methodScore));

  return {
    overallScore,
    sourceQuality,
    ageQuality,
    methodologyRigor,
  };
}
