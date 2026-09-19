import { AI_PATTERNS, DENSITY_PATTERNS, FORENSIC_PATTERNS } from "./patterns";

export type MarkerHit = { name: string; match: string };
export type ScoreAction = "REWRITE_PARAGRAPH" | "REPLACE" | "REPLACE_WEAKEST" | "LEAVE";
export type ScoreResult = { hits: MarkerHit[]; count: number; action: ScoreAction };

/** "Always scrubbed" markers — checked before the density branch, regardless of count. */
const ALWAYS_SCRUB = new Set(["reveal_bridge", "neg_parallel", "sincerity_marker"]);

/**
 * Per-paragraph density scoring — the humanizer's core mechanism.
 * 3+ marker hits in one paragraph = rewrite the whole paragraph; 2 =
 * replace the weakest; a lone common-word marker is not a verdict.
 */
export function scoreParagraph(
  paragraph: string,
  markers: Record<string, RegExp> = DENSITY_PATTERNS,
): ScoreResult {
  const hits: MarkerHit[] = [];
  for (const [name, pattern] of Object.entries(markers)) {
    for (const m of paragraph.matchAll(new RegExp(pattern.source, pattern.flags))) {
      hits.push({ name, match: m[0] });
    }
  }

  const n = hits.length;
  const always = hits.filter((h) => ALWAYS_SCRUB.has(h.name));

  let action: ScoreAction;
  if (n >= 3) action = "REWRITE_PARAGRAPH";
  else if (always.length > 0) action = "REPLACE";
  else if (n === 2) action = "REPLACE_WEAKEST";
  else action = "LEAVE";

  return { hits, count: n, action };
}

/** Single-hit AI-tell patterns (reveal bridges, negative parallelism, etc.) — any hit = fix. */
export function scoreSingleHitPatterns(text: string): MarkerHit[] {
  const hits: MarkerHit[] = [];
  for (const [name, pattern] of Object.entries(AI_PATTERNS)) {
    for (const m of text.matchAll(new RegExp(pattern.source, pattern.flags))) {
      hits.push({ name, match: m[0] });
    }
  }
  return hits;
}

/** Forensic tier: real model leakage. Always on, any single hit is disqualifying. */
export function scoreForensicPatterns(text: string): MarkerHit[] {
  const hits: MarkerHit[] = [];
  for (const [name, pattern] of Object.entries(FORENSIC_PATTERNS)) {
    for (const m of text.matchAll(new RegExp(pattern.source, pattern.flags))) {
      hits.push({ name, match: m[0] });
    }
  }
  return hits;
}

/**
 * Em dash cap: ~1 per 100 words, floor 1, ceiling 2 per post. Returns the
 * count OVER the cap — 0 means leave every em dash alone. Zero em dashes
 * in a long post is itself a tell (§2.6), so this never recommends going
 * to zero.
 */
export function emDashExcess(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  const cap = Math.max(1, Math.min(2, Math.round(words / 100)));
  const count = (text.match(/—/g) || []).length;
  return Math.max(0, count - cap);
}

/** Standalone sentences under 4 words. More than 2 per post = forced rhythm. */
export function fragmentCount(text: string): number {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => {
      const n = s.split(/\s+/).filter(Boolean).length;
      return n > 0 && n < 4;
    }).length;
}

const HOLLOW_ADJECTIVES = new Set([
  "dynamic", "vibrant", "innovative", "faster", "cheaper", "better", "simple",
  "effective", "easy", "bold", "clear", "focused", "scalable", "powerful", "aesthetic",
]);
const ABSTRACT_NOUNS = new Set([
  "growth", "impact", "value", "alignment", "innovation", "efficiency", "results",
  "success", "clarity", "freedom", "scale", "momentum", "consistency", "mindset",
  "strategy", "vision",
]);

export type TriadMatch = { text: string; isHollow: boolean };

/** Rule-of-three / hollow-triad detection, ported from scrub-rules.md. */
export function detectTriads(text: string): TriadMatch[] {
  const patterns = [
    /(\w+), (\w+),? and (\w+)/gi,
    /(\w+ \w+), (\w+ \w+),? and (\w+ \w+)/gi,
    /^(\w+)\. (\w+)\. (\w+)\.$/gim,
    /\b(no \w+)[,.] (no \w+)[,.] ((?:just|only) \w+)/gi,
  ];

  const matches: TriadMatch[] = [];
  for (const pattern of patterns) {
    for (const m of text.matchAll(pattern)) {
      const items = m.slice(1, 4).map((s) => s.toLowerCase().replace(/\.$/, ""));
      const hasReceipt = items.some((item) => /\d/.test(item) || /[$%]/.test(item));
      const allAbstractOrHollow = items.every(
        (item) => HOLLOW_ADJECTIVES.has(item) || ABSTRACT_NOUNS.has(item),
      );
      matches.push({ text: m[0], isHollow: allAbstractOrHollow && !hasReceipt });
    }
  }
  return matches;
}
