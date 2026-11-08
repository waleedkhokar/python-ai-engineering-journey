import { useRef, useState } from "react";
import type { DragEvent, FormEvent } from "react";
import { analyzeResume } from "./api";
import type { AnalysisResponse, ATSScoreDetail } from "./types";

const MAX_MB = 10;
const MIN_JOB_CHARS = 20;

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function chooseFile(candidate: File | undefined) {
    if (!candidate) return;
    const isAllowed = /\.(pdf|docx)$/i.test(candidate.name);
    if (!isAllowed) {
      setError("Please choose a PDF or DOCX file.");
      return;
    }
    if (candidate.size > MAX_MB * 1024 * 1024) {
      setError(`The file must be ${MAX_MB} MB or smaller.`);
      return;
    }
    setError(null);
    setFile(candidate);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files[0]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) return setError("Upload a resume first.");
    if (jobText.trim().length < MIN_JOB_CHARS) {
      return setError("Paste the full job description (at least a few sentences).");
    }
    setLoading(true);
    setError(null);
    try {
      setResult(await analyzeResume(file, jobText));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Resume Analyzer</h1>
        <p>Compare your resume with a job description and see what to improve. Runs locally, with no paid API.</p>
      </header>

      <main>
        {!result ? (
          <form className="card" onSubmit={handleSubmit}>
            <h2>1. Upload your resume</h2>
            <div
              className={`dropzone ${dragging ? "dragging" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx"
                hidden
                onChange={(e) => chooseFile(e.target.files?.[0])}
              />
              {file ? (
                <span>{file.name} ({Math.max(1, Math.round(file.size / 1024))} KB). Click to replace.</span>
              ) : (
                <span>Drag a PDF or DOCX here, or click to browse.</span>
              )}
            </div>

            <h2>2. Paste the job description</h2>
            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Paste the full job posting here..."
              rows={10}
            />
            <p className="hint">{jobText.length} characters</p>

            {error && <p className="error" role="alert">{error}</p>}

            <button type="submit" className="primary" disabled={loading}>
              {loading ? "Analysing..." : "Analyse resume"}
            </button>
          </form>
        ) : (
          <Results data={result} onReset={reset} />
        )}
      </main>

      <footer className="app-footer">Scores are heuristic guides, not a guarantee of how any applicant tracking system will rank you.</footer>
    </div>
  );
}

function Results({ data, onReset }: { data: AnalysisResponse; onReset: () => void }) {
  const { ats_score: ats, skill_comparison: skills, feedback } = data;
  const color = ats.overall_score >= 75 ? "var(--good)" : ats.overall_score >= 55 ? "var(--warn)" : "var(--bad)";

  return (
    <section className="results">
      <div className="card summary">
        <div className="gauge" style={{ background: `conic-gradient(${color} ${ats.overall_score * 3.6}deg, var(--track) 0)` }}>
          <div className="gauge-inner">
            <strong>{ats.overall_score}</strong>
            <span>ATS score</span>
          </div>
        </div>
        <div>
          <h2>{data.job_description.title}{data.job_description.company !== "Not specified" ? ` at ${data.job_description.company}` : ""}</h2>
          <p>{feedback.overall_feedback}</p>
          <button type="button" onClick={onReset}>Analyse another resume</button>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Section scores</h3>
          {ats.details.map((detail) => (
            <ScoreBar key={detail.category} detail={detail} />
          ))}
        </div>

        <div className="card">
          <h3>Skill match: {skills.match_percentage}% of required skills</h3>
          <SkillGroup title="Matching" items={skills.matching_skills.map((m) => m.skill)} tone="good" />
          <SkillGroup title="Missing" items={skills.missing_skills} tone="bad" />
          <SkillGroup title="Additional" items={skills.additional_skills} tone="neutral" />
        </div>
      </div>

      <div className="grid">
        <List title="Strengths" items={feedback.strengths} />
        <List title="Weaknesses" items={feedback.weaknesses} />
      </div>

      <div className="card">
        <h3>Suggested improvements</h3>
        <ul className="suggestions">
          {feedback.suggestions.map((s, i) => (
            <li key={i}>
              <span className={`badge ${s.priority}`}>{s.priority}</span> {s.suggestion}
            </li>
          ))}
        </ul>
      </div>

      {feedback.language_suggestions.length > 0 && (
        <List title="Wording" items={feedback.language_suggestions} />
      )}

      {ats.recommendations.length > 0 && <List title="Top actions" items={ats.recommendations} />}
    </section>
  );
}

function ScoreBar({ detail }: { detail: ATSScoreDetail }) {
  return (
    <div className="bar-row">
      <div className="bar-label">
        <span>{detail.category}</span>
        <span>{detail.score}</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${detail.score}%` }} />
      </div>
    </div>
  );
}

function SkillGroup({ title, items, tone }: { title: string; items: string[]; tone: "good" | "bad" | "neutral" }) {
  return (
    <div className="skill-group">
      <h4>{title} ({items.length})</h4>
      {items.length === 0 ? <p className="hint">None</p> : (
        <div className="chips">
          {items.map((item) => (
            <span key={item} className={`chip ${tone}`}>{item}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
