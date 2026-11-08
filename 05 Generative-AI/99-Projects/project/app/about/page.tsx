'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Heart, Target, Eye } from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import { FadeIn } from '@/components/fade-in';
import { Card, CardContent } from '@/components/ui/card';

const values = [
  {
    icon: Target,
    title: 'Mission',
    body: 'To help every student and researcher become a stronger, more independent academic writer — through feedback that teaches, not text that replaces.',
  },
  {
    icon: Eye,
    title: 'Vision',
    body: 'A world where AI in education amplifies human learning rather than bypassing it, and where every learner has access to mentor-quality writing guidance.',
  },
  {
    icon: Heart,
    title: 'Values',
    body: 'Transparency in feedback, respect for original voice, and the belief that understanding the why matters more than producing the what.',
  },
];

const pledges = [
  'LinguaLens will never generate essays, paragraphs, or sentences on your behalf.',
  'Every piece of feedback explains its reasoning so you can learn the underlying principle.',
  'We design for growth — the aim is that you need less coaching over time.',
  'We respect academic integrity norms, citation practices, and institutional policies.',
  'Your drafts remain yours; we coach, you author.',
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Coaching that respects the craft of writing"
        description="LinguaLens AI exists because the hardest part of writing well isn't fixing typos — it's understanding why a sentence, a paragraph, or an argument lands or doesn't. We built a coach for that."
      />

      {/* Mission / Vision / Values */}
      <section className="section-spacing">
        <div className="mx-auto max-w-content px-5 sm:px-8 lg:px-12">
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <FadeIn key={v.title} delay={i * 0.08}>
                  <Card className="h-full border-border/50">
                    <CardContent className="p-7">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-6 font-display text-xl font-bold text-foreground">
                        {v.title}
                      </h3>
                      <p className="mt-3 text-sm leading-[1.7] text-muted-foreground">
                        {v.body}
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrity pledge */}
      <section className="border-t border-border/60 bg-secondary/20 section-spacing">
        <div className="mx-auto max-w-content px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <FadeIn>
              <SectionHeading
                eyebrow="Our pledge"
                title="An academic integrity commitment, not a slogan"
                description="We believe AI writing tools in education carry a real responsibility. Here is exactly what LinguaLens will and will not do — and the principles we hold ourselves to."
              />
            </FadeIn>

            <FadeIn delay={0.12}>
              <Card className="border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]">
                <CardContent className="p-7 sm:p-8">
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
                      <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Integrity pledge
                    </h3>
                  </div>
                  <ul className="mt-7 space-y-5">
                    {pledges.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-3 text-sm leading-[1.7] text-foreground"
                      >
                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-success" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8 lg:px-12">
          <FadeIn>
            <SectionHeading
              align="center"
              title="See the coaching philosophy in action"
              description="Bring a draft to the analyzer and experience feedback that explains the why."
              className="mx-auto"
            />
            <div className="mt-10">
              <Link
                href="/analyze"
                className="group inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Start Analyzing
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
