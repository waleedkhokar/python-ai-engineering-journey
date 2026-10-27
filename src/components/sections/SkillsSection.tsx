import React from "react";
import { SKILL_GROUPS } from "@/lib/data";

export default function SkillsSection() {
  return (
    <section className="panel rv">
      <div className="sec-head">
        <h2>My Skills</h2>
        <p>
          The technologies and tools I use to build modern, scalable and efficient digital solutions &mdash; with the original brand icon for every tool that has one.
        </p>
      </div>
      <div className="skill-groups">
        {SKILL_GROUPS.map((g, i) => (
          <div key={i} className="skill-card">
            <h3>{g[0]}</h3>
            <div className="skill-chips">
              {g[1].map((s, idx) => (
                <span key={idx} className="skill-chip">
                  {s[1] && (
                    <img
                      src={`/assets/icons/${s[1]}.svg`}
                      alt=""
                      loading="lazy"
                    />
                  )}
                  {s[0]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
