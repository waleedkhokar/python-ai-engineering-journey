import { Notice, PageHeader } from "@/components/app-ui";
import { JusticeMap } from "@/components/justice-map";

export default function MapPage() {
  return (
    <div className="app-page">
      <PageHeader eyebrow="Courts & Regions" title="Justice across Pakistan" lede="Select a province or territory to see its capital, principal court and how many official sources the library holds for it." />
      <div className="app-card"><JusticeMap /></div>
      <Notice>Boundaries are simplified for display. Court information is reference material; this project has not yet added region-specific sources for most regions, and no legal-aid or court-schedule data is shown.</Notice>
    </div>
  );
}
