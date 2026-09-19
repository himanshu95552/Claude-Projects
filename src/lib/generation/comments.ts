/**
 * Comment drafting rules — linkedin-comment-drafter/SKILL.md +
 * references/comment-templates.md. See prompt-contracts.md §2 for how this
 * feeds the actual generation call.
 */

export type ReactionType = "LIKE" | "PRAISE" | "EMPATHY" | "INTEREST" | "APPRECIATION" | "ENTERTAINMENT";

export type CommentTemplate = {
  code: string;
  name: string;
  skeleton: string;
  defaultReaction: ReactionType;
  note?: string;
};

export const COMMENT_TEMPLATES: CommentTemplate[] = [
  {
    code: "T1", name: "Missing-Piece", defaultReaction: "INTEREST",
    note: "Highest hit rate (~15% author-reply probability).",
    skeleton: "[Name] the [their-thesis] argument misses one piece. [what-moved]. When [their-condition], the real differentiator is [specific-skill], not [their-focus].",
  },
  { code: "T2", name: "Answer-the-Closing-Question", defaultReaction: "APPRECIATION",
    skeleton: "[direct answer, not a hedge]. [one concrete example/number]. [why this matters for their framing]." },
  { code: "T3", name: "Data-First", defaultReaction: "INTEREST",
    skeleton: "Half the [population] I see now [specific-behavior]. The [old-assumption] broke around [date/event]. [new-rule]." },
  { code: "T4", name: "Practitioner Observation", defaultReaction: "INTEREST",
    skeleton: "[Name] when [condition-A] the [system] does X, when [condition-B] it does Y. [the rule behind it]. That's when [outcome] kicks in." },
  { code: "T5", name: "Counter-with-Concession", defaultReaction: "INTEREST",
    note: "Never LIKE — reads passive.",
    skeleton: "Agree on [point-1]. The part I'd push on is [point-2]. [one reason rooted in a specific case/number]." },
  { code: "T6", name: "Quotable-Reframe", defaultReaction: "APPRECIATION",
    skeleton: "[one quotable line, <12 words, standalone]. [expansion: why true now, one concrete cause]." },
  { code: "T7", name: "Ask-a-Sharper-Question", defaultReaction: "INTEREST",
    skeleton: "[Name] the harder version of this question is [reframed, one level deeper]. Curious if you've seen [specific case]." },
  { code: "SALES-T1", name: "Account Engagement Warmup", defaultReaction: "INTEREST",
    note: "React + one reinforcing insight, no pitch/link.",
    skeleton: "[one insight that reinforces their point, no pitch, no link]." },
  { code: "SALES-T2", name: "Expertise-Building Comment", defaultReaction: "INTEREST",
    note: "2-3/day on target-account posts, spread across the day.",
    skeleton: "[industry insight]. [a proof case]." },
];

export const COMMENT_CONSTRAINTS = {
  minChars: 200,
  maxChars: 350,
  hardMaxChars: 500, // beyond this reads as a thread hijack, depresses parent post's Depth Score
  minWords: 12, // under this gets near-zero algorithmic weight
  emDashCapPer100Words: 1,
  noHashtags: true,
} as const;

/** The 4-part structure that triggers LinkedIn's "in-depth comment" signal — comment-templates.md. */
export const SUBSTANTIVE_COMMENT_CHECKLIST = [
  "References a specific point from the original post (quote or paraphrase one line)",
  "Adds the commenter's own data/test result/personal experience with a number",
  "Introduces a new keyword or angle the post didn't cover",
  "Ends with a genuine question that invites thread depth",
] as const;

const ANTI_PATTERN_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
  { name: "generic_praise", pattern: /^(great post|great share|love this)[,!.]?\s*(\[name\]|\w+)?[!.]?$/i },
  { name: "bare_agreement", pattern: /^(this\.|100%\.?|couldn'?t agree more\.?)$/i },
  { name: "negative_parallelism", pattern: /\b(isn'?t|not) [^,.\n]{1,40}, it'?s\b/i },
  { name: "rule_of_three_list", pattern: /^(\w+)\. (\w+)\. (\w+)\.$/m },
];

export type AntiPatternCheck = { passed: boolean; violations: string[] };

/** comment-templates.md §3.4 anti-patterns — auto-refused, never sent to the queue. */
export function checkCommentAntiPatterns(text: string): AntiPatternCheck {
  const violations: string[] = [];
  const trimmed = text.trim();

  for (const { name, pattern } of ANTI_PATTERN_PATTERNS) {
    if (pattern.test(trimmed)) violations.push(name);
  }

  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  if (wordCount < COMMENT_CONSTRAINTS.minWords) violations.push("too_short_for_algorithmic_weight");
  if (trimmed.length > COMMENT_CONSTRAINTS.hardMaxChars) violations.push("exceeds_thread_hijack_length");
  if (/#\w+/.test(trimmed)) violations.push("contains_hashtag");
  if (/^[\p{Emoji}\s]+$/u.test(trimmed)) violations.push("emoji_only");

  return { passed: violations.length === 0, violations };
}

/** How well a draft covers the 4-part substantive structure (comments.md §3.3). Heuristic, not authoritative. */
export function scoreSubstance(text: string): { endsWithQuestion: boolean; hasNumber: boolean; wordCount: number } {
  const trimmed = text.trim();
  return {
    endsWithQuestion: /\?\s*$/.test(trimmed),
    hasNumber: /\d/.test(trimmed),
    wordCount: trimmed.split(/\s+/).filter(Boolean).length,
  };
}
