/**
 * Reply threading — linkedin-reply-handler/SKILL.md, references/
 * threading-rules.md + filtering-rules.md + reply-templates.md.
 */

export type CommentNode = {
  id: string;
  authorProfileUrl?: string;
  text: string;
  replies?: CommentNode[];
};

/**
 * LinkedIn nests replies only 2 levels deep in its data model, even though
 * the UI can visually suggest deeper threads. Every reply's parentComment
 * must be the TOP-level comment's URN — never an intermediate reply's URN.
 * Passing a 2nd-level reply's own URN causes a 400, a silently misplaced
 * comment, or an orphaned reply.
 */
export function findTopCommentUrn(
  postUrn: string,
  commentId: string,
  postComments: CommentNode[],
): string {
  for (const top of postComments) {
    if (top.id === commentId) return `urn:li:comment:(${postUrn},${commentId})`;
    for (const reply of top.replies ?? []) {
      if (reply.id === commentId) return `urn:li:comment:(${postUrn},${top.id})`;
    }
  }
  throw new Error("Comment not found in tree");
}

/**
 * Two URN forms exist: web permalinks/scrapers use the short form
 * `urn:li:comment:(activity:P,111)`; the live API returns the long form
 * `urn:li:comment:(urn:li:activity:P,111)`. Normalize short -> long. Never
 * "fix" a long-form URN back to short.
 */
export function normalizeCommentUrn(urn: string): string {
  const shortFormMatch = urn.match(/^urn:li:comment:\(activity:([^,]+),(.+)\)$/);
  if (shortFormMatch) {
    return `urn:li:comment:(urn:li:activity:${shortFormMatch[1]},${shortFormMatch[2]})`;
  }
  return urn;
}

// --- Low-value comment filter (threading-rules.md / filtering-rules.md) ---

const GENERIC_PRAISE = [
  "great post", "great share", "love this", "so true", "this!", "100%",
  "well said", "spot on", "nailed it", "facts",
];

export type FilterReason =
  | "generic_praise" | "duplicate" | "spam" | "own_comment" | null;

export type FilterResult = { keep: boolean; reason: FilterReason; note?: string };

/**
 * Run before a whole-thread sweep. `ownProfileUrl` excludes the account's
 * own comments; `seenTexts` (normalized) lets the caller detect
 * duplicate/near-duplicate template phrases across the thread.
 */
export function filterComment(params: {
  comment: CommentNode;
  ownProfileUrl?: string;
  seenNormalizedTexts: Set<string>;
}): FilterResult {
  const { comment, ownProfileUrl, seenNormalizedTexts } = params;
  const text = comment.text.trim();
  const lower = text.toLowerCase();

  if (ownProfileUrl && comment.authorProfileUrl === ownProfileUrl) {
    return { keep: false, reason: "own_comment" };
  }

  if (/https?:\/\//.test(text) && text.replace(/https?:\/\/\S+/g, "").trim().length < 10) {
    return { keep: false, reason: "spam", note: "Link-only with no context." };
  }
  if (/\b(check my profile|dm me)\b/i.test(text)) {
    return { keep: false, reason: "spam", note: "Self-promo unrelated to topic." };
  }

  // Always keep: ends in ?, disagrees/pushes back, or has a specific number/example.
  const hasQuestion = /\?/.test(text);
  const hasNumberOrExample = /\d/.test(text) || text.length > 60;
  if (hasQuestion || hasNumberOrExample) {
    // fall through to duplicate check only — content presence overrides length-based drops
  } else {
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const isGenericPhrase = GENERIC_PRAISE.some((phrase) => lower === phrase || lower === phrase + "!");
    const isEmojiOrOneWord = /^[\p{Emoji}\s]+$/u.test(text) || wordCount <= 1;
    if (isGenericPhrase || isEmojiOrOneWord || (wordCount < 4 && !hasQuestion)) {
      return { keep: false, reason: "generic_praise" };
    }
  }

  const normalized = lower.replace(/\s+/g, " ").trim();
  if (seenNormalizedTexts.has(normalized)) {
    return { keep: false, reason: "duplicate", note: "Near-duplicate template phrase already seen in this thread." };
  }

  return { keep: true, reason: null };
}

export type ReplyTemplate = { code: string; name: string; skeleton: string };

export const REPLY_TEMPLATES: ReplyTemplate[] = [
  { code: "R1", name: "Answer-Their-Question", skeleton: "[Name] [direct answer, 1 sentence]. [one concrete practice/number/example backing it]." },
  { code: "R2", name: "Concede-Then-Sharpen", skeleton: "Fair point on [conceded]. Where I'd still push is [narrow slice]. [one specific case sharpening the push-back]." },
  { code: "R3", name: "Extend-Their-Thesis", skeleton: "[Name] the piece that compounds is [new angle]. [concrete example where it's visible now]." },
  { code: "R4", name: "Share-Lived-Experience", skeleton: "[Name] we hit this exact thing last [timeframe]. [what broke, one line]. [the fix, or what you're still trying]. [one honest caveat]." },
  { code: "R5", name: "Ask-Back", skeleton: "[Name] before I dig in, what's the [missing piece] in your framing? If [scenario A], I'd answer [X]. If [scenario B], closer to [Y]. Which side are you standing in?" },
];

export const REPLY_CONSTRAINTS = {
  minChars: 150,
  maxChars: 300, // tighter than top-level comments
  emDashCapPerReply: 1,
} as const;

/**
 * Whole-thread sweep pacing rule — threading-rules.md: publish sequentially,
 * never in a burst. A dozen replies landing in the same second matches
 * automation-detection patterns. Spread batches larger than ~10; a 429 or
 * rejected publish stops the run, never a retry loop.
 */
export function planSweepPublishOrder<T>(items: T[], maxPerBurst = 10): T[][] {
  if (items.length <= maxPerBurst) return [items];
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += maxPerBurst) {
    batches.push(items.slice(i, i + maxPerBurst));
  }
  return batches;
}
