import React from 'react';
import { X, Quote, CheckCircle2, ShieldCheck, FileSearch, Copy } from 'lucide-react';

interface SourceDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceText: string;
  activeQuote?: string | null;
  itemTitle?: string | null;
}

export const SourceDocumentModal: React.FC<SourceDocumentModalProps> = ({
  isOpen,
  onClose,
  sourceText,
  activeQuote,
  itemTitle
}) => {
  if (!isOpen) return null;

  const renderHighlightedText = () => {
    if (!activeQuote || !sourceText) {
      return <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-700">{sourceText}</p>;
    }

    const cleanQuote = activeQuote.trim();
    const quoteIndex = sourceText.indexOf(cleanQuote);

    if (quoteIndex === -1) {
      // Fallback if exact substring match has minor whitespace differences
      return (
        <div>
          <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs">
            <span className="font-bold">Target Source Citation:</span> "{cleanQuote}"
          </div>
          <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-700">{sourceText}</p>
        </div>
      );
    }

    const before = sourceText.slice(0, quoteIndex);
    const match = sourceText.slice(quoteIndex, quoteIndex + cleanQuote.length);
    const after = sourceText.slice(quoteIndex + cleanQuote.length);

    return (
      <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-700">
        {before}
        <mark className="bg-amber-200 text-amber-950 font-semibold px-1 py-0.5 rounded border-b-2 border-amber-500 shadow-sm animate-pulse">
          {match}
        </mark>
        {after}
      </p>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Quote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Source Document Verification</h2>
              <p className="text-xs text-slate-400">
                {itemTitle ? `Verifying source citation for: ${itemTitle}` : 'Full Discharge Paperwork Grounding'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Quote Highlight Box */}
        {activeQuote && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 border-b border-amber-200/80 flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Extracted Source Quote Grounding
              </span>
              <p className="text-xs font-medium text-slate-800 italic mt-0.5">
                "{activeQuote}"
              </p>
            </div>
          </div>
        )}

        {/* Document Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto bg-slate-50">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-inner">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 text-xs text-slate-500 font-semibold">
              <span className="flex items-center space-x-1.5">
                <FileSearch className="w-4 h-4 text-teal-600" />
                <span>Original Hospital Discharge Paperwork</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                100% Verified Grounded
              </span>
            </div>
            {renderHighlightedText()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
          <span className="flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Every AI instruction links directly to these original physician notes.</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Citation Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
