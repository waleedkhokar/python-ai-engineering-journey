"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { sendAnalyticsQuery } from "@/services/api";
import ReactMarkdown from "react-markdown";

export default function AnalyticsDashboardPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const currentQuery = query;
    setLoading(true);
    setResult("");

    try {
      const data = await sendAnalyticsQuery(currentQuery);
      setResult(data.reply);
    } catch (err) {
      setResult("Error communicating with analytics agent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-2">Admin Analytics Dashboard</h1>
        <p className="text-gray-400 text-sm mb-6">
          Query your PostgreSQL database using natural language. The system will auto-generate SQL and return live results.
        </p>

        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What is our total revenue from completed orders?"
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl font-medium transition disabled:opacity-50"
          >
            Analyze
          </button>
        </form>

        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-3 text-gray-300">Execution Output</h2>
          {loading ? (
            <div className="text-gray-400 animate-pulse">Generating SQL and querying database...</div>
          ) : (
            <div className="bg-gray-950 p-4 rounded-lg text-emerald-400 font-mono text-sm overflow-x-auto flex-1 border border-gray-800">
              {result ? (
                <div className="prose prose-invert max-w-none text-gray-200">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              ) : (
                <span className="text-gray-500">Results will appear here after running an analytics query.</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}