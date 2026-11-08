import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Pill, 
  Loader2, 
  CheckCircle2, 
  ShieldAlert, 
  Copy, 
  BookOpen, 
  Clock, 
  Calendar, 
  Printer, 
  Plus, 
  ArrowRight,
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Zap,
  Check,
  RefreshCw,
  Stethoscope,
  Languages
} from 'lucide-react';
import { DischargePlan, MedicationItem } from '../types';
import { safeFetchJson } from '../lib/apiUtils';

interface PrescriptionAnalysisViewProps {
  plan: DischargePlan;
  onOpenSourceModal: (quote?: string, title?: string) => void;
  onUpdatePlan?: (updatedPlan: DischargePlan) => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenUrduModal?: (meds?: MedicationItem[], text?: string) => void;
}

interface ParsedScheduleItem {
  timeSlot: string;
  medicationNames: string[];
  instructions?: string;
}

export const PrescriptionAnalysisView: React.FC<PrescriptionAnalysisViewProps> = ({
  plan,
  onOpenSourceModal,
  onUpdatePlan,
  onNavigateToTab,
  onOpenUrduModal
}) => {
  const PRESET_CARDIAC = `Rx: Ticagrelor (Brilinta) 90mg PO BID x 12 months with food. Purpose: Antiplatelet to prevent stent thrombosis.
Rx: Aspirin 81mg PO Daily indefinitely. Purpose: Secondary cardiovascular protection.
Rx: Atorvastatin (Lipitor) 80mg PO Daily at bedtime (QHS). Purpose: High-potency lipid management.
Rx: Nitroglycerin 0.4mg SL PRN chest pain. Repeat q5min x 3 doses max. If pain persists after 5 mins, CALL 911.`;

  const PRESET_DIABETES = `Rx: Metformin 1000mg PO BID with morning & evening meals. Purpose: Blood glucose regulation.
Rx: Lisinopril 20mg PO Daily in morning. Purpose: Blood pressure control & renal protection.
Rx: Empagliflozin (Jardiance) 10mg PO Daily in morning. Purpose: Glycemic control & cardioprotection.
Rx: Amlodipine 5mg PO Daily. Purpose: Essential hypertension.`;

  const PRESET_SURGERY = `Rx: Apixaban (Eliquis) 2.5mg PO TWICE DAILY with food x 14 days. Purpose: Deep vein thrombosis prophylaxis.
Rx: Cephalexin 500mg PO QID (every 6 hours) x 7 days. Purpose: Surgical site infection prevention.
Rx: Acetaminophen (Tylenol) 650mg PO Q8H PRN mild to moderate pain. Max 3000mg/24hr.
Rx: Oxycodone 5mg PO Q6H PRN severe breakthrough pain. Take only if needed.`;

  const [rxText, setRxText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedPatientName, setExtractedPatientName] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<MedicationItem[] | null>(null);
  const [parsedSchedule, setParsedSchedule] = useState<ParsedScheduleItem[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [imported, setImported] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<'all' | 'medications' | 'timeline'>('all');

  const handleClearAll = () => {
    setRxText('');
    setAnalysisResult(null);
    setParsedSchedule(null);
    setExtractedPatientName(null);
    setErrorMsg(null);
    setImported(false);
  };

  const handleAnalyzeText = async (textToAnalyze = rxText) => {
    if (!textToAnalyze.trim()) {
      setErrorMsg('Please enter or paste prescription text to analyze.');
      return;
    }

    // Clear previous analysis results immediately before new analysis
    setAnalysisResult(null);
    setParsedSchedule(null);
    setExtractedPatientName(null);
    setErrorMsg(null);
    setImported(false);
    setIsAnalyzing(true);

    try {
      const data = await safeFetchJson('/api/parse-discharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manualText: textToAnalyze })
      });

      if (data.success) {
        if (data.plan?.patientName && data.plan.patientName !== 'Unspecified Patient') {
          setExtractedPatientName(data.plan.patientName);
        } else if (data.patientName && data.patientName !== 'Unspecified Patient') {
          setExtractedPatientName(data.patientName);
        }

        const rawMeds = data.plan?.medications || data.medications || [];
        
        if (Array.isArray(rawMeds) && rawMeds.length > 0) {
          const mapped: MedicationItem[] = rawMeds.map((m: any, idx: number) => {
            let routeStr = m.route || 'Oral';
            if (typeof routeStr === 'string') {
              if (routeStr.toUpperCase() === 'PO') routeStr = 'Oral';
              if (routeStr.toUpperCase() === 'SL') routeStr = 'Sublingual';
            }

            return {
              id: `rx-${Date.now()}-${idx + 1}`,
              name: m.name || 'Medication',
              genericName: m.genericName || m.name || '',
              dosage: m.dosage || m.strength || m.dose || 'As directed',
              route: routeStr,
              frequency: m.frequency || 'Daily',
              scheduleTime: m.scheduleTime || 'morning',
              timeLabel: m.scheduleTime === 'evening' ? '6:00 PM' : m.scheduleTime === 'bedtime' ? '10:00 PM' : m.scheduleTime === 'afternoon' ? '1:00 PM' : '8:00 AM',
              duration: m.duration || 'As prescribed',
              purpose: m.purpose || m.instructions || 'Prescribed treatment',
              specialInstructions: m.specialInstructions || m.instructions || 'Take as instructed by physician.',
              sourceQuote: `${m.name || 'Medication'} ${m.dosage || m.strength || ''} ${m.frequency || ''}`.trim(),
              confidence: 98,
              takenToday: false,
              remainingQuantity: 30,
              totalQuantity: 30
            };
          });
          setAnalysisResult(mapped);
        } else {
          setAnalysisResult([]);
          setErrorMsg('No medications were detected in the provided text. Please ensure the prescription text includes medication names and dosage instructions.');
        }

        if (data.medicationSchedule && data.medicationSchedule.length > 0) {
          setParsedSchedule(data.medicationSchedule);
        } else {
          setParsedSchedule(null);
        }
      } else {
        setErrorMsg('Unable to parse prescription. Please check the text and try again.');
      }
    } catch (err) {
      console.error('Prescription text analysis error:', err);
      setErrorMsg('Failed to process prescription analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(rxText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportToCarePlan = () => {
    if (!analysisResult || !onUpdatePlan) return;
    const updatedPlan: DischargePlan = {
      ...plan,
      patientName: (extractedPatientName && extractedPatientName !== 'Unspecified Patient') ? extractedPatientName : plan.patientName,
      medications: [...analysisResult]
    };
    onUpdatePlan(updatedPlan);
    setImported(true);
    setTimeout(() => setImported(false), 3000);
  };

  const handlePrintSchedule = () => {
    window.print();
  };

  // Build Timeline Slot Mapping
  const getTimelineSlots = () => {
    if (parsedSchedule && parsedSchedule.length > 0) {
      return parsedSchedule;
    }

    if (!analysisResult) return [];

    const slots: { [key: string]: { timeSlot: string; icon: any; color: string; bg: string; medications: MedicationItem[] } } = {
      morning: {
        timeSlot: 'Morning (8:00 AM)',
        icon: Sun,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10 border-amber-500/20',
        medications: []
      },
      afternoon: {
        timeSlot: 'Afternoon (1:00 PM)',
        icon: SunMedium,
        color: 'text-sky-400',
        bg: 'bg-sky-500/10 border-sky-500/20',
        medications: []
      },
      evening: {
        timeSlot: 'Evening (6:00 PM)',
        icon: Sunset,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10 border-indigo-500/20',
        medications: []
      },
      bedtime: {
        timeSlot: 'Bedtime (10:00 PM)',
        icon: Moon,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10 border-purple-500/20',
        medications: []
      },
      as_needed: {
        timeSlot: 'As Needed (PRN) / Emergency',
        icon: Zap,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/20',
        medications: []
      }
    };

    analysisResult.forEach((med) => {
      const freqLower = (med.frequency || '').toLowerCase();
      const schedTime = med.scheduleTime || 'morning';

      if (freqLower.includes('prn') || freqLower.includes('as needed') || freqLower.includes('chest pain')) {
        slots.as_needed.medications.push(med);
      } else if (freqLower.includes('bid') || freqLower.includes('twice')) {
        slots.morning.medications.push(med);
        slots.evening.medications.push(med);
      } else if (freqLower.includes('tid') || freqLower.includes('three times')) {
        slots.morning.medications.push(med);
        slots.afternoon.medications.push(med);
        slots.evening.medications.push(med);
      } else if (freqLower.includes('qid') || freqLower.includes('four times')) {
        slots.morning.medications.push(med);
        slots.afternoon.medications.push(med);
        slots.evening.medications.push(med);
        slots.bedtime.medications.push(med);
      } else if (slots[schedTime]) {
        slots[schedTime].medications.push(med);
      } else {
        slots.morning.medications.push(med);
      }
    });

    return Object.values(slots).filter(s => s.medications.length > 0);
  };

  const timelineSlots = getTimelineSlots();

  return (
    <div className="space-y-6 animate-fadeIn py-2">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-blue-600/30 text-blue-300 font-black text-[10px] uppercase tracking-widest rounded-full border border-blue-500/30 flex items-center space-x-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
              <span>Prescription Clinical Analyzer</span>
            </span>
            <span className="px-2.5 py-1 bg-teal-500/20 text-teal-300 font-bold text-[10px] rounded-full border border-teal-500/30 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>Gemini 3.6 Flash Engine</span>
            </span>
          </div>

          <h2 className="heavy-type text-2xl sm:text-4xl uppercase tracking-tight text-white leading-tight">
            Prescription Analysis & Dosing Workspace
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Enter or paste raw doctor prescription scripts, medication discharge orders, or handwritten Rx transcriptions. Gemini AI extracts structured medication lists, exact dosages, frequencies, and a complete daily timeline schedule.
          </p>
        </div>
      </div>

      {/* Preset Quick Load Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Try Sample Prescription Presets:</span>
          </span>
          <button
            onClick={() => { setRxText(''); setAnalysisResult(null); }}
            className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Clear Input</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => { setRxText(PRESET_CARDIAC); handleAnalyzeText(PRESET_CARDIAC); }}
            className="p-3 text-left rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all group"
          >
            <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700 flex items-center justify-between">
              <span>Post-Op Cardiac Stent</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              Ticagrelor, Aspirin, Statin & Nitroglycerin PRN
            </p>
          </button>

          <button
            onClick={() => { setRxText(PRESET_DIABETES); handleAnalyzeText(PRESET_DIABETES); }}
            className="p-3 text-left rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-all group"
          >
            <div className="font-bold text-xs text-slate-900 group-hover:text-teal-700 flex items-center justify-between">
              <span>Diabetes & Hypertension</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              Metformin, Lisinopril, Jardiance & Amlodipine
            </p>
          </button>

          <button
            onClick={() => { setRxText(PRESET_SURGERY); handleAnalyzeText(PRESET_SURGERY); }}
            className="p-3 text-left rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 transition-all group"
          >
            <div className="font-bold text-xs text-slate-900 group-hover:text-indigo-700 flex items-center justify-between">
              <span>Joint Surgery Post-Op</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              Eliquis DVT Prophylaxis, Antibiotics & Pain
            </p>
          </button>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Input Workspace */}
        <div className="lg:col-span-5 saas-card p-6 space-y-4 bg-white border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-black uppercase tracking-wider text-sm text-slate-900">
                Prescription Text Entry
              </h3>
            </div>
            <button
              onClick={handleCopyText}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center space-x-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
              Raw Prescription Text / Doctor Notes
            </label>
            <textarea
              rows={11}
              value={rxText}
              onChange={(e) => setRxText(e.target.value)}
              placeholder="Type or paste medical prescription notes here (e.g. Rx: Amoxicillin 500mg PO TID x 10 days)..."
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs p-4 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all leading-relaxed"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Supports PO, BID, TID, QID, PRN, QHS, SL</span>
              <span>{rxText.length} characters</span>
            </div>
          </div>

          <button
            onClick={() => handleAnalyzeText(rxText)}
            disabled={isAnalyzing || !rxText.trim()}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Prescription with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Analyze Prescription with AI</span>
              </>
            )}
          </button>

          {/* Quick Legend Guide */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              Latin Medical Abbreviations Decoded:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-medium text-slate-700">
              <div><strong className="text-slate-900">PO:</strong> By mouth (oral)</div>
              <div><strong className="text-slate-900">BID:</strong> Twice daily</div>
              <div><strong className="text-slate-900">TID:</strong> Three times daily</div>
              <div><strong className="text-slate-900">QID:</strong> Four times daily</div>
              <div><strong className="text-slate-900">PRN:</strong> As needed</div>
              <div><strong className="text-slate-900">QHS:</strong> Every bedtime</div>
              <div><strong className="text-slate-900">SL:</strong> Under tongue</div>
              <div><strong className="text-slate-900">Q8H:</strong> Every 8 hours</div>
            </div>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section Toolbar & View Switcher */}
          <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 text-white flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <Pill className="w-5 h-5 text-teal-400" />
              <h3 className="font-black uppercase tracking-wider text-sm text-white">
                Extracted Prescription Results
              </h3>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveViewTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeViewTab === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Views
              </button>
              <button
                onClick={() => setActiveViewTab('medications')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeViewTab === 'medications'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Medication List
              </button>
              <button
                onClick={() => setActiveViewTab('timeline')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeViewTab === 'timeline'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Timeline Schedule
              </button>
            </div>
          </div>

          {/* Action Sync Banner */}
          {analysisResult && analysisResult.length > 0 && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-600 text-white rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-xs text-teal-950 uppercase tracking-wider">
                    {analysisResult.length} Medications Parsed Successfully
                  </h4>
                  <p className="text-xs text-teal-700 font-medium">
                    Sync directly with your active care plan and medication timeline tracker.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {onOpenUrduModal && (
                  <button
                    onClick={() => onOpenUrduModal(analysisResult || undefined, rxText)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                  >
                    <Languages className="w-4 h-4 text-emerald-200" />
                    <span>Explain in Urdu / اردو</span>
                  </button>
                )}

                <button
                  onClick={handleImportToCarePlan}
                  className={`px-4 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs shadow-md transition-all flex items-center space-x-1.5 ${
                    imported 
                      ? 'bg-emerald-600 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                >
                  {imported ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Imported to Care Plan!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to Active Care Plan</span>
                    </>
                  )}
                </button>

                {onNavigateToTab && imported && (
                  <button
                    onClick={() => onNavigateToTab('medications')}
                    className="px-3 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-black uppercase text-xs flex items-center space-x-1 transition-colors"
                  >
                    <span>View Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* No Results Placeholder */}
          {(!analysisResult || analysisResult.length === 0) && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Pill className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-black text-slate-800 uppercase text-sm">
                No Prescription Analyzed Yet
              </h4>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                Enter prescription text on the left or select a sample preset, then click &quot;Analyze Prescription with AI&quot;.
              </p>
            </div>
          )}

          {/* Medication List Section */}
          {(activeViewTab === 'all' || activeViewTab === 'medications') && analysisResult && analysisResult.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                  <Pill className="w-4 h-4 text-blue-600" />
                  <span>1. Extracted Medication List & Dosing Details</span>
                </span>
                <span className="mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                  {analysisResult.length} Drugs Extracted
                </span>
              </div>

              <div className="space-y-3">
                {analysisResult.map((med, idx) => (
                  <div key={med.id || idx} className="saas-card p-5 bg-white border border-slate-200 space-y-3 hover:border-blue-300 transition-all">
                    {/* Header: Name, Generic, Badges */}
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-base text-slate-900">{med.name}</span>
                          {med.genericName && med.genericName !== med.name && (
                            <span className="text-xs text-slate-500 font-bold">({med.genericName})</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Route: <strong className="text-slate-800 font-bold">{med.route || 'Oral'}</strong>
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Dosage Badge */}
                        <span className="mono text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-xl">
                          Dosage: {med.dosage}
                        </span>
                        {/* Frequency Badge */}
                        <span className="mono text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-xl">
                          {med.frequency}
                        </span>
                      </div>
                    </div>

                    {/* Purpose & Clinical Details */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-medium space-y-1">
                      <div><strong className="text-slate-900">Clinical Purpose:</strong> {med.purpose}</div>
                      {med.duration && (
                        <div className="text-[11px] text-slate-500 font-semibold">
                          Expected Duration: {med.duration}
                        </div>
                      )}
                    </div>

                    {/* Special Instructions / Warnings */}
                    {med.specialInstructions && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
                        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-black uppercase text-[10px] tracking-wider block text-amber-800">
                            Special Instructions & Precautions:
                          </strong>
                          <span>{med.specialInstructions}</span>
                        </div>
                      </div>
                    )}

                    {/* Grounded Source Quote */}
                    {med.sourceQuote && (
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => onOpenSourceModal(med.sourceQuote, med.name)}
                          className="text-[11px] font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center space-x-1"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                          <span>Verify Grounded Doctor Note Quote</span>
                        </button>

                        <span className="text-[10px] mono text-slate-400 font-bold">
                          Rx Match #{idx + 1}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Schedule Section */}
          {(activeViewTab === 'all' || activeViewTab === 'timeline') && timelineSlots && timelineSlots.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>2. Daily Medication Timeline Schedule</span>
                </span>
                <span className="mono text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                  Chronological Breakdown
                </span>
              </div>

              <div className="space-y-4">
                {timelineSlots.map((slot: any, idx: number) => {
                  const IconComp = slot.icon || Clock;
                  const meds = slot.medications || [];
                  const names = slot.medicationNames || meds.map((m: any) => m.name);

                  return (
                    <div key={idx} className="bento-card p-5 bg-slate-900 text-white border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center space-x-2.5">
                          <div className={`p-2 rounded-xl ${slot.bg || 'bg-slate-800'}`}>
                            <IconComp className={`w-4 h-4 ${slot.color || 'text-teal-400'}`} />
                          </div>
                          <h4 className="font-black text-sm uppercase tracking-wider text-white">
                            {slot.timeSlot || 'Scheduled Time'}
                          </h4>
                        </div>
                        <span className="mono text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                          {names.length} {names.length === 1 ? 'Medication' : 'Medications'}
                        </span>
                      </div>

                      {/* Med items list */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {meds.length > 0 ? (
                          meds.map((m: any, mIdx: number) => (
                            <div key={mIdx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-black text-xs text-white">{m.name}</span>
                                <span className="mono text-[10px] text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                                  {m.dosage}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 font-medium">
                                {m.frequency} • {m.purpose}
                              </p>
                            </div>
                          ))
                        ) : (
                          names.map((name: string, nIdx: number) => (
                            <div key={nIdx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                              <span className="font-black text-xs text-white block">{name}</span>
                              {slot.instructions && (
                                <p className="text-[11px] text-slate-400 font-medium mt-1">
                                  {slot.instructions}
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Secondary Actions Bar */}
          {analysisResult && analysisResult.length > 0 && (
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={handlePrintSchedule}
                className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-black uppercase text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Schedule</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
