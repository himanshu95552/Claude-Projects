import Anthropic from "@anthropic-ai/sdk";
import { getEnv, isDemoMode } from "@/lib/env";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (isDemoMode()) {
    throw new Error("ANTHROPIC_API_KEY is not set — check isDemoMode() before calling this.");
  }
  if (!client) {
    client = new Anthropic({ apiKey: getEnv().ANTHROPIC_API_KEY });
  }
  return client;
}

export type ClaudeCallResult = {
  text: string;
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
};

// Per-million-token USD pricing, used to compute the spend-monitor ledger.
// build-spec.md §10 / architecture-options.md cost table.
const PRICING: Record<string, { input: number; output: number }> = {
  "claude-haiku-4-5": { input: 1, output: 5 },
  "claude-sonnet-5": { input: 2, output: 10 },
  "claude-opus-5": { input: 5, output: 25 },
};

export function estimateCostUsd(params: {
  model: string;
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
}): number {
  const pricing = PRICING[params.model] ?? PRICING["claude-sonnet-5"];
  // Cached input tokens are billed at a fraction of full price (~10%),
  // per Anthropic prompt caching — architecture-options.md's caching lever.
  const uncachedInput = Math.max(0, params.inputTokens - params.cachedInputTokens);
  const cost =
    (uncachedInput * pricing.input) / 1_000_000 +
    (params.cachedInputTokens * pricing.input * 0.1) / 1_000_000 +
    (params.outputTokens * pricing.output) / 1_000_000;
  return Math.round(cost * 10_000) / 10_000;
}

/**
 * A single non-batch call, used for interactive paths (e.g. the persona
 * test bench's "generate a sample" button, which needs a synchronous
 * response). The nightly job uses the Batch API instead — see ./batch.ts.
 */
export async function callClaude(params: {
  model: string;
  system: string;
  prompt: string;
  cachedSystemPrefix?: string;
  maxTokens?: number;
}): Promise<ClaudeCallResult> {
  const anthropic = getAnthropicClient();

  const systemBlocks: Anthropic.Messages.TextBlockParam[] = params.cachedSystemPrefix
    ? [
        { type: "text", text: params.cachedSystemPrefix, cache_control: { type: "ephemeral" } },
        { type: "text", text: params.system },
      ]
    : [{ type: "text", text: params.system }];

  const response = await anthropic.messages.create({
    model: params.model,
    max_tokens: params.maxTokens ?? 1024,
    system: systemBlocks,
    messages: [{ role: "user", content: params.prompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return {
    text: textBlock?.type === "text" ? textBlock.text : "",
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    cachedInputTokens: response.usage.cache_read_input_tokens ?? 0,
  };
}
