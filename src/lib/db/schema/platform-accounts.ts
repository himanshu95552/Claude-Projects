import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { platformAccountStatusEnum, platformEnum } from "./enums";
import { participants } from "./participants";

/**
 * OAuth grant for one participant on one platform. Tokens are encrypted at
 * rest (see src/lib/integrations/<platform>/tokens.ts — AES-GCM via ENCRYPTION_KEY)
 * and stored as opaque ciphertext here, never in plaintext.
 *
 * LinkedIn access tokens expire in 60 days (refresh ~365) — see
 * 03-research/platform-api-capabilities.md. `expiresAt` drives the re-auth
 * banner; nothing about token lifetime is hardcoded in the UI layer.
 */
export const platformAccounts = pgTable("platform_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: uuid("participant_id")
    .notNull()
    .references(() => participants.id, { onDelete: "cascade" }),
  platform: platformEnum("platform").notNull(),
  handle: text("handle"),
  platformUserId: text("platform_user_id"),

  encryptedAccessToken: text("encrypted_access_token"),
  encryptedRefreshToken: text("encrypted_refresh_token"),
  scopes: jsonb("scopes").$type<string[]>().notNull().default([]),

  expiresAt: timestamp("expires_at", { withTimezone: true }),
  refreshExpiresAt: timestamp("refresh_expires_at", { withTimezone: true }),

  status: platformAccountStatusEnum("status").notNull().default("connected"),
  connectedAt: timestamp("connected_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastRefreshedAt: timestamp("last_refreshed_at", { withTimezone: true }),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
});

export type PlatformAccount = typeof platformAccounts.$inferSelect;
export type NewPlatformAccount = typeof platformAccounts.$inferInsert;
