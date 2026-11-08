import React from 'react';
import { 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  Siren,
  Hospital
} from 'lucide-react';
import { WarningSign } from '../types';

interface EmergencyWarningSignsProps {
  warningSigns: WarningSign[];
  onOpenSourceModal: (quote: string, title: string) => void;
}

export const EmergencyWarningSigns: React.FC<EmergencyWarningSignsProps> = ({
  warningSigns,
  onOpenSourceModal
}) => {
  const emergencyItems = warningSigns.filter(w => w.level === 'emergency');
  const urgentItems = warningSigns.filter(w => w.level !== 'emergency');

  return (
    <div className="space-y-6">
      {/* Pinned Hero Emergency Banner */}
      <div className="bg-rose-600 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden accent-border-rose">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-rose-500/60">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-white/20 text-white shrink-0">
              <Siren className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="mono text-xs font-black bg-white text-rose-600 px-2.5 py-0.5 rounded uppercase">
                  HIGH PRIORITY
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-rose-100">
                  CRITICAL PROTOCOL
                </span>
              </div>
              <h2 className="heavy-type text-3xl sm:text-5xl text-white uppercase mt-2">
                Emergency Red-Flag Warning Signs
              </h2>
              <p className="text-xs font-bold uppercase tracking-wider text-rose-100 mt-2">
                Extracted directly from hospital discharge papers. Do not delay emergency care.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <a
              href="tel:911"
              className="px-6 py-4 bg-slate-900 hover:bg-black text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl flex items-center space-x-2 transition-all border border-slate-700"
            >
              <PhoneCall className="w-5 h-5 text-rose-400 animate-bounce" />
              <span>CALL 911 IMMEDIATELY</span>
            </a>
          </div>
        </div>

        <div className="mt-4 text-xs font-bold uppercase tracking-wider text-rose-100 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-white shrink-0" />
          <span>Severe shortness of breath, sudden chest pain, or massive bleeding require 911 emergency services.</span>
        </div>
      </div>

      {/* Emergency Level 911 Items */}
      {emergencyItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-black text-rose-600 uppercase tracking-widest flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Immediate Emergency Services Required (Call 911)</span>
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {emergencyItems.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-3xl p-6 accent-border-rose flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                    <h4 className="text-base font-black uppercase text-slate-950 tracking-wide">{item.symptom}</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    {item.actionRequired}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onOpenSourceModal(item.sourceQuote, item.symptom)}
                    className="px-4 py-2 bg-white border border-rose-200 text-rose-900 hover:bg-rose-50 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-rose-600" />
                    <span>Citation</span>
                  </button>

                  <a
                    href="tel:911"
                    className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-rose-700 transition-colors flex items-center space-x-1 shadow-sm"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call 911</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Urgent Doctor / Care Team Items */}
      {urgentItems.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-black text-slate-950 uppercase tracking-widest flex items-center space-x-2">
            <Hospital className="w-4 h-4 text-blue-600" />
            <span>Urgent Doctor / Care Team Contact Symptoms</span>
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {urgentItems.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-3xl p-6 border-l-8 border-amber-500 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <h4 className="text-base font-black uppercase text-slate-950 tracking-wide">{item.symptom}</h4>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">
                    {item.actionRequired}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onOpenSourceModal(item.sourceQuote, item.symptom)}
                    className="px-4 py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Citation</span>
                  </button>

                  {item.contactNumber && (
                    <a
                      href={`tel:${item.contactNumber.replace(/[^0-9]/g, '')}`}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-600 transition-colors flex items-center space-x-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                      <span>{item.contactNumber}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
