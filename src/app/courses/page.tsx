import React from "react";
import { Metadata } from "next";
import { MODULES } from "@/lib/data";
import ModuleFullBlock from "@/components/ui/ModuleFullBlock";
import StatsMarquee from "@/components/sections/StatsMarquee";

export const metadata: Metadata = {
  title: "All 10 Courses | Python AI Engineering Journey",
  description: "The complete path from Python fundamentals to AI engineering.",
};

export default function CoursesPage() {
  return (
    <>
      <section className="panel rv">
        <div className="sec-head" style={{ marginBottom: "6px" }}>
          <h2>All 10 Courses</h2>
          <p>
            The complete path, in the order to learn it. Every course below shows all of its classes in order and its projects as pills. Open a course for the full detail page, or open its main folder on GitHub.
          </p>
        </div>
      </section>

      {MODULES.map((m) => (
        <ModuleFullBlock key={m.n} module={m} />
      ))}

      <StatsMarquee />
    </>
  );
}
