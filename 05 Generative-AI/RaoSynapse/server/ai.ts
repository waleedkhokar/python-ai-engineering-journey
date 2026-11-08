export type AIInputMessage = { role: 'user' | 'assistant'; content: string };

export const aiStatus = () => ({
  configured: !!process.env.GROQ_API_KEY,
  provider: process.env.GROQ_API_KEY ? 'Groq' : 'Preview responder',
  model: process.env.GROQ_API_KEY ? (process.env.GROQ_MODEL || 'openai/gpt-oss-20b') : 'preview-responder',
});

function previewText(prompt: string) {
  const subject = prompt.trim().replace(/\s+/g, ' ').slice(0, 180);
  return `**Preview responder — Groq is not configured.**\n\nI received your prompt: “${subject}${prompt.length > 180 ? '…' : ''}”\n\nHere is a practical way to develop it:\n\n1. **Define the outcome.** Write down what a useful answer would let you do.\n2. **Separate facts from assumptions.** Save claims that need evidence as research notes.\n3. **Break the problem into parts.** Identify constraints, alternatives, and the smallest testable next step.\n4. **Bring in another perspective.** Create a Room and invite a collaborator to challenge or extend the thinking.\n5. **Preserve the result.** Share a snapshot or fork the conversation when you want to explore a new direction.\n\nThis response demonstrates the live RaoSynapse workflow, but it is not AI-generated research and should not be treated as a factual answer. Add a server-side \`GROQ_API_KEY\` to enable real Groq responses.`;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function* streamAI(messages: AIInputMessage[], signal?: AbortSignal): AsyncGenerator<string> {
  const status = aiStatus();
  const prompt = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  if (!status.configured) {
    const text = previewText(prompt);
    const chunks = text.match(/.{1,90}(?:\s|$)|.{1,90}/g) || [text];
    for (const chunk of chunks) {
      if (signal?.aborted) return;
      await sleep(35);
      yield chunk;
    }
    return;
  }

  const requestController = new AbortController();
  const abortRequest = () => requestController.abort();
  signal?.addEventListener('abort', abortRequest, { once: true });
  const timeout = setTimeout(() => requestController.abort(), 45_000);
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    signal: requestController.signal,
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: status.model,
      stream: true,
      temperature: 0.4,
      max_tokens: 1600,
      messages: [
        {
          role: 'system',
          content: 'You are Synapse AI inside RaoSynapse, a collaborative research workspace. Be clear, rigorous, and honest. Distinguish facts from uncertainty. Never invent citations, sources, authors, dates, or current web access. Use concise Markdown when helpful.',
        },
        ...messages.slice(-20),
      ],
    }),
  }).finally(() => {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abortRequest);
  });

  if (!response.ok) {
    const detail = await response.text();
    const error = new Error(`Groq request failed (${response.status})`) as Error & { status?: number; detail?: string };
    error.status = response.status;
    error.detail = detail.slice(0, 500);
    throw error;
  }
  if (!response.body) throw new Error('Groq returned an empty stream.');

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
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (typeof delta === 'string' && delta) yield delta;
      } catch { /* Ignore incomplete SSE chunks; the remaining buffer handles continuation. */ }
    }
  }
}

export async function completeAI(messages: AIInputMessage[]) {
  let content = '';
  for await (const delta of streamAI(messages)) content += delta;
  return content;
}
