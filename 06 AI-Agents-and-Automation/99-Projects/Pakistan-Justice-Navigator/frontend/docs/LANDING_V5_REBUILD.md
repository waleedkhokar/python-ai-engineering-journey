# Landing v0.5 — Single-Stage Cinematic Rebuild

## Why v0.4 was rejected

The previous landing page used multiple independent `min-height: 215vh` parallax sections. Although each section had motion, the visitor still experienced them as separate presentation slides with large empty intervals. That contradicted the intended “live inside the promotion” experience.

## v0.5 architecture

The landing page now uses one scroll narrative:

```text
experience-track   = 650vh
  └─ experience-stage = sticky, 100svh
       ├─ architecture / lighting world
       ├─ intro
       ├─ citizen story + floating documents
       ├─ issue organization
       ├─ official Pakistani legal source
       ├─ document intelligence
       └─ lawyer-ready brief
```

The browser computes one continuous progress value (`--p`) and overlapping phase values (`--intro`, `--story`, `--organize`, `--law`, `--docs`, `--finale`). Adjacent phases deliberately overlap so the world morphs instead of cutting to another screen.

## Motion system

- scroll-linked camera depth
- foreground/background parallax
- pointer-linked perspective on desktop
- floating legal documents moving at different Z depths
- case issue orbit
- 3D legal-book/source object
- document extraction “explosion”
- layered brief assembly
- compact scroll progress indicator
- `prefers-reduced-motion` fallback that converts the experience into readable normal sections

## Visual direction

- chocolate / walnut environment rather than flat brown blocks
- Pakistan-inspired deep green for verified/research intelligence
- warm ivory legal surfaces
- muted sand/brass accents
- no rainbow treatment
- typography is intentionally sparse and campaign-like

## Guardrails preserved

The landing page continues to avoid presenting metadata-only source candidates as verified legal provisions. It does not claim legal representation and keeps source provenance messaging intact.
