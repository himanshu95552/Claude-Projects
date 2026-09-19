import { isDemoMode } from "@/lib/env";
import { callClaude } from "@/lib/integrations/claude/client";
import {
  buildCachedSystemPrefix,
  buildCommentPrompt,
  buildConnectionNotePrompt,
  buildPostPrompt,
  buildReplyPrompt,
  buildReshareCommentaryPrompt,
} from "@/lib/integrations/claude/prompts";
import { auditHumanizedText } from "./humanizer/audit";
import {
  demoCommentText,
  demoConnectionNote,
  demoPostText,
  demoReplyText,
  demoReshareCommentary,
} from "./demo-content";
import { evaluateGovernanceFlags } from "@/domain/governance";
import type {
  CommentGenerationInput,
  CommentGenerationOutput,
  ConnectionNoteInput,
  ConnectionNoteOutput,
  PostGenerationInput,
  PostGenerationOutput,
  ReplyGenerationInput,
  ReplyGenerationOutput,
  ReshareCommentaryInput,
  ReshareCommentaryOutput,
} from "./contracts";
import { assertConnectionNoteGate, assertReshareRotationSize, modelForJob } from "./contracts";

export type GenerationMeta = {
  isDemoContent: boolean;
  humanizerVerdict: "pass" | "warning" | "fail";
  humanizerWarnings: string[];
  humanizerBlockers: string[];
  governanceFlags: string[];
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
};

/** Best-effort JSON parse of a model response — models occasionally wrap JSON in prose or fences. */
function parseJsonResponse<T>(text: string, fallback: T): T {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return fallback;
  try {
    return { ...fallback, ...JSON.parse(match[0]) };
  } catch {
    return fallback;
  }
}

function attachMeta(
  text: string,
  usage: { inputTokens: number; outputTokens: number; cachedInputTokens: number },
  isDemoContent: boolean,
  governanceParams: { clearedCustomerNames: string[]; phiCheckRequired: boolean },
): GenerationMeta {
  const audit = auditHumanizedText(text, "strict");
  const flags = evaluateGovernanceFlags({
    text,
    clearedCustomerNames: governanceParams.clearedCustomerNames,
    phiCheckRequired: governanceParams.phiCheckRequired,
  });
  return {
    isDemoContent,
    humanizerVerdict: audit.verdict,
    humanizerWarnings: audit.warnings,
    humanizerBlockers: audit.blockers,
    governanceFlags: flags,
    ...usage,
  };
}

export async function generatePost(
  input: PostGenerationInput,
): Promise<{ output: PostGenerationOutput; meta: GenerationMeta }> {
  const storyLine = input.storyBank[0]?.content;

  if (isDemoMode()) {
    const text = demoPostText(input.pillar, storyLine);
    const meta = attachMeta(text, { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 }, true, {
      clearedCustomerNames: input.governance.clearedCustomers,
      phiCheckRequired: input.governance.phiCheck,
    });
    return {
      output: {
        text,
        charCount: text.length,
        hookType: "F9",
        pillar: input.pillar,
        storyBankRefs: [],
        explain: { whyThisTopic: "[DEMO] Placeholder rationale.", whyNow: "[DEMO] Placeholder rationale." },
        reviewFlags: meta.governanceFlags,
      },
      meta,
    };
  }

  const model = modelForJob("draft", input.config);
  const { system, prompt } = buildPostPrompt(input);
  const cachedPrefix = buildCachedSystemPrefix(input);
  const result = await callClaude({ model, system, prompt, cachedSystemPrefix: cachedPrefix, maxTokens: 1500 });

  const parsed = parseJsonResponse(result.text, {
    text: result.text,
    hookType: "F9",
    explain: {},
    storyBankRefs: [] as string[],
  });

  const meta = attachMeta(
    parsed.text,
    { inputTokens: result.inputTokens, outputTokens: result.outputTokens, cachedInputTokens: result.cachedInputTokens },
    false,
    { clearedCustomerNames: input.governance.clearedCustomers, phiCheckRequired: input.governance.phiCheck },
  );

  return {
    output: {
      text: parsed.text,
      charCount: parsed.text.length,
      hookType: parsed.hookType as PostGenerationOutput["hookType"],
      pillar: input.pillar,
      storyBankRefs: parsed.storyBankRefs ?? [],
      explain: parsed.explain ?? {},
      reviewFlags: meta.governanceFlags,
    },
    meta,
  };
}

export async function generateComment(
  input: CommentGenerationInput,
): Promise<{ output: CommentGenerationOutput; meta: GenerationMeta }> {
  if (isDemoMode()) {
    const text = demoCommentText(input.targetPost.authorName);
    const meta = attachMeta(text, { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 }, true, {
      clearedCustomerNames: input.governance.clearedCustomers,
      phiCheckRequired: input.governance.phiCheck,
    });
    return {
      output: {
        text,
        targetPostUrl: "",
        targetId: "",
        isFirstHour: input.isFirstHour,
        explain: { whyThisPost: "[DEMO]", whatYouAdd: "[DEMO]" },
        variants: [text],
      },
      meta,
    };
  }

  const model = modelForJob("draft", input.config);
  const { system, prompt } = buildCommentPrompt(input);
  const cachedPrefix = buildCachedSystemPrefix(input);
  const result = await callClaude({ model, system, prompt, cachedSystemPrefix: cachedPrefix, maxTokens: 800 });

  const parsed = parseJsonResponse(result.text, { text: result.text, variants: [result.text], explain: { whyThisPost: "", whatYouAdd: "" } });
  const meta = attachMeta(
    parsed.text,
    { inputTokens: result.inputTokens, outputTokens: result.outputTokens, cachedInputTokens: result.cachedInputTokens },
    false,
    { clearedCustomerNames: input.governance.clearedCustomers, phiCheckRequired: input.governance.phiCheck },
  );

  return {
    output: {
      text: parsed.text,
      targetPostUrl: "",
      targetId: "",
      isFirstHour: input.isFirstHour,
      explain: parsed.explain,
      variants: parsed.variants ?? [parsed.text],
    },
    meta,
  };
}

