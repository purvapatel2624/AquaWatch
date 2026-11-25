import React, { useState } from 'react';
import { 
  Waves,
  Home,
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
  Globe2,
  LogIn,
  LogOut,
  User,
  Building2,
  ChevronDown,
  Calendar,
  HeartHandshake,
  FileText
} from 'lucide-react';
import { usePollution } from '../../context/PollutionContext';
import { useAuth } from '../../context/AuthContext';
import { exportToCSV, exportToGeoJSON } from '../../utils/exportUtils';
import { UserRole } from '../../types/auth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenAuthModal: (role?: UserRole, reason?: string) => void;
  onOpenProfileModal: () => void;
  onOpenNgoDashboard: () => void;
  onOpenCleanupDrives: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenNgoDashboard,
  onOpenCleanupDrives,
}) => {
  const { filteredObservations, demoMode, setDemoMode } = usePollution();
  const { isAuthenticated, isUser, isNgo, userProfile, ngoProfile, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Explore Map', icon: MapPin },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'insights', label: 'AI Insights', icon: Sparkles },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'methodology', label: 'Sources & Rigor', icon: ShieldCheck },
  ];

  const handleReportClick = () => {
    if (!isAuthenticated) {
      onOpenAuthModal('user', 'Please log in or register before submitting a marine pollution report.');
    } else {
      onOpenReportModal();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('home')}
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
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-ocean-50 text-ocean-700 border border-ocean-200/80 shadow-sm'
                      : 'text-slate-600 hover:text-ocean-600 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-ocean-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-2.5">
            
            {/* Cleanup Drives Button (Publicly accessible) */}
            <button
              onClick={onOpenCleanupDrives}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-marine-700 bg-slate-50 hover:bg-marine-50 border border-slate-200 hover:border-marine-200 transition-colors"
              title="View community coastal & river cleanup drives"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-marine-600" />
              <span>Cleanup Drives</span>
            </button>

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
              <span className="hidden lg:inline">{demoMode ? 'Demo Mode' : 'Verified Data'}</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden lg:inline">Export</span>
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
              onClick={handleReportClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-marine-600 to-ocean-600 hover:from-marine-700 hover:to-ocean-700 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>

            {/* NGO Quick Dashboard Button (if logged in as NGO) */}
            {isNgo && (
              <button
                onClick={onOpenNgoDashboard}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold text-white bg-marine-700 hover:bg-marine-800 shadow-sm transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-marine-200" />
                <span>NGO Dashboard</span>
              </button>
            )}

            {/* AUTHENTICATION STATE */}
            {!isAuthenticated ? (
              /* PROMINENT LOGIN / SIGN UP BUTTON IN TOP-RIGHT CORNER */
              <button
                onClick={() => onOpenAuthModal('user')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-ocean-700 via-ocean-600 to-marine-600 hover:from-ocean-800 hover:to-marine-700 shadow-md shadow-ocean-600/20 hover:shadow-lg transition-all active:scale-95 border border-white/20"
                id="login-signup-btn"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login / Sign Up</span>
              </button>
            ) : (
              /* LOGGED IN USER OR NGO PROFILE DROPDOWN */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-xs"
                >
                  {isUser && userProfile ? (
                    <>
                      {userProfile.avatarUrl ? (
                        <img
                          src={userProfile.avatarUrl}
                          alt={userProfile.fullName}
                          className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-ocean-600 text-white flex items-center justify-center text-xs font-bold">
                          {userProfile.fullName.charAt(0)}
                        </div>
                      )}
                      <div className="text-left hidden lg:block">
                        <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                          {userProfile.fullName}
                        </div>
                        <span className="text-[10px] text-ocean-700 font-semibold block">Citizen User</span>
                      </div>
                    </>
                  ) : (
                    ngoProfile && (
                      <>
                        <div className="w-7 h-7 rounded-lg bg-marine-600 text-white flex items-center justify-center text-xs font-bold">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="text-left hidden lg:block">
                          <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                            {ngoProfile.orgName}
                          </div>
                          <span className="text-[10px] text-teal-700 font-semibold flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            Verified NGO
                          </span>
                        </div>
                      </>
                    )
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-extrabold text-slate-900 truncate">
                        {isUser ? userProfile?.fullName : ngoProfile?.orgName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {isUser ? userProfile?.email : ngoProfile?.officialEmail}
                      </p>
                    </div>

                    {isUser ? (
                      <>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenProfileModal();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-ocean-50 hover:text-ocean-700 text-left"
                        >
                          <User className="w-4 h-4 text-ocean-600" />
                          <span>My Profile & Settings</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenProfileModal();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-ocean-50 hover:text-ocean-700 text-left"
                        >
                          <FileText className="w-4 h-4 text-ocean-600" />
                          <span>My Submitted Reports</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenNgoDashboard();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-marine-50 hover:text-marine-700 text-left"
                        >
                          <ShieldCheck className="w-4 h-4 text-marine-600" />
                          <span>NGO Dashboard (Reports)</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenNgoDashboard();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-marine-50 hover:text-marine-700 text-left"
                        >
                          <Calendar className="w-4 h-4 text-marine-600" />
                          <span>Manage Cleanup Drives</span>
                        </button>
                      </>
                    )}

                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {!isAuthenticated ? (
              <button
                onClick={() => onOpenAuthModal('user')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-ocean-600 hover:bg-ocean-700 flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            ) : (
              <button
                onClick={isUser ? onOpenProfileModal : onOpenNgoDashboard}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white bg-marine-600 hover:bg-marine-700 flex items-center gap-1"
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                <span>{isUser ? 'Profile' : 'NGO'}</span>
              </button>
            )}

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

          <button
            onClick={() => {
              onOpenCleanupDrives();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <HeartHandshake className="w-5 h-5 text-marine-600" />
            <span>Environmental Cleanup Drives</span>
          </button>

          <button
            onClick={() => {
              handleReportClick();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-bold text-white bg-ocean-600"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Report Marine Pollution</span>
          </button>
          
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

          {isAuthenticated && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-xs font-bold text-rose-600 py-1.5"
              >
                Log Out of {isUser ? userProfile?.fullName : ngoProfile?.orgName}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
