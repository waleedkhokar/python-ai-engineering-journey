"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CourseModule } from "@/lib/types";
import { MODULES, MODULE_BRANDS, pad2, classNum, isProjectsRow, folderUrl } from "@/lib/data";
import { Icon } from "@/components/ui/Icons";

function McCard({ module: m }: { module: CourseModule }) {
  const url = folderUrl(m.folder);
  const brand = MODULE_BRANDS[m.n - 1];

  return (
    <article className="mccard">
      <div className="mcard-top">
        <div className="micon">
          <img src={`/assets/icons/${brand}.svg`} alt="" loading="lazy" />
        </div>
        <span className="mnum">Course {pad2(m.n)} of 10</span>
      </div>
      <h3>{m.title}</h3>
      <div className="sub">{m.sub}</div>
      <div className="meta">
        {m.classesLabel} &middot; {m.period}
      </div>
      <p className="mc-desc">{m.overview}</p>
      <div className="mf-sub">All Classes &mdash; in order</div>
      <ul className="mc-classes">
        {m.classes.map((c, idx) => (
          <li key={idx}>
            <span className={`mf-n${isProjectsRow(m, idx) ? " proj" : ""}`}>
              {classNum(m, idx)}
            </span>
            <span>{c[0]}</span>
          </li>
        ))}
      </ul>
      <div className="mf-foot">
        <Link className="link-arrow" href={`/course/${m.n}`}>
          Open this course in detail <Icon name="arrow" />
        </Link>
        <a className="mini-link" href={url} target="_blank" rel="noopener noreferrer">
          Course Folder on GitHub <Icon name="ext" />
        </a>
      </div>
    </article>
  );
}

function McRow({
  modules,
  rowClass,
  isPaused,
  onTogglePause,
}: {
  modules: CourseModule[];
  rowClass: string;
  isPaused: boolean;
  onTogglePause: () => void;
}) {
  return (
    <div className={`mc-viewport ${rowClass}`} onClick={onTogglePause}>
      <div className={`mc-track ${isPaused ? "paused" : ""}`}>
        {modules.map((m) => (
          <McCard key={m.n} module={m} />
        ))}
        {modules.map((m) => (
          <McCard key={`dup-${m.n}`} module={m} />
        ))}
      </div>
    </div>
  );
}

export default function CoursesCarousel() {
  const [paused1, setPaused1] = useState(false);
  const [paused2, setPaused2] = useState(false);

  return (
    <section className="panel panel-flat mc-panel rv">
      <div className="mc">
        <McRow
          modules={MODULES.slice(0, 5)}
          rowClass="mc-row1"
          isPaused={paused1}
          onTogglePause={() => setPaused1(!paused1)}
        />
        <McRow
          modules={MODULES.slice(5, 10)}
          rowClass="mc-row2"
          isPaused={paused2}
          onTogglePause={() => setPaused2(!paused2)}
        />
      </div>
      <p className="mc-hint">
        The courses keep moving slowly &mdash; hover or tap a row to pause and read.
      </p>
    </section>
  );
}
