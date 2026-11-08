import manifest from "@/data/member4_manifest.json";

export type LegalSearchResult = {
  document_id: string;
  title: string;
  document_type: string;
  jurisdiction: string;
  authority: string;
  court: string;
  bench: string;
  citation: string;
  source_name: string;
  source_url: string;
  section_or_article: string;
  status: string;
  score: number;
  evidence_level: "metadata" | "chunk";
  snippet: string;
};

type ManifestRow = (typeof manifest)[number];

const STOP = new Set(["the", "a", "an", "of", "to", "and", "or", "in", "for", "is", "are", "my", "me", "i", "with", "on", "from"]);

function tokenize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((token) => token.length > 1 && !STOP.has(token));
}

const synonyms: Record<string, string[]> = {
  property: ["property", "land", "transfer", "registration", "specific", "civil"],
  inheritance: ["inheritance", "succession", "property", "family"],
  qabza: ["possession", "property", "civil", "relief"],
  possession: ["possession", "property", "relief", "civil"],
  rent: ["rent", "rented", "premises", "tenant", "landlord"],
  tenant: ["rent", "rented", "premises"],
  fir: ["criminal", "procedure", "penal", "evidence"],
  arrest: ["criminal", "procedure", "penal"],
  bail: ["criminal", "procedure"],
  contract: ["contract", "agreement", "goods", "partnership", "arbitration"],
  harassment: ["harassment", "workplace", "women"],
  consumer: ["consumer", "goods", "service"],
  evidence: ["shahadat", "evidence"],
  limitation: ["limitation"],
  company: ["companies", "company", "partnership"],
  terrorism: ["terrorism", "anti-terrorism", "criminal"],
  laundering: ["money", "laundering", "aml"]
};

function scoreRow(row: ManifestRow, query: string) {
  const q = tokenize(query);
  const expanded = new Set(q.flatMap((token) => synonyms[token] ?? [token]));
  const title = row.title.toLowerCase();
  const haystack = `${row.title} ${row.document_type} ${row.jurisdiction} ${row.authority} ${row.court} ${row.source_name}`.toLowerCase();
  let score = 0;
  for (const token of expanded) {
    if (title.includes(token)) score += 6;
    else if (haystack.includes(token)) score += 2;
  }
  if (row.priority === "High") score += 1;
  if (row.status === "placeholder") score -= 100;
  return score;
}

export function searchLegalMetadata(query: string, limit = 6): LegalSearchResult[] {
  const clean = query.trim();
  if (!clean) return [];
  return (manifest as ManifestRow[])
    .map((row) => ({ row, score: scoreRow(row, clean) }))
    .filter(({ row, score }) => score > 0 && row.status !== "placeholder")
    .sort((a, b) => b.score - a.score || a.row.title.localeCompare(b.row.title))
    .slice(0, limit)
    .map(({ row, score }) => ({
      document_id: row.document_id,
      title: row.title,
      document_type: row.document_type,
      jurisdiction: row.jurisdiction,
      authority: row.authority,
      court: row.court,
      bench: row.bench,
      citation: row.citation,
      source_name: row.source_name,
      source_url: row.source_url,
      section_or_article: row.section_or_article,
      status: row.status,
      score,
      evidence_level: "metadata" as const,
      snippet: "Metadata match only — exact sections and quotations require an ingested source chunk."
    }));
}
