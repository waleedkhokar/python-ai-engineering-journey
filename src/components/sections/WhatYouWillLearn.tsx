import React from "react";
import Link from "next/link";
import { LEARN_TOPICS } from "@/lib/data";
import { Icon } from "@/components/ui/Icons";

export default function WhatYouWillLearn() {
  return (
    <section className="panel rv">
      <div className="sec-head">
        <h2>What You Will Learn</h2>
        <p>Every field on the road from your first line of Python to production AI engineering.</p>
      </div>

      <div className="learn-grid">
        {LEARN_TOPICS.map((t, i) => {
          const href = t[1] ? `/course/${t[1]}` : "/courses";
          return (
            <Link
              key={i}
              className="lcard"
              style={{ "--d": `${i * 55}ms` } as React.CSSProperties}
              href={href}
            >
              <span className="lic">
                {t[2] ? (
                  <img src={`/assets/icons/${t[2]}.svg`} alt={t[0]} loading="lazy" />
                ) : (
                  <Icon name="check" />
                )}
              </span>
              {t[0]}
            </Link>
          );
        })}
      </div>

      <p className="learn-note">
        <b>50+ developers</b> are connected with us, building the future of AI engineering together. <b>Free forever, open source.</b>
      </p>
    </section>
  );
}
