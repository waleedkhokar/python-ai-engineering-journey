import React from "react";
import { Metadata } from "next";
import { Icon } from "@/components/ui/Icons";
import {
  REPO,
  WHATSAPP,
  WA_GROUP,
  LINKEDIN,
  GMAIL,
  GAIN_ITEMS,
  MORE_ADVANTAGES,
  WHO_CAN_JOIN,
} from "@/lib/data";
import ContributeSteps from "@/components/sections/ContributeSteps";
import FolderMap from "@/components/sections/FolderMap";
import FaqAccordion from "@/components/sections/FaqAccordion";

export const metadata: Metadata = {
  title: "Contribute | Python AI Engineering Journey",
  description: "Join 50+ developers building the future of AI engineering together.",
};

export default function ContributePage() {
  return (
    <>
      <section className="panel rv">
        <div className="sec-head" style={{ marginBottom: "4px" }}>
          <h2>Join Our Open-Source Developer Community!</h2>
          <p style={{ fontSize: "17px" }}>
            50+ developers are already working together on this Python to AI Engineering Journey repository.
          </p>
          <p style={{ fontSize: "17px" }}>
            You just need 10 to 15 minutes — then your name will be added in contributors.
          </p>
          <p style={{ fontSize: "17px" }}>
            In just 10 to 20 minutes you can contribute, become an expert, and add your contribution to your CV, resume, LinkedIn, or anywhere you want.
          </p>
        </div>
      </section>

      <section className="panel rv">
        <div className="sec-head">
          <h2>1. What Is Open-Source Contribution?</h2>
        </div>
        <p className="lead">
          Open-source contribution means working on a shared project with other developers &mdash; adding your code, improving existing projects, fixing bugs, and learning together. This repository is built exactly that way, in the open, by everyone who joins it.
        </p>
      </section>

      <section className="panel rv">
        <div className="sec-head">
          <h2>2. What Will You Gain?</h2>
        </div>
        <div className="prep-grid">
          {GAIN_ITEMS.map((g, i) => (
            <div
              key={i}
              className="prep"
              style={g.fullWidth ? { gridColumn: "1/-1" } : undefined}
            >
              <h4>{g.title}</h4>
              <p>{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel rv">
        <div className="sec-head">
          <h2>More Advantages</h2>
          <p>Even more reasons developers join this community &mdash; and stay.</p>
        </div>
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
      </section>

      <section className="panel rv">
        <div className="sec-head">
          <h2>3. Who Can Join?</h2>
        </div>
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
      </section>

      <section className="must-start rv">
        <h2>You Must Start</h2>
        <p>
          If you do not do anything yet, still start. First star the repo, then fork the repo, then try anything, but you must start.
        </p>
        <a
          className="btn btn-white"
          href={REPO}
          target="_blank"
          rel="noopener noreferrer"
        >
          &#11088; Star the Repo <Icon name="ext" />
        </a>
      </section>

      <section className="panel rv">
        <div className="sec-head">
          <h2>How to Contribute &mdash; Step by Step</h2>
        </div>
        <ContributeSteps />
      </section>

      <section className="panel rv">
        <div className="sec-head">
          <h2>Folder Map &mdash; Where Everything Goes</h2>
          <p>Always add your work inside the main folder of its course. Each folder opens on GitHub.</p>
        </div>
        <FolderMap />
      </section>

      <section className="panel rv">
        <div className="sec-head">
          <h2>Want to Join Us?</h2>
          <p>Send a message with your skills, interests, and the type of projects you would like to build.</p>
        </div>
        <div className="crow">
          <div className="micon">
            <img src="/assets/icons/github.svg" alt="" loading="lazy" />
          </div>
          <div>
            <div className="cl">GitHub Repository</div>
            <a className="cv" href={REPO} target="_blank" rel="noopener noreferrer">
              github.com/waleedkhokar/python-ai-engineering-journey
            </a>
          </div>
        </div>
        <div className="crow">
          <div className="micon">
            <img src="/assets/icons/whatsapp.svg" alt="" loading="lazy" />
          </div>
          <div>
            <div className="cl">WhatsApp</div>
            <a className="cv" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              0319 1402404
            </a>
          </div>
        </div>
        <div className="crow">
          <div className="micon">
            <img src="/assets/icons/whatsapp.svg" alt="" loading="lazy" />
          </div>
          <div>
            <div className="cl">WhatsApp Group</div>
            <a className="cv" href={WA_GROUP} target="_blank" rel="noopener noreferrer">
              Join the community group
            </a>
          </div>
        </div>
        <div className="crow">
          <div className="micon">
            <img src="/assets/icons/linkedin.svg" alt="" loading="lazy" />
          </div>
          <div>
            <div className="cl">LinkedIn</div>
            <a className="cv" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              linkedin.com/in/waleedkhokhar
            </a>
          </div>
        </div>
        <div className="crow">
          <div className="micon">
            <img src="/assets/icons/gmail.svg" alt="" loading="lazy" />
          </div>
          <div>
            <div className="cl">Gmail</div>
            <a className="cv" href={`mailto:${GMAIL}`}>
              {GMAIL}
            </a>
          </div>
        </div>
      </section>

      <section className="panel rv">
        <div className="sec-head">
          <h2>Can&apos;t Contribute Right Now? No Problem!</h2>
        </div>
        <p className="lead">
          Star the repository and fork it to learn Python, Machine Learning, Deep Learning, Data Analytics, Data Science, Generative AI, and Agentic AI and also interview preparation step by step.
        </p>
        <div className="hero-cta" style={{ marginTop: "20px" }}>
          <a className="btn btn-green" href={REPO} target="_blank" rel="noopener noreferrer">
            Star &amp; Fork on GitHub <Icon name="ext" />
          </a>
        </div>
      </section>

      <FaqAccordion />
    </>
  );
}
