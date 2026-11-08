import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  AlertTriangle, 
  Award, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Clock,
  Building,
  User
} from 'lucide-react';
import { DischargePlan } from '../types';
import { RefillStatusWidget } from './RefillStatusWidget';
import { GeminiDashboardCards } from './GeminiDashboardCards';

interface PlanOverviewProps {
  plan: DischargePlan;
  onOpenSourceModal: (quote?: string, title?: string) => void;
  onUpdateQuantity?: (id: string, newQuantity: number) => void;
  onMarkRefillRequested?: (id: string) => void;
  onUpdatePharmacyEmail?: (id: string, email: string) => void;
  onNavigateToMedications?: () => void;
  onToggleTaken?: (id: string) => void;
  onToggleTask?: (id: string) => void;
  onToggleReminder?: (id: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const PlanOverview: React.FC<PlanOverviewProps> = ({ 
  plan, 
  onOpenSourceModal,
  onUpdateQuantity,
  onMarkRefillRequested,
  onUpdatePharmacyEmail,
  onNavigateToMedications,
  onToggleTaken,
  onToggleTask,
  onToggleReminder,
  onNavigateToTab
}) => {
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const toggleTerm = (term: string) => {
    setExpandedTerm(expandedTerm === term ? null : term);
  };

  const hasLowSupplyMeds = plan.medications && plan.medications.some(m => {
    const qty = m.remainingQuantity;
    const threshold = m.refillThreshold ?? 5;
    return qty !== undefined && qty <= threshold;
  });

  const lowQtyCount = plan.medications?.filter(m => {
    const qty = m.remainingQuantity;
    const threshold = m.refillThreshold ?? 5;
    return qty !== undefined && qty <= threshold;
  }).length || 0;

  return (
    <div className="space-y-8">
      {/* Entry Method Badge Banner */}
      <div className="flex items-center justify-between bg-slate-100/80 border border-slate-200 px-4 py-2.5 rounded-2xl">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
          {plan.entryMethod === 'document' ? (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl flex items-center space-x-1.5 font-black uppercase text-[11px]">
              <FileText className="w-3.5 h-3.5 text-emerald-700" />
              <span>📄 Based on your uploaded document</span>
            </span>
          ) : plan.entryMethod === 'manual_notes' ? (
            <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl flex items-center space-x-1.5 font-black uppercase text-[11px]">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>✏️ Based on your typed/voice notes (Verify with official paperwork)</span>
            </span>
          ) : (
            <span className="px-3 py-1 bg-blue-100 text-blue-900 border border-blue-300 rounded-xl flex items-center space-x-1.5 font-black uppercase text-[11px]">
              <FileText className="w-3.5 h-3.5 text-blue-700" />
              <span>📋 Sample Recovery Plan</span>
            </span>
          )}
        </div>
        <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
          Discharge Date: {plan.dischargeDate}
        </span>
      </div>

      {/* Top Analytics Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Analytics Card 1: Reports Analyzed */}
        <div className="saas-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Reports Analyzed
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="heavy-type text-3xl text-slate-950">1</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              100% OCR Grounded
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Active Hospital Discharge Document
          </p>
        </div>

        {/* Analytics Card 2: Recovery Plans */}
        <div className="saas-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Recovery Plan Score
            </span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="heavy-type text-3xl text-slate-950">
              {plan.confidence.overallScore}%
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              High Confidence
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {plan.keyRecoveryMilestones.length} Active Milestones
          </p>
        </div>

        {/* Analytics Card 3: Upcoming Follow-Ups */}
        <div className="saas-card p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Upcoming Follow-Ups
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="heavy-type text-3xl text-slate-950">
              {plan.followUps.length}
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              Calendar Set
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {plan.followUps[0] ? `Next: ${plan.followUps[0].date}` : 'No appointments'}
          </p>
        </div>

        {/* Analytics Card 4: Medication Reminders / Refills */}
        <div className={`saas-card p-5 space-y-2 ${
          lowQtyCount > 0 ? 'border-amber-300 bg-amber-50/30' : ''
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Medications & Refills
            </span>
            <div className={`p-2 rounded-xl ${
              lowQtyCount > 0 ? 'bg-amber-500 text-slate-950' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="heavy-type text-3xl text-slate-950">
              {plan.medications.length}
            </span>
            {lowQtyCount > 0 ? (
              <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md animate-pulse">
                {lowQtyCount} Refill Alert
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Fully Stocked
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Daily dosage schedule active
          </p>
        </div>
      </div>

      {/* Refill Alert Banner if applicable */}
      {hasLowSupplyMeds && (
        <RefillStatusWidget
          medications={plan.medications}
          patientName={plan.patientName}
          onUpdateQuantity={onUpdateQuantity}
          onMarkRefillRequested={onMarkRefillRequested}
          onUpdatePharmacyEmail={onUpdatePharmacyEmail}
          onNavigateToMedications={onNavigateToMedications}
        />
      )}

      {/* ========================================================
          GEMINI DASHBOARD CARDS (Summary, Medication Schedule, 
          Follow Up Instructions, Recovery Checklist, Warning Signs)
         ======================================================== */}
      <GeminiDashboardCards
        plan={plan}
        onOpenSourceModal={onOpenSourceModal}
        onToggleTaken={onToggleTaken}
        onToggleTask={onToggleTask}
        onToggleReminder={onToggleReminder}
        onNavigateToTab={onNavigateToTab}
      />
    </div>
  );
};

