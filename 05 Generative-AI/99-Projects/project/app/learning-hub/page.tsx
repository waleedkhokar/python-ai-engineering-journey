'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Compass, Layers, Lightbulb } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import { FadeIn } from '@/components/fade-in';
import { Card, CardContent } from '@/components/ui/card';

const tracks = [
  {
    icon: Compass,
    title: 'Foundations',
    description:
      'Sentence-level clarity, coherence, and the mechanics that make academic prose readable.',
  },
  {
    icon: Layers,
    title: 'Structure & Argument',
    description:
      'Paragraph flow, thesis development, evidence integration, and logical scaffolding.',
  },
  {
    icon: Lightbulb,
    title: 'Voice & Style',
    description:
      'Developing a confident academic voice, hedging appropriately, and avoiding common pitfalls.',
  },
  {
    icon: BookOpen,
    title: 'Discipline Guides',
    description:
      'Conventions for different fields — from lab reports to literature reviews to humanities essays.',
  },
];

export default function LearningHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Learning Hub"
        title="Learn the principles behind the feedback"
        description="The Learning Hub is your library of writing lessons and guides. Every piece of coaching from LinguaLens connects back to a concept you can study here — so feedback becomes lasting skill."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-content px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <SectionHeading
              eyebrow="Coming soon"
              title="Learning tracks"
              description="Curated lessons organized into tracks, each tied to a dimension of academic writing."
            />
          </FadeIn>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {tracks.map((track, i) => {
              const Icon = track.icon;
              return (
                <FadeIn key={track.title} delay={i * 0.06}>
                  <Card className="group h-full border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.04)]">
                    <CardContent className="flex h-full flex-col p-7">
                      <div className="flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </span>
                        <h3 className="font-display text-xl font-bold text-foreground">
                          {track.title}
                        </h3>
                      </div>
                      <p className="mt-5 flex-1 text-sm leading-[1.7] text-muted-foreground">
                        {track.description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                        <span className="rounded-full bg-secondary/60 px-2.5 py-0.5 text-xs">
                          In preparation
                        </span>
                      </span>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>

          {/* CTA */}
          <FadeIn>
            <div className="mt-16 flex flex-col items-center justify-between gap-5 rounded-2xl border border-border/50 bg-secondary/30 p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:flex-row sm:text-left lg:p-10">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Want to practice while lessons are being built?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Head to the analyzer and start getting coach-style notes on
                  your own drafts today.
                </p>
              </div>
              <Link
                href="/analyze"
                className="group inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md"
              >
                Go to Analyze
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
