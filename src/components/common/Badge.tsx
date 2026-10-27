import React from 'react';
import { SeverityLevel, ProvenanceType, WaterbodyType } from '../../types/pollution';

export const SeverityBadge: React.FC<{ severity: SeverityLevel; showDot?: boolean }> = ({ severity, showDot = true }) => {
  const styles = {
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Moderate: 'bg-amber-50 text-amber-700 border-amber-200',
    High: 'bg-orange-50 text-orange-700 border-orange-200',
    Critical: 'bg-rose-50 text-rose-700 border-rose-200',
  }[severity] || 'bg-slate-50 text-slate-700 border-slate-200';

  const dotColors = {
    Low: 'bg-emerald-500',
    Moderate: 'bg-amber-500',
    High: 'bg-orange-500',
    Critical: 'bg-rose-500',
  }[severity] || 'bg-slate-500';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />}
      {severity}
    </span>
  );
};

export const ProvenanceBadge: React.FC<{ provenance: ProvenanceType }> = ({ provenance }) => {
  switch (provenance) {
    case 'verified_measurement':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          Agency Verified
        </span>
      );
    case 'scientific_estimate':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
          Scientific Model
        </span>
      );
    case 'historical_observation':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">
          Historical Baseline
        </span>
      );
    case 'community_verified':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
          Community Verified
        </span>
      );
    case 'community_unverified':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300">
          Citizen Unverified
        </span>
      );
    case 'demonstration_simulation':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
          Simulation Demo
        </span>
      );
    default:
      return null;
  }
};

export const WaterbodyBadge: React.FC<{ type: WaterbodyType }> = ({ type }) => {
  const labels: Record<WaterbodyType, { label: string; color: string }> = {
    coastline: { label: 'Coastline', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    beach: { label: 'Beach', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    river: { label: 'River', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    sea_ocean: { label: 'Ocean Gyre / Sea', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    estuary: { label: 'Estuary / Delta', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  };

  const item = labels[type] || { label: type, color: 'bg-slate-50 text-slate-700 border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${item.color}`}>
      {item.label}
    </span>
  );
};
