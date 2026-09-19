import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { generationJobStatusEnum } from "./enums";

/**
 * One row per nightly run. Also the backbone of the admin "spend monitor"
 * (build-spec.md §6) — cost is derived from logged token counts rather
 * than trusted from the provider dashboard, so the monthly cap can be
 * enforced in-app before a run starts.
 */
export const generationJobs = pgTable("generation_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: generationJobStatusEnum("status").notNull().default("queued"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  participantsProcessed: integer("participants_processed").notNull().default(0),
  itemsGenerated: integer("items_generated").notNull().default(0),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Per-call token/cost ledger, keyed to a job when part of the nightly run. */
export const apiUsageLog = pgTable("api_usage_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  generationJobId: uuid("generation_job_id").references(() => generationJobs.id),
  model: text("model").notNull(),
  jobType: text("job_type").notNull(), // 'research' | 'draft' | 'humanize' | 'voice_profile'
  inputTokens: integer("input_tokens").notNull(),
  outputTokens: integer("output_tokens").notNull(),
  cachedInputTokens: integer("cached_input_tokens").notNull().default(0),
  costUsd: numeric("cost_usd", { precision: 10, scale: 4 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type GenerationJob = typeof generationJobs.$inferSelect;
export type ApiUsageLogRow = typeof apiUsageLog.$inferSelect;
