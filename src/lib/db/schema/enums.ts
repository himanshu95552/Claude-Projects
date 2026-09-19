import { pgEnum } from "drizzle-orm/pg-core";

/**
 * Central registry of every Postgres enum in the schema.
 * Keeping these in one file makes it easy to see the full state-machine
 * vocabulary of the app at a glance, and avoids enum name collisions.
 */

export const appRoleEnum = pgEnum("app_role", [
  "participant",
  "operator",
  "admin",
]);

export const employmentEnum = pgEnum("employment", [
  "employee",
  "contractor",
  "advisor",
  "founder",
]);

export const participantStatusEnum = pgEnum("participant_status", [
  "invited",
  "onboarding",
  "active",
  "paused",
  "exited",
]);

export const reviewTierEnum = pgEnum("review_tier", [
  "self_approve",
  "standard",
]);

export const emojiSettingEnum = pgEnum("emoji_setting", [
  "never",
  "rare",
  "normal",
]);

export const platformEnum = pgEnum("platform", [
  "linkedin",
  "instagram",
  "facebook",
  "x",
]);

export const platformAccountStatusEnum = pgEnum("platform_account_status", [
  "connected",
  "expiring_soon",
  "expired",
  "revoked",
]);

export const laneStatusEnum = pgEnum("lane_status", ["open", "claimed"]);

export const storyKindEnum = pgEnum("story_kind", [
  "number",
  "turning_point",
  "position",
  "anecdote",
]);

export const voiceProfileSourceEnum = pgEnum("voice_profile_source", [
  "interview",
  "writing_samples",
  "edit_diffs",
  "manual",
]);

/** The engagement ladder — see 02-program-design/engagement-sequence.md */
export const targetStageEnum = pgEnum("target_stage", [
  "cold",
  "follow",
  "warm_up",
  "recognized",
  "connect",
  "conversation",
  "handoff",
  "retired",
]);

export const queueItemTypeEnum = pgEnum("queue_item_type", [
  "publish",
  "first_hour_comment",
  "general_comment",
  "reply",
  "follow",
  "connect",
  "amplify_reshare",
  "amplify_follow_invite",
]);

/** Two fulfillment paths only — see 03-research/platform-api-capabilities.md */
export const fulfillmentEnum = pgEnum("fulfillment", [
  "api_publish",
  "manual_link",
]);

export const queueItemStatusEnum = pgEnum("queue_item_status", [
  "pending",
  "done",
  "skipped",
  "failed",
]);

export const reviewStatusEnum = pgEnum("review_status", [
  "not_required",
  "pending",
  "approved",
  "rejected",
]);

export const configScopeEnum = pgEnum("config_scope", [
  "global",
  "lane",
  "participant",
]);

export const metricSourceEnum = pgEnum("metric_source", ["manual", "api"]);

export const generationJobStatusEnum = pgEnum("generation_job_status", [
  "queued",
  "running",
  "succeeded",
  "failed",
]);

/** Creative brief format — matches the shapes researched platforms actually support. */
export const creativeFormatEnum = pgEnum("creative_format", [
  "static",
  "carousel",
  "trending", // short-form / meme-adjacent / reactive-to-a-moment format
]);

export const revisionSourceEnum = pgEnum("revision_source", [
  "original",
  "edited",
  "regenerated",
]);
