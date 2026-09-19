export * from "./company";
export * from "./product";
export * from "./proof";
export * from "./claims";
export * from "./messaging";
export * from "./brand";

import { NEVER_IN_WRITING, UNUSABLE_STATISTICS } from "./claims";
import { CENTERS, POSITIONING, SCOPE_BOUNDARIES } from "./product";
import { ORIGIN_STORY, FAST_FOOD_ANALOGY } from "./company";
import { CLIENT_STORIES } from "./proof";

/**
 * Assembles the knowledge-brief context injected into generation prompts
 * (src/lib/integrations/claude/prompts.ts) so every draft about Alpha
 * Nodus/Gravity is accurate by construction rather than by hoping the
 * model remembers a fact correctly. Kept short by design -- this rides
 * inside the cached system prefix, so it's paid for once per participant,
 * not once per item.
 */
export function buildKnowledgeContext(): string {
  return [
    `Company: Alpha Nodus. Product: Gravity -- ${POSITIONING.oneLine}`,
    `Founding fact (best "why we exist" material): ${ORIGIN_STORY.summary}`,
    `Standard explanatory device: ${FAST_FOOD_ANALOGY}`,
    "",
    "Product scope -- NEVER violate these:",
    ...SCOPE_BOUNDARIES.map((s) => `- ${s}`),
    "",
    "Four centers: " + CENTERS.map((c) => `${c.name} (${c.headlineResult})`).join("; "),
    "",
    "Client proof points available (only these may be quoted, and only their real quotes -- never invent a quote or a number):",
    ...CLIENT_STORIES.map((c) => `- ${c.name}: best for "${c.bestFor}"`),
    "",
    `Never write, in any framing: ${NEVER_IN_WRITING.join(", ")}.`,
    `Never cite these unverifiable statistics: ${UNUSABLE_STATISTICS.slice(0, 3).join("; ")}, and others -- if unsure whether a stat is sourced, omit it rather than risk it.`,
  ].join("\n");
}
