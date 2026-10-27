import React from "react";
import { MODULES } from "@/lib/data";
import CourseCard from "@/components/ui/CourseCard";

export default function CoursesGrid() {
  return (
    <section className="panel rv">
      <div className="sec-head">
        <h2>The 10 Courses</h2>
        <p>
          One clear path, in order. Open any course to see every class, its projects and its interview preparation in full detail.
        </p>
      </div>
      <div className="grid">
        {MODULES.map((m, i) => (
          <CourseCard key={m.n} module={m} delay={(i % 3) * 70} />
        ))}
      </div>
    </section>
  );
}
