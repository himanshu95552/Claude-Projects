import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { participants } from "./participants";

/**
 * Magic-link auth, deliberately simple (build-spec.md §8: "Magic link;
 * nobody needs passwords"). A token is single-use (usedAt) and short-lived;
 * the session it creates is a separate, longer-lived, revocable row so an
 * admin can force-logout a device without touching login tokens.
 */
export const magicLinkTokens = pgTable("magic_link_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: uuid("participant_id")
    .notNull()
    .references(() => participants.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

export type MagicLinkToken = typeof magicLinkTokens.$inferSelect;
export type Session = typeof sessions.$inferSelect;
