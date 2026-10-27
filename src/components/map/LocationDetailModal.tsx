import React from 'react';
import { 
  X, 
  MapPin, 
  ExternalLink, 
  Calendar, 
  Activity, 
  ShieldCheck, 
  BarChart2, 
  Compass, 
  GitCompare,
  TrendingDown,
  TrendingUp,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { PollutionObservation } from '../../types/pollution';
import { SeverityBadge, ProvenanceBadge, WaterbodyBadge } from '../common/Badge';

interface LocationDetailModalProps {
  location: PollutionObservation | null;
  onClose: () => void;
  onCompare: (loc: PollutionObservation) => void;
}

export const LocationDetailModal: React.FC<LocationDetailModalProps> = ({
  location,
  onClose,
  onCompare,
}) => {
  if (!location) return null;

  const categories = [
    { key: 'packaging', label: 'Packaging & Sachets', value: location.categoryBreakdown.packaging, color: 'bg-indigo-500' },
    { key: 'bottles', label: 'Bottles & Caps', value: location.categoryBreakdown.bottles, color: 'bg-sky-500' },
    { key: 'bags', label: 'Bags & Films', value: location.categoryBreakdown.bags, color: 'bg-amber-500' },
    { key: 'fishing_gear', label: 'Fishing Gear & Nets', value: location.categoryBreakdown.fishing_gear, color: 'bg-rose-500' },
    { key: 'microplastics', label: 'Microplastics (<5mm)', value: location.categoryBreakdown.microplastics, color: 'bg-emerald-500' },
    { key: 'other', label: 'Other Debris', value: location.categoryBreakdown.other, color: 'bg-slate-400' },
  ].sort((a, b) => b.value - a.value);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-50 to-ocean-50/30">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <SeverityBadge severity={location.severity} />
              <ProvenanceBadge provenance={location.provenance} />
              <WaterbodyBadge type={location.waterbodyType} />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {location.locationName}
            </h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {location.country} • {location.region}
              </span>
              <span>•</span>
              <span className="font-mono text-slate-600">
                {location.coordinates[0].toFixed(4)}°N, {location.coordinates[1].toFixed(4)}°E
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-ocean-50/60 border border-ocean-100 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-ocean-700 mb-1">
                <span>Recorded Abundance</span>
                <Activity className="w-4 h-4 text-ocean-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {location.measuredValue.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {location.measurementUnit}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Severity Index</span>
                <span className="text-[11px] font-bold text-slate-500">Scale 1-100</span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                {location.severityScore}
                <span className="text-xs font-semibold text-slate-400">/100</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    location.severity === 'Critical' ? 'bg-rose-500' :
                    location.severity === 'High' ? 'bg-orange-500' :
                    location.severity === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${location.severityScore}%` }}
                />
              </div>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-1">
                <span>Data Confidence</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-900">
                {location.confidence.overallScore}
                <span className="text-xs font-semibold text-emerald-700">/100</span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {location.confidence.sourceQuality} • {location.confidence.ageQuality}
              </p>
            </div>

          </div>

          {/* Description & Scientific Context */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">Observation Summary</h4>
            <p>{location.description}</p>
          </div>

          {/* Debris Composition Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-ocean-600" />
                Debris Composition Breakdown
              </h4>
              <span className="text-xs text-slate-400">Based on sampled counts</span>
            </div>

            {/* Stacked bar visualization */}
            <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100">
              {categories.map((c) => (
                <div
                  key={c.key}
                  className={`${c.color} h-full transition-all`}
                  style={{ width: `${c.value}%` }}
                  title={`${c.label}: ${c.value}%`}
                />
              ))}
            </div>

            {/* Category percentage chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {categories.map((c) => (
                <div key={c.key} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.color}`} />
                    <span className="text-slate-600 truncate">{c.label}</span>
                  </div>
                  <span className="font-bold text-slate-900 ml-1">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Trend Chart (if data present) */}
          {location.historicalTrend && location.historicalTrend.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Historical Observation Trend (Annual)
                </h4>
                <span className="text-xs font-medium text-slate-500">
                  Unit: {location.historicalTrend[0].unit}
                </span>
              </div>

              <div className="h-44 w-full bg-slate-50/50 rounded-2xl p-2 border border-slate-100">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={location.historicalTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="year" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', border: 'none', color: '#fff', fontSize: '12px' }}
                      formatter={(val: any) => [`${val} ${location.historicalTrend?.[0].unit}`, 'Abundance']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0284c7" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#0284c7', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Data Source & Scientific Methodology */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-ocean-600" />
                Data Source & Provenance
              </span>
              <span className="text-slate-500">{location.reportedDate}</span>
            </div>
            <p className="font-semibold text-slate-900">{location.dataSource}</p>
            <p className="text-slate-600 leading-relaxed">{location.methodology}</p>
            {location.sourceUrl && (
              <a
                href={location.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-ocean-600 hover:text-ocean-700 font-semibold pt-1 hover:underline"
              >
                Open Official Source Documentation <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onCompare(location);
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all"
          >
            <GitCompare className="w-4 h-4 text-ocean-600" />
            Compare with Another Location
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
