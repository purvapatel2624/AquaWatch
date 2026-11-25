import React, { useState } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Calendar, 
  Check, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  Award,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePollution } from '../../context/PollutionContext';
import { SeverityBadge } from '../common/Badge';
import { CommunityReportStatus } from '../../types/pollution';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReportModal: () => void;
  onOpenCleanupDrives: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenReportModal,
  onOpenCleanupDrives,
}) => {
  const { userProfile, updateUserProfile, logout } = useAuth();
  const { communityReports } = usePollution();

  const [activeTab, setActiveTab] = useState<'reports' | 'profile'>('reports');

  // Profile edit fields
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');
  const [location, setLocation] = useState(userProfile?.location || '');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen || !userProfile) return null;

  // Filter reports submitted by this user (by userId or matching email)
  const myReports = communityReports.filter(
    (r) =>
      (r.userId && r.userId === userProfile.id) ||
      (r.reporterEmail && r.reporterEmail.toLowerCase() === userProfile.email.toLowerCase())
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName: fullName.trim(),
      bio: bio.trim(),
      phoneNumber: phoneNumber.trim(),
      location: location.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const getStatusBadge = (status: CommunityReportStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
            <CheckCircle2 className="w-3 h-3 text-teal-600" />
            Verified Audit
          </span>
        );
      case 'cleanup_scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Sparkles className="w-3 h-3 text-blue-600" />
            Cleanup Scheduled
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" />
            Debris Cleared
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <Clock className="w-3 h-3 text-indigo-600" />
            Under NGO Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with User Info */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-ocean-50/70 via-white to-marine-50/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shadow-ocean-500/10"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-ocean-600 to-marine-500 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-ocean-500/20">
                    {userProfile.fullName.charAt(0)}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white">
                  ✓
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {userProfile.fullName}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-ocean-100 text-ocean-800 border border-ocean-200">
                    Citizen Watcher
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>{userProfile.email}</span>
                  {userProfile.location && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {userProfile.location}
                      </span>
                    </>
                  )}
                </p>
                {userProfile.bio && (
                  <p className="text-xs text-slate-600 mt-1.5 italic max-w-md">
                    "{userProfile.bio}"
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics & Actions Bar */}
          <div className="mt-5 grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Submitted Reports
              </span>
              <span className="text-lg font-black text-ocean-700">{myReports.length}</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Verified Audits
              </span>
              <span className="text-lg font-black text-teal-700">
                {myReports.filter((r) => r.status === 'verified' || r.status === 'cleanup_scheduled').length}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-center shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                <Award className="w-3 h-3 text-amber-500" />
                Steward Points
              </span>
              <span className="text-lg font-black text-amber-600">
                {userProfile.volunteerPoints || 250}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('reports')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'reports'
                  ? 'border-ocean-600 text-ocean-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>My Submitted Reports</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-ocean-100 text-ocean-800">
                {myReports.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'border-ocean-600 text-ocean-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>
          </div>

          <div className="pb-2 flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenCleanupDrives();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-marine-700 bg-marine-50 hover:bg-marine-100 border border-marine-200 transition-colors"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-marine-600" />
              <span>Volunteer Drives</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenReportModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-ocean-600 hover:bg-ocean-700 shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Report</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'reports' ? (
            myReports.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-ocean-50 text-ocean-600 flex items-center justify-center mx-auto">
                  <FileText className="w-7 h-7" />
                </div>
                <h4 className="font-extrabold text-base text-slate-900">No pollution reports submitted yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Help map marine and river plastic debris by submitting your first observation with coordinates and photo evidence.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenReportModal();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-ocean-600 hover:bg-ocean-700 shadow-md shadow-ocean-600/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  Submit Pollution Report
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Tracking {myReports.length} submitted environmental observations</span>
                  <span className="text-[11px] text-ocean-700 font-semibold bg-ocean-50 px-2 py-0.5 rounded">
                    Scientific Audit Trail Active
                  </span>
                </div>

                {myReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          {getStatusBadge(report.status)}
                          <SeverityBadge severity={report.severity} />
                          <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {report.waterbodyType.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-slate-900">{report.locationName}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Observed on {report.date} at {report.time}</span>
                          <span>•</span>
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-[11px]">
                            [{report.coordinates[0].toFixed(3)}, {report.coordinates[1].toFixed(3)}]
                          </span>
                        </p>
                      </div>

                      {report.photoUrl && (
                        <img
                          src={report.photoUrl}
                          alt={report.locationName}
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-xs shrink-0"
                        />
                      )}
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                      {report.description}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-xs">
                      <div className="font-semibold text-slate-700">
                        Category: <span className="text-ocean-700 capitalize">{report.wasteCategory}</span> • Estimated Count: <span className="text-ocean-700">{report.estimatedPieces} pcs</span>
                      </div>

                      {report.reviewedByNgoName && (
                        <div className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                          Reviewed by {report.reviewedByNgoName}
                        </div>
                      )}
                    </div>

                    {report.reviewNotes && (
                      <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-200/70 text-[11px] text-teal-900">
                        <span className="font-bold">NGO Reviewer Note:</span> {report.reviewNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Profile Settings Tab */
            <div className="space-y-4">
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500 font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Email Address (Read-Only)</label>
                    <input
                      type="email"
                      value={userProfile.email}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Location / Coastal Region</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Santa Monica, CA"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Avatar Image URL (Optional)</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Bio / Environmental Interests</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell other volunteers and NGOs about your coastal conservation interests..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500 font-medium"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                  >
                    Log Out of AquaWatch
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-ocean-600 hover:bg-ocean-700 shadow-md shadow-ocean-600/20 transition-all"
                  >
                    Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
