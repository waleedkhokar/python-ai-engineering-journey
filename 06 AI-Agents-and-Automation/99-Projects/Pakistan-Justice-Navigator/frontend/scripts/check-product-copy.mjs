import fs from "node:fs";
import path from "node:path";

const roots = ["app", "components"];
const blocked = [
  /Member[\s‑-]?\d/gi,
  /starter corpus/gi,
  /starter metadata/gi,
  /integration pending/gi,
  /demo surface/gi,
  /RAG adds/gi,
  /same case object/gi
];

const files = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (/\.(tsx|ts)$/.test(name)) files.push(full);
  }
}
for (const root of roots) walk(root);

const failures = [];
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  for (const rule of blocked) {
    rule.lastIndex = 0;
    const match = rule.exec(source);
    if (match) failures.push(`${file}: citizen-facing internal wording found: ${match[0]}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Product copy check passed across ${files.length} TS/TSX files.`);
