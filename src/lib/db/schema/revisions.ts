import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { revisionSourceEnum } from "./enums";
import { queueItems } from "./queue";
import { participants } from "./participants";

/**
 * Full history for a queue item's content — every edit and every
 * regeneration, not just the current edited_content. This is what "mark
 * a line and regenerate the idea" needs to be undoable and auditable:
 * a participant can see exactly what changed and revert.
 *
 * Each regeneration is generated in its own isolated call — no prior
 * draft's text is carried as conversation history into the next one
 * (src/domain/regenerate.ts) — only the same stable envelope every
 * generation call uses. This row is what proves that happened, not just
 * documents that it should.
 */
export const queueItemRevisions = pgTable("queue_item_revisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  queueItemId: uuid("queue_item_id")
    .notNull()
    .references(() => queueItems.id, { onDelete: "cascade" }),

  content: text("content").notNull(),
  source: revisionSourceEnum("source").notNull(),
  reason: text("reason"), // why regenerated / what was edited

  createdByParticipantId: uuid("created_by_participant_id").references(() => participants.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type QueueItemRevision = typeof queueItemRevisions.$inferSelect;
export type NewQueueItemRevision = typeof queueItemRevisions.$inferInsert;
