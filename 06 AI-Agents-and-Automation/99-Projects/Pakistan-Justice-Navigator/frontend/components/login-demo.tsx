"use client";

import { FormEvent, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "./icons";

const DEMO_KEY = "pjn:demo-user:v1";

export function LoginDemo() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const cleanEmail = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Enter a valid email address for the demo profile.");
      return;
    }
    window.localStorage.setItem(DEMO_KEY, JSON.stringify({ name: name.trim() || "Citizen", email: cleanEmail, mode: "demo" }));
    router.push("/dashboard");
  }

  return (
    <div className="login-stage">
      <div className="login-architecture" aria-hidden="true"><span /><span /><span /></div>
      <section className="login-copy">
        <span className="cinema-kicker">RETURN TO YOUR CASE —</span>
        <h1>Your legal story stays <em>organized.</em></h1>
        <p>For this demo, your profile stays on this browser so you can explore the case journey without creating a real account.</p>
        <div className="login-proof">
          <div><Icon name="shield" size={18} /><span><strong>Private by design</strong><small>Only add what is necessary.</small></span></div>
          <div><Icon name="book" size={18} /><span><strong>Source-aware</strong><small>Official provenance remains visible.</small></span></div>
          <div><Icon name="document" size={18} /><span><strong>Case continuity</strong><small>Continue drafts and briefs.</small></span></div>
        </div>
      </section>
      <form className="login-panel" onSubmit={submit}>
        <div className="login-panel-head"><Icon name="scale" size={24} /><span>DEMO ACCESS</span></div>
        <h2>Welcome back.</h2>
        <p>Enter your name and email to preview the citizen dashboard.</p>
        <label><span>Name</span><input value={name} onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)} placeholder="Your name" autoComplete="name" /></label>
        <label><span>Email</span><input value={email} onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} placeholder="you@example.com" type="email" autoComplete="email" /></label>
        {error ? <div className="inline-form-error" role="alert">{error}</div> : null}
        <button type="submit" className="cinema-button primary full">Continue to dashboard <Icon name="arrow" size={18} /></button>
        <small className="login-disclaimer">Demo only — no password is collected on this screen.</small>
        <Link href="/" className="quiet-back">← Back to experience</Link>
      </form>
    </div>
  );
}
