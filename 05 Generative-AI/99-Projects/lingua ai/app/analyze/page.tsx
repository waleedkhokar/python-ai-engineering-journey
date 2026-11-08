'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  PenLine,
  Sparkles,
  Eraser,
  FileText,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Circle,
  CloudRain,
  Trees,
  Wind,
  Bird,
  VolumeX,
  AlertCircle,
  RotateCw,
} from 'lucide-react';
import { PageHero } from '@/components/page-hero';
import { FadeIn } from '@/components/fade-in';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AnalysisResults, AnalysisErrorCard } from '@/components/analysis-results';
import { analyzeWriting, AnalysisError } from '@/lib/analyze-client';
import type { AnalysisResult } from '@/lib/analysis';
import { cn } from '@/lib/utils';
import { useFocusAudio } from '@/hooks/use-focus-audio';

const PLACEHOLDER = `Paste your essay, assignment, literature review, research proposal, thesis section, or academic paragraph here.

LinguaLens AI will analyse your writing and explain how you can improve while preserving your own ideas.`;

const EXAMPLE_TEXT = `Recent scholarship has increasingly examined the relationship between social media use and adolescent wellbeing, however the findings remain contested. This study investigates whether the type of platform usage, passive consumption versus active engagement, moderates this relationship. A total of 312 participants aged 16-18 were recruited from three secondary schools. Participants completed self-report measures of screen time, platform engagement style, and subjective wellbeing. The results indicate that passive scrolling was associated with lower wellbeing scores, whereas active engagement such as messaging close friends showed no significant negative effect. These findings suggest that the impact of social media on adolescents may depend less on overall usage time and more on how that time is spent. Future research should explore whether interventions targeting engagement style, rather than restricting access, could be more effective.`;

const CHECKLIST_STEPS = [
  'Reading your writing',
  'Understanding your ideas',
  'Analysing academic structure',
  'Preparing mentor feedback',
  'Finalising recommendations',
] as const;

const FOCUS_OPTIONS = [
  { id: 'off', label: 'Off', icon: VolumeX },
  { id: 'rain', label: 'Rain', icon: CloudRain },
  { id: 'forest', label: 'Forest', icon: Trees },
  { id: 'wind', label: 'Wind', icon: Wind },
  { id: 'birds', label: 'Birds', icon: Bird },
] as const;

type FocusOption = (typeof FOCUS_OPTIONS)[number]['id'];

type Phase = 'idle' | 'loading';
type ErrorState = { message: string; retryable: boolean } | null;

function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const matches = trimmed.match(/[^.!?]+[.!?]+(\s|$)/g);
  return matches ? matches.length : trimmed.split(/\n+/).filter(Boolean).length;
}

const STEP_INTERVAL = 850;

