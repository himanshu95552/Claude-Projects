import {
  integer,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { metricSourceEnum, platformEnum } from "./enums";
import { participants } from "./participants";

/**
 * A point-in-time metric reading, per participant+platform or program-wide
 * (participantId null = company page / program level). Manual entry is the
 * baseline per platform-api-capabilities.md — member post analytics may
 * never be obtainable, so the schema must not assume API access.
 */
export const metricSnapshots = pgTable("metric_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: uuid("participant_id").references(() => participants.id, {
    onDelete: "cascade",
  }),
  platform: platformEnum("platform"),

  impressions: integer("impressions"),
  reactions: integer("reactions"),
  comments: integer("comments"),
  shares: integer("shares"),
  profileViews: integer("profile_views"),
  followers: integer("followers"),

  source: metricSourceEnum("source").notNull().default("manual"),
  capturedAt: timestamp("captured_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type MetricSnapshot = typeof metricSnapshots.$inferSelect;
export type NewMetricSnapshot = typeof metricSnapshots.$inferInsert;
