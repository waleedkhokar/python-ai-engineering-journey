import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const docs = JSON.parse(fs.readFileSync(path.join(root, "data", "legal_documents.json"), "utf8"));

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

assert(Array.isArray(docs), "Corpus JSON must be an array");
assert(docs.length === 35, `Expected 35 starter rows, got ${docs.length}`);

const ids = new Set(docs.map((d) => d.document_id));
assert(ids.size === docs.length, "document_id values must be unique");
assert(ids.has("PK-001"), "Missing Constitution starter record");
assert(ids.has("PK-009"), "Missing Transfer of Property Act starter record");
assert(ids.has("SD-003"), "Missing Sindh Rented Premises starter record");

const allowedHosts = new Set([
  "pakistancode.gov.pk",
  "www.sindhlaws.gov.pk",
  "sindhlaws.gov.pk",
  "caselaw.shc.gov.pk"
]);

for (const doc of docs) {
  assert(doc.title && doc.source_url && doc.authority, `Incomplete record: ${doc.document_id}`);
  const url = new URL(doc.source_url);
  assert(allowedHosts.has(url.hostname), `Unexpected source domain for ${doc.document_id}: ${url.hostname}`);
}

const placeholders = docs.filter((d) => d.title.toLowerCase().includes("placeholder"));
assert(placeholders.length === 5, `Expected 5 SHC placeholders, got ${placeholders.length}`);

console.log(`PASS — ${docs.length} starter rows validated.`);
console.log(`PASS — ${placeholders.length} placeholder judgment rows identified.`);
console.log("PASS — all current source URLs are limited to the approved official domains.");
