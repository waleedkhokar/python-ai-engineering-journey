import { NextResponse } from "next/server";
import { getCorpusStats, legalDocuments } from "@/lib/corpus";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    stats: getCorpusStats(),
    documents: legalDocuments
  });
}
