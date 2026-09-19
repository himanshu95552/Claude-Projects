import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { participants } from "./participants";

/** Sunday summary per participant — app-spec.md "Weekly — the loop". */
export const weeklySummaries = pgTable("weekly_summaries", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: uuid("participant_id")
    .notNull()
    .references(() => participants.id, { onDelete: "cascade" }),
  weekStart: date("week_start").notNull(),

  postsShipped: integer("posts_shipped").notNull().default(0),
  postsPlanned: integer("posts_planned").notNull().default(0),
  queueCompletionPct: integer("queue_completion_pct").notNull().default(0),

  topPostId: uuid("top_post_id"),
  topPostSummary: text("top_post_summary"),

  whatChanged: text("what_changed"),
  participationNudgeSent: boolean("participation_nudge_sent").notNull().default(false),

  detail: jsonb("detail")
    .$type<{
      totalImpressions?: number;
      totalEngagements?: number;
      stage3Triggers?: number;
      newFollowers?: number;
    }>()
    .notNull()
    .default({}),

  generatedAt: timestamp("generated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type WeeklySummary = typeof weeklySummaries.$inferSelect;
export type NewWeeklySummary = typeof weeklySummaries.$inferInsert;
