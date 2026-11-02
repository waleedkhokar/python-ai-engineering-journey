"use client";

import { useEffect, useState } from "react";
import { Notice, PageHeader } from "./app-ui";

const USER_KEY = "pjn:demo-user:v1";
const DRAFTS_KEY = "pjn:drafts:v1";
const CASES_KEY = "pjn:cases:v2";

export function SettingsPanel() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(window.localStorage.getItem(USER_KEY) ?? "null") as { name?: string } | null;
      setName(user?.name ?? "");
    } catch {
      setName("");
    }
  }, []);

  function saveName() {
    try {
      const current = JSON.parse(window.localStorage.getItem(USER_KEY) ?? "null") as Record<string, unknown> | null;
      window.localStorage.setItem(USER_KEY, JSON.stringify({ email: "", mode: "demo", ...current, name: name.trim() }));
      setMessage("Saved.");
    } catch {
      setMessage("Could not save in this browser.");
    }
  }

  function clearLocal() {
    if (!window.confirm("Delete saved drafts and locally stored cases from this browser? This cannot be undone.")) return;
    window.localStorage.removeItem(DRAFTS_KEY);
    window.localStorage.removeItem(CASES_KEY);
    setMessage("Local drafts and cases deleted.");
  }

  return (
    <div className="app-page">
      <PageHeader eyebrow="Settings" title="Preferences" lede="Everything here applies to this browser only." />

      <section className="app-grid-2">
        <div className="app-card">
          <div className="app-card-head"><h2>Display name</h2></div>
          <form className="app-form" onSubmit={(event) => { event.preventDefault(); saveName(); }}>
            <label className="app-field"><span>Name shown on the dashboard</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={60} /></label>
            <button type="submit" className="app-btn app-btn-primary">Save name</button>
          </form>
        </div>
        <div className="app-card">
          <div className="app-card-head"><h2>Local data</h2></div>
          <p className="app-fine">Drafts and demo cases are stored in your browser&apos;s local storage. If an account backend is configured, cases saved there are not affected by this button.</p>
          <button type="button" className="app-btn app-btn-danger" onClick={clearLocal}>Delete local drafts &amp; cases</button>
        </div>
      </section>

      {message && <p className="app-status" role="status">{message}</p>}
      <Notice tone="green">Language for intake (English, Urdu, Roman Urdu) is chosen inside the guided intake for each case.</Notice>
    </div>
  );
}
