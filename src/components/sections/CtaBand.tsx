import React from "react";
import Link from "next/link";
import { REPO, WA_GROUP } from "@/lib/data";

export default function CtaBand() {
  return (
    <section className="cta-band rv">
      <h2>Our AI Engineering Journey Starts Here</h2>
      <p>
        Pick course 1, open the first class, and write your first line of Python today. Everything is free.
      </p>
      <p
        style={{
          color: "var(--green-dark)",
          fontWeight: 800,
          fontSize: "19px",
          maxWidth: "none",
          marginTop: 0,
        }}
      >
        First of all, start the repo. Start is a must. I need stars.
      </p>
      <div style={{ display: "inline-flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
        <a
          className="btn btn-green"
          href={REPO}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "17px", padding: "14px 28px" }}
        >
          &#11088; Start the Repo
        </a>
        <Link className="btn btn-ghost" href="/course/1">
          Start Course 1
        </Link>
        <a
          className="btn btn-ghost"
          href={WA_GROUP}
          target="_blank"
          rel="noopener noreferrer"
        >
          Join WhatsApp Group
        </a>
      </div>
    </section>
  );
}
