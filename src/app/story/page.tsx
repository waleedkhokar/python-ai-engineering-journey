import React from "react";
import { Metadata } from "next";
import { StoryHero } from "@/components/sections/AboutMeSection";
import StoryTimeline from "@/components/sections/StoryTimeline";
import SkillsSection from "@/components/sections/SkillsSection";
import ConnectGrid from "@/components/sections/ConnectGrid";

export const metadata: Metadata = {
  title: "My Story | Python AI Engineering Journey",
  description: "The story behind Waleed Khokhar and the Python AI Engineering Journey.",
};

export default function StoryPage() {
  return (
    <>
      <section className="panel rv">
        <StoryHero />
      </section>
      <StoryTimeline />
      <SkillsSection />
      <ConnectGrid />
    </>
  );
}
