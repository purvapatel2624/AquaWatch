import React, { useState } from 'react';
import { 
  Waves, 
  MapPin, 
  BarChart3, 
  Sparkles, 
  PlusCircle, 
  BookOpen, 
  ShieldCheck, 
  Download, 
  Menu, 
  X,
  FileSpreadsheet,
  Globe2
} from 'lucide-react';
import { usePollution } from '../../context/PollutionContext';
import { exportToCSV, exportToGeoJSON } from '../../utils/exportUtils';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenReportModal }) => {
  const { filteredObservations, demoMode, setDemoMode } = usePollution();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const navItems = [
    { id: 'map', label: 'Explore Map', icon: MapPin },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'methodology', label: 'Sources & Rigor', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('map')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ocean-700 via-ocean-500 to-marine-400 flex items-center justify-center text-white shadow-md shadow-ocean-500/20 group-hover:scale-105 transition-transform">
                <Waves className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-ocean-900 via-ocean-700 to-marine-600 bg-clip-text text-transparent">
                    AquaWatch
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-ocean-100 text-ocean-800 border border-ocean-200">
                    Open Science
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  Marine & River Plastic Pollution Monitoring
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-ocean-50 text-ocean-700 border border-ocean-200/80 shadow-sm'
                      : 'text-slate-600 hover:text-ocean-600 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-ocean-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions: Community Report + Export + Demo Mode */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* Demo mode badge toggle */}
            <button
              onClick={() => setDemoMode(!demoMode)}
              title="Toggle simulated demonstration scenarios"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                demoMode 
                  ? 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${demoMode ? 'bg-amber-500 animate-ping' : 'bg-slate-400'}`} />
              {demoMode ? 'Demo Mode Active' : 'Verified Data Only'}
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Export
              </button>

              {exportDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setExportDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Download ({filteredObservations.length} records)
                  </div>
                  <button
                    onClick={() => {
                      exportToCSV(filteredObservations);
                      setExportDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-ocean-50 hover:text-ocean-700 text-left"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Export as CSV (.csv)
                  </button>
                  <button
                    onClick={() => {
                      exportToGeoJSON(filteredObservations);
                      setExportDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-ocean-50 hover:text-ocean-700 text-left"
                  >
                    <Globe2 className="w-4 h-4 text-ocean-600" />
                    Export as GeoJSON (.geojson)
                  </button>
                </div>
              )}
            </div>

            {/* Report Pollution CTA */}
            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-marine-600 to-ocean-600 hover:from-marine-700 hover:to-ocean-700 shadow-md shadow-ocean-600/20 hover:shadow-lg transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Report Pollution
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenReportModal}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-marine-600 hover:bg-marine-700 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-ocean-50 text-ocean-700 border border-ocean-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-ocean-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
          
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setDemoMode(!demoMode);
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-slate-600"
            >
              Status: <span className="text-ocean-700 font-bold">{demoMode ? 'Demo Active' : 'Verified Data Only'}</span>
            </button>
            <button
              onClick={() => {
                exportToCSV(filteredObservations);
                setMobileMenuOpen(false);
              }}
              className="text-xs font-semibold text-ocean-600 hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Export CSV
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
