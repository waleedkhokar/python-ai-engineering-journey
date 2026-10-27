import React from "react";
import Link from "next/link";
import { CourseModule } from "@/lib/types";
import { MODULE_BRANDS, pad2, classNum, isProjectsRow, folderUrl } from "@/lib/data";
import { Icon } from "@/components/ui/Icons";

export default function ModuleFullBlock({ module: m }: { module: CourseModule }) {
  const brand = MODULE_BRANDS[m.n - 1];
  const url = folderUrl(m.folder);

  return (
    <section className="panel rv">
      <div className="mf-head">
        <div className="micon">
          <img src={`/assets/icons/${brand}.svg`} alt="" loading="lazy" />
        </div>
        <div style={{ flex: 1, minWidth: "240px" }}>
          <span className="mnum">Course {pad2(m.n)} of 10</span>
          <h3 style={{ fontSize: "24px", marginTop: "3px" }}>{m.title}</h3>
          <div className="sub" style={{ fontWeight: 600, color: "var(--ink-2)", fontSize: "16px" }}>
            {m.sub}
          </div>
        </div>
      </div>

      <div className="d-meta">
        <span className="pill">
          <Icon name="book" />
          <b>{m.classesLabel}</b>
        </span>
        <span className="pill">
          <Icon name="layers" />
          <b>{m.projectsLabel}</b>
        </span>
        <span className="pill">
          <Icon name="clock" />
          <b>{m.period}</b>
        </span>
      </div>

      <p style={{ color: "var(--ink-2)", margin: "18px 0 0", maxWidth: "78ch" }}>
        {m.overview}
      </p>

      <div className="mf-sub">All Classes &mdash; in order</div>
      <ul className="mf-classes">
        {m.classes.map((c, idx) => (
          <li key={idx}>
            <span className={`mf-n${isProjectsRow(m, idx) ? " proj" : ""}`}>
              {classNum(m, idx)}
            </span>
            <span>{c[0]}</span>
          </li>
        ))}
      </ul>

      {m.projects.length > 0 && (
        <>
          <div className="mf-sub">Projects in this course</div>
          <div className="mf-projs">
            {m.projects.map((p, idx) => (
              <span key={idx} className="mf-proj">
                <Icon name="folder" />
                {p[0]}
                {p[1] === 1 && " · Community"}
              </span>
            ))}
          </div>
        </>
      )}

      {m.extras && m.extras.leetcode && (
        <>
          <div className="mf-sub">LeetCode practice</div>
          <div className="mf-projs">
            {m.extras.leetcode.map((x, idx) => (
              <span key={idx} className="mf-proj">
                <Icon name="target" />
                {x[0]} &mdash; {x[1]}
              </span>
            ))}
          </div>
          <p style={{ color: "var(--muted)", fontSize: "14.5px", margin: "12px 0 0" }}>
            {m.extras.prep}
          </p>
        </>
      )}

      <div className="mf-foot">
        <Link className="link-arrow" href={`/course/${m.n}`}>
          Open this course in detail <Icon name="arrow" />
        </Link>
        <a className="mini-link" href={url} target="_blank" rel="noopener noreferrer">
          Course Folder on GitHub <Icon name="ext" />
        </a>
      </div>
    </section>
  );
}
