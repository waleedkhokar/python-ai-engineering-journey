import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PageHero({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  className,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn('relative overflow-hidden', className)}>
      {/* Soft warm background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-radial from-primary-soft/50 via-transparent to-transparent [background-size:70%_60%] [background-position:50%_0%] [background-repeat:no-repeat]"
      />

      <div className="mx-auto max-w-content px-5 pt-20 pb-16 sm:px-8 sm:pt-24 sm:pb-20 lg:px-12 lg:pt-28 lg:pb-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {eyebrow && (
            <span
              style={{ animationDelay: '0ms' }}
              className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary"
            >
              {eyebrow}
            </span>
          )}
          <h1
            style={{ animationDelay: '80ms' }}
            className="animate-fade-up mt-6 font-display font-bold leading-[1.2] tracking-tight text-foreground text-balance [font-size:clamp(2rem,5vw+0.5rem,3.5rem)]"
          >
            {title}
          </h1>
          {description && (
            <p
              style={{ animationDelay: '160ms' }}
              className="animate-fade-up mt-6 max-w-prose text-base leading-[1.7] text-muted-foreground text-pretty sm:text-lg"
            >
              {description}
            </p>
          )}
          {ctaLabel && ctaHref && (
            <div
              style={{ animationDelay: '240ms' }}
              className="animate-fade-up mt-9"
            >
              <Link
                href={ctaHref}
                className="group inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
