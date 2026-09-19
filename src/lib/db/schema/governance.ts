import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Customer names cleared for public reference — governance.md: "only names
 * public on the Alpha Nodus website are cleared." Kept as data, not a
 * hardcoded list, so the review flow and generation guardrails both read
 * from one source of truth that marketing can update without a deploy.
 */
export const clearedCustomers = pgTable("cleared_customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ClearedCustomer = typeof clearedCustomers.$inferSelect;
export type NewClearedCustomer = typeof clearedCustomers.$inferInsert;
