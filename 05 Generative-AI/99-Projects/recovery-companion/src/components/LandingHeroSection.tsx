import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Pill, 
  Calendar, 
  Activity, 
  Bot, 
  Upload, 
  Zap, 
  Printer, 
  Users, 
  Award,
  Lock,
  Stethoscope
} from 'lucide-react';

interface LandingHeroSectionProps {
  onStartFree: () => void;
  onOpenDemoReport: () => void;
}

export const LandingHeroSection: React.FC<LandingHeroSectionProps> = ({
  onStartFree,
  onOpenDemoReport
}) => {
  return (
    <div className="space-y-16 py-4 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
              <span>Next-Gen Enterprise Health AI Platform</span>
            </div>

            <h1 className="heavy-type text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
              Understand Hospital Discharge Instructions with <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-blue-200 bg-clip-text text-transparent">AI Precision</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
              Upload discharge summaries, prescriptions, and medical reports. Get simplified explanations, medication schedules, recovery plans, and follow-up reminders in plain language.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartFree}
                className="px-7 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2.5"
              >
                <span>Start Free Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDemoReport}
                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-black uppercase tracking-wider text-xs rounded-2xl border border-slate-700 transition-all flex items-center space-x-2"
              >
                <Play className="w-4 h-4 text-blue-400 fill-blue-400" />
                <span>Watch Live Demo</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs font-bold text-slate-400">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>HIPAA-Safe Design</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>256-Bit Encrypted</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>99.4% OCR Accuracy</span>
              </div>
            </div>
          </div>

          {/* Right Healthcare Dashboard Mockup Preview */}
          <div className="lg:col-span-5 relative">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl relative space-y-4">
              
              {/* Mock Floating Badge 1 */}
              <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 flex items-center justify-between text-xs animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-black text-white block">Discharge Summary OCR</span>
                    <span className="text-[10px] text-slate-400">Processing 14 pages...</span>
                  </div>
                </div>
                <span className="mono text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/30">
                  99.8% Grounded
                </span>
              </div>

              {/* Mock Medication Timeline Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-300 font-black uppercase">
                    <Pill className="w-4 h-4 text-blue-400" />
                    <span>Medication Extract</span>
                  </div>
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded">
                    4 Prescriptions Found
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block text-xs">Ticagrelor (Brilinta) 90mg</span>
                      <span className="text-[10px] text-slate-400">Twice daily • Restrict bleeding</span>
                    </div>
                    <span className="mono text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      Low Stock (3 left)
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block text-xs">Aspirin 81mg</span>
                      <span className="text-[10px] text-slate-400">Once daily in morning</span>
                    </div>
                    <span className="mono text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                      Schedule Set
                    </span>
                  </div>
                </div>
              </div>

              {/* Mock Floating Badge 2 */}
              <div className="p-3.5 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center space-x-3 text-xs text-blue-200">
                <Bot className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="font-bold">
                  Gemini AI generated a 3-step recovery milestone plan with automatic refill tracking.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section / Statistics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="saas-card p-6 text-center space-y-1">
          <span className="heavy-type text-3xl sm:text-4xl text-blue-600 block">50,000+</span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Reports Analyzed
          </span>
          <span className="text-[11px] text-slate-400">Hospital discharge papers</span>
        </div>

        <div className="saas-card p-6 text-center space-y-1">
          <span className="heavy-type text-3xl sm:text-4xl text-teal-600 block">120,000+</span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Recovery Plans
          </span>
          <span className="text-[11px] text-slate-400">Active patient schedules</span>
        </div>

        <div className="saas-card p-6 text-center space-y-1">
          <span className="heavy-type text-3xl sm:text-4xl text-emerald-600 block">99.4%</span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            AI Accuracy
          </span>
          <span className="text-[11px] text-slate-400">OCR & medication extraction</span>
        </div>

        <div className="saas-card p-6 text-center space-y-1">
          <span className="heavy-type text-3xl sm:text-4xl text-slate-900 block">250+</span>
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Active Health Systems
          </span>
          <span className="text-[11px] text-slate-400">Hospitals & clinic partners</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8 text-center">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Enterprise Feature Suite
          </span>
          <h2 className="heavy-type text-3xl sm:text-4xl text-slate-950 uppercase tracking-tight">
            Designed for Hospitals & Caregivers
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Everything patients and care teams need for a smooth, safe recovery process after hospital discharge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* Feature 1 */}
          <div className="bento-card p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-black uppercase tracking-wider text-base text-slate-950">
              AI Document Analysis
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Translates complex medical jargon into clear, 5th-grade reading level recovery plans grounded directly in hospital discharge paperwork.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bento-card p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-black">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-black uppercase tracking-wider text-base text-slate-950">
              OCR Document Extraction
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Seamlessly scans PDF reports or smartphone camera photos to identify diagnoses, procedures, and attending physician instructions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bento-card p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="font-black uppercase tracking-wider text-base text-slate-950">
              Medication Scheduling & Refills
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Automatic pill quantity inventory, dosage timelines, and one-click email refill requests to patient pharmacies.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bento-card p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-black uppercase tracking-wider text-base text-slate-950">
              Recovery Tracking
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Interactive daily wound care, activity, and dietary checklists to track day-by-day healing milestones.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bento-card p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-black uppercase tracking-wider text-base text-slate-950">
              Follow-Up Reminders
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Calendar appointments with location maps, provider details, and automated notification alerts.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bento-card p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              <Printer className="w-6 h-6" />
            </div>
            <h3 className="font-black uppercase tracking-wider text-base text-slate-950">
              Printable PDF Exports
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Generate fridge-ready 1-page summary cards for family members, caregivers, and primary care physicians.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-teal-400">
            Simple 4-Step Process
          </span>
          <h2 className="heavy-type text-3xl sm:text-4xl text-white uppercase">
            How DischargeCare AI Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center mx-auto text-sm">
              1
            </div>
            <h3 className="font-black uppercase tracking-wider text-sm text-white">
              Upload Report
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Snap a photo or drag & drop discharge papers in PDF or image formats.
            </p>
          </div>

          <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center mx-auto text-sm">
              2
            </div>
            <h3 className="font-black uppercase tracking-wider text-sm text-white">
              AI Document Analysis
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini OCR extracts medications, diagnoses, and follow-up schedules.
            </p>
          </div>

          <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center mx-auto text-sm">
              3
            </div>
            <h3 className="font-black uppercase tracking-wider text-sm text-white">
              Get Recovery Plan
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              View plain-language timelines, pill schedules, and emergency warning signs.
            </p>
          </div>

          <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center mx-auto text-sm">
              4
            </div>
            <h3 className="font-black uppercase tracking-wider text-sm text-white">
              Recover Confidently
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Share plans with caregivers, set pill reminders, and email pharmacy refills.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onStartFree}
            className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black uppercase tracking-wider text-xs rounded-2xl shadow-xl transition-all"
          >
            Launch Recovery Dashboard Now
          </button>
        </div>
      </section>
    </div>
  );
};
