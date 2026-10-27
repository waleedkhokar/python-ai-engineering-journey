"use client";

import React, { useState } from "react";
import { FAQS } from "@/lib/data";

export default function FaqAccordion() {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggle = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="panel rv">
      <div className="sec-head">
        <h2>Frequently Asked Questions</h2>
      </div>
      {FAQS.map((f, i) => {
        const isOpen = openIndices.includes(i);
        return (
          <div key={i} className={`faq-item ${isOpen ? "open" : ""}`}>
            <button
              className="faq-q"
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              {f[0]}
              <span className="fx">+</span>
            </button>
            {isOpen && <div className="faq-a" style={{ display: "block" }}>{f[1]}</div>}
          </div>
        );
      })}
    </section>
  );
}
