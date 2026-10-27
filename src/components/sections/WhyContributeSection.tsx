import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { GAIN_ITEMS, MORE_ADVANTAGES, WHO_CAN_JOIN } from "@/lib/data";
import ContributeSteps from "./ContributeSteps";

export default function WhyContributeSection() {
  return (
    <section className="panel rv">
      <div className="sec-head">
        <h2>Why Contribute?</h2>
      </div>
      <h3 style={{ fontSize: "21px" }}>Join Our Open-Source Developer Community!</h3>
      <p className="lead" style={{ marginTop: "12px" }}>
        <b>50+ developers</b> are already working together on this Python to AI Engineering Journey repository.
      </p>
      <p style={{ color: "var(--ink-2)", margin: "12px 0 0" }}>
        You just need 10 to 15 minutes &mdash; then your name will be added in contributors.
      </p>
      <p style={{ color: "var(--ink-2)", margin: "10px 0 0" }}>
        In just 10 to 20 minutes you can contribute, become an expert, and add your contribution to your CV, resume, LinkedIn, or anywhere you want.
      </p>

      <h3 style={{ marginTop: "30px" }}>1. What Is Open-Source Contribution?</h3>
      <p style={{ color: "var(--ink-2)", margin: "10px 0 0", maxWidth: "78ch" }}>
        Open-source contribution means working on a shared project with other developers &mdash; adding your code, improving existing projects, fixing bugs, and learning together. This repository is built exactly that way, in the open, by everyone who joins it.
      </p>

      <h3 style={{ marginTop: "30px" }}>2. What Will You Gain?</h3>
      <div style={{ marginTop: "14px" }}>
        <div className="prep-grid">
          {GAIN_ITEMS.map((g, i) => (
            <div key={i} className="prep" style={g.fullWidth ? { gridColumn: "1/-1" } : undefined}>
              <h4>{g.title}</h4>
              <p>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ marginTop: "30px" }}>More Advantages</h3>
      <p style={{ color: "var(--muted)", margin: "8px 0 14px" }}>
        Even more reasons developers join this community &mdash; and stay.
      </p>
      <ul className="check-list">
        {MORE_ADVANTAGES.map((adv, i) => (
          <li key={i}>
            <span className="ck">
              <Icon name="check" />
            </span>
            <span dangerouslySetInnerHTML={{ __html: adv }} />
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: "30px" }}>3. Who Can Join?</h3>
      <div style={{ marginTop: "14px" }}>
        <ul className="check-list">
          {WHO_CAN_JOIN.map((item, i) => (
            <li key={i}>
              <span className="ck">
                <Icon name="check" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p style={{ color: "var(--ink-2)", margin: "16px 0 0" }}>
          You do not need to be an expert. Start with what you know and improve as you contribute.
        </p>
      </div>

      <h3 style={{ marginTop: "30px" }}>You Must Start</h3>
      <p style={{ color: "var(--green-dark)", fontWeight: 800, fontSize: "17.5px", margin: "10px 0 0" }}>
        If you do not do anything yet, still start. First star the repo, then fork the repo, then try anything, but you must start.
      </p>

      <h3 style={{ marginTop: "30px" }}>How to Contribute &mdash; Step by Step</h3>
      <div style={{ marginTop: "14px" }}>
        <ContributeSteps />
      </div>

      <div className="hero-cta" style={{ marginTop: "26px" }}>
        <Link className="btn btn-green" href="/contribute">
          Read More on Contribution &amp; Learn Practical Skills <Icon name="arrow" />
        </Link>
      </div>
    </section>
  );
}
