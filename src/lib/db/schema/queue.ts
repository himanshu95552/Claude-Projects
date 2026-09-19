import {
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  fulfillmentEnum,
  platformEnum,
  queueItemStatusEnum,
  queueItemTypeEnum,
  reviewStatusEnum,
} from "./enums";
import { participants } from "./participants";
import { targets } from "./targets";

/** One queue per participant per day. */
export const queues = pgTable("queues", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: uuid("participant_id")
    .notNull()
    .references(() => participants.id, { onDelete: "cascade" }),
  forDate: date("for_date").notNull(),

  windowStart: text("window_start"),
  windowEnd: text("window_end"),
  estimatedMinutes: integer("estimated_minutes"),

  generatedAt: timestamp("generated_at", { withTimezone: true }),
  generationJobId: uuid("generation_job_id"),

  completedCount: integer("completed_count").notNull().default(0),
  totalCount: integer("total_count").notNull().default(0),
  clearedAt: timestamp("cleared_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Queue = typeof queues.$inferSelect;
export type NewQueue = typeof queues.$inferInsert;

export type QueueItemExplain = {
  whyThisTopic?: string;
  whyThisHook?: string;
  whyThisPerson?: string;
  whyNow?: string;
  whatYouAdd?: string;
};

/**
 * A single actionable card. `fulfillment` is the load-bearing field per
 * 03-research/platform-api-capabilities.md — api_publish gets a Post
 * button wired to a real platform call, manual_link gets a copy button
 * plus an open-in-app-or-browser link. These are deliberately never
 * unified into one rendering path (build-spec.md §4).
 *
 * `editedContent` is kept separate from `content` on purpose — that diff
 * is the highest-quality voice-training signal available (build-spec.md
 * §7) and feeds the monthly voice-profile refresh.
 */
export const queueItems = pgTable("queue_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  queueId: uuid("queue_id")
    .notNull()
    .references(() => queues.id, { onDelete: "cascade" }),
  position: integer("position").notNull().default(0),

  type: queueItemTypeEnum("type").notNull(),
  fulfillment: fulfillmentEnum("fulfillment").notNull(),
  // Which platform this specific card targets. Defaults to linkedin since
  // that's the primary channel everywhere in the build spec; X/Instagram/
  // Facebook items are companion cross-posts, generated only when the
  // participant has that platform connected (see queue-builder.ts).
  platform: platformEnum("platform").notNull().default("linkedin"),

  content: text("content").notNull(),
  editedContent: text("edited_content"),
  variants: jsonb("variants").$type<string[]>().notNull().default([]),

  explain: jsonb("explain").$type<QueueItemExplain>().notNull().default({}),

  // set null (not cascade/restrict): a queue item is a historical record
  // of what was drafted and acted on — it should survive the target being
  // removed, just losing the link, rather than blocking the delete or
  // disappearing itself.
  targetId: uuid("target_id").references(() => targets.id, { onDelete: "set null" }),
  sourcePostUrl: text("source_post_url"),

  status: queueItemStatusEnum("status").notNull().default("pending"),
  skipReason: text("skip_reason"),
  actedAt: timestamp("acted_at", { withTimezone: true }),
  platformPostId: text("platform_post_id"),

  needsReview: reviewStatusEnum("review_status").notNull().default("not_required"),
  reviewFlags: jsonb("review_flags").$type<string[]>().notNull().default([]),
  reviewSlaDueAt: timestamp("review_sla_due_at", { withTimezone: true }),
  reviewedByParticipantId: uuid("reviewed_by_participant_id").references(
    () => participants.id,
  ),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewNote: text("review_note"),

  metadata: jsonb("metadata")
    .$type<{
      pillar?: string;
      hookType?: string;
      charCount?: number;
      isFirstHour?: boolean;
      stageEvidence?: string;
      rotationWeek?: string;
      companyPostId?: string;
      threadHeat?: string;
      parentCommentId?: string;
    }>()
    .notNull()
    .default({}),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type QueueItem = typeof queueItems.$inferSelect;
export type NewQueueItem = typeof queueItems.$inferInsert;
