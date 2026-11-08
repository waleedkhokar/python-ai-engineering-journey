// Mirrors the backend response models in backend/app/schemas.py.

export interface ATSScoreDetail {
  category: string;
  score: number;
  feedback: string[];
}

export interface SkillMatch {
  skill: string;
  match_score: number;
  method: string;
}

export interface SkillComparison {
  matching_skills: SkillMatch[];
  missing_skills: string[];
  additional_skills: string[];
  match_percentage: number;
}

export interface ImprovementSuggestion {
  category: string;
  suggestion: string;
  priority: "high" | "medium" | "low";
}

export interface AnalysisResponse {
  resume: {
    contact_info: { name: string | null; email: string | null };
    skills: string[];
  };
  job_description: {
    title: string;
    company: string;
    required_skills: string[];
    nice_to_have_skills: string[];
  };
  skill_comparison: SkillComparison;
  ats_score: {
    overall_score: number;
    details: ATSScoreDetail[];
    recommendations: string[];
  };
  feedback: {
    strengths: string[];
    weaknesses: string[];
    suggestions: ImprovementSuggestion[];
    language_suggestions: string[];
    overall_feedback: string;
  };
  generated_at: string;
}
