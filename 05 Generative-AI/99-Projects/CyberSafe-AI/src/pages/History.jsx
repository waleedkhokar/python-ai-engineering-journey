import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("investigations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setHistory(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading history...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Investigation History
        </h1>

        {history.length === 0 ? (
          <p className="text-slate-400">
            No investigations found.
          </p>
        ) : (
          <div className="space-y-6">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 rounded-xl p-6 border border-slate-700"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-cyan-600 px-3 py-1 rounded-full">
                    {item.type}
                  </span>

                  <span className="text-sm text-slate-400">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>

                <h2 className="font-semibold mb-2">
                  Input
                </h2>

                <p className="bg-slate-800 p-3 rounded wrap-break-words">
                  {item.input}
                </p>

                <h2 className="font-semibold mt-5 mb-2">
                  Result
                </h2>

                <div className="bg-slate-800 p-4 rounded">
                  <p>
                    <strong>Risk/Strength:</strong>{" "}
                    {item.result.risk || item.result.strength}
                  </p>

                  {item.result.confidence && (
                    <p>
                      <strong>Confidence:</strong>{" "}
                      {item.result.confidence}%
                    </p>
                  )}

                  {item.result.score && (
                    <p>
                      <strong>Score:</strong>{" "}
                      {item.result.score}/100
                    </p>
                  )}

                  <p className="mt-3">
                    {item.result.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}