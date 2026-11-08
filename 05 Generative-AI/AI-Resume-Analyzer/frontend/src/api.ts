import type { AnalysisResponse } from "./types";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000";

/** Sends the resume and job description to the backend and returns the analysis. */
export async function analyzeResume(file: File, jobDescription: string): Promise<AnalysisResponse> {
  const form = new FormData();
  form.append("resume_file", file);
  form.append("job_description", jobDescription);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/v1/analyze`, { method: "POST", body: form });
  } catch {
    throw new Error("Could not reach the analysis server. Check that the backend is running.");
  }

  if (!response.ok) {
    let detail = "Something went wrong while analysing the resume.";
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      // Keep the default message when the body is not JSON.
    }
    throw new Error(detail);
  }
  return (await response.json()) as AnalysisResponse;
}
