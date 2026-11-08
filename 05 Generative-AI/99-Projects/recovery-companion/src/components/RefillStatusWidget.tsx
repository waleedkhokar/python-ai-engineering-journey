import React, { useState } from 'react';
import { 
  Pill, 
  AlertTriangle, 
  CheckCircle2, 
  Mail, 
  Clock, 
  ChevronRight, 
  Plus, 
  Minus, 
  Send,
  Building2,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { MedicationItem } from '../types';
import { RefillRequestModal } from './RefillRequestModal';

interface RefillStatusWidgetProps {
  medications: MedicationItem[];
  patientName?: string;
  onUpdateQuantity?: (id: string, newQuantity: number) => void;
  onMarkRefillRequested?: (id: string) => void;
  onUpdatePharmacyEmail?: (id: string, email: string) => void;
  onNavigateToMedications?: () => void;
}

export const RefillStatusWidget: React.FC<RefillStatusWidgetProps> = ({
  medications,
  patientName = 'Patient',
  onUpdateQuantity,
  onMarkRefillRequested,
  onUpdatePharmacyEmail,
  onNavigateToMedications
}) => {
  const [selectedMed, setSelectedMed] = useState<MedicationItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const lowSupplyMeds = medications.filter(m => {
    const qty = m.remainingQuantity;
    const threshold = m.refillThreshold ?? 5;
    return qty !== undefined && qty <= threshold;
  });

  const requestedMeds = medications.filter(m => m.refillRequested);

  const handleOpenRefill = (med: MedicationItem) => {
    setSelectedMed(med);
    setIsModalOpen(true);
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-5">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-amber-500 text-slate-950 font-black rounded-2xl shadow-sm shrink-0">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black uppercase tracking-wider text-base text-slate-950">
                Prescription Refill Status
              </h3>
              {lowSupplyMeds.length > 0 && (
                <span className="bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                  {lowSupplyMeds.length} Low
                </span>
              )}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-0.5">
              Live inventory tracking & automatic pharmacy refill requests
            </p>
          </div>
        </div>

        {lowSupplyMeds.length > 0 && (
          <button
            onClick={() => handleOpenRefill(lowSupplyMeds[0])}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-sm transition-all shrink-0 flex items-center space-x-2"
          >
            <Mail className="w-4 h-4" />
            <span>Refill Low Supply ({lowSupplyMeds.length})</span>
          </button>
        )}
      </div>

      {/* Overview Stat Chips */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
            Total Tracked
          </span>
          <span className="heavy-type text-2xl text-slate-900 block mt-0.5">
            {medications.length}
          </span>
        </div>

        <div className={`p-3.5 rounded-2xl border text-center transition-all ${
          lowSupplyMeds.length > 0
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-emerald-50 border-emerald-200 text-emerald-950'
        }`}>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
            Low Supply Alert
          </span>
          <span className={`heavy-type text-2xl block mt-0.5 ${
            lowSupplyMeds.length > 0 ? 'text-amber-600 font-black' : 'text-emerald-600'
          }`}>
            {lowSupplyMeds.length}
          </span>
        </div>

        <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-200 text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-800 block">
            Refills Requested
          </span>
          <span className="heavy-type text-2xl text-blue-600 block mt-0.5">
            {requestedMeds.length}
          </span>
        </div>
      </div>

      {/* Medication Supply Table / List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-500 px-1">
          <span>Medication Inventory Summary</span>
          {onNavigateToMedications && (
            <button
              onClick={onNavigateToMedications}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 hover:underline"
            >
              <span>Manage Full Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-200/80 border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-2xs">
          {medications.map((med) => {
            const qty = med.remainingQuantity ?? 10;
            const threshold = med.refillThreshold ?? 5;
            const isLow = qty <= threshold;

            return (
              <div 
                key={med.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isLow ? 'bg-amber-50/40' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className={`p-2 rounded-xl shrink-0 font-bold ${
                    isLow ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Pill className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-black uppercase tracking-wide text-xs text-slate-900 truncate">
                        {med.name}
                      </h4>
                      <span className="mono text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                        {med.dosage}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Rx #{med.rxNumber || 'RX-884201'} • {med.frequency}
                    </p>
                  </div>
                </div>

                {/* Right Quantity Counter & Action Buttons */}
                <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                  {/* Doses Counter */}
                  <div className="flex items-center space-x-1.5">
                    <span className={`mono text-xs font-black px-2.5 py-1 rounded-lg ${
                      isLow ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {qty} left
                    </span>

                    {/* Quick + / - Adjuster */}
                    {onUpdateQuantity && (
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden text-xs">
                        <button
                          onClick={() => onUpdateQuantity(med.id, Math.max(0, qty - 1))}
                          className="px-1.5 py-1 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="Decrease 1 dose"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onUpdateQuantity(med.id, qty + 1)}
                          className="px-1.5 py-1 hover:bg-slate-100 text-slate-700 transition-colors"
                          title="Increase 1 dose"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Refill Button or Status */}
                  {med.refillRequested ? (
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-900 font-black uppercase text-[10px] rounded-xl flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Requested</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenRefill(med)}
                      className={`px-3.5 py-1.5 rounded-xl font-black uppercase tracking-wider text-xs transition-all flex items-center space-x-1.5 ${
                        isLow
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-2xs'
                          : 'bg-slate-900 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Request Refill</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <RefillRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        medication={selectedMed}
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
