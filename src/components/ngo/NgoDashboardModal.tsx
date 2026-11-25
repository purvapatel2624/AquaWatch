import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Plus, 
  Edit3,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { usePollution } from '../../context/PollutionContext';
import { SeverityBadge } from '../common/Badge';
import { CommunityReportStatus, WaterbodyType } from '../../types/pollution';

interface NgoDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReportDetails?: (reportId: string) => void;
}

export const NgoDashboardModal: React.FC<NgoDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { ngoProfile, updateNgoProfile, logout } = useAuth();
  const { 
    communityReports, 
    updateReportStatus, 
    cleanupDrives, 
    createCleanupDrive 
  } = usePollution();

  const [activeTab, setActiveTab] = useState<'reports' | 'cleanups' | 'profile'>('reports');
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'verified' | 'cleanups'>('all');
  
  // Status update modal / inline editing
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [statusSelect, setStatusSelect] = useState<CommunityReportStatus>('verified');
  const [reviewNote, setReviewNote] = useState('');
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);

  // New cleanup drive form state
  const [showNewDriveForm, setShowNewDriveForm] = useState(false);
  const [driveTitle, setDriveTitle] = useState('');
  const [driveDesc, setDriveDesc] = useState('');
  const [driveLocation, setDriveLocation] = useState('');
  const [driveWaterbody, setDriveWaterbody] = useState<WaterbodyType>('beach');
  const [driveLat, setDriveLat] = useState('34.0102');
  const [driveLng, setDriveLng] = useState('-118.4965');
  const [driveDate, setDriveDate] = useState('2026-11-20');
  const [driveTime, setDriveTime] = useState('09:00');
  const [driveTargetVolunteers, setDriveTargetVolunteers] = useState(50);
  const [driveEquip, setDriveEquip] = useState('Gloves, bio-bags, litter tongs, audit sheets');
  const [driveSuccess, setDriveSuccess] = useState(false);

  // Profile editing
  const [orgName, setOrgName] = useState(ngoProfile?.orgName || '');
  const [orgType, setOrgType] = useState(ngoProfile?.orgType || 'Marine Conservation NGO');
  const [contactPerson, setContactPerson] = useState(ngoProfile?.contactPerson || '');
  const [contactNumber, setContactNumber] = useState(ngoProfile?.contactNumber || '');
  const [operatingLocation, setOperatingLocation] = useState(ngoProfile?.operatingLocation || '');
  const [missionStatement, setMissionStatement] = useState(ngoProfile?.missionStatement || '');
  const [website, setWebsite] = useState(ngoProfile?.website || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  if (!isOpen || !ngoProfile) return null;

  // Filtered reports
  const filteredReports = communityReports.filter(r => {
    if (reportFilter === 'pending') return r.status === 'pending_review' || r.status === 'under_review';
    if (reportFilter === 'verified') return r.status === 'verified';
    if (reportFilter === 'cleanups') return r.status === 'cleanup_scheduled' || r.status === 'resolved';
    return true;
  });

  // NGO's drives
  const orgDrives = cleanupDrives.filter(d => d.orgId === ngoProfile.id || d.orgName === ngoProfile.orgName);

  const handleUpdateStatusSubmit = (reportId: string) => {
    updateReportStatus(
      reportId,
      statusSelect,
      ngoProfile.orgName,
      ngoProfile.id,
      reviewNote.trim() || undefined
    );
    setUpdateFeedback(`Report status updated to "${statusSelect.replace('_', ' ').toUpperCase()}"`);
    setSelectedReportId(null);
    setReviewNote('');
    setTimeout(() => setUpdateFeedback(null), 3000);
  };

  const handleCreateDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveTitle.trim() || !driveLocation.trim()) return;

    createCleanupDrive({
      orgId: ngoProfile.id,
      orgName: ngoProfile.orgName,
      orgType: ngoProfile.orgType,
      title: driveTitle.trim(),
      description: driveDesc.trim(),
      locationName: driveLocation.trim(),
      waterbodyType: driveWaterbody,
      coordinates: [parseFloat(driveLat) || 34.01, parseFloat(driveLng) || -118.49],
      date: driveDate,
      time: driveTime,
      targetVolunteers: Number(driveTargetVolunteers),
      equipmentProvided: driveEquip.split(',').map(s => s.trim()).filter(Boolean),
      contactEmail: ngoProfile.officialEmail,
      imageUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80',
    });

    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    setDriveSuccess(true);
    setShowNewDriveForm(false);
    setDriveTitle('');
    setDriveDesc('');
    setDriveLocation('');
    setTimeout(() => setDriveSuccess(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateNgoProfile({
      orgName: orgName.trim(),
      orgType: orgType.trim(),
      contactPerson: contactPerson.trim(),
      contactNumber: contactNumber.trim(),
      operatingLocation: operatingLocation.trim(),
      missionStatement: missionStatement.trim(),
      website: website.trim(),
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* NGO Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-marine-900 via-ocean-950 to-slate-900 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-marine-400 to-ocean-500 p-0.5 shadow-lg shadow-marine-500/20 shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-marine-400">
                  <Building2 className="w-8 h-8" />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    {ngoProfile.orgName}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Environmental NGO
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                  <span>{ngoProfile.orgType}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-marine-400" />
                    {ngoProfile.operatingLocation}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-marine-300 text-[11px]">
                    ID: {ngoProfile.accreditationId}
                  </span>
                </p>

                <p className="text-xs text-slate-300/80 mt-1 max-w-xl line-clamp-1 italic">
                  "{ngoProfile.missionStatement || 'Promoting scientific coastal stewardship and plastic cleanup.'}"
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Submissions
              </span>
              <span className="text-xl font-black text-white">{communityReports.length}</span>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                Pending Review
              </span>
              <span className="text-xl font-black text-amber-400">
                {communityReports.filter(r => r.status === 'pending_review' || r.status === 'under_review').length}
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                Verified Audits
              </span>
              <span className="text-xl font-black text-emerald-400">
                {communityReports.filter(r => r.status === 'verified').length}
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">
                Cleanup Drives
              </span>
              <span className="text-xl font-black text-cyan-300">
                {orgDrives.length} Active
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('reports')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'reports'
                  ? 'border-marine-600 text-marine-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Review Reports & Photos</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-marine-100 text-marine-800 font-bold">
                {communityReports.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cleanups')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'cleanups'
                  ? 'border-marine-600 text-marine-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Organize Cleanup Drives</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-ocean-100 text-ocean-800 font-bold">
                {cleanupDrives.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'border-marine-600 text-marine-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Organization Credibility</span>
            </button>
          </div>

          {activeTab === 'cleanups' && !showNewDriveForm && (
            <button
              onClick={() => setShowNewDriveForm(true)}
              className="mb-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-marine-600 hover:bg-marine-700 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Drive</span>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {updateFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{updateFeedback}</span>
            </div>
          )}

          {driveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Environmental Cleanup Drive published successfully to the public platform!</span>
            </div>
          )}

          {/* TAB 1: REPORTS REVIEW & MODERATION */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              
              {/* Filter pills */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Filter:</span>
                  {(['all', 'pending', 'verified', 'cleanups'] as const).map(filter => (
                    <button
                      key={filter}
                      onClick={() => setReportFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                        reportFilter === filter
                          ? 'bg-marine-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {filter === 'cleanups' ? 'Cleanup Scheduled' : filter}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-slate-400">
                  Showing {filteredReports.length} citizen observations
                </span>
              </div>

              {filteredReports.map(report => (
                <div
                  key={report.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 hover:border-slate-300 transition-all shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          report.status === 'verified'
                            ? 'bg-teal-100 text-teal-800 border border-teal-200'
                            : report.status === 'cleanup_scheduled'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : report.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {report.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <SeverityBadge severity={report.severity} />
                        <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {report.waterbodyType.toUpperCase()}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-base text-slate-900">{report.locationName}</h4>
                      <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                        <span>Reported by: <strong className="text-slate-700">{report.reporterName}</strong></span>
                        {report.reporterEmail && <span>({report.reporterEmail})</span>}
                        <span>•</span>
                        <span>Date: {report.date} at {report.time}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-ocean-700">
                          [{report.coordinates[0].toFixed(4)}, {report.coordinates[1].toFixed(4)}]
                        </span>
                      </p>
                    </div>

                    {report.photoUrl && (
                      <div className="relative group shrink-0">
                        <img
                          src={report.photoUrl}
                          alt={report.locationName}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-slate-200 shadow-xs"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                          Photo
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-xs">
                    <div className="font-medium text-slate-600">
                      Primary Debris: <span className="font-bold text-slate-800 capitalize">{report.wasteCategory}</span> • Estimated Count: <span className="font-bold text-slate-800">{report.estimatedPieces} items</span>
                    </div>

                    {selectedReportId === report.id ? (
                      <div className="w-full mt-2 p-3 bg-white rounded-xl border border-marine-300 space-y-3 animate-in fade-in">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-marine-900">
                            Update Scientific Moderation Status
                          </span>
                          <button
                            onClick={() => setSelectedReportId(null)}
                            className="text-slate-400 hover:text-slate-600 text-xs"
                          >
                            Cancel
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">Status</label>
                            <select
                              value={statusSelect}
                              onChange={(e) => setStatusSelect(e.target.value as CommunityReportStatus)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-medium"
                            >
                              <option value="pending_review">Pending Review</option>
                              <option value="under_review">Under NGO Review</option>
                              <option value="verified">Verified Scientific Audit</option>
                              <option value="cleanup_scheduled">Scheduled for Cleanup Drive</option>
                              <option value="resolved">Debris Resolved / Cleaned</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-600 block mb-1">
                              Reviewer Notes / Action Plan
                            </label>
                            <input
                              type="text"
                              value={reviewNote}
                              onChange={(e) => setReviewNote(e.target.value)}
                              placeholder="e.g. Field team dispatched for coastal sweep"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-medium"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedReportId(null)}
                            className="px-3 py-1 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateStatusSubmit(report.id)}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-marine-600 hover:bg-marine-700 shadow-xs"
                          >
                            Save Status & Sign Audit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {report.reviewNotes && (
                          <span className="text-[11px] text-slate-500 italic">
                            Note: "{report.reviewNotes}"
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setSelectedReportId(report.id);
                            setStatusSelect(report.status);
                            setReviewNote(report.reviewNotes || '');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-marine-700 bg-marine-50 hover:bg-marine-100 border border-marine-200 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Review & Change Status</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: CLEANUP DRIVES MANAGEMENT */}
          {activeTab === 'cleanups' && (
            <div className="space-y-4">
              
              {showNewDriveForm ? (
                <div className="bg-slate-50 p-5 rounded-2xl border border-marine-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-marine-600" />
                      Create New Environmental Cleanup Drive
                    </h4>
                    <button
                      onClick={() => setShowNewDriveForm(false)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleCreateDriveSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-bold text-slate-700">Drive Title *</label>
                        <input
                          type="text"
                          value={driveTitle}
                          onChange={(e) => setDriveTitle(e.target.value)}
                          placeholder="e.g. Santa Monica Beach Macroplastic Sweep"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Waterbody Type</label>
                        <select
                          value={driveWaterbody}
                          onChange={(e) => setDriveWaterbody(e.target.value as WaterbodyType)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                        >
                          <option value="beach">Beach</option>
                          <option value="river">River</option>
                          <option value="coastline">Coastline</option>
                          <option value="estuary">Estuary</option>
                          <option value="sea_ocean">Sea / Ocean</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Location Name *</label>
                        <input
                          type="text"
                          value={driveLocation}
                          onChange={(e) => setDriveLocation(e.target.value)}
                          placeholder="e.g. Santa Monica Pier Strand"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Date *</label>
                        <input
                          type="date"
                          value={driveDate}
                          onChange={(e) => setDriveDate(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Meeting Time *</label>
                        <input
                          type="time"
                          value={driveTime}
                          onChange={(e) => setDriveTime(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Latitude</label>
                        <input
                          type="text"
                          value={driveLat}
                          onChange={(e) => setDriveLat(e.target.value)}
                          placeholder="34.0102"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Longitude</label>
                        <input
                          type="text"
                          value={driveLng}
                          onChange={(e) => setDriveLng(e.target.value)}
                          placeholder="-118.4965"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Target Volunteer Count</label>
                        <input
                          type="number"
                          min="5"
                          max="500"
                          value={driveTargetVolunteers}
                          onChange={(e) => setDriveTargetVolunteers(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Equipment Provided</label>
                        <input
                          type="text"
                          value={driveEquip}
                          onChange={(e) => setDriveEquip(e.target.value)}
                          placeholder="Gloves, sacks, litter grabbers..."
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Cleanup Plan & Guidelines</label>
                      <textarea
                        rows={3}
                        value={driveDesc}
                        onChange={(e) => setDriveDesc(e.target.value)}
                        placeholder="Detail the target debris, rendezvous point, parking advice, and safety precautions..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowNewDriveForm(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-marine-600 hover:bg-marine-700 shadow-md shadow-marine-600/20"
                      >
                        Publish Cleanup Drive
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Active & Scheduled Environmental Drives ({cleanupDrives.length})</span>
                  <span className="text-[11px] text-marine-700 font-semibold bg-marine-50 px-2 py-0.5 rounded">
                    Publicly Visible to Volunteers
                  </span>
                </div>

                {cleanupDrives.map(drive => (
                  <div
                    key={drive.id}
                    className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-marine-100 text-marine-800 border border-marine-200">
                            {drive.orgName}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {drive.waterbodyType.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900">{drive.title}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{drive.date} at {drive.time}</span>
                          <span>•</span>
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{drive.locationName}</span>
                        </p>
                      </div>

                      <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-center shrink-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered</span>
                        <span className="text-sm font-black text-marine-700">
                          {drive.registeredVolunteers.length} / {drive.targetVolunteers}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed">
                      {drive.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-xs">
                      <div className="text-slate-500 text-[11px]">
                        <strong>Gear Provided:</strong> {drive.equipmentProvided.join(', ')}
                      </div>
                      <span className="text-[11px] font-bold text-teal-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                        Live on Citizen Portal
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: ORGANIZATION PROFILE & CREDIBILITY */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {profileSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Organization profile updated successfully!</span>
                </div>
              )}

              {/* Credibility Certificate Banner */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 p-4 rounded-2xl flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-xs text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Accredited Environmental Organization</span>
                    <span className="text-[10px] bg-teal-200 text-teal-900 px-1.5 py-0.2 rounded font-mono">
                      {ngoProfile.accreditationId}
                    </span>
                  </h4>
                  <p className="text-xs text-teal-800 leading-snug">
                    This organization possesses verified authority on AquaWatch to review and certify community citizen observations, upgrade data confidence metrics, and schedule regional coastal cleanups.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Organization Name *</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Organization Type</label>
                    <select
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                    >
                      <option value="Marine Conservation NGO">Marine Conservation NGO</option>
                      <option value="River Basin Alliance">River Basin Alliance</option>
                      <option value="Coastal Cleanup Non-Profit">Coastal Cleanup Non-Profit</option>
                      <option value="Environmental Research & Science">Environmental Research</option>
                      <option value="Youth Climate Action Network">Youth Climate Action</option>
                      <option value="Community Ocean Stewardship">Ocean Stewardship</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Official Email (Read-Only)</label>
                  <input
                    type="email"
                    value={ngoProfile.officialEmail}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Contact Person *</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Contact Telephone *</label>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Operating Coastal / River Region *</label>
                    <input
                      type="text"
                      value={operatingLocation}
                      onChange={(e) => setOperatingLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Official Website</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mission Statement</label>
                  <textarea
                    rows={3}
                    value={missionStatement}
                    onChange={(e) => setMissionStatement(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium"
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
                    Log Out of NGO Account
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-marine-600 hover:bg-marine-700 shadow-md shadow-marine-600/20"
                  >
                    Save Organization Details
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
