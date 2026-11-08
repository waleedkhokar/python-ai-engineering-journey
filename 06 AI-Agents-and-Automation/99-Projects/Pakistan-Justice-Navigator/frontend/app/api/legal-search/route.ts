import { NextResponse } from "next/server";
import { searchLegalMetadata } from "@/lib/legal-search";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { query?: unknown; limit?: unknown };
  const query = typeof body.query === "string" ? body.query.trim() : "";
  const limit = typeof body.limit === "number" ? Math.min(10, Math.max(1, Math.floor(body.limit))) : 6;
  if (query.length < 3) {
    return NextResponse.json({ error: "Enter at least 3 characters." }, { status: 400 });
  }

  const backendUrl = process.env.LEGAL_RAG_API_URL?.replace(/\/$/, "");
  if (backendUrl) {
    try {
      const response = await fetch(`${backendUrl}/v1/search`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-pjn-client": "citizen-web" },
        body: JSON.stringify({ query, limit }),
        signal: AbortSignal.timeout(12000),
        cache: "no-store"
      });
      if (response.ok) {
        const payload = await response.json();
        return NextResponse.json({ ...payload, mode: payload.mode ?? "rag-backend" });
      }
    } catch {
      // Fall through to the transparent metadata-only fallback.
    }
  }

  return NextResponse.json({
    query,
    mode: backendUrl ? "metadata-fallback" : "metadata-only",
    results: searchLegalMetadata(query, limit),
    warning: "Exact legal provisions are not being claimed in this fallback. Connect the legal retrieval service after source chunks are ingested."
  });
}
