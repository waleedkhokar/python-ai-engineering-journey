export interface CVAnalysisResponse {
  filename?: string; // <--- Make sure this is here for batch files
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  experience_gaps: string[];
  ats_issues: string[];
  suggested_improvements: string[];
  interview_questions: string[];
}