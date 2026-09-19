/**
 * Hook formula catalog — ported from linkedin-post-writer/SKILL.md and
 * linkedin-hook-extractor. F1-F10 are the "reference engagement" formulas
 * with concrete classification features; F11-F20 are qualitative/structural
 * (no scoring function exists in source — see EngagementGoal selection
 * instead). "2026 caveat" fields carry real platform-safety notes (e.g.
 * F6 is a target of LinkedIn's anti-"AI slop" report button) — surface
 * these to the drafting model as guardrails, not just documentation.
 */
export type HookFormulaCode =
  | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10"
  | "F11" | "F12" | "F13" | "F14" | "F15" | "F16" | "F17" | "F18" | "F19" | "F20";

export type HookFormula = {
  code: HookFormulaCode;
  name: string;
  bestFor: string;
  caveat?: string;
  structural: boolean; // F17-F20: shapes the post's logic, not its topic
};

export const HOOK_FORMULAS: Record<HookFormulaCode, HookFormula> = {
  F1: { code: "F1", name: "Platform Risk Anaphora", bestFor: "Category/platform posts, product-as-fix", structural: false },
  F2: { code: "F2", name: "R.I.P. Obituary", bestFor: "Era-ending claims, industry pivots", structural: false },
  F3: { code: "F3", name: "Year-over-Year Pivot", bestFor: "Identity shifts, founder reflection", structural: false },
  F4: {
    code: "F4", name: "Time-Anchor Confession",
    bestFor: "Vulnerability, voice reset, ICP re-targeting",
    caveat: "Use with care: needs a dated, uncomfortable fact — no 'let me be honest' framing; substance in first 3 lines.",
    structural: false,
  },
  F5: { code: "F5", name: "Self-Proving Meta", bestFor: "Commitment-based posts, tests in public", structural: false },
  F6: {
    code: "F6", name: "Comment-Gate Lead Magnet",
    bestFor: "List building",
    caveat: "Use with care: target of LinkedIn's 2026 authenticity update and 'AI slop' report button. Real deliverable only — never 'comment X to get Y'.",
    structural: false,
  },
  F7: { code: "F7", name: "Odd-Precision Money Ledger", bestFor: "Founder build-log, cost breakdowns", structural: false },
  F8: { code: "F8", name: "Paid-vs-Free Reversal", bestFor: "Free framework give-away", structural: false },
  F9: {
    code: "F9", name: "Curiosity-Gap Teaser",
    bestFor: "Emergent behavior, behind-the-scenes",
    caveat: "Use with care: teaser phrases ('what nobody tells you') are on 2026 AI-tell lists; the gap must pay off within 2 lines.",
    structural: false,
  },
  F10: { code: "F10", name: "Contrarian + Historical Receipts", bestFor: "Sacred-cow takes, AI/tech cycles", structural: false },
  F11: { code: "F11", name: "Emotional Cold-Open", bestFor: "Real story, emotional stakes (likes)", structural: false },
  F12: {
    code: "F12", name: "Permission Slip",
    bestFor: "Encouragement, reassurance",
    caveat: "Use with care: generic-frame device; needs a dated fact and must be the post's only contrast.",
    structural: false,
  },
  F13: { code: "F13", name: "Bait-and-Switch Reversal", bestFor: "Policy/process change that's an upgrade (likes)", structural: false },
  F14: { code: "F14", name: "Named Gratitude / Tribute", bestFor: "Thanking mentors/team/departing colleague (reposts)", structural: false },
  F15: { code: "F15", name: "Explain-to-Kids", bestFor: "Demystifying jargon (saves)", structural: false },
  F16: { code: "F16", name: "Status-Strip Humility", bestFor: "Senior voice wanting warmth not distance", structural: false },
  F17: { code: "F17", name: "Controlled A/B Anecdote", bestFor: "One-variable comparison, delegation/AI takes (comments)", structural: true },
  F18: {
    code: "F18", name: "False-Binary Dissolve",
    bestFor: "'Both obvious answers fail' governance/strategy",
    caveat: "Use with care: generic-frame device; must be the post's one contrast.",
    structural: true,
  },
  F19: { code: "F19", name: "Anecdote-Meets-Evidence Bridge", bestFor: "Personal noticing + a data stack (comments/saves)", structural: true },
  F20: { code: "F20", name: "Diverging-Curves Close", bestFor: "Two trajectories that diverge, quotable maxim (reposts)", structural: true },
};

