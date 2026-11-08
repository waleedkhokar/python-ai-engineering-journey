import React from 'react';
import { DischargePlan, SampleReport } from '../types';
import { LocalUser } from '../lib/firestoreService';
import { ManualRecoveryPlanGenerator } from './ManualRecoveryPlanGenerator';

interface UploadCenterViewProps {
  onPlanGenerated: (plan: DischargePlan) => void;
  onSelectSampleReport: (sample: SampleReport) => void;
  currentUser?: LocalUser | null;
}

export const UploadCenterView: React.FC<UploadCenterViewProps> = ({
  onPlanGenerated,
  currentUser
}) => {
  return (
    <div className="py-2">
      <ManualRecoveryPlanGenerator
        onPlanGenerated={onPlanGenerated}
        currentUser={currentUser}
      />
    </div>
  );
};
