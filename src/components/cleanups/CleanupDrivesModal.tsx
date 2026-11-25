import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Check, 
  Building2, 
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { usePollution } from '../../context/PollutionContext';

interface CleanupDrivesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAuth: (reason: string) => void;
}

export const CleanupDrivesModal: React.FC<CleanupDrivesModalProps> = ({
  isOpen,
  onClose,
  onTriggerAuth,
}) => {
  const { isAuthenticated, isUser, userProfile } = useAuth();
  const { cleanupDrives, registerForCleanupDrive } = usePollution();

  const [rsvpFeedback, setRsvpFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleJoinDrive = (driveId: string, driveTitle: string) => {
    if (!isAuthenticated) {
      onTriggerAuth(`Please log in or create an account to RSVP for "${driveTitle}".`);
      return;
    }

    if (!isUser || !userProfile) {
      setRsvpFeedback('NGO accounts coordinate drives. To volunteer as an individual, please sign in with a Citizen User account.');
      setTimeout(() => setRsvpFeedback(null), 3500);
      return;
    }

    const registered = registerForCleanupDrive(driveId, userProfile.email);
    if (registered) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      setRsvpFeedback(`You're officially registered for "${driveTitle}"! The organizing team has been notified.`);
    } else {
      setRsvpFeedback(`You are already registered for "${driveTitle}".`);
    }
    setTimeout(() => setRsvpFeedback(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-marine-50/70 via-ocean-50/40 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-marine-600 to-ocean-600 flex items-center justify-center text-white shadow-md shadow-marine-600/20">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-marine-100 text-marine-800">
                  Community Action
                </span>
                <span className="text-xs text-slate-500 font-medium">Public Volunteer Network</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Environmental Cleanup Drives
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback message banner */}
        {rsvpFeedback && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{rsvpFeedback}</span>
          </div>
        )}

        {/* Drives List */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Discover upcoming coastal, beach, and river cleanup opportunities ({cleanupDrives.length})</span>
            <span className="text-[11px] font-semibold text-marine-700 bg-marine-50 px-2 py-0.5 rounded">
              Organized by Accredited NGOs
            </span>
          </div>

          {cleanupDrives.map(drive => {
            const isUserRegistered = userProfile && drive.registeredVolunteers.includes(userProfile.email);
            const spotsRemaining = Math.max(0, drive.targetVolunteers - drive.registeredVolunteers.length);

            return (
              <div
                key={drive.id}
                className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 hover:border-marine-200 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-marine-100 text-marine-800 border border-marine-200">
                        <Building2 className="w-3 h-3 text-marine-600" />
                        {drive.orgName}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        <ShieldCheck className="w-3 h-3 text-teal-600" />
                        Verified NGO
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 uppercase">
                        {drive.waterbodyType}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      {drive.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-marine-600" />
                        <span>{drive.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-marine-600" />
                        <span>{drive.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-marine-600" />
                        <span>{drive.locationName}</span>
                      </div>
                    </div>
                  </div>

                  {drive.imageUrl && (
                    <img
                      src={drive.imageUrl}
                      alt={drive.title}
                      className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-xs shrink-0 hidden sm:block"
                    />
                  )}
                </div>

                <p className="text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200/80 leading-relaxed">
                  {drive.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80 text-xs">
                  <div className="space-y-0.5">
                    <div className="text-slate-500 text-[11px]">
                      <strong>Gear Provided:</strong> {drive.equipmentProvided.join(', ')}
                    </div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        <strong>{drive.registeredVolunteers.length}</strong> volunteers joined • {spotsRemaining} spots available
                      </span>
                    </div>
                  </div>

                  {isUserRegistered ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-teal-800 bg-teal-100 border border-teal-200">
                      <Check className="w-4 h-4 text-teal-600" />
                      You Are Registered
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoinDrive(drive.id, drive.title)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-marine-600 to-ocean-600 hover:from-marine-700 hover:to-ocean-700 shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAuthenticated ? 'Join as Volunteer' : 'Sign In to Join Drive'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