export type EngagementGoal = "comments" | "reposts" | "likes" | "saves";

/** linkedin-post-writer/SKILL.md §1.2 — pick a formula by the reaction you want. */
export const GOAL_TO_FORMULAS: Record<EngagementGoal, HookFormulaCode[]> = {
  comments: ["F17", "F10", "F4", "F12", "F9"],
  reposts: ["F14", "F2", "F8"],
  likes: ["F11", "F13", "F16"],
  saves: ["F15", "F7", "F8"],
};

/**
 * Hook-level rules that apply regardless of formula (source §1.3, 2026
 * corpus data). Feed these to the drafting prompt as hard constraints.
 */
export const HOOK_RULES = {
  neverOpenWithQuestion: "Never open with a question — question-as-line-1 is -34% median likes; move it to the close instead.",
  preferNumberFirst: "Prefer an odd-precision number in line 1 — +34% median likes.",
  densityRule: "One contrast and one triad per post, maximum. Zero reveal-bridge openers ('The result?', 'Plot twist:', 'Here's what').",
  mobileHookCutoffChars: 265,
  desktopHookCutoffChars: 210,
} as const;

// --- F1-F10 classifier -----------------------------------------------

export type HookFeatures = {
  anaphoraCount?: number;
  leadsWithNumber?: boolean;
  questionHook?: boolean;
  confessionPhrase?: boolean;
  obituaryPhrase?: boolean;
  timeAnchor?: boolean;
  yearOverYear?: boolean;
  curiosityGap?: boolean;
  freeReversal?: boolean;
  publicCommitment?: boolean;
  hasNumberedList?: boolean;
  hasDatedReceipts?: boolean;
  hasLedger?: boolean;
  hasChecklist?: boolean;
  mirrorQuestion?: boolean;
  identityReframe?: boolean;
  commitmentClose?: boolean;
  softOffer?: boolean;
  commentGate?: boolean;
};

type FormulaRule = { required: string[]; boost: string[] };

/** Feature -> formula mapping, ported verbatim from classification-rules.md. */
const FORMULA_RULES: Record<string, FormulaRule> = {
  F1: { required: ["anaphoraCount>=3"], boost: ["hasNumberedList"] },
  F2: { required: ["obituaryPhrase"], boost: ["hasNumberedList", "identityReframe"] },
  F3: { required: ["yearOverYear"], boost: ["mirrorQuestion"] },
  F4: { required: ["timeAnchor||confessionPhrase"], boost: ["mirrorQuestion"] },
  F5: { required: ["publicCommitment"], boost: ["commitmentClose", "hasNumberedList"] },
  F6: { required: ["commentGate"], boost: ["hasNumberedList"] },
  F7: { required: ["leadsWithNumber", "hasLedger"], boost: ["identityReframe"] },
  F8: { required: ["freeReversal"], boost: ["hasChecklist", "softOffer"] },
  F9: { required: ["curiosityGap"], boost: [] },
  F10: { required: ["hasDatedReceipts"], boost: ["identityReframe"] },
};

function evalFeature(features: HookFeatures, expr: string): boolean {
  if (expr === "anaphoraCount>=3") return (features.anaphoraCount ?? 0) >= 3;
  if (expr === "timeAnchor||confessionPhrase") return Boolean(features.timeAnchor || features.confessionPhrase);
  return Boolean((features as Record<string, unknown>)[expr]);
}

function scoreFormula(features: HookFeatures, rule: FormulaRule): number {
  const requiredMet = rule.required.filter((r) => evalFeature(features, r)).length;
  if (requiredMet < rule.required.length) return 0;
  const boost = rule.boost.filter((b) => Boolean((features as Record<string, unknown>)[b])).length;
  return Math.min(1.0 + 0.15 * boost, 1.6);
}

export type HookClassification = { code: HookFormulaCode; confidence: number };

/** Returns up to 2 formulas scoring above 0.8 — ported from source pseudocode. */
export function classifyHook(features: HookFeatures): HookClassification[] {
  const scored = Object.entries(FORMULA_RULES)
    .map(([code, rule]) => ({ code: code as HookFormulaCode, score: scoreFormula(features, rule) }))
    .filter((s) => s.score > 0.8)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  // Normalize the raw 1.0-1.6 score range to a 0-1 confidence for display.
  return scored.map((s) => ({ code: s.code, confidence: Math.min(1, s.score / 1.6) }));
}
