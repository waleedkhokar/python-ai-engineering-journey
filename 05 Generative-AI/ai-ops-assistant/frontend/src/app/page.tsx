import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Enterprise <span className="text-blue-500">AI-Ops</span> Platform
        </h1>
        <p className="max-w-2xl text-gray-400 text-lg mb-10">
          Seamlessly switch between our AI-powered customer support assistant and our internal natural-language database analytics engine.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          <Link
            href="/support"
            className="p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500 transition text-left group"
          >
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition">
              Customer Support RAG &rarr;
            </h2>
            <p className="text-gray-400 text-sm">
              Chat with an intelligent assistant backed by live product catalog data and stock counts.
            </p>
          </Link>

          <Link
            href="/admin/analytics"
            className="p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-indigo-500 transition text-left group"
          >
            <h2 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition">
              Admin Text-to-SQL &rarr;
            </h2>
            <p className="text-gray-400 text-sm">
              Query your PostgreSQL operational database using plain everyday English queries.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}