import React from 'react';
import { ShieldAlert, X, PhoneCall, AlertTriangle, ArrowRight } from 'lucide-react';
import { WarningSign } from '../types';

interface WarningSignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  warningSigns: WarningSign[];
  hospitalPhone?: string;
}

export const WarningSignsModal: React.FC<WarningSignsModalProps> = ({
  isOpen,
  onClose,
  warningSigns,
  hospitalPhone = '(555) 234-8900'
}) => {
  if (!isOpen) return null;

  const emergencySigns = warningSigns.filter((w) => w.level === 'emergency');
  const urgentSigns = warningSigns.filter((w) => w.level === 'urgent_call' || w.level === 'monitor');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-rose-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider">
                Emergency Warning Signs
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                When to seek immediate emergency help vs. calling your doctor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Call 911 Banner */}
          <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-black text-rose-950 uppercase tracking-wide">
                  Immediate 911 Emergency Signs
                </h3>
                <p className="text-xs text-rose-800 font-medium mt-0.5">
                  Chest pain, sudden shortness of breath, loss of consciousness, or massive bleeding.
                </p>
              </div>
            </div>
            <a
              href="tel:911"
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-rose-600/20 text-center shrink-0 flex items-center justify-center space-x-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 911 Now</span>
            </a>
          </div>

          {/* Emergency Symptoms List */}
          {emergencySigns.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Red-Flag Symptoms Identified in Your Plan
              </h4>
              <div className="space-y-2">
                {emergencySigns.map((sign, idx) => (
                  <div
                    key={sign.id || idx}
                    className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-start space-x-3"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0 animate-ping" />
                    <div>
                      <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        {sign.symptom}
                      </h5>
                      <p className="text-xs text-rose-900 font-bold mt-1">
                        Required Action: {sign.actionRequired}
                      </p>
                      {sign.sourceQuote && (
                        <p className="text-[11px] text-slate-500 italic mt-1 bg-white/60 p-2 rounded-lg border border-slate-200">
                          Quote from paperwork: "{sign.sourceQuote}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Urgent Doctor Contact List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Urgent Doctor Contact Signs
              </h4>
              <a
                href={`tel:${hospitalPhone.replace(/[^0-9]/g, '')}`}
                className="text-xs font-black text-blue-600 hover:underline flex items-center space-x-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Care Team ({hospitalPhone})</span>
              </a>
            </div>

            <div className="space-y-2">
              {urgentSigns.map((sign, idx) => (
                <div
                  key={sign.id || idx}
                  className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 flex items-start space-x-3"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      {sign.symptom}
                    </h5>
                    <p className="text-xs text-slate-700 font-medium mt-1">
                      {sign.actionRequired}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] font-semibold text-slate-500">
            If in doubt, always err on the side of caution and call emergency services.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
