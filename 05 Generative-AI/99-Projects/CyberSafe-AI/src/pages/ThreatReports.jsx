import threatReports from "../data/threatReports";

export default function ThreatReports() {

  const colors = {
    Critical: "bg-red-700",
    High: "bg-red-500",
    Medium: "bg-yellow-500",
    Low: "bg-green-600",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-6xl mx-auto p-8">

        <h1 className="text-5xl font-bold mb-3">
          Threat Reports
        </h1>

        <p className="text-slate-400 mb-10">
          Recent cybersecurity threats and recommended protection measures.
        </p>

        <div className="space-y-8">

          {threatReports.map((report) => (

            <div
              key={report.id}
              className="bg-slate-900 rounded-xl p-6 border border-slate-800"
            >

              <div className="flex justify-between items-center">

                <h2 className="text-2xl font-bold">

                  {report.title}

                </h2>

                <span
                  className={`px-4 py-2 rounded-full ${colors[report.severity]}`}
                >
                  {report.severity}
                </span>

              </div>

              <p className="text-cyan-400 mt-2">

                {report.category}

              </p>

              <p className="mt-4">

                <strong>Target:</strong> {report.target}

              </p>

              <p className="mt-4">

                {report.description}

              </p>

              <h3 className="mt-6 font-bold text-lg">

                Prevention

              </h3>

              <ul className="list-disc ml-6 mt-3">

                {report.prevention.map((item, index) => (

                  <li key={index}>{item}</li>

                ))}

              </ul>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}