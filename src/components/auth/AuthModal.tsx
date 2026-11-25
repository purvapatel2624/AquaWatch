import React, { useState } from 'react';
import { 
  X, 
  User, 
  Building2, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  initialMode?: 'login' | 'register';
  redirectReason?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'user',
  initialMode = 'login',
  redirectReason,
}) => {
  const { login, registerUser, registerNgo, quickLoginDemo } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // User fields
  const [fullName, setFullName] = useState('');

  // NGO fields
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('Marine Conservation NGO');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [operatingLocation, setOperatingLocation] = useState('');
  const [accreditationId, setAccreditationId] = useState('');

  // State
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
  };

  const handleQuickDemo = (role: UserRole) => {
    quickLoginDemo(role);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password, selectedRole);
        if (!res.success) {
          setErrorMsg(res.error || 'Authentication failed');
          setLoading(false);
          return;
        }

        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        onClose();
      } else {
        // Registration validations
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match.');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }

        if (selectedRole === 'user') {
          if (!fullName.trim()) {
            setErrorMsg('Please enter your full name.');
            setLoading(false);
            return;
          }

          const res = await registerUser({
            fullName,
            email,
            password,
          });

          if (!res.success) {
            setErrorMsg(res.error || 'Registration failed');
            setLoading(false);
            return;
          }
        } else {
          // NGO validations
          if (!orgName.trim()) {
            setErrorMsg('Please enter your organization name.');
            setLoading(false);
            return;
          }
          if (!contactPerson.trim()) {
            setErrorMsg('Please enter the name of the official contact person.');
            setLoading(false);
            return;
          }
          if (!contactNumber.trim()) {
            setErrorMsg('Please enter an official contact telephone number.');
            setLoading(false);
            return;
          }
          if (!operatingLocation.trim()) {
            setErrorMsg('Please specify the operating coastal or river basin location.');
            setLoading(false);
            return;
          }

          const res = await registerNgo({
            orgName,
            orgType,
            officialEmail: email,
            contactPerson,
            contactNumber,
            operatingLocation,
            password,
            accreditationId: accreditationId || undefined,
          });

          if (!res.success) {
            setErrorMsg(res.error || 'Registration failed');
            setLoading(false);
            return;
          }
        }

        setSuccessMsg('Account created successfully! Welcome to AquaWatch.');
        confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-ocean-50/50 via-white to-marine-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-ocean-100 text-ocean-800">
                AquaWatch Portal
              </span>
              <span className="text-xs text-slate-500 font-medium">Identity & Rigor</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              {mode === 'login' ? 'Sign In to AquaWatch' : 'Create an Account'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative redirect notice if triggered from a protected action */}
        {redirectReason && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{redirectReason}</span>
          </div>
        )}

        {/* Scrollable form body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Two Prominent Options: USER vs NGO */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Option A: Ordinary User */}
              <button
                type="button"
                onClick={() => handleRoleChange('user')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  selectedRole === 'user'
                    ? 'border-ocean-600 bg-ocean-50/70 shadow-sm ring-2 ring-ocean-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedRole === 'user' ? 'bg-ocean-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                  {selectedRole === 'user' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-ocean-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Option A: Citizen User</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Submit pollution reports, track status, view past reports & volunteer.
                  </p>
                </div>
              </button>

              {/* Option B: NGO / Organization */}
              <button
                type="button"
                onClick={() => handleRoleChange('ngo')}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  selectedRole === 'ngo'
                    ? 'border-marine-600 bg-marine-50/70 shadow-sm ring-2 ring-marine-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedRole === 'ngo' ? 'bg-marine-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  {selectedRole === 'ngo' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-marine-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-extrabold text-sm text-slate-900">Option B: NGO / Org</h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-marine-600" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Moderate reports, organize cleanup drives, manage NGO dashboard.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Mode Switcher: Login vs Register */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Register New {selectedRole === 'ngo' ? 'Organization' : 'Account'}
            </button>
          </div>

          {/* Errors or Success */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* USER REGISTRATION SPECIFIC FIELDS */}
            {mode === 'register' && selectedRole === 'user' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500 font-medium"
                    required
                  />
                </div>
              </div>
            )}

            {/* NGO REGISTRATION SPECIFIC FIELDS */}
            {mode === 'register' && selectedRole === 'ngo' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Organization Name *</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Pacific Ocean Cleanup Alliance"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-marine-500 font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Organization Type *</label>
                    <select
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-marine-500 font-medium"
                    >
                      <option value="Marine Conservation NGO">Marine Conservation NGO</option>
                      <option value="River Basin Alliance">River Basin Alliance</option>
                      <option value="Coastal Cleanup Non-Profit">Coastal Cleanup Non-Profit</option>
                      <option value="Environmental Research & Science">Environmental Research & Science</option>
                      <option value="Youth Climate Action Network">Youth Climate Action Network</option>
                      <option value="Community Ocean Stewardship">Community Ocean Stewardship</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Contact Person *</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. Dr. Marcus Vance"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-marine-500 font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Contact Number *</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="+1 (555) 382-9011"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-marine-500 font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Operating Location *</label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={operatingLocation}
                        onChange={(e) => setOperatingLocation(e.target.value)}
                        placeholder="e.g. California Coast & Bay Area"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-marine-500 font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Accreditation / Reg ID (Optional)</label>
                    <input
                      type="text"
                      value={accreditationId}
                      onChange={(e) => setAccreditationId(e.target.value)}
                      placeholder="e.g. UN-EP-NGO-8842"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-marine-500 font-medium"
                    />
                  </div>
                </div>
              </>
            )}

            {/* EMAIL (COMMON) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {selectedRole === 'ngo' ? 'Official Organization Email *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'ngo'
                      ? 'e.g. coordinator@pacificcleanup.org'
                      : 'e.g. elena.citizen@aquawatch.org'
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500 font-medium"
                  required
                />
              </div>
            </div>

            {/* PASSWORD (COMMON) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500 font-medium"
                  required
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD (REGISTER ONLY) */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-ocean-500 font-medium"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                selectedRole === 'ngo'
                  ? 'bg-gradient-to-r from-marine-600 to-teal-700 hover:from-marine-700 hover:to-teal-800 shadow-marine-600/20'
                  : 'bg-gradient-to-r from-ocean-600 to-marine-600 hover:from-ocean-700 hover:to-marine-700 shadow-ocean-600/20'
              } disabled:opacity-50`}
            >
              <span>{mode === 'login' ? 'Sign In Securely' : 'Create Account & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Bar for Instant Review */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Instant Demo Access (1-Click)
              </span>
              <span className="text-[10px] text-slate-400">Pre-seeded accounts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('user')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-ocean-50 text-ocean-800 hover:bg-ocean-100 border border-ocean-200 transition-colors text-left"
              >
                <User className="w-4 h-4 text-ocean-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold truncate">Login as Citizen User</div>
                  <div className="text-[10px] text-ocean-600/80 truncate">Elena Rostova (Reports & Profile)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('ngo')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-marine-50 text-marine-800 hover:bg-marine-100 border border-marine-200 transition-colors text-left"
              >
                <Building2 className="w-4 h-4 text-marine-600 shrink-0" />
                <div className="truncate">
                  <div className="font-bold truncate">Login as Verified NGO</div>
                  <div className="text-[10px] text-marine-600/80 truncate">Pacific Ocean Alliance (Dashboard)</div>
                </div>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
