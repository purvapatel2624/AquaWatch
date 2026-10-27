import React from 'react';
import { Waves, ShieldAlert, ExternalLink, Presentation, Heart } from 'lucide-react';

interface FooterProps {
  onOpenHackathonModal: () => void;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHackathonModal, setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-ocean-500 to-marine-400 flex items-center justify-center text-white">
                <Waves className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                AquaWatch
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering students, researchers, and coastal communities with verifiable data on marine and river plastic pollution.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenHackathonModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-ocean-950 text-ocean-300 border border-ocean-800 hover:bg-ocean-900 transition-colors"
              >
                <Presentation className="w-3.5 h-3.5 text-ocean-400" />
                Hackathon Pitch Deck & Docs
              </button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('map')} className="text-slate-400 hover:text-white transition-colors">
                  Interactive Pollution Map
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="text-slate-400 hover:text-white transition-colors">
                  Analytics & Trends Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('insights')} className="text-slate-400 hover:text-white transition-colors">
                  AI-Powered Environmental Insights
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('learn')} className="text-slate-400 hover:text-white transition-colors">
                  River-to-Sea Waste Education
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('methodology')} className="text-slate-400 hover:text-white transition-colors">
                  Data Reliability & Provenance Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Authentic Data Partners */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Data Baselines</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://marinedebris.noaa.gov/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-ocean-300">
                  NOAA Marine Debris Program <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.unep.org/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-ocean-300">
                  UNEP Global Partnership on Marine Litter <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://oceanconservancy.org/" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-ocean-300">
                  Ocean Conservancy ICC Surveys <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://nature.com/articles/s41467-021-23165-7" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-ocean-300">
                  Lebreton et al. (Nature Communications) <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Scientific Transparency Notice */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              Scientific Integrity Mandate
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              AquaWatch uses authentic historical observations and published scientific transport models. It is an awareness & scientific monitoring tool, not a live automated IoT sensor grid. Simulated and community reports are always explicitly labeled.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800 text-center sm:flex sm:justify-between sm:text-left text-xs text-slate-500">
          <p>© 2026 AquaWatch Project. Open Science for Cleaner Waters.</p>
          <p className="mt-2 sm:mt-0 flex items-center justify-center sm:justify-start gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for global ocean conservation.
          </p>
        </div>
      </div>
    </footer>
  );
};
