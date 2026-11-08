"use client";

import { useEffect, useMemo, useState } from "react";
import { deleteDraft, listDrafts, saveDraft, type SavedDraft } from "@/lib/draft-store";
import { DRAFT_TEMPLATES } from "@/lib/drafting-templates";
import { Notice, PageHeader, formatDate } from "./app-ui";
import { Icon } from "./icons";

function newId() {
  return `DR-${Date.now().toString(36).toUpperCase()}`;
}

export function DraftingStudio() {
  const [templateId, setTemplateId] = useState(DRAFT_TEMPLATES[0].id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"fill" | "review">("fill");
  const [body, setBody] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [draftId, setDraftId] = useState(newId);
  const [saved, setSaved] = useState<SavedDraft[]>([]);
  const [message, setMessage] = useState("");

  const template = useMemo(() => DRAFT_TEMPLATES.find((item) => item.id === templateId) ?? DRAFT_TEMPLATES[0], [templateId]);

  useEffect(() => setSaved(listDrafts()), []);

  function choose(id: string) {
    setTemplateId(id);
    setValues({});
    setStep("fill");
    setReviewed(false);
    setDraftId(newId());
    setMessage("");
  }

  function generate() {
    setBody(template.build(values));
    setReviewed(false);
    setStep("review");
    setMessage("");
  }

  function persist() {
    setSaved(saveDraft({ id: draftId, templateId, title: template.name, body, reviewed }));
    setMessage("Draft saved in this browser.");
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(body);
      setMessage("Copied to clipboard.");
    } catch {
      setMessage("Copy was blocked by the browser. Select the text and copy it manually.");
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${template.id}-${draftId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function open(draft: SavedDraft) {
    setTemplateId(draft.templateId);
    setDraftId(draft.id);
    setBody(draft.body);
    setReviewed(draft.reviewed);
    setStep("review");
    setMessage("");
  }

  return (
    <div className="app-page">
      <PageHeader eyebrow="Draft Documents" title="Prepare a document" lede="Choose a template, fill in your details, then review and edit the text before you use it." />

      <div className="app-steps" aria-label="Progress">
        <span className={step === "fill" ? "is-current" : "is-done"}>1 · Details</span>
        <span className={step === "review" ? "is-current" : ""}>2 · Review &amp; edit</span>
      </div>

      <div className="app-draft-layout">
        <div className="app-card">
          <fieldset className="app-templates">
            <legend>Document type</legend>
            {DRAFT_TEMPLATES.map((item) => (
              <label key={item.id} className={item.id === templateId ? "is-selected" : ""}>
                <input type="radio" name="template" value={item.id} checked={item.id === templateId} onChange={() => choose(item.id)} />
                <strong>{item.name}</strong>
                <small>{item.summary}</small>
              </label>
            ))}
          </fieldset>

          {step === "fill" ? (
            <form className="app-form" onSubmit={(event) => { event.preventDefault(); generate(); }}>
              {template.fields.map((field) => (
                <label key={field.id} className="app-field">
                  <span>{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea rows={3} value={values[field.id] ?? ""} placeholder={field.placeholder} onChange={(event) => setValues({ ...values, [field.id]: event.target.value })} />
                  ) : (
                    <input type={field.type ?? "text"} value={values[field.id] ?? ""} placeholder={field.placeholder} onChange={(event) => setValues({ ...values, [field.id]: event.target.value })} />
                  )}
                  {field.hint && <small>{field.hint}</small>}
                </label>
              ))}
              <p className="app-fine">Avoid entering ID numbers or other sensitive details you do not need. Unfilled fields stay as blanks in the draft.</p>
              <button type="submit" className="app-btn app-btn-primary">Generate draft <Icon name="arrow" size={16} /></button>
            </form>
          ) : (
            <div className="app-review">
              <label className="app-field">
                <span>Draft text (editable)</span>
                <textarea className="app-draft-text" rows={20} value={body} onChange={(event) => { setBody(event.target.value); setReviewed(false); }} />
              </label>
              <label className="app-check">
                <input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} />
                <span>I have read and corrected this draft, and understand it should be checked by a qualified lawyer before use.</span>
              </label>
              <div className="app-btn-row">
                <button type="button" className="app-btn app-btn-ghost" onClick={() => setStep("fill")}>← Edit details</button>
                <button type="button" className="app-btn app-btn-ghost" onClick={persist}>Save draft</button>
                <button type="button" className="app-btn app-btn-primary" disabled={!reviewed} onClick={copy}>Copy</button>
                <button type="button" className="app-btn app-btn-gold" disabled={!reviewed} onClick={download}>Download .txt</button>
              </div>
              {!reviewed && <p className="app-fine">Copy and download unlock once you confirm the review above.</p>}
              {message && <p className="app-status" role="status">{message}</p>}
            </div>
          )}
        </div>

        <aside className="app-card">
          <div className="app-card-head"><h2>Saved drafts</h2></div>
          {saved.length === 0 ? (
            <p className="app-fine">Nothing saved yet. Drafts you save stay in this browser only.</p>
          ) : (
            <ul className="app-list">
              {saved.map((draft) => (
                <li key={draft.id} className="app-list-row">
                  <button type="button" onClick={() => open(draft)}>
                    <span className="app-list-icon"><Icon name="document" size={16} /></span>
                    <div><strong>{draft.title}</strong><small>{draft.id} · {formatDate(draft.updatedAt)}{draft.reviewed ? " · reviewed" : ""}</small></div>
                  </button>
                  <button type="button" className="app-icon-btn" aria-label={`Delete draft ${draft.id}`} onClick={() => setSaved(deleteDraft(draft.id))}><Icon name="close" size={14} /></button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      <Notice>Templates are general starting points and are not tailored to your facts or to any particular court&apos;s requirements. Stamp paper, attestation and format rules vary — confirm them with a lawyer or the relevant office.</Notice>
    </div>
  );
}
