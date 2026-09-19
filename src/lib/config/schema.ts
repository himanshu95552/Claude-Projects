import { z } from "zod";

/**
 * The full settings surface, per build-spec.md §5. Every group here is a
 * partial — a lane or participant override only needs to specify the keys
 * it changes; everything else falls through to the layer below. `resolve()`
 * in ./resolve.ts does a deep-merge across global -> lane -> participant,
 * in that order, so a later layer always wins on the keys it sets.
 *
 * These defaults are the numbers from build-spec.md §5 and
 * engagement-sequence.md, used to seed the global config row.
 */

export const cadenceSchema = z.object({
  postsPerWeek: z.number().min(0),
  commentsPerDay: z.number().min(0),
  repliesPerDay: z.number().min(0),
  followsPerDay: z.number().min(0),
  connectionInvitesPerDay: z.number().min(0),
  pageFollowInvitesPerMonth: z.number().min(0),
  pageResharesPerWeek: z.number().min(0),
});
export type Cadence = z.infer<typeof cadenceSchema>;

export const timingSchema = z.object({
  timezone: z.string(),
  queueDeliveryTime: z.string(), // "17:00"
  preferredPostingWindowStart: z.string(), // "17:30"
  preferredPostingWindowEnd: z.string(), // "23:30"
  reminderDelayMinutes: z.number().min(0),
  weeklySummaryDay: z.enum([
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  ]),
  daysOff: z.array(z.string()),
});
export type Timing = z.infer<typeof timingSchema>;

export const targetingSchema = z.object({
  keywords: z.array(z.string()),
  geography: z.string(),
  centerSizeMin: z.number().min(0),
  centerSizeMax: z.number().min(0),
  targetJobTitles: z.array(z.string()),
  trendingReactionThreshold: z.number().min(0),
  firstHourCutoffMinutes: z.number().min(0),
  itemsPerQueue: z.number().min(0),
});
export type Targeting = z.infer<typeof targetingSchema>;

export const ladderSchema = z.object({
  touchesBeforeInvite: z.number().min(0),
  minDaysBeforeInvite: z.number().min(0),
  requireStage3Signal: z.boolean(),
  warmReplyWindowHours: z.number().min(0),
  autoRetireDays: z.number().min(0),
  recommendedCommentsPerDayMin: z.number().min(0),
  recommendedCommentsPerDayMax: z.number().min(0),
});
export type Ladder = z.infer<typeof ladderSchema>;

export const contentSchema = z.object({
  postLengthMin: z.number().min(0),
  postLengthMax: z.number().min(0),
  hookRotation: z.boolean(),
  carouselsPerWeek: z.number().min(0),
  bannedPhrases: z.array(z.string()),
  ctaStyle: z.string(),
});
export type Content = z.infer<typeof contentSchema>;

export const voiceSchema = z.object({
  sliders: z.object({
    formality: z.number().min(0).max(100),
    sentenceLength: z.number().min(0).max(100),
    hedging: z.number().min(0).max(100),
    humor: z.number().min(0).max(100),
    directness: z.number().min(0).max(100),
    technicalDepth: z.number().min(0).max(100),
  }),
  emoji: z.enum(["never", "rare", "normal"]),
  freetextRules: z.array(z.string()),
  bannedPhrases: z.array(z.string()),
});
export type VoiceConfig = z.infer<typeof voiceSchema>;

export const governanceSchema = z.object({
  reviewTier: z.enum(["self_approve", "standard"]),
  specialChecks: z.array(z.string()),
  reviewSlaHours: z.number().min(0),
  reviewTriggers: z.array(z.string()),
});
export type GovernanceConfig = z.infer<typeof governanceSchema>;

export const modelSchema = z.object({
  draftingModel: z.string(),
  researchModel: z.string(),
  batchMode: z.boolean(),
  cachingEnabled: z.boolean(),
  monthlySpendCapUsd: z.number().min(0),
});
export type ModelConfig = z.infer<typeof modelSchema>;

export const settingsSchema = z.object({
  cadence: cadenceSchema.partial().optional(),
  timing: timingSchema.partial().optional(),
  targeting: targetingSchema.partial().optional(),
  ladder: ladderSchema.partial().optional(),
  content: contentSchema.partial().optional(),
  voice: voiceSchema.partial().optional(),
  governance: governanceSchema.partial().optional(),
  model: modelSchema.partial().optional(),
});
export type Settings = z.infer<typeof settingsSchema>;

/**
 * Fully-resolved settings — every field required, after global -> lane ->
 * participant merge. Nothing downstream should ever see a partial config.
 */
export type ResolvedSettings = {
  cadence: Cadence;
  timing: Timing;
  targeting: Targeting;
  ladder: Ladder;
  content: Content;
  voice: VoiceConfig;
  governance: GovernanceConfig;
  model: ModelConfig;
};

/**
 * The program defaults. Every number here is cited from build-spec.md §5
 * and engagement-sequence.md — nothing invented. This is the seed for the
 * `global` config row; from then on, changes go through the versioned
 * config system, not this file.
 */
export const GLOBAL_DEFAULTS: ResolvedSettings = {
  cadence: {
    postsPerWeek: 3,
    commentsPerDay: 6,
    repliesPerDay: 5,
    followsPerDay: 5,
    connectionInvitesPerDay: 4,
    pageFollowInvitesPerMonth: 20,
    pageResharesPerWeek: 1,
  },
  timing: {
    timezone: "America/New_York",
    queueDeliveryTime: "17:00",
    preferredPostingWindowStart: "17:30",
    preferredPostingWindowEnd: "23:30",
    reminderDelayMinutes: 60,
    weeklySummaryDay: "sunday",
    daysOff: [],
  },
  targeting: {
    keywords: [],
    geography: "United States",
    centerSizeMin: 1,
    centerSizeMax: 500,
    targetJobTitles: [],
    trendingReactionThreshold: 15,
    firstHourCutoffMinutes: 90,
    itemsPerQueue: 8,
  },
  ladder: {
    touchesBeforeInvite: 2,
    minDaysBeforeInvite: 7,
    requireStage3Signal: true,
    warmReplyWindowHours: 24,
    autoRetireDays: 60,
    recommendedCommentsPerDayMin: 5,
    recommendedCommentsPerDayMax: 8,
  },
  content: {
    postLengthMin: 1300,
    postLengthMax: 2500,
    hookRotation: true,
    carouselsPerWeek: 0,
    bannedPhrases: ["excited to announce", "game-changer", "thrilled to share", "revolutionary", "replaces your RIS"],
    ctaStyle: "genuine-question",
  },
  voice: {
    sliders: {
      formality: 50,
      sentenceLength: 50,
      hedging: 30,
      humor: 30,
      directness: 60,
      technicalDepth: 50,
    },
    emoji: "never",
    freetextRules: [],
    bannedPhrases: [],
  },
  governance: {
    reviewTier: "standard",
    specialChecks: [],
    reviewSlaHours: 4,
    reviewTriggers: ["customer_name_mentioned", "unverified_claim", "phi_risk", "banned_claim", "unsourced_statistic", "needs_shamit_routing"],
  },
  model: {
    draftingModel: "claude-sonnet-5",
    researchModel: "claude-haiku-4-5",
    batchMode: true,
    cachingEnabled: true,
    monthlySpendCapUsd: 30,
  },
};
