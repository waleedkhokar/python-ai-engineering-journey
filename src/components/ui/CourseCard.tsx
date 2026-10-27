import React from "react";
import Link from "next/link";
import { CourseModule } from "@/lib/types";
import { MODULE_BRANDS, pad2 } from "@/lib/data";

interface CourseCardProps {
  module: CourseModule;
  delay?: number;
}

export default function CourseCard({ module: m, delay = 0 }: CourseCardProps) {
  const brand = MODULE_BRANDS[m.n - 1];

  return (
    <article className="mcard rv" style={{ transitionDelay: `${delay}ms` }}>
      <div className="mcard-top">
        <div className="micon">
          <img src={`/assets/icons/${brand}.svg`} alt="" loading="lazy" />
        </div>
        <span className="mnum">Course {pad2(m.n)} of 10</span>
      </div>
      <h3>{m.title}</h3>
      <div className="sub">{m.sub}</div>
      <div className="meta">
        {m.classesLabel} &middot; {m.projectsLabel}
        <br />
        {m.period}
      </div>
      <span className="go">
        <Link className="btn btn-green btn-sm" href={`/course/${m.n}`}>
          Explore Course
        </Link>
      </span>
    </article>
  );
}
