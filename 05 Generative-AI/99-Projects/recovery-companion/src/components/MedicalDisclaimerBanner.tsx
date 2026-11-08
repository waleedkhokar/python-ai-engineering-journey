import React, { useState } from 'react';
import { ShieldCheck, Info, X, ExternalLink } from 'lucide-react';

export const MedicalDisclaimerBanner: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1 text-xs text-amber-800 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-medium">Medical Disclaimer: Non-Diagnostic Informational Assistant</span>
        </div>
        <button 
          onClick={() => setIsMinimized(false)} 
          className="text-amber-700 underline text-[11px] hover:text-amber-900 font-medium"
        >
          View Full Safety Guardrails
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-emerald-50 border-b border-amber-200/80 px-4 sm:px-6 py-2.5 text-xs text-slate-700 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-start space-x-3">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 mt-0.5 sm:mt-0 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-xs">
              Medical & Safety Disclaimer
            </p>
            <p className="text-slate-600 leading-relaxed text-[11px] mt-0.5">
              This AI Discharge Assistant translates and organizes your existing hospital discharge paperwork into plain language. It <strong className="text-slate-900">does not issue new medical diagnoses</strong>, alter prescribed drug dosages, or replace professional advice from your doctor or care team. Always verify details with your official discharge documents.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-slate-200/60 rounded text-slate-500 hover:text-slate-800 transition-colors"
            title="Minimize disclaimer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
