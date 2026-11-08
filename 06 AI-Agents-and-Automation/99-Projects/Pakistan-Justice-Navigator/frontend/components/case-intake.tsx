"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { clearIntakeDraft, loadIntakeDraft, saveCase, saveIntakeDraft } from "@/lib/case-store";
import type { CaseDocument, CaseDraft, Language, TriageResult } from "@/lib/types";
import { Icon } from "./icons";

const copy = {
  en: {
    eyebrow: "GUIDED CASE INTAKE — STEP",
    title: "Tell us what happened.",
    subtitle: "Use everyday language. You do not need legal terminology.",
    placeholder: "Example: My uncle is occupying inherited property. I have a registry copy and a legal notice...",
    analyze: "Organize my situation",
    clarify: "Let’s clarify one thing at a time.",
    documents: "Add documents if you have them",
    documentHelp: "Choose only documents related to this matter. You can continue without attaching anything.",
    finish: "Create my case brief"
  },
  "roman-ur": {
    eyebrow: "GUIDED CASE INTAKE — STEP",
    title: "Jo hua, apne alfaaz mein batayein.",
    subtitle: "Legal alfaaz ki zaroorat nahin — simple Roman Urdu bilkul theek hai.",
    placeholder: "Misal: Mere chacha inherited property par qabza kiye hue hain. Mere paas registry copy aur legal notice hai...",
    analyze: "Mera masla organize karein",
    clarify: "Aik aik baat clear karte hain.",
    documents: "Agar documents hain to add karein",
    documentHelp: "Sirf is matter se related documents choose karein. Documents ke baghair bhi continue kar sakte hain.",
    finish: "Mera case brief banayein"
  },
  ur: {
    eyebrow: "رہنمائی کے ساتھ کیس اندراج — مرحلہ",
    title: "جو ہوا، اپنے الفاظ میں بتائیں۔",
    subtitle: "قانونی اصطلاحات ضروری نہیں — سادہ انداز میں مسئلہ لکھیں۔",
    placeholder: "مثال: میرے چچا وراثتی جائیداد پر قابض ہیں اور میرے پاس رجسٹری اور قانونی نوٹس موجود ہے۔۔۔",
    analyze: "میرا معاملہ ترتیب دیں",
    clarify: "ایک ایک بات واضح کرتے ہیں۔",
    documents: "اگر دستاویزات ہیں تو شامل کریں",
    documentHelp: "صرف اسی معاملے سے متعلق دستاویزات منتخب کریں۔ بغیر دستاویز کے بھی آگے بڑھ سکتے ہیں۔",
    finish: "میرا کیس خلاصہ بنائیں"
  }
} as const;

const languages: { id: Language; label: string; note: string }[] = [
  { id: "en", label: "English", note: "EN" },
  { id: "roman-ur", label: "Roman Urdu", note: "RU" },
  { id: "ur", label: "اردو", note: "UR" }
];

function whyWeAsk(type: "text" | "yes_no" | "date") {
  if (type === "date") return "Dates can affect chronology and possible deadlines, but they still need source or professional verification.";
  if (type === "yes_no") return "This helps separate what is known from what still needs evidence.";
  return "This detail helps organize the brief so a reviewer can understand the situation faster.";
}

