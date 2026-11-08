export interface FetchOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  const timeoutMs = options?.timeoutMs || 65000; // 65 seconds
  const maxRetries = options?.retries !== undefined ? options.retries : 1;

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= maxRetries) {
    attempt++;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const fetchOptions: RequestInit = {
        ...options,
        signal: controller.signal,
      };

      const response = await fetch(url, fetchOptions);
      clearTimeout(timer);

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();

      if (!contentType.includes('application/json') && !text.trim().startsWith('{') && !text.trim().startsWith('[')) {
        if (!response.ok) {
          throw new Error(`Server request failed with status ${response.status} (${response.statusText}).`);
        }
        throw new Error('File upload failed. Please try again.');
      }

      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Unable to read this scan. Please upload a clearer image or try again.');
      }

      if (!response.ok) {
        throw new Error(data?.error || data?.message || `Server returned error status ${response.status}`);
      }

      return data as T;
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        lastError = new Error('AI processing timed out. Please retry.');
      } else {
        lastError = err instanceof Error ? err : new Error(String(err));
      }

      // If network transient error and retries remain, wait and retry
      if (attempt <= maxRetries && (err.name === 'AbortError' || err.message?.includes('Failed to fetch') || err.message?.includes('502') || err.message?.includes('503'))) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }
      break;
    }
  }

  throw lastError || new Error('File upload failed. Please try again.');
}
