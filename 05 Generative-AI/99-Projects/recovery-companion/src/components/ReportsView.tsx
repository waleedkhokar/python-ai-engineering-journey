import React, { useState } from 'react';
import { 
  FileText, 
  Trash2, 
  Printer, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  PlusCircle, 
  User, 
  Building2, 
  Pill, 
  Calendar, 
  Clock, 
  ArrowRight,
  FolderOpen,
  Sparkles
} from 'lucide-react';
import { DischargePlan } from '../types';
import { LocalUser } from '../lib/firestoreService';

interface ReportsViewProps {
  currentUser?: LocalUser | null;
  savedPlans?: DischargePlan[];
  activePlanId?: string;
  onSelectPlan?: (plan: DischargePlan) => void;
  onDeletePlan?: (planId: string) => void;
  onCreateNewPlan?: () => void;
  onOpenPrintModal?: (plan: DischargePlan) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentUser,
  savedPlans = [],
  activePlanId,
  onSelectPlan,
  onDeletePlan,
  onCreateNewPlan,
  onOpenPrintModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlans = savedPlans.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      (p.patientName || '').toLowerCase().includes(q) ||
      (p.primaryDiagnosis || '').toLowerCase().includes(q) ||
      (p.hospitalName || '').toLowerCase().includes(q) ||
      (p.attendingPhysician || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center space-x-1">
              <FolderOpen className="w-3 h-3 text-blue-600" />
              <span>Saved Recovery Vault</span>
            </span>
            {currentUser && (
              <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[10px] font-bold">
                Logged in as {currentUser.email}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            Previous Recovery Plans
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl leading-relaxed">
            Manage your saved post-discharge recovery plans, view medication schedules, print PDF reports, or launch a blank recovery form.
          </p>
        </div>

        {onCreateNewPlan && (
          <button
            onClick={onCreateNewPlan}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-xs rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search saved plans by patient, diagnosis, or hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 w-full sm:w-auto justify-end">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Local Device Storage Encrypted</span>
        </div>
      </div>

      {/* Saved Plans Grid */}
      {filteredPlans.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">
              No Saved Recovery Plans Found
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">
              {searchQuery 
                ? `No plans match your search query "${searchQuery}".` 
                : 'You have no saved recovery plans yet. Click below to create your first personalized recovery plan.'}
            </p>
          </div>
          {onCreateNewPlan && (
            <button
              onClick={onCreateNewPlan}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all inline-flex items-center space-x-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Recovery Plan</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPlans.map((planItem) => {
            const isActive = planItem.id === activePlanId;
            const createdFormatted = planItem.createdAt 
              ? new Date(planItem.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
              : 'Recent';

            return (
              <div 
                key={planItem.id} 
                className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between ${
                  isActive ? 'border-blue-600 ring-2 ring-blue-600/10' : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-slate-900 text-base flex items-center gap-1.5">
                          <User className="w-4 h-4 text-blue-600" />
                          <span>{planItem.patientName || 'Unnamed Patient'}</span>
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-black text-[10px] uppercase rounded-md tracking-wider">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-600 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{planItem.hospitalName || 'Hospital'}</span>
                        {planItem.attendingPhysician && (
                          <span className="text-slate-400"> • Dr. {planItem.attendingPhysician}</span>
                        )}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shrink-0 bg-slate-100 px-2 py-1 rounded-lg">
                      <Calendar className="w-3 h-3" />
                      <span>{createdFormatted}</span>
                    </span>
                  </div>

                  {/* Diagnosis */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Diagnosis / Procedure</p>
                    <p className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-2">
                      {planItem.primaryDiagnosis || 'Post-Discharge Care Plan'}
                    </p>
                  </div>

                  {/* Stats Pill Row */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-600">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 flex items-center gap-1">
                      <Pill className="w-3 h-3 text-blue-600" />
                      <span>{(planItem.medications || []).length} Medicines</span>
                    </span>

                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{(planItem.dailyTasks || []).length} Daily Checklist</span>
                    </span>

                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-100 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-600" />
                      <span>{(planItem.followUps || []).length} Follow-ups</span>
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {onOpenPrintModal && (
                      <button
                        onClick={() => onOpenPrintModal(planItem)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                        title="Print / Export PDF"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        <span className="hidden sm:inline">Export PDF</span>
                      </button>
                    )}

                    {onDeletePlan && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete the recovery plan for "${planItem.patientName}"?`)) {
                            onDeletePlan(planItem.id);
                          }
                        }}
                        className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl transition-all border border-slate-200 cursor-pointer"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {onSelectPlan && (
                    <button
                      onClick={() => onSelectPlan(planItem)}
                      className={`px-4 py-2 font-black uppercase text-xs rounded-xl transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white hover:bg-slate-800'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
                      }`}
                    >
                      <span>{isActive ? 'Currently Active' : 'Load Dashboard'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
