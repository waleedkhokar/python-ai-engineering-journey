export type AppLanguage = 'en' | 'ur' | 'roman_urdu';

export type ScreenState = 'landing' | 'upload' | 'analysis' | 'overview' | 'guided' | 'summary' | 'export' | 'about';

export type FieldCategoryGroup = 'personal' | 'contact' | 'education' | 'documents' | 'other';

export type FieldType = 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'file' | 'textarea';

export interface LocalizedText {
  en: string;
  ur: string;
  roman_urdu: string;
}

export interface FieldPosition {
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  widthPercent?: number;
  fontSize?: number;
}

export interface FormField {
  id: string;
  fieldName: string;
  originalText: string;
  explanation: LocalizedText;
  fieldType: FieldType;
  isRequired: boolean;
  isConfusing: boolean;
  exampleValue: string;
  value?: string | null;
  matchConfidence?: 'high' | 'medium' | 'low' | 'not_applicable';
  commonMistakes: LocalizedText;
  categoryGroup: FieldCategoryGroup;
  options?: string[];
  position?: FieldPosition;
}

export interface RequiredDocument {
  id: string;
  documentName: string;
  isExplicitlyRequired: boolean; // Explicit vs Likely required
  reason: LocalizedText;
  tip: LocalizedText;
  isReady?: boolean;
}

export interface FormAnalysisResult {
  isForm?: boolean;
  notFormReason?: string;
  formTitle: string;
  formDescription: LocalizedText;
  category: string;
  fields: FormField[];
  documents: RequiredDocument[];
  statedDocuments?: string[];
  overallTips: LocalizedText;
  detectedLanguage?: string;
  imagePreviewUrl?: string;
}

export interface UserAnswer {
  fieldId: string;
  value: string;
  isConfirmed: boolean;
  confidenceScore?: number;
  validationMessage?: string;
  notes?: string;
}

export interface SampleFormTemplate {
  id: string;
  title: string;
  category: string;
  description: LocalizedText;
  badge: string;
  imageUrl: string;
  data: FormAnalysisResult;
}
