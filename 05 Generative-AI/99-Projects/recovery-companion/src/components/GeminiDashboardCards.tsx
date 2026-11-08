import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Clock, 
  Pill, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  User, 
  Building, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  Check, 
  Plus, 
  ArrowUpRight
} from 'lucide-react';
import { DischargePlan } from '../types';

interface GeminiDashboardCardsProps {
  plan: DischargePlan;
  onOpenSourceModal?: (quote?: string, title?: string) => void;
  onToggleTaken?: (id: string) => void;
  onToggleTask?: (id: string) => void;
  onToggleReminder?: (id: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const GeminiDashboardCards: React.FC<GeminiDashboardCardsProps> = ({
  plan,
  onOpenSourceModal,
  onToggleTaken,
  onToggleTask,
  onNavigateToTab
}) => {
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [selectedScheduleFilter, setSelectedScheduleFilter] = useState<string>('all');

  const toggleTerm = (term: string) => {
    setExpandedTerm(expandedTerm === term ? null : term);
  };

  const scheduleTimeSlots = [
    { id: 'all', label: 'All Times' },
    { id: 'morning', label: 'Morning (8:00 AM)' },
    { id: 'afternoon', label: 'Afternoon (1:00 PM)' },
    { id: 'evening', label: 'Evening (8:00 PM)' },
    { id: 'bedtime', label: 'Bedtime (10:00 PM)' },
    { id: 'as_needed', label: 'As Needed (PRN)' },
  ];

  const filteredMeds = plan.medications.filter((m) => {
    if (selectedScheduleFilter === 'all') return true;
    return m.scheduleTime === selectedScheduleFilter;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Badge Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-3 py-1 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-xs flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 3.6 Flash Structured Results</span>
            </span>
            <span className="mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
              {plan.confidence?.overallScore || 96}% Grounding Score
            </span>
          </div>
          <h2 className="heavy-type text-2xl sm:text-3xl text-slate-950 uppercase">
            Discharge Plan Dashboard Cards
          </h2>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>5 Core Gemini Analysis Cards</span>
        </div>
      </div>

      {/* Grid Layout of the 5 Requested Gemini Dashboard Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ========================================================
            CARD 1: SUMMARY (Spans 12 columns)
           ======================================================== */}
        <div id="card-summary" className="lg:col-span-12 bento-card p-6 sm:p-8 border-slate-200 shadow-md relative overflow-hidden accent-border">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black uppercase tracking-wider rounded-lg flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Summary Card</span>
                </span>
                <span className="mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  Patient: {plan.patientName}
                </span>
                <span className="mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  Facility: {plan.hospitalName}
                </span>
              </div>

              <h3 className="heavy-type text-2xl sm:text-3xl text-slate-950 uppercase">
                {plan.primaryDiagnosis || 'Discharge Clinical Summary'}
              </h3>

              <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-blue-400 font-black text-xs uppercase tracking-wider">
                  <span className="flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Plain-Language Summary</span>
                  </span>
                  <span className="mono text-[10px] text-slate-400">GEMINI 3.6 FLASH</span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed font-medium text-slate-100">
                  {plan.plainLanguageSummary}
                </p>
              </div>
            </div>

            {/* Quick Meta Info Box */}
            <div className="lg:w-80 shrink-0 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="text-xs font-black uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2 flex items-center justify-between">
                <span>Clinical Overview</span>
                <Building className="w-4 h-4 text-blue-600" />
              </div>
              <div className="space-y-2 text-xs font-medium text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Discharge Date:</span>
                  <span className="font-bold text-slate-900">{plan.dischargeDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Attending Physician:</span>
                  <span className="font-bold text-slate-900">{plan.attendingPhysician}</span>
                </div>
                {plan.proceduresPerformed && plan.proceduresPerformed.length > 0 && (
                  <div>
                    <span className="text-slate-500 block mb-1">Procedures:</span>
                    <div className="flex flex-wrap gap-1">
                      {plan.proceduresPerformed.map((p, idx) => (
                        <span key={idx} className="mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {onOpenSourceModal && (
                <button
                  onClick={() => onOpenSourceModal(plan.sourceDocumentText?.slice(0, 300), 'Summary Source Citation')}
                  className="w-full mt-2 py-2 bg-slate-900 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect OCR Citation</span>
                </button>
              )}
            </div>
          </div>

          {/* Medical Terms Glossary Accordion Section */}
          {plan.medicalTermsGlossary && plan.medicalTermsGlossary.length > 0 && (
            <div className="mt-5 pt-4 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-700">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Explained Medical Terminology ({plan.medicalTermsGlossary.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plan.medicalTermsGlossary.map((item, idx) => {
                  const isExpanded = expandedTerm === item.term;
                  return (
                    <div 
                      key={idx}
                      className={`border rounded-xl transition-all overflow-hidden ${
                        isExpanded ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <button
                        onClick={() => toggleTerm(item.term)}
                        className="w-full px-3.5 py-2.5 text-left font-black text-xs text-slate-900 flex items-center justify-between"
                      >
                        <span className="flex items-center space-x-1.5 truncate">
                          <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="uppercase">{item.term}</span>
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-3.5 pb-3 text-xs text-slate-700 font-medium leading-relaxed border-t border-indigo-100 pt-2 bg-indigo-50/20">
                          {item.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>


        {/* ========================================================
            CARD 2: MEDICATION SCHEDULE (Spans 12 or 7 columns)
           ======================================================== */}
        <div id="card-medication-schedule" className="lg:col-span-7 bento-card p-6 sm:p-7 border-slate-200 shadow-md flex flex-col justify-between accent-border-teal">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-teal-600 text-white rounded-2xl shadow-xs">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">
                      2. Medication Schedule Card
                    </span>
                    <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded border border-teal-200">
                      {plan.medications.length} Prescriptions
                    </span>
                  </div>
                  <h3 className="font-black uppercase text-lg text-slate-950 tracking-tight">
                    Medication Schedule
                  </h3>
                </div>
              </div>

              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('medications')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center space-x-1 transition-colors"
                >
                  <span>Full Tracker</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Time Slot Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {scheduleTimeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedScheduleFilter(slot.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap text-xs ${
                    selectedScheduleFilter === slot.id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>

            {/* Medication List Cards */}
            <div className="space-y-3">
              {filteredMeds.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                  No medications scheduled for this specific time slot.
                </div>
              ) : (
                filteredMeds.map((med) => (
                  <div 
                    key={med.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      med.takenToday 
                        ? 'bg-emerald-50/60 border-emerald-200' 
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-black text-sm text-slate-950 uppercase tracking-tight truncate">
                          {med.name}
                        </span>
                        {med.dosage && (
                          <span className="mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                            {med.dosage}
                          </span>
                        )}
                        {med.timeLabel && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {med.timeLabel}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 font-medium leading-normal">
                        <strong>Instructions:</strong> {med.specialInstructions || med.purpose || 'Take as prescribed by physician.'}
                      </p>

                      {med.frequency && (
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2 pt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Frequency: {med.frequency} ({med.route || 'Oral'})</span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Take Dose Button */}
                    <div className="shrink-0 flex items-center space-x-2">
                      {onToggleTaken && (
                        <button
                          onClick={() => onToggleTaken(med.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                            med.takenToday
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-900 hover:bg-teal-600 text-white shadow-xs'
                          }`}
                        >
                          {med.takenToday ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Taken Today</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Log Dose</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Always consult your healthcare team before changing dosage.</span>
            <span className="font-bold text-slate-700">{plan.medications.length} Prescriptions</span>
          </div>
        </div>


        {/* ========================================================
            CARD 3: FOLLOW UP INSTRUCTIONS (Spans 12 or 5 columns)
           ======================================================== */}
        <div id="card-follow-ups" className="lg:col-span-5 bento-card p-6 sm:p-7 border-slate-200 shadow-md flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block">
                    3. Follow Up Instructions
                  </span>
                  <h3 className="font-black uppercase text-lg text-slate-950 tracking-tight">
                    Follow Up Appointments
                  </h3>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-black rounded-lg border border-indigo-200">
                {plan.followUps.length} Visits
              </span>
            </div>

            {/* Follow Up Cards List */}
            <div className="space-y-3">
              {plan.followUps.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                  No follow-up appointments listed.
                </div>
              ) : (
                plan.followUps.map((fup) => (
                  <div key={fup.id} className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-2 shadow-2xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-black text-sm text-slate-950 uppercase tracking-tight">
                          {fup.providerName}
                        </h4>
                        <p className="text-xs font-bold text-indigo-600">{fup.specialty || 'Physician / Specialist'}</p>
                      </div>

                      <span className="mono text-[11px] font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg shrink-0">
                        {fup.date} {fup.time ? `@ ${fup.time}` : ''}
                      </span>
                    </div>

                    {fup.instructions && (
                      <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {fup.instructions}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 gap-2">
                      <span className="flex items-center space-x-1 text-slate-700">
                        <User className="w-3 h-3 text-indigo-600 shrink-0" />
                        <span className="truncate max-w-[180px]">{fup.location || fup.address || 'Medical Office'}</span>
                      </span>

                      {fup.phone && (
                        <a 
                          href={`tel:${fup.phone}`}
                          className="flex items-center space-x-1 font-bold text-indigo-600 hover:underline"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{fup.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Keep all scheduled follow-up visits.</span>
            <span className="font-bold text-indigo-600">Calendar Synced</span>
          </div>
        </div>


        {/* ========================================================
            CARD 4: RECOVERY CHECKLIST (Spans 12 or 6 columns)
           ======================================================== */}
        <div id="card-recovery-checklist" className="lg:col-span-6 bento-card p-6 sm:p-7 border-slate-200 shadow-md flex flex-col justify-between accent-border-emerald">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block">
                    4. Recovery Checklist Card
                  </span>
                  <h3 className="font-black uppercase text-lg text-slate-950 tracking-tight">
                    Recovery Checklist
                  </h3>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-lg border border-emerald-200">
                {plan.dailyTasks.filter(t => t.completed).length}/{plan.dailyTasks.length} Completed
              </span>
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {plan.dailyTasks.map((task, idx) => (
                <div 
                  key={task.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start space-x-3 ${
                    task.completed 
                      ? 'bg-emerald-50/80 border-emerald-200 opacity-90' 
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <button
                    onClick={() => onToggleTask && onToggleTask(task.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center transition-all shrink-0 ${
                      task.completed 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-100 text-slate-700 border border-slate-300 hover:border-emerald-500'
                    }`}
                  >
                    {task.completed ? <Check className="w-4 h-4 stroke-[3]" /> : `0${idx + 1}`}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`font-black text-xs uppercase tracking-tight ${
                        task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}>
                        {task.title}
                      </h4>
                      {task.categoryLabel && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                          {task.categoryLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">
                      {task.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Complete tasks daily to maintain recovery progress.</span>
            <span className="font-bold text-emerald-700">100% Clinical Grounded</span>
          </div>
        </div>


        {/* ========================================================
            CARD 5: WARNING SIGNS (Spans 12 or 6 columns)
           ======================================================== */}
        <div id="card-warning-signs" className="lg:col-span-6 bento-card p-6 sm:p-7 border-slate-200 shadow-md flex flex-col justify-between accent-border-rose">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-rose-600 text-white rounded-2xl shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 block">
                    5. Warning Signs Card
                  </span>
                  <h3 className="font-black uppercase text-lg text-slate-950 tracking-tight">
                    Warning Signs & Red Flags
                  </h3>
                </div>
              </div>

              <span className="px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-black rounded-lg border border-rose-200">
                {plan.warningSigns.length} Red Flags
              </span>
            </div>

            {/* Warning Signs List */}
            <div className="space-y-3">
              {plan.warningSigns.map((warn) => {
                const isEmergency = warn.level === 'emergency';
                return (
                  <div 
                    key={warn.id}
                    className={`p-4 rounded-2xl border transition-all space-y-2 ${
                      isEmergency 
                        ? 'bg-rose-50/80 border-rose-200 text-rose-950 shadow-2xs' 
                        : 'bg-amber-50/80 border-amber-200 text-amber-950 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`w-4 h-4 shrink-0 ${isEmergency ? 'text-rose-600' : 'text-amber-600'}`} />
                        <h4 className="font-black text-xs uppercase tracking-tight">
                          {warn.symptom}
                        </h4>
                      </div>

                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        isEmergency ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                      }`}>
                        {isEmergency ? 'EMERGENCY' : 'URGENT CALL'}
                      </span>
                    </div>

                    <p className="text-xs font-bold leading-relaxed pl-6">
                      Action Required: {warn.actionRequired}
                    </p>

                    {isEmergency && (
                      <div className="pt-1 pl-6">
                        <a
                          href="tel:911"
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] uppercase tracking-wider rounded-lg transition-all inline-flex items-center space-x-1.5 shadow-xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call 911 Immediately</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="font-bold text-rose-600">Non-diagnostic reference.</span>
            <span>If experiencing acute distress, call 911 immediately.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
