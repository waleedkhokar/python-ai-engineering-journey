import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Building2, 
  Stethoscope, 
  Calendar, 
  ShieldCheck, 
  Share2, 
  Mail, 
  Phone, 
  Bell, 
  CheckCircle2, 
  FileText, 
  Key, 
  Globe, 
  Save, 
  Sparkles,
  Lock,
  Download,
  LogOut
} from 'lucide-react';
import { DischargePlan, LanguageCode } from '../types';
import { LocalUser } from '../lib/firestoreService';

interface PatientProfileViewProps {
  plan: DischargePlan;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isCaregiverMode: boolean;
  onToggleCaregiverMode: () => void;
  onOpenShare: () => void;
  onOpenPrint: () => void;
  onOpenLegal?: () => void;
  currentUser?: LocalUser | null;
  onSignOut?: () => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({
  plan,
  currentLanguage,
  onLanguageChange,
  isCaregiverMode,
  onToggleCaregiverMode,
  onOpenShare,
  onOpenPrint,
  onOpenLegal,
  currentUser,
  onSignOut
}) => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-2 animate-fadeIn">
      {/* Patient Profile Header Card */}
      <div className="bento-card p-8 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              {plan.patientName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="heavy-type text-2xl text-white uppercase tracking-tight">
                  {plan.patientName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest">
                  Active Patient
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 flex flex-wrap items-center gap-2">
                <span>Ref Code: {plan.caregiverShareCode || 'CARE-8921-DC'}</span>
                <span>•</span>
                <span>Discharged: {plan.dischargeDate}</span>
                {currentUser && (
                  <>
                    <span>•</span>
                    <span className="text-teal-400 font-bold">Account: {currentUser.email}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentUser && onSignOut && (
              <button
                onClick={onSignOut}
                className="px-3.5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-black uppercase tracking-wider text-xs rounded-xl border border-rose-500/30 transition-all flex items-center space-x-2"
                title="Sign out of Caregiver Portal"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            )}

            <button
              onClick={onOpenShare}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Access</span>
            </button>

            <button
              onClick={onOpenPrint}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black uppercase tracking-wider text-xs rounded-xl border border-slate-700 transition-all flex items-center space-x-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Record</span>
            </button>
          </div>
        </div>

        {/* Clinical Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              Hospital Facility
            </span>
            <span className="font-bold text-white text-sm block">
              {plan.hospitalName}
            </span>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              Attending Physician
            </span>
            <span className="font-bold text-white text-sm block">
              {plan.attendingPhysician}
            </span>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
              Primary Medical Diagnosis
            </span>
            <span className="font-bold text-teal-300 text-xs block truncate">
              {plan.primaryDiagnosis}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Preference Settings Card */}
        <div className="saas-card p-6 space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-wider text-sm text-slate-950">
                Language & Interface Settings
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Configure preferred language and display perspectives
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-black uppercase tracking-wider text-[11px] mb-1.5">
                Primary Plan Language:
              </label>
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold p-3 rounded-xl focus:outline-none focus:border-blue-600 text-xs"
              >
                <option value="en">English (US)</option>
                <option value="ur">اردو (Urdu)</option>
                <option value="es">Español (Spanish)</option>
                <option value="zh">中文 (Mandarin)</option>
                <option value="vi">Tiếng Việt (Vietnamese)</option>
                <option value="ar">العربية (Arabic)</option>
                <option value="fr">Français (French)</option>
              </select>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-black uppercase tracking-wider text-slate-900 block text-xs">
                  Caregiver Perspective Mode
                </span>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Optimizes view for family members and home health aides
                </p>
              </div>

              <button
                onClick={onToggleCaregiverMode}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  isCaregiverMode 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {isCaregiverMode ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications & Reminders Preferences */}
        <div className="saas-card p-6 space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-200">
            <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-wider text-sm text-slate-950">
                Notification Alerts
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Pill schedules & appointment reminder triggers
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <label className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-black uppercase tracking-wider text-slate-900 block text-xs">
                  Email Pharmacy Refill Notifications
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Receive low supply refill confirmations via email
                </span>
              </div>
              <input 
                type="checkbox" 
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-black uppercase tracking-wider text-slate-900 block text-xs">
                  SMS Follow-Up Reminders
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  SMS alerts 24 hours prior to clinic appointments
                </span>
              </div>
              <input 
                type="checkbox" 
                checked={smsAlerts}
                onChange={() => setSmsAlerts(!smsAlerts)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Preferences Saved!</span>
                </span>
              )}
              <button
                onClick={handleSaveSettings}
                className="ml-auto px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-black uppercase tracking-wider text-xs rounded-xl transition-all shadow-sm flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Legal & Privacy Statement */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3 text-slate-600">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <span>
            <strong>Data Security & Transparency:</strong> Patient records are encrypted and restricted to your account.
          </span>
        </div>

        {onOpenLegal && (
          <button
            onClick={onOpenLegal}
            className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-800 font-black uppercase text-[11px] rounded-xl border border-slate-300 transition-all shrink-0"
          >
            View Privacy Policy & Terms
          </button>
        )}
      </div>
    </div>
  );
};
