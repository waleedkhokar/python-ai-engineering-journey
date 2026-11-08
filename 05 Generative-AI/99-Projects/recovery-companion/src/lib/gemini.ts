import { safeFetchJson } from './apiUtils';

export interface GeminiMedicalTerm {
  term: string;
  explanation: string;
}

export interface GeminiMedicationScheduleItem {
  timeSlot: string;
  medicationNames: string[];
  instructions?: string;
}

export interface GeminiMedication {
  name: string;
  dosage?: string;
  frequency?: string;
  instructions?: string;
  scheduleTime?: string;
  purpose?: string;
}

export interface GeminiFollowup {
  doctor?: string;
  specialty?: string;
  date?: string;
  time?: string;
  location?: string;
  instructions?: string;
}

export interface GeminiWarningSign {
  symptom?: string;
  actionRequired?: string;
  level?: string;
}

export interface GeminiChecklistItem {
  task?: string;
  category?: string;
  completed?: boolean;
}

export interface GeminiOcrParseResult {
  summary: string;
  medicalTerms: GeminiMedicalTerm[];
  medications: GeminiMedication[];
  medicationSchedule: GeminiMedicationScheduleItem[];
  followups: GeminiFollowup[];
  checklist: GeminiChecklistItem[];
  warningSigns: GeminiWarningSign[];
}

/**
 * Sends OCR extracted text to Gemini 3.6 Flash via server-side API.
 * Returns structured JSON containing summary, medical terms, medications, medication schedule, followups, checklist, and warning signs.
 */
export async function sendOcrToGemini(ocrText: string): Promise<GeminiOcrParseResult> {
  const data = await safeFetchJson('/api/parse-discharge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ocrText }),
  });

  if (data.structuredResult) {
    return data.structuredResult;
  }

  return {
    summary: data.summary || data.plan?.plainLanguageSummary || '',
    medicalTerms: data.medicalTerms || data.plan?.medicalTermsGlossary || [],
    medications: data.medications || data.plan?.medications || [],
    medicationSchedule: data.medicationSchedule || [],
    followups: data.followups || data.plan?.followUps || [],
    checklist: data.checklist || (data.plan?.dailyTasks || []).map((t: any) => ({
      task: t.title || t.description || '',
      category: t.category || 'general',
      completed: t.completed || false
    })),
    warningSigns: data.warningSigns || data.plan?.warningSigns || [],
  };
}
