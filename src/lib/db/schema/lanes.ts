import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { laneStatusEnum } from "./enums";

/**
 * One lane per participant, never shared — see 02-program-design/lanes.md.
 * `heldByParticipantId` is nullable and set from the participants table
 * (defined after this file) rather than a hard FK here, to avoid a circular
 * reference; the application layer enforces one-active-holder-per-lane.
 */
export const lanes = pgTable("lanes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  targetsPersona: text("targets_persona").notNull(),
  pillars: jsonb("pillars").$type<string[]>().notNull().default([]),
  doRules: jsonb("do_rules").$type<string[]>().notNull().default([]),
  dontRules: jsonb("dont_rules").$type<string[]>().notNull().default([]),
  status: laneStatusEnum("status").notNull().default("open"),
  heldByParticipantId: uuid("held_by_participant_id"),
  isHighValue: boolean("is_high_value").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Lane = typeof lanes.$inferSelect;
export type NewLane = typeof lanes.$inferInsert;
