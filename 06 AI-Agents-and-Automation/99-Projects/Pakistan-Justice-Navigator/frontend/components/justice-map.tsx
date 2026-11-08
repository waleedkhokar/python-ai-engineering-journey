"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { MAP_SHAPES, MAP_VIEWBOX } from "@/lib/pakistan-map-shapes";
import { FEDERAL_COURTS, FEDERAL_SOURCE_COUNT, JUSTICE_REGIONS, librarySourceCount } from "@/lib/justice-regions";
import { Icon } from "./icons";

export function JusticeMap({ compact = false }: { compact?: boolean }) {
  const [selectedId, setSelectedId] = useState("sindh");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const selected = JUSTICE_REGIONS.find((region) => region.id === selectedId) ?? JUSTICE_REGIONS[0];
  const count = librarySourceCount(selected);

  const onKey = (event: KeyboardEvent, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedId(id);
    }
  };

  return (
    <div className={compact ? "jmap jmap-compact" : "jmap"}>
      <div className="jmap-figure">
        <svg viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`} role="group" aria-label="Map of Pakistan. Select a region to see its court information.">
          {JUSTICE_REGIONS.map((region) => {
            const shape = MAP_SHAPES[region.id];
            if (!shape) return null;
            const has = librarySourceCount(region) > 0;
            const cls = ["jmap-region", has ? "has-sources" : "", region.id === selectedId ? "is-selected" : "", region.id === hoverId ? "is-hover" : ""].join(" ");
            return (
              <path
                key={region.id}
                d={shape.d}
                className={cls}
                tabIndex={0}
                role="button"
                aria-label={`${region.name}${region.id === selectedId ? ", selected" : ""}`}
                aria-pressed={region.id === selectedId}
                onClick={() => setSelectedId(region.id)}
                onKeyDown={(event) => onKey(event, region.id)}
                onMouseEnter={() => setHoverId(region.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(region.id)}
                onBlur={() => setHoverId(null)}
              />
            );
          })}
          {!compact && JUSTICE_REGIONS.map((region) => {
            const shape = MAP_SHAPES[region.id];
            if (!shape || region.id === "ict") return null;
            return <text key={region.id} x={shape.centroid[0]} y={shape.centroid[1]} className="jmap-label" textAnchor="middle">{region.name.replace("Azad Jammu & Kashmir", "AJK").replace("Gilgit-Baltistan", "G-B").replace("Khyber Pakhtunkhwa", "KP")}</text>;
          })}
        </svg>
        <ul className="jmap-legend" aria-label="Map legend">
          <li><i className="lg-sources" /> Official sources in library</li>
          <li><i className="lg-none" /> None added yet</li>
          <li><i className="lg-selected" /> Selected</li>
        </ul>
      </div>

      <div className="jmap-panel" aria-live="polite">
        <span className="app-eyebrow">{selected.kind}</span>
        <h3>{selected.name}</h3>
        <dl>
          <div><dt>Capital</dt><dd>{selected.capital}</dd></div>
          <div><dt>Principal court</dt><dd>{selected.highCourt}</dd></div>
          <div><dt>Library sources</dt><dd>{count > 0 ? `${count} ${selected.name}-specific` : "None added yet"}{FEDERAL_SOURCE_COUNT > 0 ? ` + ${FEDERAL_SOURCE_COUNT} federal` : ""}</dd></div>
        </dl>
        <p className="jmap-fine">
          {selected.id === "ict" ? `Federal courts also sit here: ${FEDERAL_COURTS.join(" and ")}. ` : ""}
          Court names are reference information; library counts come from this project&apos;s source records. Confirm details on official court websites.
        </p>
        <div className="jmap-actions">
          <Link href="/sources" className="app-btn app-btn-primary">Open source library <Icon name="arrow" size={16} /></Link>
          {!compact && <Link href="/research" className="app-btn app-btn-ghost">Research a topic</Link>}
        </div>
      </div>
    </div>
  );
}
