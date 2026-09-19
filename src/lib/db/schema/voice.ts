import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { emojiSettingEnum, storyKindEnum, voiceProfileSourceEnum } from "./enums";
import { participants } from "./participants";

export type VoiceSliders = {
  formality: number; // 0-100
  sentenceLength: number; // 0-100 (short -> long)
  hedging: number; // 0-100
  humor: number; // 0-100
  directness: number; // 0-100
  technicalDepth: number; // 0-100
};

/**
 * Versioned, never overwritten — build-spec.md §7: "config is versioned,
 * not overwritten" applies just as much to voice as to settings. Only one
 * row per participant has isCurrent = true at a time; history stays for
 * the test bench's "compare against current" and for auditing drift.
 */
export const voiceProfiles = pgTable("voice_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: uuid("participant_id")
    .notNull()
    .references(() => participants.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  isCurrent: boolean("is_current").notNull().default(true),

  sliders: jsonb("sliders").$type<VoiceSliders>().notNull(),
  freetextRules: jsonb("freetext_rules").$type<string[]>().notNull().default([]),
  bannedPhrases: jsonb("banned_phrases").$type<string[]>().notNull().default([]),
  emojiSetting: emojiSettingEnum("emoji_setting").notNull().default("never"),

  source: voiceProfileSourceEnum("source").notNull().default("manual"),
  sourceNotes: text("source_notes"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type VoiceProfile = typeof voiceProfiles.$inferSelect;
export type NewVoiceProfile = typeof voiceProfiles.$inferInsert;

/** The reservoir every draft pulls from — see prompt-contracts.md. */
export const storyBankEntries = pgTable("story_bank_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: uuid("participant_id")
    .notNull()
    .references(() => participants.id, { onDelete: "cascade" }),
  kind: storyKindEnum("kind").notNull(),
  content: text("content").notNull(),
  usedInPostIds: jsonb("used_in_post_ids").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type StoryBankEntry = typeof storyBankEntries.$inferSelect;
export type NewStoryBankEntry = typeof storyBankEntries.$inferInsert;
