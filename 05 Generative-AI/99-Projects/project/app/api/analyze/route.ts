import { NextResponse } from 'next/server';
import { validateAnalysisResult } from '@/lib/analysis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SYSTEM_INSTRUCTION = `You are LinguaLens AI, a mentor-style academic writing coach for university students and researchers.

Your role is to TEACH, not to replace the writer. You must:
- Analyse the user's academic writing and explain how it can improve while preserving the writer's own ideas.
- Be specific, constructive, and kind — like a supportive research mentor.
- Never generate an essay for the user. The "rewrite" field must be a SHORT mentor-style example of improved phrasing for at most one or two sentences, not a full rewrite.
- Explain the reasoning behind suggestions so the student learns the underlying principle.
- Respect academic integrity, citation norms, and original voice.

Return ONLY valid JSON using exactly this shape, with no markdown, no code fences, and no extra commentary:
{
  "overallAssessment": "string: a warm, honest summary of the writing's current state",
  "writingScore": {
    "overall": number 0-100,
    "grammar": number 0-100,
    "cohesion": number 0-100,
    "coherence": number 0-100,
    "academicTone": number 0-100,
    "vocabulary": number 0-100
  },
  "strengths": ["string", ...] specific things the writer did well,
  "areasForImprovement": ["string", ...] specific, actionable weaknesses with reasoning,
  "mentorNotes": "string: a personal note from the mentor explaining priorities and how to approach revision",
  "learningMode": ["string", ...] recommended topics or skills to study next,
  "rewrite": "string: a SHORT mentor-style example of improved phrasing for at most one or two sentences",
  "integrityAdvice": "string: guidance on maintaining academic integrity relevant to this writing",
  "growthReflection": "string: a reflective question or prompt to help the writer grow"
}`;

function errorResponse(message: string, status: number, retryable = true) {
  return NextResponse.json({ error: message, retryable }, { status });
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return errorResponse(
      'The analysis service is not configured yet. Please try again later.',
      503,
      false
    );
  }

  let body: { text?: unknown };
  try {
    body = await req.json();
  } catch {
    return errorResponse('Could not read your request. Please try again.', 400);
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (!text) {
    return errorResponse('Please paste some academic writing before starting the analysis.', 422, false);
  }
  if (text.length > 12000) {
    return errorResponse('That submission is a bit long. Please trim it to under 12,000 characters and try again.', 422, false);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    let geminiRes: Response;
    try {
      geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            contents: [
              {
                role: 'user',
                parts: [{ text: `Analyse this academic writing and return structured feedback as JSON:\n\n${text}` }],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              responseMimeType: 'application/json',
            },
          }),
          signal: controller.signal,
        }
      );
    } catch {
      if (controller.signal.aborted) {
        return errorResponse('The analysis is taking longer than expected. Please try again.', 504);
      }
      return errorResponse('Something went wrong while reaching the analysis service. Please try again.', 500);
    }

    if (!geminiRes.ok) {
      if (geminiRes.status === 429) {
        return errorResponse('The analysis service is busy right now. Please wait a moment and try again.', 503);
      }
      if (geminiRes.status >= 500) {
        return errorResponse('The analysis service had a temporary issue. Please try again.', 502);
      }
      return errorResponse('The analysis service declined the request. Please try again.', 502);
    }

    const geminiBody = await geminiRes.json();
    const rawText: string | undefined =
      geminiBody?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return errorResponse('The analysis came back empty. Please try again.', 502);
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          return errorResponse('The analysis response could not be understood. Please try again.', 502);
        }
      } else {
        return errorResponse('The analysis response could not be understood. Please try again.', 502);
      }
    }

    const result = validateAnalysisResult(parsed);
    return NextResponse.json({ result });
  } catch {
    return errorResponse('Something went wrong while reaching the analysis service. Please try again.', 500);
  } finally {
    clearTimeout(timeoutId);
  }
}
