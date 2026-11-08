export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('X-RaoSynapse-Client', 'web');
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(path, { ...options, headers, credentials: 'same-origin' });
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    const message = typeof payload === 'object' && payload?.error
      ? (typeof payload.error === 'string' ? payload.error : payload.error.message)
      : `Request failed (${response.status})`;
    const code = typeof payload === 'object' ? (payload.code || payload.error?.code) : undefined;
    throw new ApiError(message || 'Request failed.', response.status, code);
  }
  return payload as T;
}

export const json = (value: unknown) => JSON.stringify(value);
export const clientId = () => crypto.randomUUID();

export async function streamAI(
  conversationId: string,
  content: string,
  idempotencyId: string,
  signal: AbortSignal,
  onEvent: (event: any) => void,
) {
  const response = await fetch(`/api/conversations/${conversationId}/ai`, {
    method: 'POST',
    credentials: 'same-origin',
    signal,
    headers: { 'Content-Type': 'application/json', 'X-RaoSynapse-Client': 'web' },
    body: JSON.stringify({ content, clientId: idempotencyId }),
  });
  if (!response.ok) {
    const payload = await response.json();
    throw new ApiError(payload.error || 'AI request failed.', response.status, payload.code);
  }
  if (!response.body) throw new ApiError('Streaming is unavailable in this browser.', 500);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (line.trim()) onEvent(JSON.parse(line));
    }
  }
  if (buffer.trim()) onEvent(JSON.parse(buffer));
}

export function toast(message: string, tone: 'success' | 'error' | 'info' = 'info') {
  window.dispatchEvent(new CustomEvent('raosynapse-toast', { detail: { message, tone } }));
}

export async function copyText(text: string, label = 'Copied to clipboard') {
  await navigator.clipboard.writeText(text);
  toast(label, 'success');
}
