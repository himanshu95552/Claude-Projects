import { GOAL_TO_FORMULAS, HOOK_FORMULAS, HOOK_RULES } from "@/lib/generation/hooks";
import { COMMENT_CONSTRAINTS, COMMENT_TEMPLATES, SUBSTANTIVE_COMMENT_CHECKLIST } from "@/lib/generation/comments";
import { REPLY_CONSTRAINTS, REPLY_TEMPLATES } from "@/lib/generation/replies";
import { buildKnowledgeContext } from "@/lib/knowledge";
import type {
  CommentGenerationInput,
  ConnectionNoteInput,
  GenerationEnvelope,
  PostGenerationInput,
  ReplyGenerationInput,
  ReshareCommentaryInput,
  XPostGenerationInput,
} from "@/lib/generation/contracts";

/**
 * Builds the cached system prefix (stable across every call for a
 * participant) and the per-call system suffix, per prompt-contracts.md:
 * "Cache this prefix — it's identical across all calls for a participant
 * and is most of the input tokens."
 */
export function buildCachedSystemPrefix(envelope: GenerationEnvelope): string {
  return [
    `You are drafting social content for ${envelope.participant.name}, ${envelope.participant.role} at Alpha Nodus.`,
    `Lane: ${envelope.participant.lane.name}. Pillars: ${envelope.participant.lane.pillars.join(", ") || "none set"}.`,
    envelope.participant.lane.do.length
      ? `Do: ${envelope.participant.lane.do.join("; ")}`
      : "",
    envelope.participant.lane.dont.length
      ? `Don't: ${envelope.participant.lane.dont.join("; ")}`
      : "",
    "",
    "Voice profile:",
    `- Sliders (0-100): formality=${envelope.voiceProfile.sliders.formality}, sentenceLength=${envelope.voiceProfile.sliders.sentenceLength}, hedging=${envelope.voiceProfile.sliders.hedging}, humor=${envelope.voiceProfile.sliders.humor}, directness=${envelope.voiceProfile.sliders.directness}, technicalDepth=${envelope.voiceProfile.sliders.technicalDepth}`,
    `- Emoji: ${envelope.voiceProfile.emoji}`,
    envelope.voiceProfile.rules.length ? `- Rules, in their own words: ${envelope.voiceProfile.rules.join("; ")}` : "",
    envelope.voiceProfile.bannedPhrases.length
      ? `- Never use: ${envelope.voiceProfile.bannedPhrases.join(", ")}`
      : "",
    "",
    "Story bank (draw on at least one entry per post — this is what stops drafts reading generic):",
    ...envelope.storyBank.map((s) => `- [${s.kind}] ${s.content}`),
    "",
    "Alpha Nodus / Gravity knowledge base — the accuracy source for any company/product fact, stat, or proof point:",
    buildKnowledgeContext(),
    "",
    "Governance — cleared customers and compliance rules:",
    `- Cleared customer names (only these may be referenced, and only with real specifics): ${envelope.governance.clearedCustomers.join(", ") || "none"}`,
    envelope.governance.bannedClaims.length
      ? `- Never claim: ${envelope.governance.bannedClaims.join("; ")}`
      : "",
    envelope.governance.phiCheck ? "- PHI check is ON: never include any patient-identifying or clinical detail." : "",
    "",
    "Recent posts (avoid repeating hook type or pillar back-to-back):",
    ...envelope.recentPosts.map((p) => `- ${p.date} [${p.pillar ?? "?"}/${p.hookType ?? "?"}]: ${p.text.slice(0, 100)}...`),
    "",
    "Writing-quality rules (not detector evasion — see humanizer methodology):",
    "- Never open with a question. Prefer an odd-precision number in the first line.",
    "- One contrast and one triad per post, maximum. No reveal-bridge openers ('The result?', \"Here's what\").",
    "- Cap em dashes at ~1 per 100 words. Never zero in a long post, never more than 2.",
    "- Include: one number with a named referent, one named entity, one first-person sensory detail, one flat stated fact (no 'let me be honest' framing).",
    "- Match the voice profile's own words, not a flattened 'plain' register.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildPostPrompt(input: PostGenerationInput): { system: string; prompt: string } {
  const formulaCodes = GOAL_TO_FORMULAS[input.hookGoal];
  const formulas = formulaCodes.map((code) => HOOK_FORMULAS[code]);

  const system = [
    `Task: draft one LinkedIn post for the "${input.pillar}" pillar.`,
    `Target length: ${input.config.targetLength[0]}-${input.config.targetLength[1]} characters.`,
    `Hook must land in the first ${HOOK_RULES.desktopHookCutoffChars} characters.`,
    "End with a genuine question. 0-3 hashtags. No external links in the body.",
    "",
    "Choose ONE hook formula from this list (matched to the engagement goal):",
    ...formulas.map((f) => `- ${f.code} ${f.name}: best for ${f.bestFor}${f.caveat ? ` — ${f.caveat}` : ""}`),
    input.sourceMaterial ? `\nSource material to draw from: ${input.sourceMaterial}` : "",
    "",
    "Respond with JSON only: { text, hookType, explain: { whyThisTopic, whyThisHook, whyNow }, storyBankRefs: string[] }",
  ]
    .filter(Boolean)
    .join("\n");

  return { system, prompt: "Generate the post now." };
}

export function buildXPostPrompt(input: XPostGenerationInput): { system: string; prompt: string } {
  const system = [
    `Task: draft an X (Twitter) post for the "${input.pillar}" pillar.`,
    input.allowThread
      ? "Prefer a single post under 280 characters. If the idea genuinely needs more room, write up to ~4 short posts as a thread -- each one a complete thought, none of them padding to hit a count."
      : "Hard limit: 280 characters. One idea, said plainly. No thread.",
    "",
    "X-specific rules (from 2026 platform research, distinct from LinkedIn):",
    "- Replies and bookmarks are weighted far more heavily than likes in ranking -- write something worth replying to or saving, not just agreeing with.",
    "- No engagement-bait patterns ('like if you agree', 'RT if...') -- these are actively detected and suppressed.",
    "- Early-engagement velocity (the first 30-60 min) matters most -- the hook has to work with zero scroll context, X has no 'see more' truncation to rely on.",
    "- Conversational register is fine here even if the LinkedIn voice is more formal -- X rewards replies, and nobody replies to a press release.",
    input.sourceMaterial
      ? `\nRepurpose from (don't translate verbatim -- find the one sharpest idea in it): ${input.sourceMaterial}`
      : "",
    "",
    "Respond with JSON only: { text, explain: { whyThisTopic, whyNow } }",
  ]
    .filter(Boolean)
    .join("\n");

  return { system, prompt: "Generate the X post now." };
}

export function buildCommentPrompt(input: CommentGenerationInput): { system: string; prompt: string } {
  const system = [
    `Task: draft ${input.isFirstHour ? "a first-hour" : "a"} comment on this post.`,
    `Author: ${input.targetPost.authorName}, ${input.targetPost.authorRole}. Posted ${input.targetPost.ageMinutes} minutes ago, ${input.targetPost.reactions} reactions.`,
    `Post text: "${input.targetPost.text}"`,
    "",
    `Constraints: ${COMMENT_CONSTRAINTS.minChars}-${COMMENT_CONSTRAINTS.maxChars} characters, ${COMMENT_CONSTRAINTS.minWords}+ words, no hashtags, no emoji unless the source post uses them.`,
    "Must hit all four of:",
    ...SUBSTANTIVE_COMMENT_CHECKLIST.map((rule) => `- ${rule}`),
    "",
    "Never generic agreement. Never mention Alpha Nodus or pitch anything.",
    "Available templates for structure (pick the best fit, don't force one):",
    ...COMMENT_TEMPLATES.slice(0, 7).map((t) => `- ${t.code} ${t.name}: ${t.skeleton}`),
    "",
    "Respond with JSON only: { text, variants: string[] (2-3 alternatives), explain: { whyThisPost, whatYouAdd } }",
  ].join("\n");

  return { system, prompt: "Generate the comment now." };
}

export function buildReplyPrompt(input: ReplyGenerationInput): { system: string; prompt: string } {
  const system = [
    "Task: draft a reply in an existing comment thread.",
    `Parent comment: "${input.thread.parentText}"`,
    `Replying to: "${input.thread.replyingToText}"`,
    `Original post author has replied in this thread: ${input.originalAuthorReplied ? "yes (warm signal)" : "no"}. Thread heat: ${input.threadHeat}.`,
    "",
    `Constraints: ${REPLY_CONSTRAINTS.minChars}-${REPLY_CONSTRAINTS.maxChars} characters — tighter than a top-level comment. Continue the conversation, don't close it. Shorter than the comment you're answering.`,
    "Available templates:",
    ...REPLY_TEMPLATES.map((t) => `- ${t.code} ${t.name}: ${t.skeleton}`),
    "",
    "Respond with JSON only: { text, explain: { whyThisPost, whatYouAdd } }",
  ].join("\n");

  return { system, prompt: "Generate the reply now." };
}

export function buildConnectionNotePrompt(input: ConnectionNoteInput): { system: string; prompt: string } {
  const system = [
    "Task: draft a LinkedIn connection request note.",
    `Target: ${input.target.name}. ${input.target.profileSummary}`,
    `The specific prior exchange that earned this invite: "${input.stageEvidence}"`,
    "",
    "Constraints: under 300 characters. Must reference the actual exchange above, specifically. No pitch, no meeting ask. Reads as a person, not a template.",
    "",
    "Respond with JSON only: { note, explain: { whyNow } }",
  ].join("\n");

  return { system, prompt: "Generate the connection note now." };
}

export function buildReshareCommentaryPrompt(input: ReshareCommentaryInput): { system: string; prompt: string } {
  const system = [
    "Task: draft 2-4 sentences of reshare commentary for the company page post below, from this participant's own vantage point.",
    `Company post: "${input.companyPost.text}"`,
    "",
    "Must add something the original post didn't say. Never sound like the other rotation participant this week — write distinctly.",
    "Respond with JSON only: { text }",
  ].join("\n");

  return { system, prompt: "Generate the reshare commentary now." };
}
