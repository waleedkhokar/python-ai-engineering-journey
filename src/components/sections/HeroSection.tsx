import React from "react";
import OrbitDiagram from "./OrbitDiagram";

export default function HeroSection() {
  return (
    <section className="panel hero rv">
      <div className="hero-grid">
        <div className="hero-copy">
          <h1>
            <span>Start from zero.</span>
            <span className="g">Become job-ready.</span>
          </h1>
          <p>
            A complete, hands-on journey from Python fundamentals to AI engineering. Learn in order, build real projects, prepare for interviews, and use the free source code, notes, and projects on GitHub.
          </p>
        </div>
        <OrbitDiagram />
      </div>
    </section>
  );
}
