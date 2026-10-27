import React from "react";
import { Icon } from "@/components/ui/Icons";

export default function StoryTimeline() {
  return (
    <>
      <section className="panel rv">
        <div className="sec-head">
          <h2>The Journey</h2>
        </div>
        <div className="timeline">
          <div className="tl">
            <div className="tl-dot">
              <Icon name="code" />
            </div>
            <div>
              <h3>January 1, 2024 — The first line of Python</h3>
              <p>
                I started Course 1 with no mentor and no paid course — just consistency. Python from beginner to advanced: 14 classes, 15+ projects.
              </p>
            </div>
          </div>

          <div className="tl">
            <div className="tl-dot">
              <Icon name="chart" />
            </div>
            <div>
              <h3>Data, models, neural networks</h3>
              <p>
                Data Science, Machine Learning and Deep Learning followed — every algorithm learned by building, not just watching.
              </p>
            </div>
          </div>

          <div className="tl">
            <div className="tl-dot">
              <Icon name="spark" />
            </div>
            <div>
              <h3>Generative AI, agents, agentic systems</h3>
              <p>
                LLMs, RAG and LangChain, then AI Agents and Agentic AI Engineering — the skills the market is hiring for right now.
              </p>
            </div>
          </div>

          <div className="tl">
            <div className="tl-dot">
              <Icon name="target" />
            </div>
            <div>
              <h3>The professional layer</h3>
              <p>
                Data Structures &amp; Algorithms for interviews, Cloud &amp; DevOps &amp; System Design for production, and SQL &amp; Database Mastery to complete the stack.
              </p>
            </div>
          </div>

          <div className="tl">
            <div className="tl-dot">
              <Icon name="briefcase" />
            </div>
            <div>
              <h3>Today — Full-Stack AI Engineer</h3>
              <p>
                1+ year of experience, 20+ projects delivered, 3 internships, coding 65+ hours a week — building AI that works, and products people use.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="fact-grid" style={{ marginBottom: "26px" }}>
        <div className="fact rv">
          <div className="n">150+</div>
          <div className="l">Classes built across 10 courses</div>
        </div>
        <div className="fact rv">
          <div className="n">50+</div>
          <div className="l">Contributors and growing</div>
        </div>
        <div className="fact rv">
          <div className="n">20+</div>
          <div className="l">Projects delivered professionally</div>
        </div>
        <div className="fact rv">
          <div className="n">3</div>
          <div className="l">Internships completed</div>
        </div>
        <div className="fact rv">
          <div className="n">65+</div>
          <div className="l">Hours of coding every week</div>
        </div>
        <div className="fact rv">
          <div className="n">1000+</div>
          <div className="l">People — the mission target</div>
        </div>
      </div>

      <section className="panel rv">
        <div className="sec-head">
          <h2>Why I Built This</h2>
        </div>
        <div className="prep-grid">
          <div className="prep">
            <h4>Free education</h4>
            <p>
              Quality AI education should not need a paid course. Everything here is free, forever — every class, note, project and interview guide.
            </p>
          </div>
          <div className="prep">
            <h4>A structured path</h4>
            <p>
              Beginners fail from confusion, not difficulty. This journey removes the confusion: one path, in order, zero to job-ready.
            </p>
          </div>
          <div className="prep">
            <h4>Real projects</h4>
            <p>
              Certificates do not get jobs — proof of work does. Every course ends in projects you can show an employer.
            </p>
          </div>
          <div className="prep">
            <h4>My mission</h4>
            <p>
              Help 1000+ people become AI engineers. 50+ contributors are already building this future together — you can be one of them.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
