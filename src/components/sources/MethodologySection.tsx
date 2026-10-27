import React from 'react';
import { 
  ShieldCheck, 
  Database, 
  ExternalLink, 
  Sliders, 
  FileSpreadsheet, 
  Globe2, 
  AlertTriangle,
  Scale,
  Award
} from 'lucide-react';
import { DATA_SOURCES_META, METHODOLOGY_EXPLANATION } from '../../data/methodologyInfo';
import { usePollution } from '../../context/PollutionContext';
import { exportToCSV, exportToGeoJSON } from '../../utils/exportUtils';
import { ProvenanceBadge } from '../common/Badge';

export const MethodologySection: React.FC = () => {
  const { observations } = usePollution();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              Scientific Transparency
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Data Provenance & Reliability Methodology
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            AquaWatch adheres to strict environmental data integrity principles. We never simulate or invent field readings without transparent labeling.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(observations)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            CSV Data
          </button>
          <button
            onClick={() => exportToGeoJSON(observations)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <Globe2 className="w-3.5 h-3.5 text-ocean-600" />
            GeoJSON
          </button>
        </div>
      </div>

      {/* Core Integrity Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {METHODOLOGY_EXPLANATION.principles.map((p, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <div className="w-8 h-8 rounded-lg bg-ocean-50 text-ocean-600 flex items-center justify-center font-black text-xs">
              0{idx + 1}
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 mt-1">{p.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
          </div>
        ))}
      </div>

      {/* Data Confidence Scoring Formula */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Confidence Index Algorithm (0–100)
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
              How AquaWatch Scores Scientific Reliability
            </h3>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-xl text-slate-700">
            Score = (Source × 0.40) + (Freshness × 0.30) + (Rigor × 0.30)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>1. Source Authority (40%)</span>
              <Award className="w-4 h-4 text-ocean-600" />
            </div>
            <ul className="space-y-1 text-slate-600 leading-relaxed">
              <li>• <strong>40 pts:</strong> Agency verified (NOAA, UNEP)</li>
              <li>• <strong>36 pts:</strong> Peer-reviewed research study</li>
              <li>• <strong>32 pts:</strong> Accredited NGO audit (Ocean Conservancy)</li>
              <li>• <strong>18–28 pts:</strong> Citizen report (pending/verified)</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>2. Temporal Freshness (30%)</span>
              <Scale className="w-4 h-4 text-emerald-600" />
            </div>
            <ul className="space-y-1 text-slate-600 leading-relaxed">
              <li>• <strong>30 pts:</strong> Surveyed within the last 12 months</li>
              <li>• <strong>24 pts:</strong> Surveyed within 1 to 3 years</li>
              <li>• <strong>14 pts:</strong> Historical baseline (&gt;3 years old)</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between font-bold text-slate-900">
              <span>3. Methodology Rigor (30%)</span>
              <Sliders className="w-4 h-4 text-purple-600" />
            </div>
            <ul className="space-y-1 text-slate-600 leading-relaxed">
              <li>• <strong>30 pts:</strong> Standard 100m transect survey</li>
              <li>• <strong>27 pts:</strong> Hydrodynamic mass transport model</li>
              <li>• <strong>22 pts:</strong> Standard volunteer tally count</li>
              <li>• <strong>15 pts:</strong> Qualitative visual observation</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Primary Authentic Data Baselines */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-ocean-600">Integrated Baselines</span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
            Public Environmental Data Sources
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DATA_SOURCES_META.map((src) => (
            <div key={src.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{src.name}</h3>
                  <p className="text-xs font-semibold text-ocean-700">{src.organization}</p>
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-50 text-slate-500 hover:text-ocean-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{src.description}</p>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px] text-slate-500">
                <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">License: {src.license}</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">Coverage: {src.coverage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Known Limitations and Gaps */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Honest Scientific Limitations & Data Gaps Disclosure
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          While AquaWatch curates the best publicly accessible environmental datasets, global monitoring exhibits persistent coverage disparities:
        </p>
        <ul className="list-disc list-inside text-xs text-slate-600 space-y-1.5 pl-1">
          <li><strong>Global South Underrepresentation:</strong> Comprehensive long-term shoreline transects are far more prevalent in North America and Western Europe due to agency funding, even though Southeast Asia and South Asia experience the highest riverine plastic fluxes.</li>
          <li><strong>Measurement Unit Disparity:</strong> Comparing shoreline density (items per 100 meters) directly against river basin outputs (metric tons per year) requires qualitative normalization rather than direct mathematical equivalence.</li>
          <li><strong>Episodic Flooding Events:</strong> Severe monsoon deluges and typhoons can discharge more plastic debris in 48 hours than months of dry season baseline flow. Continuous telemetry sensors are urgently needed.</li>
        </ul>
      </div>

    </div>
  );
};
