import { isDemoMode } from "@/lib/env";
import { callModel } from "@/lib/integrations/model-client";
import {
  buildCachedSystemPrefix,
  buildCommentPrompt,
  buildConnectionNotePrompt,
  buildCreativeBriefPrompt,
  buildPostPrompt,
  buildRegenerationPrompt,
  buildReplyPrompt,
  buildReshareCommentaryPrompt,
  buildXPostPrompt,
} from "@/lib/integrations/claude/prompts";
import { auditHumanizedText } from "./humanizer/audit";
import {
  demoCommentText,
  demoConnectionNote,
  demoCreativeBriefSlides,
  demoPostText,
  demoRegeneratedText,
  demoReplyText,
  demoReshareCommentary,
  demoXPostText,
} from "./demo-content";
import { evaluateGovernanceFlags } from "@/domain/governance";
import type {
  CommentGenerationInput,
  CommentGenerationOutput,
  ConnectionNoteInput,
  ConnectionNoteOutput,
  CreativeBriefGenerationInput,
  CreativeBriefGenerationOutput,
  PostGenerationInput,
  PostGenerationOutput,
  RegenerationInput,
  RegenerationOutput,
  ReplyGenerationInput,
  ReplyGenerationOutput,
  ReshareCommentaryInput,
  ReshareCommentaryOutput,
  XPostGenerationInput,
  XPostGenerationOutput,
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
  const result = await callModel({ anthropicModel: model, system, prompt, cachedSystemPrefix: cachedPrefix, maxTokens: 1500 });

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

/**
 * X posts are always generated in their own isolated call, never as a
 * continuation of the LinkedIn generatePost() call above — each
 * generate* function opens a fresh model context (a new prompt, the
 * cached prefix, nothing else), so a companion X post never inherits
 * conversational state from the post it was repurposed from. That's the
 * "generate a new session so context isn't carried forward" rule applied
 * everywhere in this module, not just here.
 */
export async function generateXPost(
  input: XPostGenerationInput,
): Promise<{ output: XPostGenerationOutput; meta: GenerationMeta }> {
  if (isDemoMode()) {
    const text = demoXPostText(input.pillar);
    const meta = attachMeta(text, { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 }, true, {
      clearedCustomerNames: input.governance.clearedCustomers,
      phiCheckRequired: input.governance.phiCheck,
    });
    return {
      output: {
        text,
        charCount: text.length,
        pillar: input.pillar,
        explain: { whyThisTopic: "[DEMO] Placeholder rationale." },
        reviewFlags: meta.governanceFlags,
      },
      meta,
    };
  }

  const model = modelForJob("draft", input.config);
  const { system, prompt } = buildXPostPrompt(input);
  const cachedPrefix = buildCachedSystemPrefix(input);
  const result = await callModel({ anthropicModel: model, system, prompt, cachedSystemPrefix: cachedPrefix, maxTokens: 600 });

  const parsed = parseJsonResponse(result.text, { text: result.text, explain: { whyThisTopic: "" } });
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
      pillar: input.pillar,
      explain: parsed.explain,
      reviewFlags: meta.governanceFlags,
    },
    meta,
  };
}

/**
 * Same isolated-call rule as generateXPost: a fresh prompt built from the
 * spec + brand rules + the source post's text every time, never a
 * continuation of the call that drafted that post. This is also what
 * makes "regenerate" safe to expose in the UI -- every regenerate is a
 * brand-new session, not a nudge on the model's prior answer, so it can't
 * drift from the AN27 rules over repeated regenerations the way a
 * multi-turn "make it better" conversation would.
 */
