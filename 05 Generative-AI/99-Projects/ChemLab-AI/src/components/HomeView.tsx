import React from 'react';
import {
  FlaskConical,
  Bot,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  ClipboardList,
  Sparkles,
  ArrowRight,
  Beaker,
  GraduationCap,
  Atom
} from 'lucide-react';
import { ViewMode } from '../types';

interface HomeViewProps {
  onNavigate: (view: ViewMode) => void;
  onSelectExperiment: (experimentId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onSelectExperiment }) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        {/* Background Decorative Chemistry Accents */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold tracking-wide">
            <Atom className="w-4 h-4 animate-spin-slow text-teal-400" />
            <span>Interactive AI Assistant for Undergraduate Chemistry Labs</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            ChemLab <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="text-xl sm:text-2xl font-medium text-teal-200/90 font-serif">
            Chemistry Lab Assistant
          </p>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Understand, prepare for, and revise laboratory experiments effortlessly. ChemLab AI brings together structured experiment guides, an AI Chemistry Assistant, instant viva question generation, and lab preparation tracking.
          </p>

          {/* Real Problem & Target Users Banner */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4 sm:p-6 text-left text-sm space-y-3 shadow-inner my-6">
            <div className="flex items-center gap-2 font-semibold text-teal-300">
              <GraduationCap className="w-5 h-5 text-teal-400" />
              <span>Designed specifically for Undergraduate Chemistry Students</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              <strong className="text-white">The Challenge:</strong> Chemistry students often struggle to grasp complex experimental procedures, remember exact reagent functions, handle viva examiner questions, and stay organized before practical exams.
            </p>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              <strong className="text-white">The Solution:</strong> ChemLab AI combines accurate structured laboratory modules with an AI Assistant tailored to Chemistry syllabus standards — no login or account required.
            </p>
          </div>

          {/* Prominent Working CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('experiments')}
              className="w-full sm:w-auto px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base rounded-xl shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-3 group focus:ring-4 focus:ring-teal-500/50"
              id="hero-explore-experiments-btn"
            >
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
              <span>Explore Experiments</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('assistant')}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold text-base rounded-xl transition-all flex items-center justify-center gap-3 focus:ring-4 focus:ring-slate-700"
              id="hero-ask-ai-btn"
            >
              <Bot className="w-5 h-5 text-teal-400" />
              <span>Ask AI Chemistry Assistant</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Benefits Section */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Lab Support
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything an undergraduate Chemistry student needs to excel in practical sessions and viva exams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Benefit 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Beaker className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Understand Experiments</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Step-by-step procedures, chemical principles, apparatus lists, and expected observations for core experiments.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Prepare for Viva</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generate 5+ examiner-style viva voce questions and detailed answers with one click.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Revise Concepts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get instant high-yield revision summaries covering core principles, common mistakes, and key takeaways.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Review Lab Safety</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review specific chemical hazards, protective measures, and safe handling guidelines before entering the lab.
            </p>
          </div>

          {/* Benefit 5 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Track Preparation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive preparation checklist for every experiment to track your readiness percentage in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Simple & Effective</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How ChemLab AI Works</h2>
          <p className="text-slate-400 text-sm">Three easy steps to master your Chemistry practicals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 text-center space-y-4 relative">
            <div className="w-12 h-12 mx-auto rounded-full bg-teal-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              1
            </div>
            <h3 className="font-bold text-white text-lg">Select an Experiment</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Browse our structured library of core undergraduate Chemistry experiments or use the quick search bar.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 text-center space-y-4 relative">
            <div className="w-12 h-12 mx-auto rounded-full bg-teal-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              2
            </div>
            <h3 className="font-bold text-white text-lg">Explore or Ask AI</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Read step-by-step principles and apparatus details, or chat with the AI Assistant using experiment-specific context.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 text-center space-y-4 relative">
            <div className="w-12 h-12 mx-auto rounded-full bg-teal-500 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              3
            </div>
            <h3 className="font-bold text-white text-lg">Prepare for Viva & Revision</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Generate 5 viva questions with answers, review revision summaries, and check off your lab preparation checklist.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Quick Experiment Library Preview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Featured Experiments</h2>
            <p className="text-slate-600 text-xs sm:text-sm">Select an experiment below to start studying immediately.</p>
          </div>
          <button
            onClick={() => onNavigate('experiments')}
            className="text-teal-700 hover:text-teal-800 font-bold text-sm flex items-center gap-1 self-start sm:self-auto"
            id="view-all-experiments-btn"
          >
            <span>View All 5 Experiments</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => onSelectExperiment('acid-base-titration')}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-teal-400 transition-all cursor-pointer group space-y-3"
            id="quick-exp-titration"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 px-2.5 py-1 rounded-md border border-teal-200">
                Volumetric Analysis
              </span>
              <FlaskConical className="w-5 h-5 text-teal-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-teal-700 transition-colors">
              Acid-Base Titration
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2">
              Determination of unknown concentration of HCl using standard NaOH solution and phenolphthalein.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-teal-700 gap-1">
              <span>Open Experiment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onSelectExperiment('standard-solution-prep')}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-teal-400 transition-all cursor-pointer group space-y-3"
            id="quick-exp-standard-sol"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200">
                Solution Preparation
              </span>
              <Beaker className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
              Preparation of a Standard Solution
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2">
              Accurate quantitative weighing and preparation of 250 mL of 0.05 M Na₂CO₃ primary standard solution.
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-emerald-700 gap-1">
              <span>Open Experiment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div
            onClick={() => onSelectExperiment('qualitative-analysis-cations')}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-teal-400 transition-all cursor-pointer group space-y-3"
            id="quick-exp-cations"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-md border border-indigo-200">
                Inorganic Chemistry
              </span>
              <Sparkles className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors">
              Qualitative Analysis of Cations
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2">
              Systematic separation and qualitative detection of group cations (Pb²⁺, Cu²⁺, Fe³⁺, Al³⁺, NH₄⁺).
            </p>
            <div className="pt-2 flex items-center text-xs font-bold text-indigo-700 gap-1">
              <span>Open Experiment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
