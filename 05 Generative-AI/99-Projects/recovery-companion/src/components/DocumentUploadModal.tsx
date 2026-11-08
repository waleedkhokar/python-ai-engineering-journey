import React from 'react';
import { X } from 'lucide-react';
import { DischargePlan, SampleReport } from '../types';
import { LocalUser } from '../lib/firestoreService';
import { ManualRecoveryPlanGenerator } from './ManualRecoveryPlanGenerator';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanGenerated: (plan: DischargePlan) => void;
  onSelectSampleReport?: (sample: SampleReport) => void;
  currentUser?: LocalUser | null;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onPlanGenerated,
  currentUser
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-50 rounded-3xl border border-slate-200 shadow-2xl p-4 sm:p-6 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full transition-all"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Manual Plan Generator */}
        <ManualRecoveryPlanGenerator
          currentUser={currentUser}
          onPlanGenerated={(plan) => {
            onPlanGenerated(plan);
            onClose();
          }}
        />
      </div>
    </div>
  );
};
