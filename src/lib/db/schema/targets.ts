import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { targetStageEnum } from "./enums";
import { participants } from "./participants";

export type StageHistoryEntry = {
  stage: string;
  at: string; // ISO timestamp
  evidence: string;
};

/**
 * A prospect moving through the engagement ladder — see
 * 02-program-design/engagement-sequence.md. `stageHistory` is the audit
 * trail the ladder's "the same request at stage 4 is a person they already
 * recognize" claim depends on: every stage transition must carry the
 * evidence that earned it.
 */
export const targets = pgTable("targets", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerParticipantId: uuid("owner_participant_id")
    .notNull()
    .references(() => participants.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  title: text("title"),
  center: text("center"),
  centerSize: integer("center_size"),
  linkedinUrl: text("linkedin_url").notNull(),

  stage: targetStageEnum("stage").notNull().default("cold"),
  stageHistory: jsonb("stage_history").$type<StageHistoryEntry[]>().notNull().default([]),

  isCollaborationCandidate: boolean("is_collaboration_candidate").notNull().default(false),
  notes: text("notes"),

  lastTouchAt: timestamp("last_touch_at", { withTimezone: true }),
  retireAt: timestamp("retire_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Target = typeof targets.$inferSelect;
export type NewTarget = typeof targets.$inferInsert;
