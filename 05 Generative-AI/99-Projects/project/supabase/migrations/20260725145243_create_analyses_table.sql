/*
# Create analyses table for LinguaLens AI

1. Purpose
   Stores the history of academic writing analyses performed through the
   Analyze page. Each row captures the original submitted text alongside the
   structured AI feedback returned by Gemini, so users can revisit past
   analyses and track their writing progress over time.

2. New Tables
   - `analyses`
     - `id` (uuid, primary key) — unique identifier for each analysis
     - `submitted_text` (text, not null) — the academic writing the user pasted
     - `word_count` (integer, not null, default 0) — word count of the submission at the time of analysis
     - `result` (jsonb, not null) — the full structured AI feedback object (overallAssessment, writingScore, strengths, areasForImprovement, mentorNotes, learningMode, rewrite, integrityAdvice, growthReflection)
     - `created_at` (timestamptz, default now()) — when the analysis was saved

3. Indexes
   - `analyses_created_at_idx` on `created_at` descending — speeds up listing
     recent analyses (the most common query pattern).

4. Security
   - Enable Row Level Security on `analyses`.
   - This is a single-tenant app with no sign-in screen, so the anon-key
     frontend must be able to read and write its own data. All four CRUD
     policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK
     (true)` because the data is intentionally shared/public within this app.
*/

CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_text text NOT NULL,
  word_count integer NOT NULL DEFAULT 0,
  result jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analyses_created_at_idx
  ON analyses (created_at DESC);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_analyses" ON analyses;
CREATE POLICY "anon_select_analyses" ON analyses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_analyses" ON analyses;
CREATE POLICY "anon_insert_analyses" ON analyses FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_analyses" ON analyses;
CREATE POLICY "anon_update_analyses" ON analyses FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_analyses" ON analyses;
CREATE POLICY "anon_delete_analyses" ON analyses FOR DELETE
  TO anon, authenticated USING (true);