export function CaseIntake() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("roman-ur");
  const [step, setStep] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [description, setDescription] = useState("");
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [saveLabel, setSaveLabel] = useState("Draft ready");
  const ui = copy[language];

  const canAnalyze = description.trim().length >= 20;
  const activeQuestion = triage?.followUpQuestions[questionIndex];
  const answeredCount = useMemo(() => triage ? triage.followUpQuestions.filter((q) => answers[q.id]?.trim()).length : 0, [answers, triage]);

  useEffect(() => {
    const saved = loadIntakeDraft();
    if (saved) {
      setLanguage(saved.language);
      setStep(Math.min(4, Math.max(1, saved.step)));
      setDescription(saved.description);
      setAnswers(saved.answers);
      setDocuments(saved.documents ?? []);
      setTriage(saved.triage);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setSaveLabel("Saving…");
    const id = window.setTimeout(() => {
      saveIntakeDraft({ version: 2, language, step, description, answers, documents, triage, updatedAt: new Date().toISOString() });
      setSaveLabel("Saved just now");
    }, 450);
    return () => window.clearTimeout(id);
  }, [answers, description, documents, hydrated, language, step, triage]);

  async function analyze() {
    if (!canAnalyze || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ description, language })
      });
      if (!response.ok) throw new Error("Triage request failed");
      const result = (await response.json()) as TriageResult;
      // Answers are keyed by question id, and ids (e.g. "q1") are reused across triage engines.
      // Only keep answers when the question set is unchanged, so they never attach to a different question.
      const questionKey = (list: TriageResult["followUpQuestions"]) => list.map((q) => `${q.id}:${q.prompt}`).join("|");
      if (!triage || questionKey(triage.followUpQuestions) !== questionKey(result.followUpQuestions)) setAnswers({});
      setTriage(result);
      setQuestionIndex(0);
      setStep(result.followUpQuestions.length ? 2 : 3);
    } catch {
      setError("We couldn’t organize your story right now. Your text is still saved — retry when you’re ready.");
    } finally {
      setLoading(false);
    }
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incoming: CaseDocument[] = Array.from(fileList).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      status: "selected"
    }));
    setDocuments((current) => {
      const byKey = new Map(current.map((file) => [`${file.name}-${file.size}`, file]));
      incoming.forEach((file) => byKey.set(`${file.name}-${file.size}`, file));
      return [...byKey.values()].slice(0, 5);
    });
  }

  function removeFile(name: string, size: number) {
    setDocuments((current) => current.filter((file) => !(file.name === name && file.size === size)));
  }

  function answerCurrent(value: string) {
    if (!activeQuestion) return;
    setAnswers((old) => ({ ...old, [activeQuestion.id]: value }));
  }

  function nextQuestion() {
    if (!triage) return;
    if (questionIndex < triage.followUpQuestions.length - 1) setQuestionIndex((index) => index + 1);
    else setStep(3);
  }

  async function finishCase() {
    if (!triage || !consent || loading) return;
    setLoading(true);
    setError("");
    const now = new Date().toISOString();
    // Date.now() suffixes repeat every ~1000 s and would overwrite an earlier case with the same id.
    const caseId = `PJN-${Date.now().toString(36).toUpperCase().slice(-4)}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const draft: CaseDraft = {
      caseId,
      language,
      description,
      answers,
      documents,
      triage,
      consentAcknowledged: true,
      createdAt: now,
      updatedAt: now
    };
    try {
      await saveCase(draft);
      clearIntakeDraft();
      router.push(`/case/${caseId}`);
    } catch {
      setError("Your brief could not be saved. Your intake draft is still available, so nothing you typed has been lost.");
      setLoading(false);
    }
  }

  if (!hydrated) return <div className="intake-loading surface-card">Restoring your draft —</div>;

  return (
    <div className="intake-layout" dir={language === "ur" ? "rtl" : "ltr"}>
      <aside className="step-rail surface-card" dir="ltr">
        <div className="rail-top"><span className="eyebrow">CASE PREPARATION —</span><span className="save-state"><Icon name="check" size={14} /> {saveLabel}</span></div>
        <div className="rail-steps">
          {[["01", "Describe"], ["02", "Clarify"], ["03", "Documents"], ["04", "Review"]].map(([number, label], index) => {
            const current = index + 1 === step;
            const done = index + 1 < step;
            return <button type="button" onClick={() => done && setStep(index + 1)} disabled={!done} className={current ? "rail-step rail-current" : done ? "rail-step rail-done" : "rail-step"} key={number}><span>{done ? "✓" : number}</span><strong>{label}</strong></button>;
          })}
        </div>
        <div className="rail-rule">— — — —</div>
        <p>Preliminary organization is kept separate from verified evidence and professional legal advice.</p>
        <Link href="/dashboard" className="quiet-link">Exit — draft is saved</Link>
      </aside>

      <section className="intake-stage">
        <div className="language-row" dir="ltr" aria-label="Language">
          {languages.map((item) => <button type="button" key={item.id} onClick={() => setLanguage(item.id)} className={language === item.id ? "language-pill active" : "language-pill"}><span>{item.note}</span>{item.label}</button>)}
        </div>

        {error && <div className="error-panel" role="alert"><span>!</span><div><strong>Something needs attention</strong><p>{error}</p></div>{step === 1 && <button type="button" className="text-button" onClick={analyze}>Retry</button>}</div>}

        {step === 1 && (
          <div className="intake-card depth-card step-enter">
            <span className="eyebrow">{ui.eyebrow} 01</span>
            <h1>{ui.title}</h1>
            <p className="lede">{ui.subtitle}</p>
            <div className="privacy-box"><Icon name="shield" size={20} /><div><strong>Share only what is necessary.</strong><p>Your draft is autosaved so you can leave and return. Never enter passwords, banking PINs, or unrelated private information.</p></div></div>
            <label className="big-input">
              <span>YOUR STORY —</span>
              <textarea value={description} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)} placeholder={ui.placeholder} rows={8} />
              <small>{description.trim().length} characters — at least 20 helps us understand enough to ask useful questions.</small>
            </label>
            <div className="action-row">
              <Link href="/dashboard" className="button button-quiet">Save & exit</Link>
              <button type="button" className="button button-primary" disabled={!canAnalyze || loading} onClick={analyze}>{loading ? "Organizing…" : ui.analyze} <Icon name="arrow" size={18} /></button>
            </div>
          </div>
        )}

        {step === 2 && triage && activeQuestion && (
          <div className="intake-card depth-card step-enter">
            <div className="split-heading">
              <div><span className="eyebrow">{ui.eyebrow} 02</span><h2>{ui.clarify}</h2></div>
              <span className={`review-priority priority-${triage.urgency}`}>Review priority: {triage.urgency}</span>
            </div>
            <p className="priority-help">This is a workflow priority for review — not a legal finding or verified deadline.</p>
            {triage.mode !== "backend" && <p className="priority-help" role="status">Organized by the built-in preliminary engine — the legal triage service is not connected or was unavailable right now.</p>}
            <div className="mini-summary"><span className="provenance-pill reported">YOU REPORTED</span><strong>{triage.category}</strong><p>{triage.summary}</p></div>

            <div className="conversation-progress"><span>Question {questionIndex + 1} of {triage.followUpQuestions.length}</span><div><i style={{ width: `${((questionIndex + 1) / triage.followUpQuestions.length) * 100}%` }} /></div></div>
            <div className="conversation-card" key={activeQuestion.id}>
              <span className="question-number">— {String(questionIndex + 1).padStart(2, "0")}</span>
              <h3>{activeQuestion.prompt}</h3>
              <p className="why-note">Why we ask — {whyWeAsk(activeQuestion.type)}</p>
              {activeQuestion.type === "yes_no" ? (
                <div className="choice-row">
                  {["Yes", "No", "Not sure"].map((value) => <button type="button" key={value} className={answers[activeQuestion.id] === value ? "choice active" : "choice"} onClick={() => answerCurrent(value)}>{value}</button>)}
                </div>
              ) : (
                <input className="answer-input" type={activeQuestion.type === "date" ? "date" : "text"} value={answers[activeQuestion.id] ?? ""} onChange={(event: ChangeEvent<HTMLInputElement>) => answerCurrent(event.target.value)} placeholder={activeQuestion.type === "text" ? "Type your answer" : undefined} />
              )}
            </div>

            {answeredCount > 0 && <div className="answered-ledger"><span>{answeredCount} answer{answeredCount === 1 ? "" : "s"} captured</span><button type="button" className="text-button" onClick={() => setQuestionIndex(0)}>Review from the first question</button></div>}
            <div className="action-row">
              <button type="button" className="button button-quiet" onClick={() => questionIndex ? setQuestionIndex((index) => index - 1) : setStep(1)}>Back</button>
              <div className="action-cluster">
                <button type="button" className="text-button" onClick={nextQuestion}>Skip this question</button>
                <button type="button" className="button button-primary" onClick={nextQuestion} disabled={!answers[activeQuestion.id]?.trim()}>Continue <Icon name="arrow" size={18} /></button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && triage && (
          <div className="intake-card depth-card step-enter">
            <span className="eyebrow">{ui.eyebrow} 03</span>
            <h2>{ui.documents}</h2>
            <p className="lede">{ui.documentHelp}</p>
            <div className="privacy-box compact"><Icon name="shield" size={19} /><div><strong>Document status stays explicit.</strong><p>Files selected here are listed for the case. They are not described as analyzed unless a document service actually confirms analysis.</p></div></div>
            <label className="dropzone">
              <Icon name="upload" size={32} />
              <strong>Choose related PDF or image files</strong>
              <span>Up to 5 files — PDF, JPG or PNG</span>
              <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" onChange={(event: ChangeEvent<HTMLInputElement>) => handleFiles(event.target.files)} />
            </label>

            {documents.length > 0 && <div className="file-list">{documents.map((file) => (
              <div className="file-row" key={`${file.name}-${file.size}`}>
                <span className="file-icon"><Icon name="document" size={18} /></span>
                <div><strong>{file.name}</strong><small>{Math.max(1, Math.round(file.size / 1024))} KB — selected for this case</small></div>
                <span className="status status-neutral">Not analyzed</span>
                <button type="button" className="remove-file" onClick={() => removeFile(file.name, file.size)} aria-label={`Remove ${file.name}`}>Remove</button>
              </div>
            ))}</div>}

            <div className="suggested-docs"><span className="eyebrow">MAY BE USEFUL —</span><div className="tag-row">{triage.suggestedDocuments.map((doc) => <span className="tag" key={doc}>{doc}</span>)}</div></div>
            <div className="action-row">
              <button type="button" className="button button-quiet" onClick={() => setStep(triage.followUpQuestions.length ? 2 : 1)}>Back</button>
              <div className="action-cluster"><button type="button" className="text-button" onClick={() => setStep(4)}>Continue without documents</button><button type="button" className="button button-primary" onClick={() => setStep(4)}>Review brief <Icon name="arrow" size={18} /></button></div>
            </div>
          </div>
        )}

        {step === 4 && triage && (
          <div className="intake-card depth-card step-enter">
            <span className="eyebrow">{ui.eyebrow} 04</span>
            <h2>Review before creating the brief.</h2>
            <p className="lede">The result will clearly separate your statements, AI-organized review points, document status and official-source context.</p>
            <div className="review-grid">
              <div className="review-block"><span>Case category</span><strong>{triage.category}</strong></div>
              <div className="review-block"><span>Questions answered</span><strong>{answeredCount} / {triage.followUpQuestions.length}</strong></div>
              <div className="review-block"><span>Files selected</span><strong>{documents.length}</strong></div>
            </div>
            <label className="consent-card"><input type="checkbox" checked={consent} onChange={(event: ChangeEvent<HTMLInputElement>) => setConsent(event.target.checked)} /><span><strong>I understand this is case-preparation support, not legal representation.</strong><small>Important rights, deadlines, evidence and legal strategy should be verified from original sources and, where appropriate, with a qualified lawyer.</small></span></label>
            <div className="guardrail"><Icon name="shield" size={20} /><p>{triage.guardrail}</p></div>
            <div className="action-row"><button type="button" className="button button-quiet" onClick={() => setStep(3)}>Back</button><button type="button" className="button button-accent" onClick={finishCase} disabled={!consent || loading}>{loading ? "Saving brief…" : ui.finish} <Icon name="arrow" size={18} /></button></div>
          </div>
        )}
      </section>
    </div>
  );
}
