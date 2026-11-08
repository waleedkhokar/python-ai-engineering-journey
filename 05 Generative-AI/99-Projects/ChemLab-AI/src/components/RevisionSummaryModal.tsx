import React, { useState, useEffect } from 'react';
import { RotateCcw, RefreshCw, X, AlertTriangle, CheckCircle2, ShieldAlert, Beaker, FileText, Sparkles } from 'lucide-react';
import { Experiment, RevisionSummaryData } from '../types';

interface RevisionSummaryModalProps {
  experiment: Experiment;
  isOpen: boolean;
  onClose: () => void;
}

export const RevisionSummaryModal: React.FC<RevisionSummaryModalProps> = ({ experiment, isOpen, onClose }) => {
  const [summary, setSummary] = useState<RevisionSummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experiment }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to generate revision summary.');
      }
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || 'Error generating revision summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSummary();
    }
  }, [isOpen, experiment.id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">AI Revision Sheet</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Quick Exam Review
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Experiment: <span className="text-teal-400 font-semibold">{experiment.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            id="close-revision-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 grow bg-slate-50/50">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-slate-900 text-base">Synthesizing Revision Sheet...</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Extracting high-yield objectives, core principles, procedure points, safety, and common pitfalls.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
              <p className="font-bold text-rose-900 text-sm">{error}</p>
              <button
                onClick={fetchSummary}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          ) : summary ? (
            <div className="space-y-6">
              
              {/* Objective & Principle Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-teal-700">
                    <FileText className="w-4 h-4" />
                    <span>Experiment Objective</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                    {summary.objective}
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-emerald-700">
                    <Sparkles className="w-4 h-4" />
                    <span>Core Chemical Principle</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                    {summary.corePrinciple}
                  </p>
                </div>
              </div>

              {/* Chemicals & Apparatus Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-700">
                    Essential Reagents & Chemicals
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {summary.importantChemicals?.map((chem, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span>{chem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-700">
                    Required Apparatus
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {summary.importantApparatus?.map((app, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Procedure Points */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Key Procedure Steps</span>
                </h3>
                <ol className="space-y-2 text-xs sm:text-sm text-slate-700 list-decimal list-inside">
                  {summary.keyProcedurePoints?.map((step, idx) => (
                    <li key={idx} className="leading-relaxed pl-1">
                      <span className="font-medium">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Expected Observations */}
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 space-y-2">
                <h3 className="font-bold text-emerald-950 text-xs uppercase tracking-wider">
                  Important Observations
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-900">
                  {summary.importantObservations?.map((obs, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-2" />
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safety & Common Mistakes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2">
                  <h3 className="font-bold text-amber-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Crucial Safety Precautions</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-amber-900">
                    {summary.importantSafetyPrecautions?.map((saf, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                        <span>{saf}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-2">
                  <h3 className="font-bold text-rose-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Common Exam Mistakes</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-rose-900">
                    {summary.commonMistakes?.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-2">
                <h3 className="font-bold text-teal-400 text-xs uppercase tracking-wider">
                  Key Points To Remember For Written & Practical Exams
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                  {summary.keyPointsToRemember?.map((kp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={fetchSummary}
            disabled={loading}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
            id="revision-regenerate-btn"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate Summary</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Close Revision Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
