import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { participants } from "./participants";

/** Web Push (VAPID) subscription — build-spec.md §8: "Push, no vendor." */
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  participantId: uuid("participant_id")
    .notNull()
    .references(() => participants.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
