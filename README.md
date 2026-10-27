# Python AI Engineering Journey — Next.js Application

A production-ready Next.js application migrated with 100% design fidelity from the original single-page `index.html` website.

## 🚀 Technologies Used

- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18, TypeScript
- **Styling**: Tailwind CSS & CSS Variables (Exact match to original design token system)
- **Animations**: CSS Keyframes (12s Orbit Mosey animation, 55s infinite Marquee rows, bobbing scroll indicators), Framer Motion
- **Icons**: Authentic brand SVG vectors and Lucide React
- **Fonts**: `Libre Franklin` (400-900) & `IBM Plex Mono` (400-600) via `next/font/google`

## 📁 Project Structure

```
python-ai-engineering-journey/
├── public/
│   ├── assets/
│   │   └── icons/           # 44 authentic brand vector SVGs
│   └── original-index.html  # Preserved original backup
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with fonts, Navbar, Footer
│   │   ├── page.tsx         # Home page (Hero, Orbit, Learn, Stats, Grid, Contribute, Story, CTA)
│   │   ├── globals.css      # Complete original styles, keyframes, and media queries
│   │   ├── courses/
│   │   │   └── page.tsx     # All 10 Courses full syllabus view
│   │   ├── course/
│   │   │   └── [id]/
│   │   │       └── page.tsx # Course detail (Classes, Notes, Code, LeetCode, Projects, Interview Prep)
│   │   ├── story/
│   │   │   └── page.tsx     # My Story (Hero, Phone Mockup, Timeline, Skills, Connect)
│   │   └── contribute/
│   │       └── page.tsx     # How to contribute, steps, folder map, contact, FAQ
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx   # Sticky navbar with mobile drawer
│   │   │   └── Footer.tsx   # Comprehensive footer with contact grid
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── OrbitDiagram.tsx
│   │   │   ├── WhatYouWillLearn.tsx
│   │   │   ├── StatsMarquee.tsx
│   │   │   ├── CoursesGrid.tsx
│   │   │   ├── CoursesCarousel.tsx
│   │   │   ├── WhyContributeSection.tsx
│   │   │   ├── AboutMeSection.tsx
│   │   │   ├── CtaBand.tsx
│   │   │   ├── StoryTimeline.tsx
│   │   │   ├── SkillsSection.tsx
│   │   │   ├── ConnectGrid.tsx
│   │   │   ├── ContributeSteps.tsx
│   │   │   ├── FolderMap.tsx
│   │   │   └── FaqAccordion.tsx
│   │   └── ui/
│   │       ├── Icons.tsx
│   │       ├── CourseCard.tsx
│   │       └── ModuleFullBlock.tsx
│   └── lib/
│       ├── assets.ts        # Base64 assets (Waleed's photo, laptop logo)
│       ├── data.ts          # Modules, classes, stats, FAQs, links
│       └── types.ts         # TypeScript interfaces
├── package.json
├── tsconfig.json
├── next.config.mjs
└── tailwind.config.ts
```

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

## ✨ Verification & Validation

- ✅ **Zero UI Changes**: Exact colors, gradients, font weights, padding, margins, shadows, and borders preserved.
- ✅ **All 10 Courses**: 150+ classes, notes, code, and interview prep links pointing to the official repository.
- ✅ **Responsive Design**: Validated for 320px mobile up to 1920px large desktops.
- ✅ **Animations**: 12s Orbit Mosey cycle, Marquee tracks, and interactive hover effects functioning seamlessly.
