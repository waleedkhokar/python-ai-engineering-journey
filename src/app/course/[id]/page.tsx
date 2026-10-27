import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  MODULES,
  MODULE_BRANDS,
  pad2,
  classNum,
  isProjectsRow,
  folderUrl,
  REPO,
} from "@/lib/data";
import { Icon } from "@/components/ui/Icons";

export async function generateStaticParams() {
  return MODULES.map((m) => ({
    id: m.n.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const n = parseInt(params.id, 10);
  const m = MODULES.find((mod) => mod.n === n);
  if (!m) return { title: "Course Not Found" };
  return {
    title: `Course ${pad2(m.n)}: ${m.title} | Python AI Engineering Journey`,
    description: m.overview,
  };
}

export default function CourseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const n = parseInt(params.id, 10);
  const m = MODULES.find((mod) => mod.n === n);

  if (!m) {
    notFound();
  }

  const url = folderUrl(m.folder);
  const prev = MODULES.find((mod) => mod.n === n - 1);
  const next = MODULES.find((mod) => mod.n === n + 1);
  const brand = MODULE_BRANDS[m.n - 1];

  return (
    <>
      <div className="crumb rv">
        <Link href="/courses">&larr; Back to all courses</Link>
      </div>

      <section className="panel rv">
        <div className="d-head">
          <div className="micon">
            <Icon name={m.icon} />
          </div>
          <div style={{ flex: 1, minWidth: "260px" }}>
            <span className="mnum">Course {pad2(m.n)} of 10</span>
            <h2 style={{ marginTop: "4px" }}>{m.title}</h2>
            <div className="sub" style={{ fontWeight: 600, color: "var(--ink-2)", fontSize: "17px" }}>
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
          <span className="pill">
            <Icon name="folder" />
            <span className="mono" style={{ background: "none", border: "none", padding: 0 }}>
              {m.folder}
            </span>
          </span>
        </div>

        <p className="lead" style={{ marginTop: "20px" }}>
          {m.overview}
        </p>

        <div className="hero-cta" style={{ marginTop: "22px" }}>
          <a className="btn btn-green" href={url} target="_blank" rel="noopener noreferrer">
            Course Folder on GitHub <Icon name="ext" />
          </a>
          <a className="btn btn-ghost" href={REPO} target="_blank" rel="noopener noreferrer">
            Full Repository
          </a>
        </div>

        <div className="rule-note">
          <b>How links work here:</b> every class, project, notes, code and interview-prep link for this course opens the main course folder on GitHub — <code>{url}</code> — so you always land in the right place, never on a guessed sub-folder.
        </div>
      </section>

      <section className="panel rv">
        <div className="sec-head">
          <h2>What You Will Learn</h2>
        </div>
        <div className="topics">
          {m.topics.map((t, idx) => (
            <span key={idx} className="topic">
              {t}
            </span>
          ))}
        </div>
      </section>

      <section className="panel rv">
        <div className="sec-head">
          <h2>All Classes</h2>
          <p>
            Every class in this course, in order — with exactly what each class teaches. Notes, code and interview prep for each class live in the course folder on GitHub.
          </p>
        </div>
        <div className="class-list">
          {m.classes.map((c, idx) => {
            const proj = isProjectsRow(m, idx);
            return (
              <div key={idx} className="class-row">
                <div className={`cnum${proj ? " proj" : ""}`}>{classNum(m, idx)}</div>
                <div className="class-main">
                  <h4>{c[0]}</h4>
                  <p>{c[1]}</p>
                  <div className="class-links">
                    <a className="mini-link" href={url} target="_blank" rel="noopener noreferrer">
                      Open Notes <Icon name="ext" />
                    </a>
                    <a className="mini-link" href={url} target="_blank" rel="noopener noreferrer">
                      Open Code <Icon name="ext" />
                    </a>
                    <a className="mini-link" href={url} target="_blank" rel="noopener noreferrer">
                      Interview Prep <Icon name="ext" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {m.extras && m.extras.leetcode && (
        <section className="panel rv">
          <div className="sec-head">
            <h2>99 — LeetCode Solutions</h2>
            <p>Solved problems from the course folder, grouped by difficulty.</p>
          </div>
          <div className="extra-grid">
            {m.extras.leetcode.map((x, idx) => (
              <div key={idx} className="extra">
                <div className="n">{x[1].split(" ")[0]}</div>
                <div className="l">{x[0]}</div>
                <p>{x[1]} solved and explained</p>
                <a className="mini-link" href={url} target="_blank" rel="noopener noreferrer">
                  Open Solutions <Icon name="ext" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {m.projects.length > 0 && (
        <section className="panel rv">
          <div className="sec-head">
            <h2>Projects in this course</h2>
            <p>Build them all — each project lives in the course folder on GitHub.</p>
          </div>
          <div className="proj-grid">
            {m.projects.map((p, idx) => (
              <a key={idx} className="proj" href={url} target="_blank" rel="noopener noreferrer">
                <Icon name="folder" />
                <span className="pname">{p[0]}</span>
                {p[1] === 1 && <span className="badge">Community</span>}
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="panel rv">
        <div className="sec-head">
          <h2>Interview Preparation</h2>
          <p>
            Every class in this course includes interview preparation. Open the course folder on GitHub for the full material.
          </p>
        </div>
        <div className="prep-grid">
          <div className="prep">
            <h4>Common Interview Questions</h4>
            <p>
              The questions interviewers actually ask on this course&apos;s topics, with clear, structured answers.
            </p>
            <a className="mini-link" href={url} target="_blank" rel="noopener noreferrer">
              Open Interview Prep <Icon name="ext" />
            </a>
          </div>
          <div className="prep">
            <h4>Coding Challenges</h4>
            <p>
              Hands-on problems for each class, so you can prove the skill, not just describe it.
            </p>
            <a className="mini-link" href={url} target="_blank" rel="noopener noreferrer">
              Open Interview Prep <Icon name="ext" />
            </a>
          </div>
          <div className="prep">
            <h4>Common Mistakes to Avoid</h4>
            <p>
              The errors beginners make with these topics — and how professionals avoid them.
            </p>
            <a className="mini-link" href={url} target="_blank" rel="noopener noreferrer">
              Open Interview Prep <Icon name="ext" />
            </a>
          </div>
          <div className="prep">
            <h4>Best Practices</h4>
            <p>
              How working engineers write this code in production: clean, tested and maintainable.
            </p>
            <a className="mini-link" href={url} target="_blank" rel="noopener noreferrer">
              Open Interview Prep <Icon name="ext" />
            </a>
          </div>
        </div>
        {m.extras && m.extras.prep && (
          <div className="rule-note" style={{ marginTop: "18px" }}>
            <b>100 — Interview Prep:</b> {m.extras.prep}{" "}
            <a href={url} target="_blank" rel="noopener noreferrer">
              Open the interview prep folder
            </a>
            .
          </div>
        )}
      </section>

      <div className="prevnext rv">
        {prev ? (
          <Link className="pn" href={`/course/${prev.n}`}>
            <div className="dir">&larr; Previous Course</div>
            <div className="t">
              {pad2(prev.n)} &middot; {prev.title}
            </div>
          </Link>
        ) : (
          <span className="pn disabled">
            <div className="dir">&larr; Previous Course</div>
            <div className="t">This is the first course</div>
          </span>
        )}

        <div className="pn-mid">
          <Link className="btn btn-ghost btn-sm" href="/courses">
            All Courses
          </Link>
        </div>

        {next ? (
          <Link className="pn next" href={`/course/${next.n}`}>
            <div className="dir">Next Course &rarr;</div>
            <div className="t">
              {pad2(next.n)} &middot; {next.title}
            </div>
          </Link>
        ) : (
          <span className="pn next disabled">
            <div className="dir">Next Course &rarr;</div>
            <div className="t">This is the final course</div>
          </span>
        )}
      </div>
      <div style={{ height: "26px" }}></div>
    </>
  );
}
