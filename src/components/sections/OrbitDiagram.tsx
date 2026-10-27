import React from "react";
import Link from "next/link";
import { HERO_PILLS } from "@/lib/data";

export default function OrbitDiagram() {
  const pillsA = HERO_PILLS.slice(0, 5);
  const pillsB = HERO_PILLS.slice(5, 10);

  return (
    <div className="orbit-card">
      <div className="orbit">
        <div className="orbit-ring"></div>
        <div className="orbit-ring inner"></div>

        {pillsA.map((p, idx) => (
          <Link
            key={p[0]}
            className={`opill op-${idx + 1} ophase-a s${idx}`}
            href={`/course/${p[0]}`}
          >
            <img src={`/assets/icons/${p[2]}.svg`} alt={p[1]} loading="lazy" />
            {p[1]}
          </Link>
        ))}

        {pillsB.map((p, idx) => (
          <Link
            key={p[0]}
            className={`opill op-${idx + 1} ophase-b s${idx}`}
            href={`/course/${p[0]}`}
          >
            <img src={`/assets/icons/${p[2]}.svg`} alt={p[1]} loading="lazy" />
            {p[1]}
          </Link>
        ))}

        <div className="ocentre">Python AI Engineering Journey</div>

        <div className="ojourney">
          <div className="oj-k">Python AI Engineering Journey</div>
          <div className="oj-t">Your journey</div>
          <div className="oj-s">150+ classes &bull; 50+ projects</div>
          <div className="jbar">
            <span className="jfill"></span>
          </div>
          <div className="oj-j">100% Job-Ready</div>
        </div>
      </div>

      <div className="orbit-dots" aria-hidden="true">
        <span className="odot d1"></span>
        <span className="odot d2"></span>
        <span className="odot d3"></span>
      </div>
    </div>
  );
}
