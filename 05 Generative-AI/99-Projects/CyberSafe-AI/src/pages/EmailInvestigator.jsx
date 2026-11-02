import { useState } from "react";
import { investigate } from "../services/agent";
import { saveInvestigation } from "../services/historyService";

export default function EmailInvestigator() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  async function handleInvestigate() {
    if (!email.trim()) {
      setError("Please enter an email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await investigate("email", email);

      const parsed = JSON.parse(result);

      setReport(parsed);

      // Save investigation to Supabase
      await saveInvestigation(
        "Email",
        email,
        parsed
      );

    } catch (err) {
      console.error(err);
      setError("Failed to analyse the email.");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">
        Email Investigation
      </h1>

      <textarea
        rows={10}
        className="w-full p-4 rounded-lg border border-slate-700"
        placeholder="Paste suspicious email..."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleInvestigate}
        className="mt-6 bg-cyan-500 px-6 py-3 rounded-lg hover:bg-cyan-600"
      >
        {loading ? "Investigating..." : "Investigate"}
      </button>

      {error && (
        <p className="text-red-500 mt-4">
          {error}
        </p>
      )}

      {report && (
        <div className="mt-10 border bg-amber-100 rounded-xl p-6">
          <h2 className="text-2xl font-bold">
            Investigation Report
          </h2>

          <p className="mt-4">
            <strong>Risk:</strong> {report.risk}
          </p>

          <p>
            <strong>Confidence:</strong> {report.confidence}%
          </p>

          <p className="mt-4">
            {report.summary}
          </p>

          <h3 className="mt-6 font-semibold">
            Indicators
          </h3>

          <ul className="list-disc ml-6">
            {report.indicators.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3 className="mt-6 font-semibold">
            Recommendations
          </h3>

          <ul className="list-disc ml-6">
            {report.recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <div className="mt-6 p-4 bg-slate-800 text-white rounded-lg">
            <strong>Cyber Tip:</strong>

            <p className="mt-2">
              {report.cyber_tip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}