import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bot,
  HelpCircle,
  RotateCcw,
  CheckSquare,
  Square,
  ShieldAlert,
  Beaker,
  FlaskConical,
  FileText,
  AlertTriangle,
  Sparkles,
  Check,
  GraduationCap
} from 'lucide-react';
import { Experiment, ViewMode } from '../types';
import { VivaGeneratorModal } from './VivaGeneratorModal';
import { RevisionSummaryModal } from './RevisionSummaryModal';

interface ExperimentDetailsViewProps {
  experiment: Experiment;
  onBack: () => void;
  onOpenAssistantWithContext: (experiment: Experiment) => void;
}

const CHECKLIST_ITEMS = [
  'I understand the aim of the experiment.',
  'I know the required chemicals and reagents.',
  'I know the required apparatus.',
  'I understand the procedure.',
  'I reviewed the safety precautions.',
  'I reviewed the viva questions.',
  'I reviewed the revision summary.'
];

export const ExperimentDetailsView: React.FC<ExperimentDetailsViewProps> = ({
  experiment,
  onBack,
  onOpenAssistantWithContext
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'procedure' | 'safety' | 'checklist'>('overview');
  const [vivaModalOpen, setVivaModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);

  // Load checklist state from localStorage
  const storageKey = `chemlab_prep_${experiment.id}`;
  const [checkedItems, setCheckedItems] = useState<boolean[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === CHECKLIST_ITEMS.length) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return new Array(CHECKLIST_ITEMS.length).fill(false);
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedItems));
    } catch (e) {
      // ignore
    }
  }, [checkedItems, storageKey]);

  const toggleChecklistItem = (index: number) => {
    setCheckedItems((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const completedCount = checkedItems.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* Back Button & Header */}
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
          id="back-to-experiments-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Experiment Library</span>
        </button>

        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30">
              {experiment.category}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <GraduationCap className="w-4 h-4 text-teal-400" />
              <span>Undergraduate Practical Module</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {experiment.name}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
              {experiment.description}
            </p>
          </div>

          {/* AI Feature Action Cards Section */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Action 1: Ask AI */}
            <button
              onClick={() => onOpenAssistantWithContext(experiment)}
              className="p-4 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-2xl text-left transition-all group flex items-start gap-3"
              id="ask-ai-this-experiment-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1 group-hover:text-teal-300">
                  <span>Ask AI Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                </h3>
                <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                  Ask AI about this experiment with instant context.
                </p>
              </div>
            </button>

            {/* Action 2: Viva Questions */}
            <button
              onClick={() => setVivaModalOpen(true)}
              className="p-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-2xl text-left transition-all group flex items-start gap-3"
              id="generate-viva-questions-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-indigo-300">
                  Generate Viva Questions
                </h3>
                <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                  Generate 5+ examiner viva questions and answers.
                </p>
              </div>
            </button>

            {/* Action 3: Revision Summary */}
            <button
              onClick={() => setRevisionModalOpen(true)}
              className="p-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-left transition-all group flex items-start gap-3"
              id="generate-revision-summary-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm group-hover:text-emerald-300">
                  Generate Revision Summary
                </h3>
                <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                  Instant high-yield revision sheet for exams.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Lab Preparation Progress Tracker Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-teal-600" />
            <h2 className="font-bold text-slate-900 text-base">
              Lab Preparation Progress: {completedCount}/{CHECKLIST_ITEMS.length} completed
            </h2>
          </div>
          <span className="text-xs font-extrabold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
            {progressPercent}% Ready for Lab
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Structured Experiment Information Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main 2-Column Section */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Aim & Objective */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-base border-b border-slate-100 pb-2">
              <FileText className="w-5 h-5" />
              <h2>Aim & Objective</h2>
            </div>
            <p className="text-slate-800 text-sm leading-relaxed font-sans font-medium">
              {experiment.aim}
            </p>
          </div>

          {/* Principle / Key Chemistry Concept */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-base border-b border-slate-100 pb-2">
              <Sparkles className="w-5 h-5" />
              <h2>Principle & Key Chemistry Concept</h2>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed font-serif bg-slate-50 p-4 rounded-xl border border-slate-100">
              {experiment.principle}
            </p>
          </div>

          {/* Step-by-Step Procedure */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-base">
                <Beaker className="w-5 h-5" />
                <h2>Step-by-Step Experimental Procedure</h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {experiment.procedure.length} Steps
              </span>
            </div>

            <ol className="space-y-3">
              {experiment.procedure.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-slate-50/60 p-3.5 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-800 leading-relaxed">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Expected Observations */}
          <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-base border-b border-emerald-200 pb-2">
              <Check className="w-5 h-5 text-emerald-600" />
              <h2>Expected Observations</h2>
            </div>
            <p className="text-xs text-emerald-800 italic">
              Note: These are theoretical expected observations under standard lab conditions.
            </p>
            <ul className="space-y-2">
              {experiment.expectedObservations.map((obs, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-950 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-2" />
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Points to Remember */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-base border-b border-slate-800 pb-2">
              <GraduationCap className="w-5 h-5" />
              <h2>Key Points to Remember for Practical & Viva</h2>
            </div>
            <ul className="space-y-2">
              {experiment.keyPoints.map((kp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0 mt-2" />
                  <span>{kp}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Sidebar 1-Column Section */}
        <div className="space-y-6">
          
          {/* Lab Preparation Checklist Card */}
          <div className="bg-white border-2 border-teal-500/30 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-teal-600" />
                <span>Lab Preparation Checklist</span>
              </h2>
            </div>

            <p className="text-xs text-slate-600">
              Check off each preparation task as you complete your review before class or practical exams:
            </p>

            <div className="space-y-2.5">
              {CHECKLIST_ITEMS.map((item, idx) => {
                const isChecked = checkedItems[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => toggleChecklistItem(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-teal-50/80 border-teal-300 text-teal-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                    id={`checklist-item-${idx}`}
                  >
                    <div className="mt-0.5 text-teal-600 shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-teal-600 fill-teal-100" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <span className="text-xs leading-snug">{item}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-500 font-medium">
                Progress saved automatically in your browser.
              </span>
            </div>
          </div>

          {/* Chemicals / Reagents Required */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <FlaskConical className="w-4 h-4 text-teal-600" />
              <span>Chemicals & Reagents</span>
            </h2>
            <ul className="space-y-2">
              {experiment.chemicals.map((chem, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                  <span>{chem}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Apparatus Required */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Beaker className="w-4 h-4 text-emerald-600" />
              <span>Apparatus Required</span>
            </h2>
            <ul className="space-y-2">
              {experiment.apparatus.map((app, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                  <span>{app}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety Precautions Card */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="font-bold text-amber-950 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-amber-200 pb-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Safety Precautions</span>
            </h2>
            <ul className="space-y-2">
              {experiment.safetyPrecautions.map((saf, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-amber-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                  <span>{saf}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="font-bold text-rose-950 text-sm uppercase tracking-wider flex items-center gap-2 border-b border-rose-200 pb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Common Lab Errors</span>
            </h2>
            <ul className="space-y-2">
              {experiment.commonMistakes.map((err, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-rose-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0 mt-1.5" />
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Modals for Viva & Revision */}
      <VivaGeneratorModal
        experiment={experiment}
        isOpen={vivaModalOpen}
        onClose={() => setVivaModalOpen(false)}
      />

      <RevisionSummaryModal
        experiment={experiment}
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
      />
    </div>
  );
};
