"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icons";

const scenes = [
  {
    label: "YOUR STORY",
    title: "“Mere chacha inherited property par qabza kiye hue hain…”",
    note: "Write naturally — English, Urdu or Roman Urdu."
  },
  {
    label: "ONE CLEAR QUESTION",
    title: "Do you have any ownership or inheritance documents?",
    note: "Yes  ·  No  ·  Not sure"
  },
  {
    label: "SOURCE CHECK",
    title: "Possible relevant law identified for verification",
    note: "Official title and source stay attached."
  }
];

export function HeroDemo() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setActive((value) => (value + 1) % scenes.length), 4200);
    return () => window.clearInterval(id);
  }, []);

  const scene = scenes[active];
  return (
    <div className="hero-product" aria-label="Example of the citizen case preparation flow">
      <div className="hero-product-head">
        <span className="product-dot" />
        <strong>CASE PREPARATION</strong>
        <span>01 / 04</span>
      </div>
      <div className="hero-product-body" key={active}>
        <span className="section-kicker">— {scene.label}</span>
        <h3>{scene.title}</h3>
        <p>{scene.note}</p>
      </div>
      <div className="hero-product-footer">
        <div className="progress-dots" aria-label={`Example step ${active + 1} of ${scenes.length}`}>
          {scenes.map((_, index) => (
            <button key={index} aria-label={`Show example ${index + 1}`} onClick={() => setActive(index)} className={index === active ? "active" : ""} />
          ))}
        </div>
        <span className="verified-chip"><Icon name="shield" size={15} /> Source-aware</span>
      </div>
    </div>
  );
}
