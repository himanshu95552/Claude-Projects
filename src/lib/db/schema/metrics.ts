import {
  integer,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { metricSourceEnum, platformEnum } from "./enums";
import { participants } from "./participants";
import { queueItems } from "./queue";

/**
 * A point-in-time metric reading, per participant+platform or program-wide
 * (participantId null = company page / program level). Manual entry is the
 * baseline per platform-api-capabilities.md — member post analytics may
 * never be obtainable, so the schema must not assume API access.
 *
 * `queueItemId` is optional and is what makes item-level analytics
 * possible (docs/ARCHITECTURE.md's analytics section) — a snapshot tied
 * to a specific post lets the dashboard answer "which hook/pillar/format
 * actually performs," not just "how are we doing this month." A snapshot
 * with no queueItemId is a profile/page-level rollup (followers, overall
 * profile views).
 */
export const metricSnapshots = pgTable("metric_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: uuid("participant_id").references(() => participants.id, {
    onDelete: "cascade",
  }),
  queueItemId: uuid("queue_item_id").references(() => queueItems.id, { onDelete: "cascade" }),
  platform: platformEnum("platform"),

  impressions: integer("impressions"),
  reactions: integer("reactions"),
  comments: integer("comments"),
  shares: integer("shares"),
  // Save/bookmark: the single highest-intent engagement signal across every
  // platform researched (IG: "a Save is worth more than a Like"; X: bookmarks
  // weighted 10x in the ranking algorithm) — see docs/ARCHITECTURE.md §Analytics.
  saves: integer("saves"),
  clicks: integer("clicks"),
  videoViews: integer("video_views"),
  videoCompletionPct: integer("video_completion_pct"), // 0-100
  profileViews: integer("profile_views"),
  followers: integer("followers"),

  source: metricSourceEnum("source").notNull().default("manual"),
  capturedAt: timestamp("captured_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type MetricSnapshot = typeof metricSnapshots.$inferSelect;
export type NewMetricSnapshot = typeof metricSnapshots.$inferInsert;
