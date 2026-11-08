import React, { useState } from 'react';
import { 
  Pill, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset,
  Flame,
  Info,
  AlertTriangle,
  Mail,
  Plus,
  Minus,
  RefreshCw,
  Send,
  Languages
} from 'lucide-react';
import { MedicationItem } from '../types';
import { RefillRequestModal } from './RefillRequestModal';
import { MedicationTimeline } from './MedicationTimeline';

interface MedicationTrackerProps {
  medications: MedicationItem[];
  patientName?: string;
  onToggleTaken: (id: string) => void;
  onOpenSourceModal: (quote: string, title: string) => void;
  onUpdateQuantity?: (id: string, newQuantity: number) => void;
  onMarkRefillRequested?: (id: string) => void;
  onUpdatePharmacyEmail?: (id: string, email: string) => void;
  onOpenUrduModal?: (meds?: MedicationItem[]) => void;
}

export const MedicationTracker: React.FC<MedicationTrackerProps> = ({
  medications,
  patientName = 'Patient',
  onToggleTaken,
  onOpenSourceModal,
  onUpdateQuantity,
  onMarkRefillRequested,
  onUpdatePharmacyEmail,
  onOpenUrduModal
}) => {
  const [activeSlot, setActiveSlot] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'bedtime' | 'as_needed'>('all');
  const [selectedRefillMed, setSelectedRefillMed] = useState<MedicationItem | null>(null);
  const [isRefillModalOpen, setIsRefillModalOpen] = useState<boolean>(false);

  const takenCount = medications.filter(m => m.takenToday).length;
  const progressPercent = medications.length > 0 ? Math.round((takenCount / medications.length) * 100) : 0;

  // Identify medications with low remaining quantity (<= threshold or default 5)
  const lowQuantityMeds = medications.filter(m => {
    const qty = m.remainingQuantity;
    const threshold = m.refillThreshold ?? 5;
    return qty !== undefined && qty <= threshold;
  });

  const filteredMeds = activeSlot === 'all' 
    ? medications 
    : medications.filter(m => m.scheduleTime === activeSlot);

  const handleOpenRefillModal = (med: MedicationItem) => {
    setSelectedRefillMed(med);
    setIsRefillModalOpen(true);
  };

  const handleQuantityChange = (med: MedicationItem, delta: number) => {
    if (!onUpdateQuantity) return;
    const currentQty = med.remainingQuantity ?? 10;
    const newQty = Math.max(0, currentQty + delta);
    onUpdateQuantity(med.id, newQty);
  };

  return (
    <div className="space-y-6">
      {/* Low Quantity Refill Alert Banner */}
      {lowQuantityMeds.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 rounded-3xl p-5 text-white shadow-md border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shrink-0">
              <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-white text-slate-950 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest">
                  ACTION REQUIRED
                </span>
                <h3 className="font-black uppercase tracking-wider text-base text-white">
                  Refill Alert: {lowQuantityMeds.length} Medication(s) Running Low
                </h3>
              </div>
              <p className="text-xs font-bold text-amber-50 mt-1">
                {lowQuantityMeds.map(m => `${m.name} (${m.remainingQuantity ?? 0} doses left)`).join(' • ')}
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenRefillModal(lowQuantityMeds[0])}
            className="px-5 py-3 bg-slate-950 text-white hover:bg-white hover:text-slate-950 font-black uppercase tracking-wider text-xs rounded-2xl transition-all shadow-md shrink-0 flex items-center space-x-2"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Email Pharmacy Refill Now</span>
          </button>
        </div>
      )}

      {/* Visual Medication Timeline (Morning, Afternoon, Evening, Night) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm accent-border-teal">
        <MedicationTimeline
          medications={medications}
          onToggleTaken={onToggleTaken}
          onOpenSourceModal={onOpenSourceModal}
        />
      </div>

      {/* Header Card with Progress Bar & Adherence */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white font-black">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black uppercase text-base tracking-widest text-slate-950">
                Prescription & Quantity Tracker
              </h2>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Exact dosages, time schedules, and automatic pill refill triggers
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenUrduModal && (
              <button
                onClick={() => onOpenUrduModal(medications)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-md transition-all flex items-center space-x-2"
              >
                <Languages className="w-4 h-4 text-emerald-200" />
                <span>Explain in Urdu / اردو</span>
              </button>
            )}

            <div className="flex items-center space-x-3 bg-blue-50 p-3.5 rounded-2xl border border-blue-100">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-blue-950 block">
                  Daily Adherence
                </span>
                <span className="text-xs font-black text-blue-700">
                  {takenCount} of {medications.length} taken ({progressPercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Heavy Progress Bar */}
        <div className="w-full bg-slate-200 h-3 rounded-full mt-4 overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Time-Slot Filter Tabs */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 text-xs font-black uppercase tracking-wider text-slate-600">
          <button
            onClick={() => setActiveSlot('all')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeSlot === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>All ({medications.length})</span>
          </button>

          <button
            onClick={() => setActiveSlot('morning')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeSlot === 'morning'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Sunrise className="w-3.5 h-3.5 text-amber-700" />
            <span>Morning</span>
          </button>

          <button
            onClick={() => setActiveSlot('afternoon')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeSlot === 'afternoon'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span>Afternoon</span>
          </button>

          <button
            onClick={() => setActiveSlot('evening')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeSlot === 'evening'
                ? 'bg-indigo-600 text-white font-black shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Sunset className="w-3.5 h-3.5 text-indigo-300" />
            <span>Evening</span>
          </button>

          <button
            onClick={() => setActiveSlot('bedtime')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeSlot === 'bedtime'
                ? 'bg-slate-900 text-white font-black shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Bedtime</span>
          </button>

          <button
            onClick={() => setActiveSlot('as_needed')}
            className={`px-3.5 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeSlot === 'as_needed'
                ? 'bg-rose-600 text-white font-black shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>As Needed</span>
          </button>
        </div>
      </div>

      {/* Medication List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMeds.map((med) => {
          const qty = med.remainingQuantity ?? 10;
          const isLow = qty <= (med.refillThreshold ?? 5);

          return (
            <div
              key={med.id}
              className={`glass-card rounded-3xl p-6 border transition-all duration-200 shadow-sm flex flex-col justify-between ${
                med.takenToday
                  ? 'border-emerald-300 bg-emerald-50/30 accent-border-emerald'
                  : isLow
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'accent-border'
              }`}
            >
              <div>
                {/* Card Top: Drug Name & Time Badge */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-black uppercase tracking-wider text-slate-950">{med.name}</h3>
                      {med.genericName && (
                        <span className="text-xs font-bold text-slate-400">
                          ({med.genericName})
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-black text-blue-600 mt-1 uppercase tracking-wider">
                      {med.dosage} • {med.frequency}
                    </p>
                  </div>

                  <span className="mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg flex items-center space-x-1 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{med.timeLabel}</span>
                  </span>
                </div>

                {/* Remaining Quantity Bar & Refill Trigger Controls */}
                <div className="py-3 px-3.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 my-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Pill className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-black uppercase text-slate-700">Remaining Supply:</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`mono text-xs font-black px-2 py-0.5 rounded-md ${
                        isLow ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-white'
                      }`}>
                        {qty} {med.totalQuantity ? `/ ${med.totalQuantity}` : ''} doses
                      </span>

                      {/* Quantity Adjusters */}
                      <div className="flex items-center space-x-1 border border-slate-300 rounded-lg bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(med, -1)}
                          className="p-1 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="Decrease remaining pill count"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(med, 1)}
                          className="p-1 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="Increase remaining pill count"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Visual Quantity Bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isLow ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, (qty / (med.totalQuantity || 30)) * 100)}%` }}
                    />
                  </div>

                  {/* Low Supply Alert or Refill Requested Tag */}
                  <div className="flex items-center justify-between pt-1">
                    {med.refillRequested ? (
                      <span className="text-[11px] font-black uppercase text-emerald-700 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Refill Request Submitted</span>
                      </span>
                    ) : isLow ? (
                      <span className="text-[11px] font-black uppercase text-amber-700 flex items-center space-x-1 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Low Stock Alert ({qty} left)</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 uppercase">
                        Sufficient supply on hand
                      </span>
                    )}

                    <button
                      onClick={() => handleOpenRefillModal(med)}
                      className="text-blue-600 hover:text-blue-800 font-black uppercase tracking-wider text-[11px] flex items-center space-x-1 hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>{med.refillRequested ? 'Resend Refill' : 'Refill Request'}</span>
                    </button>
                  </div>
                </div>

                {/* Low Confidence / Handwriting Ambiguity Flag */}
                {(med.confidence < 90) && (
                  <div className="mb-3 p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 text-xs font-bold flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>⚠️ Unclear document text/dose: Please confirm exact dose with your doctor</span>
                  </div>
                )}

                {/* Purpose & Special Instructions */}
                <div className="pb-3 space-y-2 text-xs">
                  <div className="flex items-start space-x-2">
                    <span className="font-black uppercase tracking-wider text-slate-800 shrink-0">Purpose:</span>
                    <span className="text-slate-700 font-medium">{med.purpose}</span>
                  </div>

                  {med.specialInstructions && (
                    <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-amber-950 text-xs font-bold leading-relaxed flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{med.specialInstructions}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Controls & Grounding Link */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => onOpenSourceModal(med.sourceQuote, `${med.name} (${med.dosage})`)}
                  className="text-slate-500 hover:text-slate-900 font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1 hover:underline"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Citation ({med.confidence}%)</span>
                </button>

                <button
                  onClick={() => onToggleTaken(med.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-sm ${
                    med.takenToday
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-900 text-white hover:bg-blue-600'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{med.takenToday ? 'Taken Today' : 'Mark Taken'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Refill Request Modal */}
      <RefillRequestModal
        isOpen={isRefillModalOpen}
        onClose={() => setIsRefillModalOpen(false)}
        medication={selectedRefillMed}
        patientName={patientName}
        onMarkRefillRequested={(medId) => {
          if (onMarkRefillRequested) {
            onMarkRefillRequested(medId);
          }
        }}
        onUpdatePharmacyEmail={onUpdatePharmacyEmail}
      />
    </div>
  );
};

