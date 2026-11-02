import { useState } from "react";
import { investigate } from "../services/agent";
import { saveInvestigation } from "../services/historyService";

export default function URLInvestigator() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  async function handleSubmit() {
    if (!url.trim()) return;

    setLoading(true);

    try {
      const result = await investigate("url", url);

      const parsed = JSON.parse(result);

      setReport(parsed);

      // Save investigation to Supabase
      await saveInvestigation(
        "URL",
        url,
        parsed
      );
    } catch (err) {
      console.error(err);
      alert("Unable to analyse URL.");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        URL Investigator
      </h1>

      <textarea
        className="w-full h-32 rounded-lg p-4 text-black border"
        placeholder="Paste a URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-cyan-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-cyan-700"
      >
        {loading ? "Analysing..." : "Investigate"}
      </button>

      {report && (
        <div className="mt-8 bg-slate-900 p-6 rounded-xl">
          <h2 className="text-red-400 text-2xl font-bold">
            Risk: {report.risk}
          </h2>

          <p className="mt-2">
            <strong>Confidence:</strong> {report.confidence}%
          </p>

          <p className="mt-4">
            {report.summary}
          </p>

          <h3 className="mt-6 font-bold">
            Indicators
          </h3>

          <ul className="list-disc ml-6">
            {report.indicators.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3 className="mt-6 font-bold">
            Recommendations
          </h3>

          <ul className="list-disc ml-6">
            {report.recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <div className="mt-6 bg-slate-800 p-4 rounded">
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