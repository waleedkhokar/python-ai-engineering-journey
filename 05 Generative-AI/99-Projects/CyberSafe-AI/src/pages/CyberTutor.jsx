import { useState } from "react";
import { investigate } from "../services/agent";

export default function CyberTutor() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  async function handleSubmit() {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const result = await investigate("tutor", question);
      setAnswer(result);
    } catch (err) {
      console.error(err);
      alert("Unable to get response.");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto p-8 text-white">

      <h1 className="text-4xl font-bold mb-6">
        Cyber Tutor
      </h1>

      <p className="text-slate-400 mb-6">
        Ask any cybersecurity question and receive an AI-powered explanation.
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Example: What is phishing?"
        className="w-full h-40 rounded-lg p-4 text-black border"
      />

      <button
        onClick={handleSubmit}
        className="bg-cyan-600 px-6 py-3 rounded-lg mt-5 hover:bg-cyan-700"
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {answer && (
        <div className="mt-10 bg-slate-900 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            AI Response
          </h2>

          <div className="whitespace-pre-wrap leading-8">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}