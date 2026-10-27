import React from "react";

export default function ContributeSteps() {
  return (
    <>
      <div className="star-callout">
        &#11088; <b>Start must:</b> first of all, star the repo on GitHub &mdash; to get updates and latest projects, learning, interview, job and internship updates. Start is a must, everywhere.
      </div>
      <div className="steps">
        <div className="step">
          <div className="snum">1</div>
          <div>
            <h4>&#11088; Star must</h4>
            <p>
              Open the journey repo on GitHub and star it, so you get updates and latest projects, learning, interview, job and internship posts. Start is a must.
            </p>
          </div>
        </div>
        <div className="step">
          <div className="snum">2</div>
          <div>
            <h4>Fork the repository</h4>
            <p>
              Open the journey repo on GitHub and click Fork &mdash; you get your own copy to work in.
            </p>
          </div>
        </div>
        <div className="step">
          <div className="snum">3</div>
          <div>
            <h4>Clone your fork</h4>
            <p>
              <code>git clone https://github.com/YOUR-USERNAME/python-ai-engineering-journey.git</code>
            </p>
          </div>
        </div>
        <div className="step">
          <div className="snum">4</div>
          <div>
            <h4>Add your project in the correct course folder</h4>
          </div>
        </div>
        <div className="step">
          <div className="snum">5</div>
          <div>
            <h4>Commit, push, and open a pull request</h4>
          </div>
        </div>
        <div className="step">
          <div className="snum">6</div>
          <div>
            <h4>Once merged, your work is part of the journey</h4>
          </div>
        </div>
      </div>
    </>
  );
}
