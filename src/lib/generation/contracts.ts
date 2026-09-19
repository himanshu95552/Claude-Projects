import type { CreativeSlide } from "@/lib/db/schema/creative";
import type { VoiceSliders } from "@/lib/db/schema";
import type { CreativeFormat, Platform } from "@/lib/creative/types";
import type { EngagementGoal, HookFormulaCode } from "./hooks";

/**
 * Shared input envelope — 04-generation-logic/prompt-contracts.md. Every
 * generation call receives this same base context. The stable parts
 * (participant, voice_profile, story_bank, governance) should be cached
 * as a prompt prefix — build-spec.md §8/§10: this is what makes prompt
 * caching the single biggest cost lever.
 */
export type GenerationEnvelope = {
  participant: {
    name: string;
    role: string;
    lane: {
      name: string;
      pillars: string[];
      do: string[];
      dont: string[];
    };
  };
  voiceProfile: {
    sliders: VoiceSliders;
    rules: string[];
    bannedPhrases: string[];
    emoji: "never" | "rare" | "normal";
  };
  storyBank: Array<{ kind: string; content: string }>;
  governance: {
    clearedCustomers: string[];
    bannedClaims: string[];
    phiCheck: boolean;
  };
  recentPosts: Array<{ date: string; hookType?: string; pillar?: string; text: string }>;
  config: {
    targetLength: [number, number];
    hookRotation: boolean;
    draftingModel: string;
    researchModel: string;
  };
};

export type ExplainBlock = {
  whyThisTopic?: string;
  whyThisHook?: string;
  whyThisPerson?: string;
  whyNow?: string;
  whatYouAdd?: string;
};

// --- 1. Post -----------------------------------------------------------

export type PostGenerationInput = GenerationEnvelope & {
  pillar: string;
  hookGoal: EngagementGoal;
  sourceMaterial?: string;
};

export type PostGenerationOutput = {
  text: string;
  charCount: number;
  hookType: HookFormulaCode;
  pillar: string;
  storyBankRefs: string[];
  explain: ExplainBlock;
  reviewFlags: string[];
};

// --- 1b. X (Twitter) post -------------------------------------------------

/**
 * X's constraints are entirely different from LinkedIn's (280 chars vs.
 * 1300-2500, no algorithmic reward for length) so this is its own
 * contract rather than a variant of PostGenerationInput -- reusing the
 * LinkedIn shape would mean either a 280-char LinkedIn post (wrong hook
 * pacing) or silently ignoring the length field.
 */
export type XPostGenerationInput = GenerationEnvelope & {
  pillar: string;
  sourceMaterial?: string; // typically the companion LinkedIn post, repurposed -- not translated verbatim
  allowThread: boolean;
};

export type XPostGenerationOutput = {
  text: string; // may exceed 280 -- splitIntoThread() handles the actual split at publish time
  charCount: number;
  pillar: string;
  explain: ExplainBlock;
  reviewFlags: string[];
};

// --- 1c. Creative brief (banner) ------------------------------------------

/**
 * A brand-guided visual companion, not a text repurpose of the post --
 * this is why it takes the format/spec as explicit input rather than
 * inferring them, and why its own isolated call is documented the same
 * way generateXPost's is: no conversation history carried in, a fresh
 * prompt built from the spec + brand rules + source post every time.
 */
export type CreativeBriefGenerationInput = GenerationEnvelope & {
  pillar: string;
  sourceMaterial: string; // the publish item's post text -- the idea the banner illustrates, not what it repeats verbatim
  platform: Platform;
  format: CreativeFormat;
  spec: { widthPx: number; heightPx: number; aspectRatio: string; minSlides: number; maxSlides: number; idealSlides?: number; tips: string[] };
};

export type CreativeBriefGenerationOutput = {
  platform: Platform;
  format: CreativeFormat;
  widthPx: number;
  heightPx: number;
  aspectRatio: string;
  slides: CreativeSlide[];
  cta: string | null;
  brandComplianceNotes: string[];
  explain: ExplainBlock;
};

// --- 2. Comment ----------------------------------------------------------

export type CommentGenerationInput = GenerationEnvelope & {
  targetPost: { authorName: string; authorRole: string; text: string; ageMinutes: number; reactions: number };
  targetStage: string;
  isFirstHour: boolean;
};

export type CommentGenerationOutput = {
  text: string;
  targetPostUrl: string;
  targetId: string;
  isFirstHour: boolean;
  explain: { whyThisPost: string; whatYouAdd: string };
  variants: string[];
};

// --- 3. Reply --------------------------------------------------------------

export type ReplyGenerationInput = GenerationEnvelope & {
  thread: { parentText: string; replyingToText: string };
  originalAuthorReplied: boolean;
  threadHeat: "cold" | "warm" | "hot";
};

export type ReplyGenerationOutput = CommentGenerationOutput & {
  parentCommentId: string;
  threadHeat: "cold" | "warm" | "hot";
};

// --- 4. Connection note ------------------------------------------------

export type ConnectionNoteInput = GenerationEnvelope & {
  target: { name: string; profileSummary: string };
  stageEvidence: string; // the specific prior exchange that moved them to stage 3
};

export type ConnectionNoteOutput = {
  note: string; // < 300 chars, LinkedIn's limit
  targetId: string;
  stageEvidence: string;
  explain: { whyNow: string };
};

/** Hard gate — prompt-contracts.md §4: never generate without evidence. */
export function assertConnectionNoteGate(input: ConnectionNoteInput): void {
  if (!input.stageEvidence.trim()) {
    throw new Error(
      "Refusing to generate a connection note with no stage_evidence — this would be cold outreach, which the ladder exists to prevent.",
    );
  }
}

// --- 5. Reshare commentary ----------------------------------------------

export type ReshareCommentaryInput = GenerationEnvelope & {
  companyPost: { text: string; publishedAt: string };
  rotationParticipantNames: string[]; // exactly 2, per company-page-amplification.md
};

export type ReshareCommentaryOutput = {
  text: string;
  companyPostId: string;
};

/** company-page-amplification.md: never all five, always exactly two, rotating. */
export function assertReshareRotationSize(participantNames: string[]): void {
  if (participantNames.length !== 2) {
    throw new Error(
      `Reshare rotation must be exactly 2 participants (got ${participantNames.length}) — company-page-amplification.md: "never all five".`,
    );
  }
}

// --- Model routing --------------------------------------------------------

export type GenerationJobType = "research" | "draft" | "humanize" | "voice_profile";

/** prompt-contracts.md "Model routing" table. */
export function modelForJob(
  jobType: GenerationJobType,
  config: { draftingModel: string; researchModel: string },
): string {
  switch (jobType) {
    case "research":
      return config.researchModel;
    case "draft":
    case "humanize":
    case "voice_profile":
      return config.draftingModel;
  }
}
