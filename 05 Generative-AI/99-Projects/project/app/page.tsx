'use client';

import Link from 'next/link';
import {
  ArrowRight,
  PenLine,
  GraduationCap,
  ShieldCheck,
  BookOpenText,
  Lightbulb,
  MessageSquareQuote,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import { FadeIn } from '@/components/fade-in';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: MessageSquareQuote,
    title: 'Mentor-style feedback',
    description:
      'Receive feedback the way a tutor would give it — specific, constructive, and focused on helping you think, not just correct.',
  },
  {
    icon: Lightbulb,
    title: 'Explains the "why"',
    description:
      'Every suggestion comes with a clear rationale so you understand the principle behind the improvement and can apply it next time.',
  },
  {
    icon: ShieldCheck,
    title: 'Academic integrity first',
    description:
      'LinguaLens never writes your text for you. It coaches you toward stronger, original academic work.',
  },
  {
    icon: BookOpenText,
    title: 'Cross-discipline',
    description:
      'Built for essays, lab reports, literature reviews, and research papers across every field of study.',
  },
  {
    icon: GraduationCap,
    title: 'Teaches, not replaces',
    description:
      'Grow as an independent writer. The goal is that you need less coaching over time, not more.',
  },
  {
    icon: PenLine,
    title: 'Focused on craft',
    description:
      'Clarity, structure, argumentation, evidence, and voice — the dimensions that define strong academic writing.',
  },
];

const pillars = [
  {
    icon: BookOpenText,
    title: 'Learn',
    description:
      'Understand the principles behind strong academic writing, with feedback that explains the reasoning — not just the fix.',
  },
  {
    icon: PenLine,
    title: 'Improve',
    description:
      'Sharpen clarity, structure, argumentation, and voice across every draft, guided by mentor-style notes on your own work.',
  },
  {
    icon: GraduationCap,
    title: 'Grow',
    description:
      'Become a more independent, confident writer over time — the aim is that you need less coaching, not more.',
  },
];

const steps = [
  {
    title: 'Paste your draft',
    description:
      'Drop in a paragraph, a section, or a full draft. Nothing is stored without your say-so.',
  },
  {
    title: 'Get coached, not corrected',
    description:
      'Receive mentor-style notes that highlight what works, what is weak, and why — grouped by writing dimension.',
  },
  {
    title: 'Apply &amp; learn',
    description:
      'Revise with intention using the explained rationale, and take a lesson from the Learning Hub to deepen the skill.',
  },
];

const principles = [
  'Never generates text on your behalf',
  'Explains the reasoning behind every note',
  'Encourages original thinking &amp; voice',
  'Respects citation &amp; integrity norms',
];

export default function HomePage() {
  return (
    <>
      {/* Hero — fits comfortably on the first screen of most laptops */}
      <PageHero
        eyebrow="AI Writing Coach for Academia"
        title={
          <>
            Write with confidence.
            <br />
            <span className="text-primary">Learn with every revision.</span>
          </>
        }
        description="LinguaLens AI is a mentor-style writing coach for university students and researchers. It explains why your writing works — or doesn&apos;t — so you grow as an independent academic writer."
        ctaLabel="Analyze my writing"
        ctaHref="/analyze"
      />

      {/* Three pillars — immediately visible */}
      <section className="border-t border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-content px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <FadeIn key={p.title} delay={i * 0.08}>
                  <Card className="group h-full border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.04)]">
                    <CardContent className="p-7">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <h3 className="mt-6 font-display text-xl font-bold text-foreground">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-sm leading-[1.7] text-muted-foreground">
                        {p.description}
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features — deeper detail */}
      <section className="section-spacing">
        <div className="mx-auto max-w-content px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <SectionHeading
              align="center"
              eyebrow="What makes it different"
              title="A coach, not a ghostwriter"
              description="Most AI tools hand you finished text. LinguaLens hands you understanding — so the next draft is better because you wrote it better."
              className="mx-auto"
            />
          </FadeIn>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <FadeIn key={feature.title} delay={i * 0.05}>
                  <Card className="group h-full border-border/50 transition-all duration-200 hover:border-primary/30 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.04)]">
                    <CardContent className="p-7">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="mt-5 font-display text-lg font-bold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="mt-3 text-sm leading-[1.7] text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/60 bg-secondary/20 section-spacing">
        <div className="mx-auto max-w-content px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <SectionHeading
              align="center"
              eyebrow="How it works"
              title="From draft to deeper understanding"
              description="A simple, repeatable loop: write, get coached, revise with intent, and learn the principle behind each note."
              className="mx-auto"
            />
          </FadeIn>

          <div className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.08}>
                <div className="relative h-full rounded-2xl border border-border/50 bg-card p-7 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <span className="font-display text-5xl font-bold text-primary/20">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p
                    className="mt-3 text-sm leading-[1.7] text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Integrity highlight */}
      <section className="section-spacing">
        <div className="mx-auto max-w-content px-5 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <FadeIn>
              <SectionHeading
                eyebrow="Academic integrity"
                title="Built to make you a better writer, not a dependent one"
                description="LinguaLens is designed around a simple promise: it will never produce text for you. It exists to sharpen your thinking, your structure, and your voice — so you own every word."
              />
              <ul className="mt-8 space-y-4">
                {principles.map((p, i) => (
                  <li key={p}>
                    <FadeIn delay={i * 0.06}>
                      <span className="flex items-start gap-3 text-sm text-foreground">
                        <CheckCircle2
                          className="mt-0.5 h-5 w-5 flex-shrink-0 text-success"
                          aria-hidden="true"
                        />
                        <span dangerouslySetInnerHTML={{ __html: p }} />
                      </span>
                    </FadeIn>
                  </li>
                ))}
              </ul>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-secondary/30 p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] lg:p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-soft/60 blur-2xl"
                />
                <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
                <p className="mt-6 font-display text-xl font-bold leading-[1.5] text-foreground">
                  &ldquo;The best feedback doesn&apos;t rewrite your work. It
                  shows you how to see your own work differently.&rdquo;
                </p>
                <p className="mt-5 text-sm text-muted-foreground">
                  — The LinguaLens coaching philosophy
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/60 bg-secondary/20 section-spacing">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8 lg:px-12">
          <FadeIn>
            <SectionHeading
              align="center"
              title="Ready to write with intention?"
              description="Paste a draft and get mentor-style feedback that explains the why behind every note."
              className="mx-auto"
            />
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/analyze"
                className="group inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Start Analyzing
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/learning-hub"
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-primary/40 hover:bg-secondary/50'
                )}
              >
                Explore the Learning Hub
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
