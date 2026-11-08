import type { AnalysisResult } from './analysis';

export class AnalysisError extends Error {
  retryable: boolean;

  constructor(message: string, retryable = true) {
    super(message);
    this.name = 'AnalysisError';
    this.retryable = retryable;
  }
}

const REQUEST_TIMEOUT_MS = 30000;

export async function analyzeWriting(text: string, signal?: AbortSignal): Promise<AnalysisResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  let res: Response;
  try {
    res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });
  } catch (err) {
    if (signal?.aborted) {
      throw new AnalysisError('Analysis cancelled', false);
    }
    if (controller.signal.aborted) {
      throw new AnalysisError(
        'The analysis is taking longer than expected. Please try again.'
      );
    }
    throw new AnalysisError(
      'Could not reach the analysis service. Please check your connection and try again.'
    );
  } finally {
    clearTimeout(timeoutId);
  }

  let body: Record<string, unknown>;
  try {
    body = await res.json();
  } catch {
    throw new AnalysisError('Received an unexpected response from the server.');
  }

  if (!res.ok) {
    const message = typeof body.error === 'string' ? body.error : 'Something went wrong during analysis.';
    throw new AnalysisError(message, body.retryable !== false);
  }

  if (!body.result || typeof body.result !== 'object') {
    throw new AnalysisError('The analysis response was incomplete. Please try again.');
  }

  return body.result as AnalysisResult;
}
