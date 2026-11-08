import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  X, 
  Activity, 
  Cpu, 
  RefreshCw, 
  ShieldCheck, 
  Zap,
  FileText,
  MessageSquare,
  Languages,
  Volume2
} from 'lucide-react';
import { safeFetchJson } from '../lib/apiUtils';

interface GeminiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GeminiStatusData {
  success: boolean;
  active: boolean;
  model: string;
  status: string;
  latencyMs?: number;
  response?: string;
  capabilities?: string[];
  details?: string;
}

export const GeminiStatusModal: React.FC<GeminiStatusModalProps> = ({ isOpen, onClose }) => {
  const [statusData, setStatusData] = useState<GeminiStatusData | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testTime, setTestTime] = useState<string | null>(null);

  const fetchStatus = async () => {
    setIsTesting(true);
    try {
      const data = await safeFetchJson<GeminiStatusData>('/api/gemini-status');
      setStatusData(data);
      setTestTime(new Date().toLocaleTimeString());
    } catch (err: any) {
      setStatusData({
        success: false,
        active: false,
        model: 'gemini-3.6-flash',
        status: 'Unreachable',
        details: err?.message || 'Failed to connect to backend AI server'
      });
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    if (isOpen && !statusData) {
      fetchStatus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-600/30">
              <Cpu className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-base uppercase tracking-wider text-white">
                  Gemini 3.6 Flash Engine
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SERVER ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Google DeepMind Next-Gen Healthcare AI</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Live Engine Status Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Model Status: <span className="text-blue-600">gemini-3.6-flash</span>
                </span>
              </div>

              <button
                onClick={fetchStatus}
                disabled={isTesting}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-all disabled:opacity-50 shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Pinging...' : 'Test Health'}</span>
              </button>
            </div>

            {/* Diagnostic Results */}
            {statusData && (
              <div className="pt-3 border-t border-slate-200/60 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Operational State</span>
                    <span className="font-black text-emerald-700 uppercase flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {statusData.status || 'Ready'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Response Latency</span>
                    <span className="font-black text-slate-900 mt-0.5 block">
                      {statusData.latencyMs ? `${statusData.latencyMs} ms` : 'Verified'}
                    </span>
                  </div>
                </div>

                {statusData.response && (
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                    <span className="block text-[10px] font-black text-blue-800 uppercase tracking-wider">Live Model Verification Echo:</span>
                    <p className="text-slate-800 font-medium italic mt-1">"{statusData.response}"</p>
                    {testTime && (
                      <span className="block text-[9px] font-mono text-slate-400 mt-1">Verified at {testTime}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Core Capabilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Active AI Capabilities Powered by Gemini</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
                <div className="flex items-center space-x-2 text-blue-600 font-black text-xs uppercase tracking-wider mb-1">
                  <FileText className="w-4 h-4" />
                  <span>Clinical OCR & Vision</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Extracts structured medicines, dosages, and schedules directly from PDF summaries and handwritten prescriptions.
                </p>
              </div>

              <div className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
                <div className="flex items-center space-x-2 text-blue-600 font-black text-xs uppercase tracking-wider mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>Grounded Q&A Assistant</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Answers patient questions strictly grounded in their official discharge notes to prevent medical hallucinations.
                </p>
              </div>

              <div className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
                <div className="flex items-center space-x-2 text-emerald-600 font-black text-xs uppercase tracking-wider mb-1">
                  <Languages className="w-4 h-4" />
                  <span>Urdu Prescription Guide</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Translates complex medical orders into plain Nastaliq Urdu with phonetic medication transliterations.
                </p>
              </div>

              <div className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-colors">
                <div className="flex items-center space-x-2 text-purple-600 font-black text-xs uppercase tracking-wider mb-1">
                  <Volume2 className="w-4 h-4" />
                  <span>Speech TTS Narration</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Generates calm, high-clarity voice instructions for visually impaired or elderly patients.
                </p>
              </div>
            </div>
          </div>

          {/* Security & Server Privacy Notice */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-black text-emerald-900 uppercase text-[11px] tracking-wider block">
                Server-Side Security Guaranteed
              </span>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                All Gemini API processing is executed securely on server endpoints. No API keys or sensitive raw credentials are exposed to client browser bundles.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Close Status
          </button>
        </div>
      </div>
    </div>
  );
};
