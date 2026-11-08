import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  X,
  ShieldAlert, 
  Calendar, 
  Pill, 
  CheckSquare, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  Activity,
  Heart,
  Hospital,
  User,
  Stethoscope,
  Info
} from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { DischargePlan } from '../types';

interface PrintableRecoveryCardProps {
  isOpen: boolean;
  onClose: () => void;
  plan: DischargePlan;
}

export const PrintableRecoveryCard: React.FC<PrintableRecoveryCardProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-recovery-document');
    if (!element) return;

    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    const safePatientName = (plan.patientName || 'Patient').replace(/\s+/g, '_');
    const opt = {
      margin: [8, 8, 8, 8] as [number, number, number, number],
      filename: `${safePatientName}_Discharge_Recovery_Plan.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('PDF generation error, falling back to window.print:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden relative my-4 p-6 sm:p-8 print:p-0 print:border-none print:shadow-none print:my-0 print:max-w-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Printable Control Bar (Hidden during actual print) */}
        <div className="print:hidden pb-5 mb-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                Official Patient Medical Recovery Plan
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Medical-grade report preview • Export to PDF or print directly
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center space-x-2 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>PDF Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors flex items-center space-x-2 shadow-xs cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>

            {/* Back to App Button */}
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-black uppercase tracking-wider rounded-xl transition-colors flex items-center space-x-2 border border-slate-200 cursor-pointer active:scale-95"
              title="Return to Recovery Plan"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back to App</span>
            </button>

            {/* Prominent Close X Button */}
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-xl transition-all border border-slate-200 hover:border-rose-300 cursor-pointer flex items-center justify-center shadow-xs active:scale-95"
              title="Close Preview (Close X)"
              aria-label="Close PDF Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Sheet (Targeted for html2pdf and print media) */}
        <div id="printable-recovery-document" className="space-y-6 text-slate-900 bg-white p-2">
          
          {/* Header Banner */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-black uppercase tracking-widest bg-blue-600 text-white px-2.5 py-0.5 rounded">
                  DischargeCare AI
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Official Patient Recovery Plan
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                Patient Discharge & Care Recovery Guide
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-700 pt-1">
                <span className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Patient: <strong className="text-slate-900">{plan.patientName}</strong></span>
                </span>
                <span className="flex items-center space-x-1">
                  <Hospital className="w-3.5 h-3.5 text-teal-600" />
                  <span>Hospital: <strong className="text-slate-900">{plan.hospitalName}</strong></span>
                </span>
                <span className="flex items-center space-x-1">
                  <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Physician: <strong className="text-slate-900">{plan.attendingPhysician}</strong></span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Discharge Date: <strong className="text-slate-900">{plan.dischargeDate}</strong></span>
                </span>
              </div>
            </div>
          </div>

          {/* 1. SECTION: SUMMARY */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-300 pb-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                1. Clinical Summary & Recovery Overview
              </h2>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-300 space-y-2 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-500 block">
                    Primary Diagnosis
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{plan.primaryDiagnosis}</p>
                </div>
                {plan.secondaryDiagnoses && plan.secondaryDiagnoses.length > 0 && (
                  <div>
                    <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-500 block">
                      Secondary Diagnoses
                    </span>
                    <p className="font-semibold text-slate-800">{plan.secondaryDiagnoses.join(', ')}</p>
                  </div>
                )}
              </div>

              {plan.plainLanguageSummary && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-500 block mb-1">
                    Plain-Language Summary
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {plan.plainLanguageSummary}
                  </p>
                </div>
              )}

              {plan.keyRecoveryMilestones && plan.keyRecoveryMilestones.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-500 block mb-1">
                    Key Recovery Milestones
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-800 font-semibold">
                    {plan.keyRecoveryMilestones.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* 2. SECTION: WARNING SIGNS (RED FLAGS) */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-300 pb-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-black uppercase tracking-wider text-rose-900">
                2. Emergency Warning Signs & Red Flags
              </h2>
            </div>

            <div className="border-2 border-rose-600 bg-rose-50 p-4 rounded-xl space-y-2">
              <div className="text-rose-900 font-extrabold text-xs uppercase tracking-wider flex items-center justify-between">
                <span>SEEK IMMEDIATE MEDICAL CARE IF YOU EXPERIENCE:</span>
                <span className="font-mono text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded">
                  EMERGENCY ACTION
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {plan.warningSigns.map((w, idx) => (
                  <div key={idx} className="p-2.5 bg-white border border-rose-200 rounded-lg space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-rose-950 font-black">{w.symptom}</strong>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        w.level === 'emergency' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {w.level.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-slate-800 font-semibold">{w.actionRequired}</p>
                    {w.contactNumber && (
                      <p className="text-slate-500 font-mono text-[10px]">Contact: {w.contactNumber}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. SECTION: MEDICATIONS */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-300 pb-1.5">
              <Pill className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                3. Medication Schedule & Dosing Instructions
              </h2>
            </div>

            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300 uppercase tracking-wider text-[11px]">
                  <th className="p-2 border border-slate-300">Medication</th>
                  <th className="p-2 border border-slate-300">Dose & Route</th>
                  <th className="p-2 border border-slate-300">Frequency & Time</th>
                  <th className="p-2 border border-slate-300">Instructions & Purpose</th>
                </tr>
              </thead>
              <tbody>
                {plan.medications.map((m, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                    <td className="p-2 border border-slate-300">
                      <strong className="text-slate-900 block">{m.name}</strong>
                      {m.genericName && m.genericName !== m.name && (
                        <span className="text-[10px] text-slate-500 block">({m.genericName})</span>
                      )}
                    </td>
                    <td className="p-2 border border-slate-300 font-medium">
                      <div>{m.dosage}</div>
                      <div className="text-[10px] text-slate-500">{m.route || 'Oral'}</div>
                    </td>
                    <td className="p-2 border border-slate-300 font-semibold">
                      <div className="font-mono text-blue-700 font-bold">{m.timeLabel}</div>
                      <div className="text-[10px] text-slate-600">{m.frequency}</div>
                    </td>
                    <td className="p-2 border border-slate-300 text-slate-800">
                      <div className="font-semibold">{m.purpose}</div>
                      {m.specialInstructions && (
                        <div className="text-[10px] text-amber-800 font-medium mt-0.5">
                          Note: {m.specialInstructions}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. SECTION: CHECKLIST */}
          {plan.dailyTasks && plan.dailyTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-300 pb-1.5">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  4. Daily Recovery Checklist & Tasks
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {plan.dailyTasks.map((task, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-300 flex items-start space-x-2.5">
                    <div className="w-4 h-4 rounded border-2 border-slate-400 mt-0.5 shrink-0 bg-white" />
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <strong className="text-slate-900 font-bold">{task.title}</strong>
                        {task.dayOffset && (
                          <span className="text-[9px] font-mono font-bold uppercase bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                            {task.dayOffset}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-[11px] font-medium">{task.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. SECTION: FOLLOW UPS */}
          {plan.followUps && plan.followUps.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-300 pb-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  5. Upcoming Follow-Up Appointments
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {plan.followUps.map((app, idx) => (
                  <div key={idx} className="p-3 border border-slate-300 rounded-lg bg-slate-50 space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-slate-900">{app.providerName}</p>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {app.specialty}
                      </span>
                    </div>
                    <p className="font-mono text-blue-800 font-bold text-xs">{app.date} at {app.time}</p>
                    <p className="text-slate-600 text-[11px]">{app.location} • {app.phone}</p>
                    {app.instructions && (
                      <p className="text-[10px] text-slate-500 font-medium italic mt-1">
                        Instructions: {app.instructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Disclaimer */}
          <div className="pt-4 border-t border-slate-300 text-[10px] text-slate-500 leading-tight space-y-1">
            <p className="font-bold text-slate-700 uppercase">Medical & Legal Notice:</p>
            <p>
              This DischargeCare AI Summary is an informational organization tool generated from hospital discharge documents. It does not replace professional clinical judgment or official discharge instructions from your attending medical team. In case of medical emergencies, dial 911 immediately.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
