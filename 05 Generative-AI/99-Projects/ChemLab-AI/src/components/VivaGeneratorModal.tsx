import React, { useState, useEffect } from 'react';
import { HelpCircle, RefreshCw, X, ChevronDown, ChevronUp, Check, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';
import { Experiment, VivaQuestion } from '../types';

interface VivaGeneratorModalProps {
  experiment: Experiment;
  isOpen: boolean;
  onClose: () => void;
}

export const VivaGeneratorModal: React.FC<VivaGeneratorModalProps> = ({ experiment, isOpen, onClose }) => {
  const [questions, setQuestions] = useState<VivaQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openIndexes, setOpenIndexes] = useState<Record<number, boolean>>({});

  const generateViva = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/viva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experiment }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to generate viva questions.');
      }
      setQuestions(data.questions || []);
      // Open all answer accordions by default for convenience
      const initialOpen: Record<number, boolean> = {};
      (data.questions || []).forEach((_: any, idx: number) => {
        initialOpen[idx] = true;
      });
      setOpenIndexes(initialOpen);
    } catch (err: any) {
      setError(err.message || 'Error generating viva questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      generateViva();
    }
  }, [isOpen, experiment.id]);

  if (!isOpen) return null;

  const toggleAnswer = (index: number) => {
    setOpenIndexes((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">AI Viva Voce Prep</h2>
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  AI Generated
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
            id="close-viva-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 grow">
          {loading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-slate-900 text-base">Generating Examiner Viva Questions...</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Analyzing {experiment.name} principles, reagents, apparatus, and procedure for undergraduate viva standards.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto" />
              <p className="font-bold text-rose-900 text-sm">{error}</p>
              <button
                onClick={generateViva}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              No viva questions generated yet. Click regenerate below.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-700">
                  Generated {questions.length} Practice Viva Questions & Answers
                </span>
                <span className="text-indigo-600 font-medium">Click question to toggle answer</span>
              </div>

              {questions.map((q, idx) => {
                const isOpen = openIndexes[idx];
                return (
                  <div
                    key={q.id || idx}
                    className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:border-indigo-300 transition-colors"
                  >
                    <button
                      onClick={() => toggleAnswer(idx)}
                      className="w-full text-left p-4 flex items-start justify-between gap-3 bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                      id={`viva-question-toggle-${idx}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          Q{idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                            {q.question}
                          </p>
                          {q.topic && (
                            <span className="inline-block mt-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                              Topic: {q.topic}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-slate-400 hover:text-slate-600 pt-1 shrink-0">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-4 bg-indigo-50/30 border-t border-slate-100 text-xs sm:text-sm text-slate-800 space-y-1.5">
                        <span className="font-bold text-indigo-900 text-xs uppercase tracking-wider block">
                          Model Answer:
                        </span>
                        <p className="leading-relaxed font-sans text-slate-700">{q.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={generateViva}
            disabled={loading}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
            id="viva-regenerate-btn"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate Questions</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Close Viva Prep
          </button>
        </div>
      </div>
    </div>
  );
};
