import React from "react";
import { STATS } from "@/lib/data";

export default function StatsMarquee() {
  const pills = STATS.map((s, i) => (
    <span key={i} className="sm-pill">
      <b>{s[0]}</b>
      <span>{s[1]}</span>
    </span>
  ));

  return (
    <div className="stats-marquee rv">
      <div className="sm-row">
        <div className="sm-track">
          <div className="sm-group">{pills}</div>
          <div className="sm-group" aria-hidden="true">
            {pills}
          </div>
        </div>
      </div>
      <div className="sm-row rev">
        <div className="sm-track">
          <div className="sm-group">{pills}</div>
          <div className="sm-group" aria-hidden="true">
            {pills}
          </div>
        </div>
      </div>
    </div>
  );
}
