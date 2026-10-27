import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Presentation, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Rocket, 
  Globe2 
} from 'lucide-react';

export const HackathonModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Problem Statement: The Blindspot in Aquatic Plastic Pollution',
      subtitle: 'Slide 1 of 5 • The Challenge',
      badge: 'The Crisis',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Over <strong>11 million metric tons</strong> of plastic enter global waterways annually. However, environmental monitoring faces three critical barriers:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
              <span className="font-extrabold text-rose-700 text-xs block mb-1">1. Fragmented Silos</span>
              <p className="text-xs text-rose-950">Data is locked inside separate academic papers, government PDFs (NOAA, UNEP), and local volunteer cleanups with incompatible formats.</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
              <span className="font-extrabold text-amber-700 text-xs block mb-1">2. Data Fabrication Risk</span>
              <p className="text-xs text-amber-950">Many public platforms display artificial, unverified "live" sensor readings, eroding scientific trust and misleading policy makers.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <span className="font-extrabold text-purple-700 text-xs block mb-1">3. River vs Ocean Gap</span>
              <p className="text-xs text-purple-950">Most public attention focuses on open ocean gyres, failing to connect inland urban river corridors where 80% of waste originates.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'The AquaWatch Solution: Verifiable Open Science Platform',
      subtitle: 'Slide 2 of 5 • Our Approach',
      badge: 'The Solution',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            <strong>AquaWatch</strong> bridges the gap between scientific institutions and the public through a transparent, full-stack environmental monitoring platform:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-ocean-50 p-4 rounded-2xl border border-ocean-100 space-y-1">
              <h4 className="font-extrabold text-xs text-ocean-900">Interactive Bathymetry Map</h4>
              <p className="text-xs text-slate-600">Geo-spatial Leaflet interface categorizing severity, dominant polymers, and monitoring transects.</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 space-y-1">
              <h4 className="font-extrabold text-xs text-teal-900">Data Reliability Score (0–100)</h4>
              <p className="text-xs text-slate-600">Objective confidence score evaluating source authority (40%), temporal freshness (30%), and methodology rigor (30%).</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-1">
              <h4 className="font-extrabold text-xs text-indigo-900">Grounded AI Analysis</h4>
              <p className="text-xs text-slate-600">Strictly facts-only synthesis with zero hallucination, explaining river transport and comparing sites.</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
              <h4 className="font-extrabold text-xs text-emerald-900">Citizen Science Pipeline</h4>
              <p className="text-xs text-slate-600">Community reporting with GPS coordinates, photo uploads, anti-spam validation, and regional review queues.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Technology Stack & Architecture',
      subtitle: 'Slide 3 of 5 • Engineering',
      badge: 'Stack & Design',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Frontend & Client Layer</h4>
              <ul className="text-xs space-y-1.5 text-slate-700 font-medium">
                <li>• <strong>React 19 & TypeScript:</strong> Type-safe component architecture</li>
                <li>• <strong>Tailwind CSS v3.4:</strong> Custom oceanic design tokens</li>
                <li>• <strong>Leaflet & CartoDB:</strong> High-performance interactive mapping</li>
                <li>• <strong>Recharts:</strong> Responsive charts (compositions & trends)</li>
              </ul>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">Data Engine & Intelligence</h4>
              <ul className="text-xs space-y-1.5 text-slate-700 font-medium">
                <li>• <strong>Authentic Baselines:</strong> NOAA MDMAP, UNEP, Nature studies</li>
                <li>• <strong>Offline Grounded Engine:</strong> Instant local statistical inference</li>
                <li>• <strong>Optional Gemini 2.0 Flash:</strong> Conversational free-form Q&A</li>
                <li>• <strong>Export Engine:</strong> Direct GeoJSON & CSV data download</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Current Limitations & Scientific Constraints',
      subtitle: 'Slide 4 of 5 • Transparency',
      badge: 'Honest Caveats',
      content: (
        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>AquaWatch champions honest scientific disclosure:</p>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 pl-1">
            <li><strong>Not an IoT Sensor Grid:</strong> Data originates from periodic transects, hydrodynamic models, and citizen audits rather than real-time water probes.</li>
            <li><strong>Cross-System Metrics:</strong> River emission rates (tons/year) versus shoreline densities (items/100m) are qualitative comparisons.</li>
            <li><strong>Underrepresented Microplastics:</strong> Deep pelagic microplastics and benthic sediment accumulations are undercounted in surface audits.</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Future Roadmap & Global Scalability',
      subtitle: 'Slide 5 of 5 • Future Scope',
      badge: 'Next Horizons',
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-ocean-50 p-4 rounded-2xl border border-ocean-100">
              <span className="font-bold text-xs text-ocean-800 block mb-1">Phase 1: Satellite & Drone ML</span>
              <p className="text-xs text-slate-600">Integrate Sentinel-2 multi-spectral plastic anomaly detection along major river deltas.</p>
            </div>
            <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100">
              <span className="font-bold text-xs text-teal-800 block mb-1">Phase 2: Local Authority Portal</span>
              <p className="text-xs text-slate-600">Provide municipal sanitation teams with predictive alert dashboards before monsoon surges.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <span className="font-bold text-xs text-purple-800 block mb-1">Phase 3: Supabase Cloud Sync</span>
              <p className="text-xs text-slate-600">Enable peer-reviewed verification workflows connecting universities with coastal volunteers.</p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-ocean-950 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ocean-500/20 text-ocean-300 flex items-center justify-center">
              <Presentation className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ocean-300">
                AquaWatch Presentation
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                Hackathon Deck & Environmental Defense
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 sm:p-8 space-y-4 min-h-[320px]">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{current.subtitle}</span>
              <span className="font-bold text-ocean-600 bg-ocean-50 px-2 py-0.5 rounded-full">
                {current.badge}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {current.title}
            </h3>
          </div>

          <div className="pt-2">{current.content}</div>
        </div>

        {/* Slide Navigation Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-ocean-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlide === slides.length - 1}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
