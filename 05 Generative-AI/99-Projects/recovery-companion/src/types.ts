export type LanguageCode = 'en' | 'ur' | 'es' | 'zh' | 'vi' | 'ar' | 'fr';

export interface SampleReport {
  id: string;
  title: string;
  category: string;
  hospitalName: string;
  patientName: string;
  dischargeDate: string;
  attendingPhysician: string;
  summaryPreview: string;
  rawText: string;
  badgeColor: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  genericName?: string;
  strength?: string; // e.g. 500mg, 10mg/5mL
  dose?: string; // e.g. 1 tablet, 2 puffs
  dosage: string;
  route: string; // e.g. Oral, Topical
  frequency: string; // e.g. Twice daily
  scheduleTime: 'morning' | 'afternoon' | 'evening' | 'bedtime' | 'as_needed';
  timeLabel: string; // e.g. 8:00 AM
  duration: string; // e.g. 7 days
  purpose: string;
  specialInstructions: string;
  sourceQuote: string;
  confidence: number; // 0-100
  takenToday: boolean;
  remainingQuantity?: number;
  totalQuantity?: number;
  pharmacyEmail?: string;
  pharmacyPhone?: string;
  rxNumber?: string;
  refillThreshold?: number;
  refillRequested?: boolean;
  history?: { date: string; taken: boolean; time?: string }[];
}

export interface FollowUpAppointment {
  id: string;
  providerName: string;
  specialty: string;
  location: string;
  address: string;
  phone: string;
  date: string;
  time: string;
  instructions: string;
  sourceQuote: string;
  reminderSet: boolean;
}

export interface DailyChecklistTask {
  id: string;
  category: 'wound_care' | 'activity' | 'nutrition' | 'medication' | 'symptom_check';
  categoryLabel: string;
  title: string;
  description: string;
  dayOffset: string; // e.g., "Days 1-3" or "Daily"
  completed: boolean;
  sourceQuote: string;
}

export interface WarningSign {
  id: string;
  level: 'emergency' | 'urgent_call' | 'monitor';
  symptom: string;
  actionRequired: string;
  sourceQuote: string;
  contactNumber?: string;
}

export interface ConfidenceScore {
  overallScore: number;
  medications: number;
  followUps: number;
  checklist: number;
  warningSigns: number;
  hasLowConfidenceFlag: boolean;
}

export interface DischargePlan {
  id: string;
  reportId: string;
  createdAt: string;
  patientName: string;
  hospitalName: string;
  dischargeDate: string;
  attendingPhysician: string;
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  proceduresPerformed: string[];
  plainLanguageSummary: string;
  keyRecoveryMilestones: string[];
  medicalTermsGlossary: { term: string; explanation: string }[];
  medications: MedicationItem[];
  followUps: FollowUpAppointment[];
  dailyTasks: DailyChecklistTask[];
  warningSigns: WarningSign[];
  confidence: ConfidenceScore;
  sourceDocumentText: string;
  medicalDisclaimerAcknowledged: boolean;
  caregiverShareCode?: string;
  entryMethod?: 'document' | 'manual_notes' | 'sample';
  isVerifiedDocument?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  groundedSourceQuote?: string;
}

export interface CaregiverShareConfig {
  shareCode: string;
  patientName: string;
  readOnly: boolean;
  expiresInDays: number;
  createdDate: string;
}
