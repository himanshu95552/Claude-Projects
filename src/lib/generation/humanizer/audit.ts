import { AESTHETIC_PATTERNS, PHRASE_BLACKLIST } from "./patterns";
import {
  detectTriads,
  emDashExcess,
  fragmentCount,
  scoreForensicPatterns,
  scoreParagraph,
  scoreSingleHitPatterns,
  type MarkerHit,
} from "./score";

export type HumanizerTier = "forensic" | "strict" | "aesthetic" | "all";

export type ParagraphAudit = {
  index: number;
  text: string;
  action: "REWRITE_PARAGRAPH" | "REPLACE" | "REPLACE_WEAKEST" | "LEAVE";
  hits: MarkerHit[];
};

export type HumanizerAuditResult = {
  tier: HumanizerTier;
  forensicHits: MarkerHit[];
  paragraphs: ParagraphAudit[];
  singleHitFlags: MarkerHit[];
  phraseBlacklistHits: string[];
  emDashesOverCap: number;
  fragmentsOverCap: number; // fragments beyond the 2-per-post allowance
  hollowTriadsFound: number;
  naturalTriadsOverCap: number; // 3rd+ natural triad in the post
  verdict: "pass" | "warning" | "fail";
  blockers: string[];
  warnings: string[];
};

/**
 * `--mode audit` from the source skill: detection-only, no rewrite. Runs
 * the tiered pattern set against a draft and returns pass/warning/fail
 * plus the specific findings, so a UI can show exactly what to fix.
 *
 * Tier behavior (source §2.2): forensic always runs; strict adds the
 * density-scored vocabulary + single-hit patterns (the LinkedIn-default
 * config); aesthetic is opt-in only and would flag defendable normal
 * English, so it's excluded unless explicitly requested.
 */
export function auditHumanizedText(
  text: string,
  tier: HumanizerTier = "strict",
): HumanizerAuditResult {
  const forensicHits = scoreForensicPatterns(text);

  const paragraphTexts = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const paragraphs: ParagraphAudit[] = paragraphTexts.map((p, index) => {
    const result = scoreParagraph(p);
    return { index, text: p, action: result.action, hits: result.hits };
  });

  const singleHitFlags = tier === "forensic" ? [] : scoreSingleHitPatterns(text);

  const lower = text.toLowerCase();
  const phraseBlacklistHits = PHRASE_BLACKLIST.filter((phrase) => lower.includes(phrase));

  if (tier === "aesthetic" || tier === "all") {
    for (const [name, pattern] of Object.entries(AESTHETIC_PATTERNS)) {
      for (const m of text.matchAll(new RegExp(pattern.source, pattern.flags))) {
        singleHitFlags.push({ name, match: m[0] });
      }
    }
  }

  const emDashesOverCap = emDashExcess(text);
  const totalFragments = fragmentCount(text);
  const fragmentsOverCap = Math.max(0, totalFragments - 2);

  const triads = detectTriads(text);
  const hollowTriadsFound = triads.filter((t) => t.isHollow).length;
  const naturalTriadCount = triads.length - hollowTriadsFound;
  const naturalTriadsOverCap = Math.max(0, naturalTriadCount - 1); // keep the first, scrub the rest

  const blockers: string[] = [];
  const warnings: string[] = [];

  if (forensicHits.length > 0) {
    blockers.push(
      `Model leakage detected (${forensicHits.map((h) => h.name).join(", ")}) — this is always a blocker, not a style note.`,
    );
  }

  const rewriteParagraphs = paragraphs.filter((p) => p.action === "REWRITE_PARAGRAPH");
  if (rewriteParagraphs.length > 0) {
    blockers.push(
      `${rewriteParagraphs.length} paragraph(s) score 3+ AI-tell markers and need a full rewrite (paragraph ${rewriteParagraphs.map((p) => p.index + 1).join(", ")}).`,
    );
  }

  const revealOrParallelism = singleHitFlags.filter(
    (h) => h.name === "reveal_bridge" || h.name === "neg_parallel" || h.name === "sincerity_marker",
  );
  if (revealOrParallelism.length > 0) {
    warnings.push(
      `${revealOrParallelism.length} reveal-bridge / negative-parallelism / sincerity-announcement hit(s) — single-hit scrub, always fix.`,
    );
  }

  if (phraseBlacklistHits.length > 0) {
    warnings.push(`Blacklisted phrase(s): ${phraseBlacklistHits.join(", ")}.`);
  }

  if (emDashesOverCap > 0) {
    warnings.push(`${emDashesOverCap} em dash(es) over the ~1/100-word cap.`);
  }

  if (fragmentsOverCap > 0) {
    warnings.push(`${fragmentsOverCap} standalone fragment(s) over the 2-per-post allowance.`);
  }

  if (hollowTriadsFound > 0) {
    blockers.push(`${hollowTriadsFound} hollow triad(s) (rule-of-three padding with no receipt) — scrub on sight.`);
  }

  if (naturalTriadsOverCap > 0) {
    warnings.push(`${naturalTriadsOverCap} natural triad(s) beyond the one-per-post allowance.`);
  }

  const replaceWeakestCount = paragraphs.filter((p) => p.action === "REPLACE_WEAKEST").length;
  if (replaceWeakestCount > 0) {
    warnings.push(`${replaceWeakestCount} paragraph(s) at borderline density (2 markers) — replace the weakest.`);
  }

  const verdict: HumanizerAuditResult["verdict"] =
    blockers.length > 0 ? "fail" : warnings.length > 3 ? "fail" : warnings.length > 0 ? "warning" : "pass";

  return {
    tier,
    forensicHits,
    paragraphs,
    singleHitFlags,
    phraseBlacklistHits,
    emDashesOverCap,
    fragmentsOverCap,
    hollowTriadsFound,
    naturalTriadsOverCap,
    verdict,
    blockers,
    warnings,
  };
}

/**
 * The 5 required human fingerprints per source §2.8 — checked heuristically
 * (a human/LLM reviewer should confirm; this only catches the mechanical
 * absence of a plausible marker, e.g. no digits anywhere in the text).
 */
export function checkHumanFingerprints(text: string): {
  hasNumberWithContext: boolean;
  hasNamedEntity: boolean;
  fragmentCountWithinBudget: boolean;
} {
  return {
    hasNumberWithContext: /\$?\d[\d,]*(\.\d+)?%?/.test(text),
    hasNamedEntity: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/.test(text) || /\b[A-Z][a-z]{2,}\b/.test(text),
    fragmentCountWithinBudget: fragmentCount(text) <= 2,
  };
}
