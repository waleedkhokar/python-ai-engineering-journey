export interface WritingScore {
  overall: number;
  grammar: number;
  cohesion: number;
  coherence: number;
  academicTone: number;
  vocabulary: number;
}

export interface AnalysisResult {
  overallAssessment: string;
  writingScore: WritingScore;
  strengths: string[];
  areasForImprovement: string[];
  mentorNotes: string;
  learningMode: string[];
  rewrite: string;
  integrityAdvice: string;
  growthReflection: string;
}

export const SCORE_LABELS: { key: keyof WritingScore; label: string }[] = [
  { key: 'overall', label: 'Overall' },
  { key: 'grammar', label: 'Grammar' },
  { key: 'cohesion', label: 'Cohesion' },
  { key: 'coherence', label: 'Coherence' },
  { key: 'academicTone', label: 'Academic Tone' },
  { key: 'vocabulary', label: 'Vocabulary' },
];

function clampScore(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === 'string' && v.trim().length > 0);
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function validateAnalysisResult(data: unknown): AnalysisResult {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid response shape');
  }
  const obj = data as Record<string, unknown>;
  const score = (obj.writingScore ?? {}) as Record<string, unknown>;

  return {
    overallAssessment: asString(obj.overallAssessment),
    writingScore: {
      overall: clampScore(score.overall),
      grammar: clampScore(score.grammar),
      cohesion: clampScore(score.cohesion),
      coherence: clampScore(score.coherence),
      academicTone: clampScore(score.academicTone),
      vocabulary: clampScore(score.vocabulary),
    },
    strengths: asStringArray(obj.strengths),
    areasForImprovement: asStringArray(obj.areasForImprovement),
    mentorNotes: asString(obj.mentorNotes),
    learningMode: asStringArray(obj.learningMode),
    rewrite: asString(obj.rewrite),
    integrityAdvice: asString(obj.integrityAdvice),
    growthReflection: asString(obj.growthReflection),
  };
}
