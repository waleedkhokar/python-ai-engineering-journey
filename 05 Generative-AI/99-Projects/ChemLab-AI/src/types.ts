export interface Experiment {
  id: string;
  name: string;
  category: string;
  description: string;
  aim: string;
  principle: string;
  chemicals: string[];
  apparatus: string[];
  procedure: string[];
  expectedObservations: string[];
  safetyPrecautions: string[];
  commonMistakes: string[];
  keyPoints: string[];
  keywords: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  experimentContextName?: string;
  isGuardrailRefusal?: boolean;
}

export interface VivaQuestion {
  id: number;
  question: string;
  answer: string;
  topic?: string;
}

export interface RevisionSummaryData {
  objective: string;
  corePrinciple: string;
  importantChemicals: string[];
  importantApparatus: string[];
  keyProcedurePoints: string[];
  importantObservations: string[];
  importantSafetyPrecautions: string[];
  commonMistakes: string[];
  keyPointsToRemember: string[];
}

export type ViewMode = 'home' | 'experiments' | 'experiment-detail' | 'assistant';
