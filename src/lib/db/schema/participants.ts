import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  appRoleEnum,
  employmentEnum,
  participantStatusEnum,
  reviewTierEnum,
} from "./enums";
import { lanes } from "./lanes";

/**
 * A real person in the program. `appRoles` is deliberately a set, not a
 * single value — Tushant is both a participant (posts under his own name)
 * and the operator (runs the nightly queue for everyone); Shamit is both
 * a participant and an admin. See build-spec.md §1 role table.
 */
export const participants = pgTable("participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  jobTitle: text("job_title").notNull(),
  employment: employmentEnum("employment").notNull().default("employee"),
  appRoles: jsonb("app_roles").$type<AppRole[]>().notNull().default(["participant"]),

  laneId: uuid("lane_id").references(() => lanes.id),

  timezone: text("timezone").notNull().default("UTC"),
  availableWindowStart: text("available_window_start"), // "17:30"
  availableWindowEnd: text("available_window_end"), // "23:30"
  reminderTime: text("reminder_time"), // "17:00"
  weeklySummaryDay: text("weekly_summary_day").notNull().default("sunday"),
  daysOff: jsonb("days_off").$type<string[]>().notNull().default([]),

  reviewTier: reviewTierEnum("review_tier").notNull().default("standard"),
  specialChecks: jsonb("special_checks").$type<string[]>().notNull().default([]),

  // Cadence (posts/week, comments/day, etc.) is deliberately NOT a column
  // here — build-spec.md §5: "if marketing might want to change it, it's
  // a setting, not a constant." It lives in the versioned `configs` table
  // as a participant-scope override, resolved via src/lib/config/resolve.ts
  // against the global defaults. This is what makes cadence change-logged
  // instead of silently overwritten.

  consentAt: timestamp("consent_at", { withTimezone: true }),
  consentVersion: text("consent_version"),

  status: participantStatusEnum("status").notNull().default("invited"),

  streakDays: integer("streak_days").notNull().default(0),
  lastQueueClearedAt: timestamp("last_queue_cleared_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type AppRole = "participant" | "operator" | "admin";
export type Participant = typeof participants.$inferSelect;
export type NewParticipant = typeof participants.$inferInsert;

export { appRoleEnum };
