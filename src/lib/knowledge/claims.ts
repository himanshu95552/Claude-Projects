/**
 * Claims control — knowledge brief §5. This is what governance flag
 * checking (src/domain/governance.ts) and generation guardrails should
 * both read from, so "what's safe to say" has exactly one source.
 */

/** Never in writing, under any framing. A governance-level blocker, not a style note. */
export const NEVER_IN_WRITING = [
  "replaces your RIS",
  "revolutionary",
  "we have no competitors",
  "we compete with RamSoft",
  "we'll take over the whole stack",
];

/** Any mention of these routes to Shamit -- never state proactively, never put in writing unprompted. */
export const ROUTE_TO_SHAMIT = [
  "any security certification claim, held or not",
  "any KLAS score, rating, or award (only the named 2023 Spotlight Report is safe, with no score attached)",
];

/**
 * Statistics deliberately not used -- widely circulated, can't be traced
 * to a primary source. A draft citing any of these should be flagged.
 */
export const UNUSABLE_STATISTICS = [
  "any fax-percentage-of-healthcare-communication figure",
  "any referral-leakage figure",
  "any call-abandonment rate",
  "advanced imaging is among the most-authorized service categories",
  "65% of denied claims are never reworked",
  "$1M/year in no-shows", // real but single-source 2018 academic center; only usable with both qualifiers attached
];

/** The unnamed case study's $2.4M figure must never be attributed to a named client. */
export const MISATTRIBUTION_RISKS = [
  "the unnamed $2.4M case study attributed to a named client",
  "the 60-70% auth-automation figure attributed to Iowa Radiology specifically rather than to the product generally",
];

/** Safe to state, always with a link where one exists. */
export const SAFE_WITH_LINK = [
  "All four published client stories/quotes (Atlantic Medical Imaging, Bright Light, Iowa Radiology, MRI Associates)",
  "The RamSoft partnership and 750+ sites",
  "The ADS integration",
  "The 2023 KLAS Spotlight Report (named, no score)",
  "Cipher Collective membership",
  "The 13 published integrations",
  "Platform volume figures (attributed as ours)",
  "The product scope, positive and negative",
];

/** Safe to name as a reference, but never quote or add invented detail. */
export const SAFE_NAME_ONLY = "Every client in the nameable-clients list (proof.ts NAMEABLE_CLIENTS) -- use as references, not evidence.";

export const RULE_ONE_FIGURE_PER_CLAIM =
  "Use the single highest current published figure per claim; never stack two versions of the same metric in one piece of content.";
