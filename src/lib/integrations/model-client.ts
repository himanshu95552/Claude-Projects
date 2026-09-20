import { activeGenerationProvider, getEnv } from "@/lib/env";
import { callClaude } from "./claude/client";
import { callGroq } from "./groq/client";

export type ModelCallResult = {
  text: string;
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
};

/**
 * Single choke point every generate* function in src/lib/generation calls
 * through, so the rest of the generation module never has to know which
 * provider is actually configured (Anthropic wins if both keys are set —
 * see activeGenerationProvider()).
 */
export async function callModel(params: {
  anthropicModel: string;
  system: string;
  prompt: string;
  cachedSystemPrefix?: string;
  maxTokens?: number;
}): Promise<ModelCallResult> {
  const provider = activeGenerationProvider();

  if (provider === "anthropic") {
    return callClaude({
      model: params.anthropicModel,
      system: params.system,
      prompt: params.prompt,
      cachedSystemPrefix: params.cachedSystemPrefix,
      maxTokens: params.maxTokens,
    });
  }

  if (provider === "groq") {
    // Groq has no prompt-caching equivalent wired up here, so the cached
    // prefix just gets folded back into the regular system text.
    const system = params.cachedSystemPrefix
      ? `${params.cachedSystemPrefix}\n\n${params.system}`
      : params.system;
    return callGroq({
      model: getEnv().GROQ_DRAFTING_MODEL,
      system,
      prompt: params.prompt,
      maxTokens: params.maxTokens,
    });
  }

  throw new Error("callModel invoked while isDemoMode() — check isDemoMode() before calling.");
}
