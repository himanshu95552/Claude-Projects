import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicClient } from "./client";

/**
 * The Batch API is what the nightly job uses — build-spec.md §8 & §10:
 * "50% cheaper, not latency-sensitive." Everything below is a thin,
 * typed wrapper so callers never touch the SDK's batch shapes directly.
 */
export type BatchRequestItem = {
  customId: string;
  model: string;
  system: string;
  cachedSystemPrefix?: string;
  prompt: string;
  maxTokens?: number;
};

export async function submitBatch(items: BatchRequestItem[]): Promise<string> {
  const anthropic = getAnthropicClient();

  const requests: Anthropic.Messages.BatchCreateParams.Request[] = items.map((item) => {
    const system: Anthropic.Messages.TextBlockParam[] = item.cachedSystemPrefix
      ? [
          { type: "text", text: item.cachedSystemPrefix, cache_control: { type: "ephemeral" } },
          { type: "text", text: item.system },
        ]
      : [{ type: "text", text: item.system }];

    return {
      custom_id: item.customId,
      params: {
        model: item.model,
        max_tokens: item.maxTokens ?? 1024,
        system,
        messages: [{ role: "user", content: item.prompt }],
      },
    };
  });

  const batch = await anthropic.messages.batches.create({ requests });
  return batch.id;
}

export type BatchStatus = {
  id: string;
  status: "in_progress" | "canceling" | "ended";
  counts: { processing: number; succeeded: number; errored: number; canceled: number; expired: number };
};

export async function getBatchStatus(batchId: string): Promise<BatchStatus> {
  const anthropic = getAnthropicClient();
  const batch = await anthropic.messages.batches.retrieve(batchId);
  return {
    id: batch.id,
    status: batch.processing_status,
    counts: {
      processing: batch.request_counts.processing,
      succeeded: batch.request_counts.succeeded,
      errored: batch.request_counts.errored,
      canceled: batch.request_counts.canceled,
      expired: batch.request_counts.expired,
    },
  };
}

export type BatchResultItem = {
  customId: string;
  ok: boolean;
  text?: string;
  inputTokens?: number;
  outputTokens?: number;
  cachedInputTokens?: number;
  error?: string;
};

export async function getBatchResults(batchId: string): Promise<BatchResultItem[]> {
  const anthropic = getAnthropicClient();
  const results: BatchResultItem[] = [];

  for await (const entry of await anthropic.messages.batches.results(batchId)) {
    if (entry.result.type === "succeeded") {
      const message = entry.result.message;
      const textBlock = message.content.find((b) => b.type === "text");
      results.push({
        customId: entry.custom_id,
        ok: true,
        text: textBlock?.type === "text" ? textBlock.text : "",
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        cachedInputTokens: message.usage.cache_read_input_tokens ?? 0,
      });
    } else {
      results.push({
        customId: entry.custom_id,
        ok: false,
        error: entry.result.type,
      });
    }
  }

  return results;
}

/** Poll until the batch is no longer in_progress, with a sane cap on wall-clock time. */
export async function waitForBatch(
  batchId: string,
  opts: { pollIntervalMs?: number; timeoutMs?: number } = {},
): Promise<BatchStatus> {
  const pollIntervalMs = opts.pollIntervalMs ?? 30_000;
  const timeoutMs = opts.timeoutMs ?? 60 * 60 * 1000; // Anthropic batches can take up to 24h; nightly job should not block that long interactively.
  const startedAt = Date.now();

  while (true) {
    const status = await getBatchStatus(batchId);
    if (status.status === "ended") return status;
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error(`Batch ${batchId} did not finish within ${timeoutMs}ms`);
    }
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
}
