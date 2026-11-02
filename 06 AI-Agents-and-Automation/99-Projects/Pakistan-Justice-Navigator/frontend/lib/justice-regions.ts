import { legalDocuments } from "./corpus";

export type JusticeRegion = {
  id: string;
  name: string;
  kind: "Province" | "Federal capital" | "Administrative territory";
  capital: string;
  highCourt: string;
  /** Jurisdiction label used by the project's source library, if the library has one for this region. */
  libraryJurisdiction?: string;
};

// Reference facts only (names and seats of courts). Verify against official court websites before relying on them.
export const JUSTICE_REGIONS: JusticeRegion[] = [
  { id: "punjab", name: "Punjab", kind: "Province", capital: "Lahore", highCourt: "Lahore High Court" },
  { id: "sindh", name: "Sindh", kind: "Province", capital: "Karachi", highCourt: "High Court of Sindh", libraryJurisdiction: "Sindh" },
  { id: "kp", name: "Khyber Pakhtunkhwa", kind: "Province", capital: "Peshawar", highCourt: "Peshawar High Court" },
  { id: "balochistan", name: "Balochistan", kind: "Province", capital: "Quetta", highCourt: "High Court of Balochistan" },
  { id: "ict", name: "Islamabad Capital Territory", kind: "Federal capital", capital: "Islamabad", highCourt: "Islamabad High Court" },
  { id: "gilgit-baltistan", name: "Gilgit-Baltistan", kind: "Administrative territory", capital: "Gilgit", highCourt: "Gilgit-Baltistan Chief Court" },
  { id: "ajk", name: "Azad Jammu & Kashmir", kind: "Administrative territory", capital: "Muzaffarabad", highCourt: "High Court of Azad Jammu & Kashmir" }
];

export const FEDERAL_COURTS = ["Supreme Court of Pakistan", "Federal Shariat Court"];

const real = legalDocuments.filter((doc) => !doc.title.toLowerCase().includes("placeholder"));

export function librarySourceCount(region: JusticeRegion) {
  return region.libraryJurisdiction ? real.filter((doc) => doc.jurisdiction === region.libraryJurisdiction).length : 0;
}

export const FEDERAL_SOURCE_COUNT = real.filter((doc) => doc.jurisdiction === "Federal").length;
export const LIBRARY_TOTAL = real.length;

export function libraryByType() {
  const counts = new Map<string, number>();
  for (const doc of real) counts.set(doc.document_type, (counts.get(doc.document_type) ?? 0) + 1);
  return [...counts.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}
