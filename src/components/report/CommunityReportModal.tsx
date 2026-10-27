import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Upload, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Image as ImageIcon, 
  AlertCircle,
  Check,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';
import { usePollution } from '../../context/PollutionContext';
import { WaterbodyType, PlasticWasteCategory, SeverityLevel } from '../../types/pollution';
import { SeverityBadge } from '../common/Badge';

interface CommunityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCoordinates?: [number, number] | null;
}

export const CommunityReportModal: React.FC<CommunityReportModalProps> = ({
  isOpen,
  onClose,
  initialCoordinates,
}) => {
  const { submitCommunityReport, communityReports, verifyCommunityReport } = usePollution();

  const [activeTab, setActiveTab] = useState<'submit' | 'queue'>('submit');

  // Form State
  const [locationName, setLocationName] = useState('');
  const [waterbodyType, setWaterbodyType] = useState<WaterbodyType>('beach');
  const [lat, setLat] = useState(initialCoordinates ? initialCoordinates[0].toString() : '34.0195');
  const [lng, setLng] = useState(initialCoordinates ? initialCoordinates[1].toString() : '-118.4912');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [wasteCategory, setWasteCategory] = useState<PlasticWasteCategory>('packaging');
  const [estimatedPieces, setEstimatedPieces] = useState(45);
  const [severity, setSeverity] = useState<SeverityLevel>('Moderate');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [antiSpamConfirmed, setAntiSpamConfirmed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Handle image upload with local FileReader
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size must be under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Get current device GPS location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toFixed(4));
          setLng(pos.coords.longitude.toFixed(4));
        },
        (err) => {
          setErrorMsg('Unable to retrieve device GPS coordinates. Please enter manually.');
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!locationName.trim()) {
      setErrorMsg('Please enter a location name.');
      return;
    }

    const numLat = parseFloat(lat);
    const numLng = parseFloat(lng);
    if (isNaN(numLat) || isNaN(numLng)) {
      setErrorMsg('Please enter valid numerical latitude and longitude coordinates.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Please provide a short description of the observed plastic debris.');
      return;
    }

    if (!reporterName.trim()) {
      setErrorMsg('Please enter your name or organization.');
      return;
    }

    if (!antiSpamConfirmed) {
      setErrorMsg('Please confirm the observation statement for scientific integrity.');
      return;
    }

    submitCommunityReport({
      locationName: locationName.trim(),
      waterbodyType,
      coordinates: [numLat, numLng],
      date,
      time,
      wasteCategory,
      estimatedPieces: Number(estimatedPieces),
      severity,
      description: description.trim(),
      reporterName: reporterName.trim(),
      reporterEmail: reporterEmail.trim() || undefined,
      photoUrl: photoPreview || undefined,
    });

    setIsSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-marine-50/40">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Community Pollution Watch
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Citizen science monitoring network for coastal and freshwater plastic tracking
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-4">
          <button
            onClick={() => setActiveTab('submit')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'submit'
                ? 'border-ocean-600 text-ocean-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Submit New Observation
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'border-ocean-600 text-ocean-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Review & Moderation Queue</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-ocean-100 text-ocean-800">
              {communityReports.length}
            </span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'submit' ? (
            isSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Observation Submitted!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you for contributing to open environmental science. Your report is now visible on the map marked as <strong>Citizen Unverified</strong> while regional moderators review it.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Location & Waterbody */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Location Name *</label>
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g. Santa Monica Pier, Pier Strand"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Waterbody Type</label>
                    <select
                      value={waterbodyType}
                      onChange={(e) => setWaterbodyType(e.target.value as WaterbodyType)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500 font-medium"
                    >
                      <option value="beach">Beach</option>
                      <option value="river">River</option>
                      <option value="coastline">Coastline</option>
                      <option value="estuary">Estuary / Delta</option>
                      <option value="sea_ocean">Sea / Open Ocean</option>
                    </select>
                  </div>
                </div>

                {/* Coordinates Picker */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Coordinates (Latitude, Longitude) *</label>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      className="text-[11px] font-semibold text-ocean-600 hover:text-ocean-700 flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" />
                      Get Current GPS Location
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      placeholder="Latitude (e.g. 34.0195)"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono"
                      required
                    />
                    <input
                      type="text"
                      value={lng}
                      onChange={(e) => setLng(e.target.value)}
                      placeholder="Longitude (e.g. -118.4912)"
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Date, Time & Severity */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Observation Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Time</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Severity Assessment</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500 font-medium"
                    >
                      <option value="Low">Low (&lt;20 items)</option>
                      <option value="Moderate">Moderate (20-100 items)</option>
                      <option value="High">High (100-500 items)</option>
                      <option value="Critical">Critical (&gt;500 items / dense)</option>
                    </select>
                  </div>
                </div>

                {/* Waste Category & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Primary Plastic Type</label>
                    <select
                      value={wasteCategory}
                      onChange={(e) => setWasteCategory(e.target.value as PlasticWasteCategory)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500 font-medium"
                    >
                      <option value="packaging">Packaging & Food Containers</option>
                      <option value="bottles">Beverage Bottles & Caps</option>
                      <option value="bags">Plastic Bags & Thin Films</option>
                      <option value="fishing_gear">Fishing Gear, Lines & Nets</option>
                      <option value="microplastics">Microplastics / Small Fragments</option>
                      <option value="mixed_macroplastics">Mixed Macroplastics</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      Estimated Count: <span className="text-ocean-700">{estimatedPieces} pieces</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="1000"
                      step="5"
                      value={estimatedPieces}
                      onChange={(e) => setEstimatedPieces(Number(e.target.value))}
                      className="w-full accent-ocean-600 mt-2"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Observation Notes *</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe specific items found, tidal state, recent rainfall or runoff, and environmental impact..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500"
                    required
                  />
                </div>

                {/* Photo Upload */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Photo Evidence (Optional)</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                    {photoPreview && (
                      <div className="flex items-center gap-2">
                        <img 
                          src={photoPreview} 
                          alt="Evidence preview" 
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => setPhotoPreview(null)}
                          className="text-xs text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Observer Details & Anti-Spam */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Reporter / Organization *</label>
                    <input
                      type="text"
                      value={reporterName}
                      onChange={(e) => setReporterName(e.target.value)}
                      placeholder="Your name or citizen group"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Email (Optional, Private)</label>
                    <input
                      type="email"
                      value={reporterEmail}
                      onChange={(e) => setReporterEmail(e.target.value)}
                      placeholder="For verification follow-up only"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                    />
                  </div>
                </div>

                {/* Anti-spam integrity check */}
                <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <input
                    type="checkbox"
                    id="anti-spam"
                    checked={antiSpamConfirmed}
                    onChange={(e) => setAntiSpamConfirmed(e.target.checked)}
                    className="mt-0.5 rounded text-ocean-600 focus:ring-ocean-500"
                  />
                  <label htmlFor="anti-spam" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                    I confirm that this report reflects a genuine personal environmental observation. I acknowledge it will be labeled as <strong>Citizen Unverified</strong> until validated by regional moderators.
                  </label>
                </div>

                {/* Submit CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-marine-600 to-ocean-600 hover:from-marine-700 hover:to-ocean-700 shadow-md shadow-ocean-600/20 transition-all active:scale-[0.99]"
                  >
                    Submit Community Report to Open Map
                  </button>
                </div>

              </form>
            )
          ) : (
            /* Moderation Queue Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Recent Community Submissions ({communityReports.length})</span>
                <span className="text-[11px] font-semibold text-ocean-700 bg-ocean-50 px-2 py-0.5 rounded">
                  Moderator Workflow Demo
                </span>
              </div>

              {communityReports.map((report) => (
                <div 
                  key={report.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          report.status === 'verified' 
                            ? 'bg-teal-100 text-teal-800 border border-teal-200' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {report.status === 'verified' ? 'Verified Audit' : 'Pending Verification'}
                        </span>
                        <SeverityBadge severity={report.severity} />
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900">{report.locationName}</h4>
                      <p className="text-xs text-slate-500">
                        {report.date} at {report.time} • Reported by {report.reporterName}
                      </p>
                    </div>

                    {report.photoUrl && (
                      <img 
                        src={report.photoUrl} 
                        alt={report.locationName} 
                        className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-sm shrink-0"
                      />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                    {report.description}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-semibold text-slate-700">
                      Estimated: {report.estimatedPieces} items ({report.wasteCategory})
                    </span>

                    {report.status !== 'verified' ? (
                      <button
                        onClick={() => verifyCommunityReport(report.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Verify & Upgrade Rigor
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        Verified by AquaWatch
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
