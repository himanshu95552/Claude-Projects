import { getEnv } from "@/lib/env";

/**
 * Groq's chat completions endpoint is OpenAI-compatible, so this is a
 * plain fetch rather than a dedicated SDK — one fewer dependency for a
 * single-endpoint integration.
 */
const GROQ_CHAT_COMPLETIONS_URL = "https://api.groq.com/openai/v1/chat/completions";

export type GroqCallResult = {
  text: string;
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
};

const MAX_RATE_LIMIT_RETRIES = 4;

/** Seconds to wait before retrying a 429 — from the retry-after header, the
 * error body's "try again in Xs" (free-tier TPM errors put it there instead
 * of a header), or a 5s fallback. */
function retryDelaySeconds(response: Response, body: string): number {
  const header = response.headers.get("retry-after");
  if (header && !Number.isNaN(Number(header))) return Number(header);

  const match = body.match(/try again in ([\d.]+)s/i);
  if (match) return Number(match[1]);

  return 5;
}

export async function callGroq(params: {
  model: string;
  system: string;
  prompt: string;
  maxTokens?: number;
}): Promise<GroqCallResult> {
  const apiKey = getEnv().GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set — check the active generation provider before calling this.");
  }

  const requestBody = JSON.stringify({
    model: params.model,
    max_tokens: params.maxTokens ?? 1024,
    messages: [
      { role: "system", content: params.system },
      { role: "user", content: params.prompt },
    ],
  });

  let lastError = "";
  for (let attempt = 0; attempt <= MAX_RATE_LIMIT_RETRIES; attempt++) {
    const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: requestBody,
    });

    if (response.ok) {
      const data = await response.json();
      const text: string = data.choices?.[0]?.message?.content ?? "";
      return {
        text,
        inputTokens: data.usage?.prompt_tokens ?? 0,
        outputTokens: data.usage?.completion_tokens ?? 0,
        // Groq doesn't expose Anthropic-style cache-read token accounting.
        cachedInputTokens: 0,
      };
    }

    const responseBody = await response.text().catch(() => "");
    lastError = `Groq API error ${response.status}: ${responseBody}`;

    // Free-tier TPM limits are hit routinely with a chain of generation
    // calls per participant — this is an expected, retryable condition,
    // not a bug. Anything else (bad key, bad model) fails immediately.
    if (response.status !== 429 || attempt === MAX_RATE_LIMIT_RETRIES) {
      throw new Error(lastError);
    }
    const delaySeconds = retryDelaySeconds(response, responseBody);
    await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
  }

  throw new Error(lastError);
}
