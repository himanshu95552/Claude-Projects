/**
 * Ported verbatim from the LinkedIn humanizer skill's audit-ai-tells.md /
 * scrub-rules.md (see 04-generation-logic/skills-reference/linkedin/
 * linkedin-humanizer/). This is the "SCRUB" pass's rule catalog — strips
 * the patterns that read as machine-written. Framing per prompt-contracts.md
 * §6: this is a *writing quality* step, not detector evasion — see
 * DETECTOR_DISCLAIMER below, always surfaced alongside any audit score.
 */

const VERB_STEMS = [
  "leverag", "utiliz", "facilitat", "streamlin", "delv", "navigat",
  "unlock", "harness", "foster", "cultivat", "elevat", "empower",
];
const VERB_GROUP = VERB_STEMS.join("|");

/** Density-scored markers: count hits/paragraph. 3+ = rewrite, 2 = replace weakest, 1 = leave. */
export const DENSITY_PATTERNS: Record<string, RegExp> = {
  vocab_verbs: new RegExp(`\\b(?:${VERB_GROUP})(?:e|es|ed|ing|s)?\\b`, "gi"),
  vocab_2026:
    /\b(significant(ly)?|crucial(ly)?|notably|particularly|comprehensive|insights?|robust|landscape|nuanced|multifaceted|holistic|seamless|ecosystem)\b/gi,
  adverb_filler: /\b(fundamentally|essentially|ultimately|arguably|certainly|definitely|undoubtedly)\b/gi,
  ing_opener: /^[\s>*-]*[A-Z][a-z]+ing\b[^.\n]{0,60},/gm,
  nominalisation: /\bthe \w+(?:tion|sion|ment|ance|ence|ization|isation) of\b/gi,
  linkedin_2026:
    /\b(quietly|compound(s|ing)?|(a|the) signal|the work|built different|load-bearing|doing the heavy lifting)\b/gi,
  linkedin_2026_matters: /^\w+ matters\.$/gim,
  decaying_2024: /\b(delve|delving|tapestry|realm|intricate|journey|paradigm)\b/gi,
};

/** Single-hit patterns: one match = fix, always. */
export const AI_PATTERNS: Record<string, RegExp> = {
  en_dash: /–/g,
  double_dash: /--/g,
  reveal_bridge:
    /^(the (result|outcome|answer|lesson|catch|kicker|truth)\?|here'?s (what|how|why|the thing)\b|stop \w+[^.\n]{0,40}[.,] ?start \b|plot twist:)/gim,
  inflated_symbolism: /not just \w+, it'?s \w+/gi,
  neg_parallel: /\b(isn'?t|not) (about )?[^,.\n]{1,40}, it'?s (about )?\b/gi,
  staccato_stack: /^(\w+\. ){2,}\w+\.$/gm,
  one_word_paragraph: /^\w+\.$/gm,
  no_no_just: /\bno \w+\. no \w+\. (just|only) \w+/gi,
  all_none: /\ball (of )?the \w+\. none of the \w+/gi,
  pseudo_socratic: /\b(why|how)\? (because|simple)\b/gi,
  sincerity_marker:
    /^[\s>*-]*(let me be (honest|real|direct|clear)|i'?ll be (honest|real|direct)|honestly\?|honest (caveat|version|answer)|the honest (version|answer|truth) is|to be (direct|honest|transparent)|real talk|full transparency|can i be (honest|vulnerable)|not gonna lie|ngl|unpopular opinion)\b/gim,
  opener_filler: /^[\s>*-]*["'"]?(In today's|Have you ever|Most people don't realize|Here's a hard truth)/gim,
  closer_filler:
    /(what (do|are) you (think|your? thought)|what(?:'s| is) your (take|thoughts?)|thoughts\?|agree or disagree\?|let me know in the comments|tag someone|let that sink in|that'?s the real story)/gi,
};

/** Forensic tier: real model leakage no human produces. Always on, 1 hit = delete. */
export const FORENSIC_PATTERNS: Record<string, RegExp> = {
  model_citation: /oaicite|contentReference|turn\d+search\d+|attached_file|grok_card|oai_citation/gi,
  unfilled_placeholder: /\[(Your Name|Company Name|Insert \w+|202X-XX-XX|Link Here)\]/gi,
  outline_closer: /^in conclusion,/gim,
  knowledge_cutoff: /\bas of my (last )?(knowledge update|training (cutoff|data))\b/gi,
};

/** Aesthetic tier: decaying older vocabulary + defendable normal English. Opt-in only. */
export const AESTHETIC_PATTERNS: Record<string, RegExp> = {
  decaying_2023: /\b(delve|tapestry|realm|journey|paradigm)\b/gi,
  defendable_normal: /\b(cultivate|vibrant|garner|showcase)\b/gi,
  passive_voice: /\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi,
};

/** Phrase blacklist — single-hit, reach-negative per the 2026 corpus cited in the skill. */
export const PHRASE_BLACKLIST = [
  "in today's fast-paced world",
  "game-changer",
  "deep dive",
  "needle-moving",
  "move the needle",
  "at the end of the day",
  "when it comes to",
  "in the age of ai",
  "paradigm shift",
  "the hard truth is",
  "the uncomfortable reality is",
];

/** Negative-parallelism full 6-form list — single-hit scrub, never auto-substitute. */
export const NEGATIVE_PARALLELISM_FORMS = [
  "It's not just X, it's Y",
  "X isn't Y, it's Z",
  "Not X, but Y",
  "It's not about X, it's about Y",
  "The question isn't X, it's Y",
  "This isn't X. This is Y",
  "The real [N] isn't X, it's Y",
];

/**
 * Framed as noise-disclosure, never a pass/fail claim — prompt-contracts.md
 * §6 + the humanizer source's own §2.14: no rewrite reliably beats AI
 * detectors, and light mechanical rewriting can raise detectability. Any
 * UI surfacing an "AI-likely" score must show this alongside it.
 */
export const DETECTOR_DISCLAIMER =
  "This is a writing-quality check, not an AI-detector pass/fail. No rewrite reliably " +
  "beats AI detectors, and detectors themselves are unreliable (GPTZero flagged 61% of " +
  "non-native-English TOEFL essays as AI in a published study). Use this to catch prose " +
  "that reads flat to a human, not to chase a detector score.";
