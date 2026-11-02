# Pakistan Justice Navigator v0.5 — Verification Report

## Automated checks passed in the build workspace

- Starter corpus integrity: 35 records validated.
- Official-domain allowlist: pass.
- Five SHC placeholders detected/quarantined: pass.
- Member 4 manifest consistency: pass.
- Future acquisition folder routing (federal / Sindh / Supreme Court / SHC): pass.
- Judgment `bench` field preserved in the search contract: pass.
- Thirteen direct official PDF entries identified in the manifest: pass.
- Supabase seed/direct-URL synchronization: pass.
- Citizen-facing internal/dev-copy scan: pass.
- Member 4 synthetic chunking/content-hash test: pass.
- Section-hint detection test: pass.
- Lexical relevance ranking test: pass.
- Empty index cannot fabricate retrieval readiness: pass.
- FastAPI `/health` empty-index behavior: pass.
- FastAPI `/v1/search` metadata-only fallback: pass.
- Placeholder judgments cannot leak into fallback results: pass.
- Python service/scripts compile: pass.
- Strict project-owned TypeScript validation: pass using a temporary local type shim because npm dependencies cannot be downloaded in this sandbox.

## Service smoke test

The FastAPI service was started locally in the build workspace. `/health` correctly reported `index_ready=false` with an empty local index. A `property transfer` search returned metadata candidates with `evidence_level=metadata`, preserved the bench/provenance response contract, and returned an explicit warning instead of inventing exact provisions.

## Official-PDF acquisition test

The acquisition script was exercised, but this execution environment could not resolve the official host/DNS. The failure path behaved as designed: it returned a failure and created no unofficial substitute documents. Therefore the final artifact contains source manifests and acquisition/ingestion code, but not downloaded legal PDFs.

## Landing v0.5 verification

The rejected stacked-section landing architecture was removed from `components/parallax-home.tsx`. An automated landing check now verifies:

- one long cinematic scroll track (`650vh`)
- one sticky viewport stage
- one continuous progress variable
- overlapping intro/story/organize/law/document/finale phases
- pointer-linked depth values
- no `data-parallax-scene` or stacked `parallax-scene` sections in the landing component
- reduced-motion fallback
- CSS structural brace balance
- strict TypeScript validation of the rebuilt landing component using temporary local type shims

The container Chromium binary did not complete headless screenshot capture in this runtime because its system-bus/headless process stalled. Therefore a fresh real-browser visual pass of the exact final bytes remains part of the local release gate. This limitation is stated rather than presenting the older v0.4 screenshots as v0.5 evidence.

## Environment limitation — genuine Next.js build

The sandbox does not currently have `node_modules`, and npm registry access timed out during dependency installation. A genuine `next build` of the final bytes therefore cannot be truthfully claimed here. Temporary validation type shims are removed from the final ZIP.

Mandatory local release gate:

```powershell
npm install
npm run test:core
npm run typecheck
npm run build
npm run dev
```

If `npm run build` fails locally, do not merge; use the exact build output to debug the production configuration.
