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

  const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: params.model,
      max_tokens: params.maxTokens ?? 1024,
      messages: [
        { role: "system", content: params.system },
        { role: "user", content: params.prompt },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Groq API error ${response.status}: ${body}`);
  }

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