export async function generateCreativeBrief(
  input: CreativeBriefGenerationInput,
): Promise<{ output: CreativeBriefGenerationOutput; meta: GenerationMeta }> {
  const slideCount = input.spec.maxSlides === 1 ? 1 : input.spec.idealSlides ?? input.spec.minSlides;

  if (isDemoMode()) {
    const slides = demoCreativeBriefSlides(input.pillar, slideCount);
    const combinedText = slides.map((s) => [s.heading, s.subheading, s.bodyText].filter(Boolean).join(" ")).join(" ");
    const meta = attachMeta(combinedText, { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 }, true, {
      clearedCustomerNames: input.governance.clearedCustomers,
      phiCheckRequired: input.governance.phiCheck,
    });
    return {
      output: {
        platform: input.platform,
        format: input.format,
        widthPx: input.spec.widthPx,
        heightPx: input.spec.heightPx,
        aspectRatio: input.spec.aspectRatio,
        slides,
        cta: slideCount > 1 ? "[DEMO] Learn more" : null,
        brandComplianceNotes: ["[DEMO] Brand compliance notes appear here once generation is connected."],
        explain: { whyThisHook: "[DEMO] Placeholder rationale.", whatYouAdd: "[DEMO] Placeholder rationale." },
      },
      meta,
    };
  }

  const model = modelForJob("draft", input.config);
  const { system, prompt } = buildCreativeBriefPrompt(input);
  const cachedPrefix = buildCachedSystemPrefix(input);
  const result = await callModel({ anthropicModel: model, system, prompt, cachedSystemPrefix: cachedPrefix, maxTokens: 1500 });

  const fallbackSlides = demoCreativeBriefSlides(input.pillar, slideCount);
  const parsed = parseJsonResponse(result.text, {
    slides: fallbackSlides,
    cta: null as string | null,
    brandComplianceNotes: [] as string[],
    explain: {},
  });

  const combinedText = parsed.slides
    .map((s: { heading: string; subheading?: string; bodyText?: string }) => [s.heading, s.subheading, s.bodyText].filter(Boolean).join(" "))
    .join(" ");
  const meta = attachMeta(
    combinedText,
    { inputTokens: result.inputTokens, outputTokens: result.outputTokens, cachedInputTokens: result.cachedInputTokens },
    false,
    { clearedCustomerNames: input.governance.clearedCustomers, phiCheckRequired: input.governance.phiCheck },
  );

  return {
    output: {
      platform: input.platform,
      format: input.format,
      widthPx: input.spec.widthPx,
      heightPx: input.spec.heightPx,
      aspectRatio: input.spec.aspectRatio,
      slides: parsed.slides,
      cta: parsed.cta ?? null,
      brandComplianceNotes: parsed.brandComplianceNotes ?? [],
      explain: parsed.explain ?? {},
    },
    meta,
  };
}

/**
 * "Mark & regenerate" — same isolated-call rule as every other generate*
 * function: a fresh prompt built from the previous draft + marked lines +
 * reason, never a continuation of the call that produced that draft (and
 * never a continuation of a PRIOR regenerate either — each click is its
 * own session, so five regenerates in a row can't drift into a back-and-
 * forth the model is "remembering").
 */
export async function generateRegeneratedContent(
  input: RegenerationInput,
): Promise<{ output: RegenerationOutput; meta: GenerationMeta }> {
  if (isDemoMode()) {
    const text = demoRegeneratedText(input.reason, input.markedExcerpts.length);
    const meta = attachMeta(text, { inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 }, true, {
      clearedCustomerNames: input.governance.clearedCustomers,
      phiCheckRequired: input.governance.phiCheck,
    });
    return {
      output: { text, explain: { whatYouAdd: "[DEMO] Placeholder rationale." } },
      meta,
    };
  }

  const model = modelForJob("draft", input.config);
  const { system, prompt } = buildRegenerationPrompt(input);
  const cachedPrefix = buildCachedSystemPrefix(input);
  const result = await callModel({ anthropicModel: model, system, prompt, cachedSystemPrefix: cachedPrefix, maxTokens: 1500 });

  const parsed = parseJsonResponse(result.text, { text: result.text, explain: {} });
  const meta = attachMeta(
    parsed.text,
    { inputTokens: result.inputTokens, outputTokens: result.outputTokens, cachedInputTokens: result.cachedInputTokens },
    false,
    { clearedCustomerNames: input.governance.clearedCustomers, phiCheckRequired: input.governance.phiCheck },
  );

  return { output: { text: parsed.text, explain: parsed.explain ?? {} }, meta };
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
  const result = await callModel({ anthropicModel: model, system, prompt, cachedSystemPrefix: cachedPrefix, maxTokens: 800 });

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
  const result = await callModel({ anthropicModel: model, system, prompt, cachedSystemPrefix: cachedPrefix, maxTokens: 500 });

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
  const result = await callModel({ anthropicModel: model, system, prompt, cachedSystemPrefix: cachedPrefix, maxTokens: 300 });

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
  const result = await callModel({ anthropicModel: model, system, prompt, cachedSystemPrefix: cachedPrefix, maxTokens: 300 });

  const parsed = parseJsonResponse(result.text, { text: result.text });
  const meta = attachMeta(
    parsed.text,
    { inputTokens: result.inputTokens, outputTokens: result.outputTokens, cachedInputTokens: result.cachedInputTokens },
    false,
    { clearedCustomerNames: input.governance.clearedCustomers, phiCheckRequired: input.governance.phiCheck },
  );

  return { output: { text: parsed.text, companyPostId: "" }, meta };
}
