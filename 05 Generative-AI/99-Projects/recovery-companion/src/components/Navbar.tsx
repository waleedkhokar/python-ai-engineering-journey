import React from 'react';
import { 
  ShieldAlert, 
  FileText, 
  Share2, 
  Languages, 
  PhoneCall, 
  Activity, 
  Volume2, 
  PlusCircle,
  UserCheck,
  Bell,
  Info
} from 'lucide-react';
import { LanguageCode } from '../types';

interface NavbarProps {
  patientName: string;
  hospitalName: string;
  isVerified?: boolean;
  onOpenUpload: () => void;
  onOpenShare: () => void;
  onOpenPrint: () => void;
  onOpenReminders?: () => void;
  onOpenEmergencyModal?: () => void;
  onOpenUrduModal?: () => void;
  onOpenGeminiStatus?: () => void;
  notificationPermission?: string;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isCaregiverMode: boolean;
  onToggleCaregiverMode: () => void;
  onPlayTTSOverview?: () => void;
  isTTSPlaying?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  patientName,
  hospitalName,
  isVerified = false,
  onOpenUpload,
  onOpenShare,
  onOpenPrint,
  onOpenReminders,
  onOpenEmergencyModal,
  onOpenUrduModal,
  onOpenGeminiStatus,
  notificationPermission = 'default',
  currentLanguage,
  onLanguageChange,
  isCaregiverMode,
  onToggleCaregiverMode,
  onPlayTTSOverview,
  isTTSPlaying
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* 1. Top Emergency Fast-Bar */}
      <div className="bg-slate-900 text-slate-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center space-x-2 font-bold tracking-tight">
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
          <span className="text-rose-400 uppercase font-black tracking-wider text-[11px]">Emergency Hotline:</span>
          <span className="hidden md:inline text-slate-300">Experiencing severe shortness of breath or heavy bleeding?</span>
          <a href="tel:911" className="bg-rose-600 hover:bg-rose-500 text-white font-black px-2.5 py-0.5 rounded text-[11px] uppercase tracking-wider transition-colors ml-1">
            CALL 911
          </a>
          {onOpenEmergencyModal && (
            <button
              onClick={onOpenEmergencyModal}
              className="text-[11px] font-black uppercase text-amber-400 hover:text-amber-300 underline ml-2 flex items-center space-x-1"
            >
              <Info className="w-3 h-3" />
              <span>Warning Signs</span>
            </button>
          )}
        </div>
        
        {/* 2. Status Bar Details */}
        <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          <a href="tel:5552348900" className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors">
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-300">Care Team: (555) 234-8900</span>
          </a>
          <button 
            onClick={onOpenGeminiStatus}
            className="flex items-center gap-1.5 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-all border border-slate-700/60 cursor-pointer"
            title="Click to view Gemini 3.6 Flash Engine status and run diagnostic"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-blue-400 hover:text-blue-300 font-bold">Gemini 3.6 Flash Active</span>
          </button>
        </div>
      </div>

      {/* 3. Branding Row & 4. Action Toolbar grouped into 2 clean rows */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Brand Logo & App Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-md shadow-blue-600/20">
              <Activity className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tighter text-slate-950 uppercase">
                  RECOVERY<span className="text-blue-600 ml-1">COMPANION</span>
                </h1>
                {/* Verified badge shown ONLY when generated from a real uploaded document */}
                {isVerified ? (
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Verified Document
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded bg-slate-100 text-slate-600 border border-slate-200">
                    Demo Plan
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-2 mt-0.5">
                <span>Patient: <strong className="text-slate-900">{patientName}</strong></span>
                <span className="text-slate-300">•</span>
                <span className="hidden md:inline">{hospitalName}</span>
              </p>
            </div>
          </div>

          {/* Action Toolbar - Row 1 & Row 2 Organized Grid */}
          <div className="flex flex-col items-end gap-2">
            {/* Toolbar Row 1: Audio Guide, Caregiver View, Urdu Prescription, Language */}
            <div className="flex items-center flex-wrap gap-2">
              {onOpenUrduModal && (
                <button
                  onClick={onOpenUrduModal}
                  className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <Languages className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Explain Rx in Urdu</span>
                </button>
              )}

              {onPlayTTSOverview && (
                <button
                  onClick={onPlayTTSOverview}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all border ${
                    isTTSPlaying 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm animate-pulse' 
                      : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isTTSPlaying ? 'Playing Audio' : 'Audio Guide'}</span>
                </button>
              )}

              <button
                onClick={onToggleCaregiverMode}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all border ${
                  isCaregiverMode 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{isCaregiverMode ? 'Caregiver Mode ON' : 'Caregiver View'}</span>
              </button>

              <div className="relative flex items-center">
                <Languages className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
                <select
                  value={currentLanguage}
                  onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                  className="bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-wider pl-7 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 hover:bg-slate-200 transition-colors"
                >
                  <option value="en">English (US)</option>
                  <option value="ur">اردو (Urdu)</option>
                  <option value="es">Español</option>
                  <option value="zh">中文</option>
                  <option value="ar">العربية</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>

            {/* Toolbar Row 2: Push Alarms, Share, Print/PDF, Upload Papers */}
            <div className="flex items-center flex-wrap gap-2">
              {onOpenReminders && (
                <button
                  onClick={onOpenReminders}
                  className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 transition-all flex items-center space-x-1.5 relative"
                >
                  <Bell className="w-3.5 h-3.5 text-blue-600" />
                  <span>Push Alarms</span>
                  <span className={`w-2 h-2 rounded-full ${
                    notificationPermission === 'granted' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`} />
                </button>
              )}

              <button
                onClick={onOpenShare}
                className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 transition-all flex items-center space-x-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Share QR</span>
              </button>

              <button
                onClick={onOpenPrint}
                className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 transition-all flex items-center space-x-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Print / PDF</span>
              </button>

              <button
                onClick={onOpenUpload}
                className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center space-x-1.5 shadow-md shadow-blue-600/20"
              >
                <PlusCircle className="w-3.5 h-3.5 text-blue-200" />
                <span>Create Recovery Plan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

