import { useState } from "react";
import { investigate } from "../services/agent";
import { saveInvestigation } from "../services/historyService";

export default function PasswordAdvisor() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  async function handleSubmit() {
    if (!password.trim()) return;

    setLoading(true);

    try {
      const result = await investigate("password", password);

      const parsed = JSON.parse(result);

      setReport(parsed);

      // Save investigation to Supabase
      await saveInvestigation(
        "Password",
        password,
        parsed
      );

    } catch (err) {
      console.error(err);
      alert("Unable to analyse password.");
    }

    setLoading(false);
  }

  const strengthColors = {
    Weak: "bg-red-600",
    Moderate: "bg-yellow-500",
    Strong: "bg-green-600",
  };

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">
      <h1 className="text-4xl font-bold mb-6">
        Password Advisor
      </h1>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password..."
        className="w-full rounded-lg p-4 text-black border"
      />

      <button
        onClick={handleSubmit}
        className="bg-cyan-600 px-6 py-3 rounded-lg mt-5 hover:bg-cyan-700"
      >
        {loading ? "Analysing..." : "Check Password"}
      </button>

      {report && (
        <div className="mt-10 bg-slate-900 rounded-xl p-6">

          <span
            className={`px-4 py-2 rounded-full text-white font-semibold ${
              strengthColors[report.strength]
            }`}
          >
            {report.strength}
          </span>

          <p className="mt-4">
            <strong>Score:</strong> {report.score}/100
          </p>

          <p className="mt-4">
            {report.summary}
          </p>

          <h2 className="text-xl font-bold mt-8">
            Issues
          </h2>

          <ul className="list-disc ml-6 mt-3">
            {report.issues.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="text-xl font-bold mt-8">
            Recommendations
          </h2>

          <ul className="list-disc ml-6 mt-3">
            {report.recommendations.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <div className="bg-slate-800 rounded-lg p-5 mt-8">
            <strong>Cyber Tip</strong>

            <p className="mt-2">
              {report.cyber_tip}
            </p>
          </div>

        </div>
      )}
    </div>
  );
}