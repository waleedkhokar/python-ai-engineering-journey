import fs from "node:fs";
import path from "node:path";

const file = path.resolve("data/member4_manifest.csv");
const text = fs.readFileSync(file, "utf8").trim();
const lines = text.split(/\r?\n/);
if (lines.length < 2) throw new Error("Member 4 manifest is empty");

function splitCsv(line) {
  const out = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { current += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === "," && !quoted) { out.push(current); current = ""; }
    else current += ch;
  }
  out.push(current);
  return out;
}

const header = splitCsv(lines[0]);
const rows = lines.slice(1).map((line) => Object.fromEntries(header.map((key, index) => [key, splitCsv(line)[index] ?? ""])));
const required = ["document_id","title","document_type","jurisdiction","authority","bench","source_url","status","source_tier"];
for (const key of required) if (!header.includes(key)) throw new Error(`Missing manifest column: ${key}`);
const ids = new Set();
const allowed = new Set(["pakistancode.gov.pk","www.pakistancode.gov.pk","sindhlaws.gov.pk","www.sindhlaws.gov.pk","caselaw.shc.gov.pk"]);
for (const row of rows) {
  if (ids.has(row.document_id)) throw new Error(`Duplicate document_id: ${row.document_id}`);
  ids.add(row.document_id);
  const host = new URL(row.source_url).hostname.toLowerCase();
  if (!allowed.has(host)) throw new Error(`Non-official source host: ${host}`);
  if (row.status === "placeholder" && !row.document_id.startsWith("SHC-")) throw new Error(`Unexpected placeholder: ${row.document_id}`);
  if (row.status !== "placeholder" && row.title.toLowerCase().includes("placeholder")) throw new Error(`Placeholder title not marked placeholder: ${row.document_id}`);
}
const placeholders = rows.filter((row) => row.status === "placeholder");
const directPdfs = rows.filter((row) => row.source_url.toLowerCase().endsWith(".pdf"));
if (placeholders.length !== 5) throw new Error(`Expected 5 SHC placeholders, found ${placeholders.length}`);
if (directPdfs.length < 4) throw new Error(`Expected at least 4 verified direct PDF URLs, found ${directPdfs.length}`);

const seedSql = fs.readFileSync(path.resolve("supabase/seed.sql"), "utf8");
if (!seedSql.includes("court, bench, authority")) throw new Error("Supabase seed does not preserve judgment bench metadata");
for (const row of directPdfs) {
  if (!seedSql.includes(row.source_url)) throw new Error(`Supabase seed is out of sync for ${row.document_id}`);
  if (!seedSql.includes(`'${row.document_id}'`)) throw new Error(`Supabase seed missing ${row.document_id}`);
}
for (const row of placeholders) {
  if (!seedSql.includes(`'${row.document_id}'`)) throw new Error(`Supabase seed missing placeholder ${row.document_id}`);
}

console.log(`PASS member4 manifest — ${rows.length} records, ${directPdfs.length} direct official PDFs, ${placeholders.length} placeholders quarantined.`);
