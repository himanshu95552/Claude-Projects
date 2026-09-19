import type { StageHistoryEntry } from "@/lib/db/schema";

/**
 * The engagement ladder — 02-program-design/engagement-sequence.md.
 * "Don't lead with a connection request. Build recognition first, then
 * connect." Nobody skips ahead; every transition needs evidence.
 */
export const LADDER_STAGES = [
  "cold",
  "follow",
  "warm_up",
  "recognized",
  "connect",
  "conversation",
  "handoff",
  "retired",
] as const;

export type LadderStage = (typeof LADDER_STAGES)[number];

const STAGE_ORDER: Record<LadderStage, number> = Object.fromEntries(
  LADDER_STAGES.map((stage, i) => [stage, i]),
) as Record<LadderStage, number>;

export function stageIndex(stage: LadderStage): number {
  return STAGE_ORDER[stage];
}

/**
 * Whether a target can move to `connect`. The hard gate from
 * prompt-contracts.md §4: "if stage_evidence is empty, don't generate."
 * Advancing to connect requires having passed through `recognized` with
 * real evidence — a reply, a reaction, or a repeat profile view — not a
 * timer alone (engagement-sequence.md: "stage 3 is what makes it real,
 * not a timer").
 */
export function canAdvanceToConnect(params: {
  currentStage: LadderStage;
  stageHistory: StageHistoryEntry[];
  daysSinceFollow: number | null;
  minDaysBeforeInvite: number;
  requireStage3Signal: boolean;
}): { allowed: boolean; reason: string } {
  const { currentStage, stageHistory, daysSinceFollow, minDaysBeforeInvite, requireStage3Signal } =
    params;

  if (stageIndex(currentStage) < stageIndex("recognized")) {
    return { allowed: false, reason: "Hasn't reached 'recognized' yet — no signal to act on." };
  }

  if (requireStage3Signal) {
    const hasRecognizedEvidence = stageHistory.some(
      (entry) => entry.stage === "recognized" && entry.evidence.trim().length > 0,
    );
    if (!hasRecognizedEvidence) {
      return {
        allowed: false,
        reason: "No recorded evidence for the 'recognized' transition — cannot generate a connection note without one.",
      };
    }
  }

  if (daysSinceFollow !== null && daysSinceFollow < minDaysBeforeInvite) {
    return {
      allowed: false,
      reason: `Only ${daysSinceFollow} day(s) since follow; program minimum is ${minDaysBeforeInvite}.`,
    };
  }

  return { allowed: true, reason: "Stage-3 signal present and dwell time satisfied." };
}

/** Append a stage transition, always with evidence — never silent. */
export function advanceStage(params: {
  stageHistory: StageHistoryEntry[];
  toStage: LadderStage;
  evidence: string;
  at?: Date;
}): StageHistoryEntry[] {
  if (!params.evidence.trim()) {
    throw new Error(
      `Refusing to advance to '${params.toStage}' without evidence — the ladder exists to prevent exactly this.`,
    );
  }
  return [
    ...params.stageHistory,
    {
      stage: params.toStage,
      at: (params.at ?? new Date()).toISOString(),
      evidence: params.evidence,
    },
  ];
}

/** auto-retire per build-spec.md §5 ladder config ("auto-retire (60 days)"). */
export function shouldAutoRetire(params: {
  lastTouchAt: Date | null;
  autoRetireDays: number;
  now?: Date;
}): boolean {
  if (!params.lastTouchAt) return false;
  const now = params.now ?? new Date();
  const daysSinceTouch = (now.getTime() - params.lastTouchAt.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceTouch >= params.autoRetireDays;
}

/**
 * Handoff triggers — engagement-sequence.md "Handoff to a real
 * conversation". Kept as an explicit, named function (not inline
 * conditionals in the caller) because these four conditions are exactly
 * the ones the spec calls out and nothing else should silently trigger
 * a handoff.
 */
export function evaluateHandoffTriggers(params: {
  askedWhatWeDo: boolean;
  productAdjacentEngagements: number;
  mentionedOurProblemInOwnWords: boolean;
  repeatedProfileViewsAfterExchange: boolean;
}): { shouldHandoff: boolean; triggers: string[] } {
  const triggers: string[] = [];
  if (params.askedWhatWeDo) triggers.push("asked_what_we_do");
  if (params.productAdjacentEngagements >= 3) triggers.push("three_plus_product_adjacent_engagements");
  if (params.mentionedOurProblemInOwnWords) triggers.push("mentioned_problem_in_own_words");
  if (params.repeatedProfileViewsAfterExchange) triggers.push("repeated_profile_views");

  return { shouldHandoff: triggers.length > 0, triggers };
}