export default function AnalyzePage() {
  const [text, setText] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [completedStep, setCompletedStep] = useState(-1);
  const [focus, setFocus] = useState<FocusOption>('off');
  const [showEmptyPrompt, setShowEmptyPrompt] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<ErrorState>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastTextRef = useRef('');

  useFocusAudio(focus);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const sentences = countSentences(text);
    return { words, characters, sentences };
  }, [text]);

  const runAnalysis = useCallback(async (input: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPhase('loading');
    setCompletedStep(-1);
    setResult(null);
    setError(null);

    // Drive the existing checklist UI in parallel with the request.
    CHECKLIST_STEPS.forEach((_, i) => {
      window.setTimeout(() => {
        setCompletedStep((prev) => Math.max(prev, i));
      }, (i + 1) * STEP_INTERVAL);
    });

    try {
      const res = await analyzeWriting(input, controller.signal);
      if (controller.signal.aborted) return;
      setResult(res);
      setCompletedStep(CHECKLIST_STEPS.length - 1);
    } catch (err) {
      if (controller.signal.aborted) return;
      if (err instanceof AnalysisError) {
        setError({ message: err.message, retryable: err.retryable });
      } else {
        setError({
          message: 'Something went wrong while analysing your writing. Please try again.',
          retryable: true,
        });
      }
    } finally {
      if (!controller.signal.aborted) {
        setPhase('idle');
        abortRef.current = null;
      }
    }
  }, []);

  const handleAnalyze = useCallback(() => {
    if (!text.trim()) {
      setShowEmptyPrompt(true);
      return;
    }
    setShowEmptyPrompt(false);
    lastTextRef.current = text;
    void runAnalysis(text);
  }, [text, runAnalysis]);

  const handleRetry = useCallback(() => {
    const input = lastTextRef.current || text;
    if (!input.trim()) return;
    void runAnalysis(input);
  }, [text, runAnalysis]);

  const requestClear = useCallback(() => {
    if (!text.trim()) {
      setText('');
      return;
    }
    setShowClearConfirm(true);
  }, [text]);

  const confirmClear = useCallback(() => {
    setText('');
    setShowClearConfirm(false);
    setShowEmptyPrompt(false);
    setResult(null);
    setError(null);
    abortRef.current?.abort();
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, []);

  const handleExample = useCallback(() => {
    setText(EXAMPLE_TEXT);
    setShowEmptyPrompt(false);
    setResult(null);
    setError(null);
    requestAnimationFrame(() => textareaRef.current?.focus());
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Analyze"
        title="Analyze Your Academic Writing"
        description="Paste your academic writing below and receive detailed educational feedback designed to help you become a stronger academic writer."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-content px-5 sm:px-8 lg:px-12">
          <FadeIn>
            <Card className="border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]">
              <CardContent className="p-6 sm:p-8 lg:p-9">
                {/* Editor header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <PenLine className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <Label
                        htmlFor="draft"
                        className="font-display text-base font-bold text-foreground"
                      >
                        Your writing
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Your writing is sent securely for analysis.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Text editor */}
                <Textarea
                  ref={textareaRef}
                  id="draft"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    if (showEmptyPrompt) setShowEmptyPrompt(false);
                  }}
                  placeholder={PLACEHOLDER}
                  className="mt-5 min-h-[350px] resize-y rounded-2xl border-border/60 bg-secondary/20 text-sm leading-[1.75] text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary/40"
                  aria-describedby="draft-stats empty-prompt"
                  aria-label="Academic writing to analyze"
                />

                {/* Live counters */}
                <div
                  id="draft-stats"
                  className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
                  aria-live="polite"
                >
                  <StatChip label="Words" value={stats.words} />
                  <StatChip label="Characters" value={stats.characters} />
                  <StatChip label="Sentences" value={stats.sentences} />
                </div>

                {/* Empty state prompt */}
                {showEmptyPrompt && (
                  <div
                    id="empty-prompt"
                    role="status"
                    className="mt-5 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3.5 text-sm text-foreground"
                  >
                    <AlertCircle
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning"
                      aria-hidden="true"
                    />
                    <span>
                      Please paste some academic writing before starting the
                      analysis.
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={requestClear}
                    disabled={!text}
                    className="w-full sm:w-auto"
                  >
                    <Eraser className="h-4 w-4" />
                    Clear
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleExample}
                    className="w-full sm:w-auto"
                  >
                    <FileText className="h-4 w-4" />
                    Example Text
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFocus((f) => (f === 'off' ? 'rain' : 'off'))}
                    className="w-full sm:w-auto"
                    aria-pressed={focus !== 'off'}
                  >
                    <Maximize2 className="h-4 w-4" />
                    Focus Mode
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={phase === 'loading'}
                    className="w-full order-first sm:order-none sm:w-auto"
                  >
                    {phase === 'loading' ? (
                      <RotateCw className="h-4 w-4 opacity-60" aria-hidden="true" />
                    ) : (
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                    )}
                    {phase === 'loading' ? 'Analyzing…' : 'Analyze'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Focus mode panel */}
          <FadeIn>
            <FocusPanel focus={focus} onChange={setFocus} />
          </FadeIn>

          {/* Loading checklist */}
          {phase === 'loading' && (
            <FadeIn>
              <Card className="mt-8 border-border/50 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]">
                <CardContent className="p-7 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Sparkles className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-foreground">
                        Analysing your writing
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Your mentor is reading your draft carefully.
                      </p>
                    </div>
                  </div>
                  <ul
                    className="mt-6 space-y-4"
                    role="list"
                    aria-label="Analysis progress"
                    aria-live="polite"
                  >
                    {CHECKLIST_STEPS.map((step, i) => {
                      const done = i <= completedStep;
                      return (
                        <li key={step} className="flex items-center gap-3.5">
                          {done ? (
                            <CheckCircle2
                              className="h-5 w-5 flex-shrink-0 text-success transition-colors duration-200"
                              aria-hidden="true"
                            />
                          ) : (
                            <Circle
                              className="h-5 w-5 flex-shrink-0 text-muted-foreground/40"
                              aria-hidden="true"
                            />
                          )}
                          <span
                            className={cn(
                              'text-sm transition-colors duration-200',
                              done
                                ? 'font-medium text-foreground'
                                : 'text-muted-foreground'
                            )}
                          >
                            {step}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          )}

          {/* Results */}
          {result && <AnalysisResults result={result} />}

          {/* Error */}
          {error && (
            <AnalysisErrorCard
              message={error.message}
              onRetry={handleRetry}
            />
          )}
        </div>
      </section>

      {/* Clear confirmation */}
      <AlertDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear your writing?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all the text from the editor. This action
              can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep my writing</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClear}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear text
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-display text-base font-bold tabular-nums text-foreground">
        {value.toLocaleString()}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </span>
  );
}

function FocusPanel({
  focus,
  onChange,
}: {
  focus: FocusOption;
  onChange: (id: FocusOption) => void;
}) {
  const active = focus !== 'off';
  return (
    <Card className="mt-6 border-border/50">
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-primary-soft text-primary'
              )}
            >
              {active ? (
                <Minimize2 className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Maximize2 className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-foreground">
                Focus Mode
              </h2>
              <p className="text-xs text-muted-foreground">
                Ambient sounds to help you focus.
              </p>
            </div>
          </div>
        </div>

        <div
          role="radiogroup"
          aria-label="Focus mode ambience"
          className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-5"
        >
          {FOCUS_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const selected = focus === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(opt.id)}
                className={cn(
                  'flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  selected
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary/50'
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
