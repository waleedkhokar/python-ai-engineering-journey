import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="py-24">

      <div className="max-w-7xl mx-auto px-8">

        <h1 className="text-6xl font-extrabold leading-tight">

          Investigate
          <span className="text-cyan-400">
            {" "}Cyber Threats
          </span>

          <br />

          Using AI

        </h1>

        <p className="mt-8 text-slate-400 text-xl max-w-2xl">

          Detect phishing emails, scam messages,
          malicious URLs and weak passwords using
          an intelligent AI investigation agent.

        </p>

        <div className="mt-10 flex gap-5">

          <Link
            to="/register"
            className="bg-cyan-500 px-7 py-4 rounded-xl"
          >
            Get Started
          </Link>

          <button className="border border-slate-700 px-7 py-4 rounded-xl">
            Learn More
          </button>

        </div>

      </div>

    </section>
  );
}