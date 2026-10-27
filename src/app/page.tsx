import React from "react";
import HeroSection from "@/components/sections/HeroSection";
import WhatYouWillLearn from "@/components/sections/WhatYouWillLearn";
import StatsMarquee from "@/components/sections/StatsMarquee";
import CoursesGrid from "@/components/sections/CoursesGrid";
import WhyContributeSection from "@/components/sections/WhyContributeSection";
import AboutMeSection from "@/components/sections/AboutMeSection";
import CtaBand from "@/components/sections/CtaBand";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhatYouWillLearn />
      <StatsMarquee />
      <CoursesGrid />
      <WhyContributeSection />
      <AboutMeSection />
      <CtaBand />
    </>
  );
}
