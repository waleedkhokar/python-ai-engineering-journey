'use client';

import {
  Sparkles,
  TrendingUp,
  ThumbsUp,
  AlertTriangle,
  GraduationCap,
  PenLine,
  ShieldCheck,
  Compass,
  Lightbulb,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';
import { SCORE_LABELS, type AnalysisResult, type WritingScore } from '@/lib/analysis';
import { cn } from '@/lib/utils';

function scoreTone(score: number): string {
  if (score >= 80) return 'bg-success';
  if (score >= 60) return 'bg-warning';
  return 'bg-destructive';
}

function scoreLabelTone(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-destructive';
}

function ResultShell({
  icon: Icon,
  title,
  eyebrow,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <FadeIn>
      <Card
        className={cn(
          'h-full border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]',
          className
        )}
      >
        <CardContent className="p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              {eyebrow && (
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {eyebrow}
                </p>
              )}
              <h3 className="font-display text-lg font-bold leading-tight text-foreground">
                {title}
              </h3>
            </div>
          </div>
          <div className="mt-5">{children}</div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className={cn('font-display font-bold tabular-nums', scoreLabelTone(score))}>
          {score}
        </span>
      </div>
      <div
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} score`}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', scoreTone(score))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function BulletList({ items, icon: Icon, tone }: { items: string[]; icon: React.ComponentType<{ className?: string }>; tone: string }) {
  if (items.length === 0) {
    return <p className="text-sm leading-relaxed text-muted-foreground">Nothing noted here.</p>;
  }
  return (
    <ul className="space-y-3.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm leading-[1.7] text-foreground">
          <Icon className={cn('mt-0.5 h-5 w-5 flex-shrink-0', tone)} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function AnalysisResults({ result }: { result: AnalysisResult }) {
  const score = result.writingScore;
  return (
    <div
      className="mt-10 space-y-6"
      role="region"
      aria-label="Analysis results"
    >
      {/* Overall assessment — full width */}
      <ResultShell icon={Sparkles} title="Overall Assessment" eyebrow="Summary">
        <p className="text-sm leading-[1.75] text-foreground">{result.overallAssessment}</p>
      </ResultShell>

      {/* Writing score — full width */}
      <ResultShell icon={TrendingUp} title="Writing Score" eyebrow="Breakdown">
        <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
          {SCORE_LABELS.map(({ key, label }) => (
            <ScoreBar key={key} label={label} score={score[key]} />
          ))}
        </div>
      </ResultShell>

      {/* Strengths + Areas — two columns on desktop */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ResultShell icon={ThumbsUp} title="Strengths" eyebrow="What works">
          <BulletList items={result.strengths} icon={ThumbsUp} tone="text-success" />
        </ResultShell>
        <ResultShell icon={AlertTriangle} title="Areas for Improvement" eyebrow="Focus here">
          <BulletList items={result.areasForImprovement} icon={AlertTriangle} tone="text-warning" />
        </ResultShell>
      </div>

      {/* Mentor notes — full width */}
      <ResultShell icon={GraduationCap} title="Research Mentor Notes" eyebrow="From your mentor">
        <p className="text-sm leading-[1.75] text-foreground">{result.mentorNotes}</p>
      </ResultShell>

      {/* Learning mode — full width */}
      <ResultShell icon={Compass} title="Learning Mode" eyebrow="Study next">
        {result.learningMode.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted-foreground">No specific topics suggested.</p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {result.learningMode.map((topic, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-2 text-sm text-foreground"
              >
                <Lightbulb className="h-4 w-4 text-primary" aria-hidden="true" />
                {topic}
              </span>
            ))}
          </div>
        )}
      </ResultShell>

      {/* Academic rewrite — full width */}
      {result.rewrite && (
        <ResultShell icon={PenLine} title="Academic Rewrite" eyebrow="Mentor example">
          <div className="rounded-xl border border-primary/20 bg-primary-soft/30 p-5">
            <p className="text-sm italic leading-[1.75] text-foreground">
              &ldquo;{result.rewrite}&rdquo;
            </p>
          </div>
        </ResultShell>
      )}

      {/* Integrity + Growth — two columns on desktop */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ResultShell icon={ShieldCheck} title="Academic Integrity Advice" eyebrow="Stay honest">
          <p className="text-sm leading-[1.75] text-foreground">{result.integrityAdvice}</p>
        </ResultShell>
        <ResultShell icon={Compass} title="Growth Reflection" eyebrow="Think on this">
          <p className="text-sm leading-[1.75] text-foreground">{result.growthReflection}</p>
        </ResultShell>
      </div>
    </div>
  );
}

export function AnalysisErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <FadeIn>
      <Card className="mt-10 border-destructive/30 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
        <CardContent className="p-7">
          <div className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-foreground">
                Analysis couldn&apos;t complete
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {message}
              </p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Retry analysis
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