export async function generateReply(
  input: ReplyGenerationInput,
): Promise<{ output: ReplyGenerationOutput; meta: GenerationMeta }> {
  if (isDemoMode()) {
    const text = demoReplyText();
    const meta = attachMeta(text, { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 }, true, {
      clearedCustomerNames: input.governance.clearedCustomers,
      phiCheckRequired: input.governance.phiCheck,
    });
    return {
      output: {
        text,
        targetPostUrl: "",
        targetId: "",
        isFirstHour: false,
        explain: { whyThisPost: "[DEMO]", whatYouAdd: "[DEMO]" },
        variants: [text],
        parentCommentId: "",
        threadHeat: input.threadHeat,
      },
      meta,
    };
  }

  const model = modelForJob("draft", input.config);
  const { system, prompt } = buildReplyPrompt(input);
  const cachedPrefix = buildCachedSystemPrefix(input);
  const result = await callClaude({ model, system, prompt, cachedSystemPrefix: cachedPrefix, maxTokens: 500 });

  const parsed = parseJsonResponse(result.text, { text: result.text, explain: { whyThisPost: "", whatYouAdd: "" } });
  const meta = attachMeta(
    parsed.text,
    { inputTokens: result.inputTokens, outputTokens: result.outputTokens, cachedInputTokens: result.cachedInputTokens },
    false,
    { clearedCustomerNames: input.governance.clearedCustomers, phiCheckRequired: input.governance.phiCheck },
  );

  return {
    output: {
      text: parsed.text,
      targetPostUrl: "",
      targetId: "",
      isFirstHour: false,
      explain: parsed.explain,
      variants: [parsed.text],
      parentCommentId: "",
      threadHeat: input.threadHeat,
    },
    meta,
  };
}

export async function generateConnectionNote(
  input: ConnectionNoteInput,
): Promise<{ output: ConnectionNoteOutput; meta: GenerationMeta }> {
  assertConnectionNoteGate(input); // hard gate — never generate without evidence

  if (isDemoMode()) {
    const note = demoConnectionNote(input.target.name, input.stageEvidence);
    const meta = attachMeta(note, { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 }, true, {
      clearedCustomerNames: input.governance.clearedCustomers,
      phiCheckRequired: input.governance.phiCheck,
    });
    return {
      output: { note, targetId: "", stageEvidence: input.stageEvidence, explain: { whyNow: "[DEMO]" } },
      meta,
    };
  }

  const model = modelForJob("draft", input.config);
  const { system, prompt } = buildConnectionNotePrompt(input);
  const cachedPrefix = buildCachedSystemPrefix(input);
  const result = await callClaude({ model, system, prompt, cachedSystemPrefix: cachedPrefix, maxTokens: 300 });

  const parsed = parseJsonResponse(result.text, { note: result.text, explain: { whyNow: "" } });
  const meta = attachMeta(
    parsed.note,
    { inputTokens: result.inputTokens, outputTokens: result.outputTokens, cachedInputTokens: result.cachedInputTokens },
    false,
    { clearedCustomerNames: input.governance.clearedCustomers, phiCheckRequired: input.governance.phiCheck },
  );

  return {
    output: { note: parsed.note, targetId: "", stageEvidence: input.stageEvidence, explain: parsed.explain },
    meta,
  };
}

export async function generateReshareCommentary(
  input: ReshareCommentaryInput,
): Promise<{ output: ReshareCommentaryOutput; meta: GenerationMeta }> {
  assertReshareRotationSize(input.rotationParticipantNames);

  if (isDemoMode()) {
    const text = demoReshareCommentary();
    const meta = attachMeta(text, { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 }, true, {
      clearedCustomerNames: input.governance.clearedCustomers,
      phiCheckRequired: input.governance.phiCheck,
    });
    return { output: { text, companyPostId: "" }, meta };
  }

  const model = modelForJob("draft", input.config);
  const { system, prompt } = buildReshareCommentaryPrompt(input);
  const cachedPrefix = buildCachedSystemPrefix(input);
  const result = await callClaude({ model, system, prompt, cachedSystemPrefix: cachedPrefix, maxTokens: 300 });

  const parsed = parseJsonResponse(result.text, { text: result.text });
  const meta = attachMeta(
    parsed.text,
    { inputTokens: result.inputTokens, outputTokens: result.outputTokens, cachedInputTokens: result.cachedInputTokens },
    false,
    { clearedCustomerNames: input.governance.clearedCustomers, phiCheckRequired: input.governance.phiCheck },
  );

  return { output: { text: parsed.text, companyPostId: "" }, meta };
}
