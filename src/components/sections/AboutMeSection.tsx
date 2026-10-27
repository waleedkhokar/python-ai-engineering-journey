import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { WALEED_PHOTO_BASE64 } from "@/lib/assets";
//logo orinal name waleed khokhar.sabjpeg.jpeg
export function StoryHero() {
  return (
    <div className="story-hero">
      <div className="story-copy">
        <span
          className="tag"
          style={{
            display: "inline-block",
            background: "var(--green-soft)",
            color: "var(--green-dark)",
            fontWeight: 700,
            fontSize: "13.5px",
            padding: "6px 14px",
            borderRadius: "999px",
            marginBottom: "18px",
          }}
        >
          My Story
        </span>
        <h2 className="story-name">Waleed Khokhar</h2>
        <div className="story-role">Full-Stack AI Engineer</div>
        <p className="lead" style={{ marginTop: "16px" }}>
          Full-Stack AI Engineer with 1+ year of experience and 20+ projects delivered, building scalable Web Applications and Mobile Apps (Android &amp; iOS) with AI-powered features. I specialize in Machine Learning, Deep Learning, Generative AI, LLMs, RAG, Agentic AI, and AI Agents, building intelligent AI solutions, automations, and products that solve real-world problems.
        </p>
        <div className="story-line">
          <b>My honest story:</b> I was a backbencher &mdash; not serious about learning, and I did not have even a single internship. Then I changed my mind, focused on learning, and started helping others learn too. That one decision changed everything.
        </div>
        <h3 style={{ marginTop: "26px" }}>What I Do</h3>
        <div className="whatdo">
          <div className="wd">
            <span className="wd-ic">
              <Icon name="code" />
            </span>
            <p>
              <b>Build Full-Stack Web Applications &amp; Mobile Apps</b> (iOS &amp; Android).
            </p>
          </div>
          <div className="wd">
            <span className="wd-ic">
              <Icon name="cpu" />
            </span>
            <p>
              <b>AI Engineering</b> using Machine Learning, Deep Learning, LLMs, RAG, and Generative AI.
            </p>
          </div>
          <div className="wd">
            <span className="wd-ic">
              <Icon name="bot" />
            </span>
            <p>
              <b>AI Agents &amp; Automation</b> using Agentic AI, MCP, n8n, and Python to automate real workflows.
            </p>
          </div>
        </div>
        <div className="story-facts">
          <span><b>Jan 1, 2024</b> Started Python</span>
          <span><b>10</b> Courses</span>
          <span><b>150+</b> Classes</span>
          <span><b>50+</b> Projects</span>
          <span><b>1+</b> Year Experience</span>
          <span><b>20+</b> Projects Delivered</span>
          <span><b>3</b> Internships</span>
          <span><b>65+</b> Hours Coding / Week</span>
          <span><b>1000+</b> People &mdash; My Mission</span>
        </div>
      </div>
      <div className="phone-wrap">
        <div className="phone">
          <span className="phone-notch"></span>
         <img
  src="/assets/waleed%20khokhar.jpeg"
  alt="Waleed Khokhar outdoors against a blue sky and green hills, wearing a black and white striped sweater, blue jeans and white-blue sneakers"
/>

          <span className="phone-home"></span>
        </div>
      </div>
    </div>
  );
}

export default function AboutMeSection() {
  return (
    <section className="panel rv">
      <div className="sec-head">
        <h2>About Us &mdash; My Story</h2>
        <p>The person behind this journey &mdash; and why it exists.</p>
      </div>
      <StoryHero />
      <div className="hero-cta" style={{ marginTop: "26px" }}>
        <Link className="btn btn-green" href="/story">
          Read More &mdash; My Story <Icon name="arrow" />
        </Link>
      </div>
    </section>
  );
}
