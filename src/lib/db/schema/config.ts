import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { configScopeEnum } from "./enums";
import { participants } from "./participants";

/**
 * Every tunable number in the program lives here, versioned per
 * build-spec.md §5 & §7: "config is versioned, not overwritten... when
 * quality shifts, the first question is always what setting changed and
 * when." Resolution order is global -> lane -> participant, each layer
 * overriding keys the previous layer set. See src/lib/config/resolve.ts.
 *
 * `scopeRef` is the lane id or participant id being configured, and is
 * null for the global scope. A new row is inserted on every change,
 * `isCurrent` flips, and old rows are the change log itself — no separate
 * audit table needed.
 */
export const configs = pgTable("configs", {
  id: uuid("id").primaryKey().defaultRandom(),
  scope: configScopeEnum("scope").notNull(),
  scopeRef: uuid("scope_ref"), // null for global
  settings: jsonb("settings").$type<Record<string, unknown>>().notNull(),
  version: integer("version").notNull(),
  isCurrent: boolean("is_current").notNull().default(true),
  changedByParticipantId: uuid("changed_by_participant_id").references(
    () => participants.id,
  ),
  changeNote: text("change_note"),
  changedAt: timestamp("changed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ConfigRow = typeof configs.$inferSelect;
export type NewConfigRow = typeof configs.$inferInsert;
