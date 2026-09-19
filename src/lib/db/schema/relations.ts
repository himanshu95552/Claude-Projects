import { relations } from "drizzle-orm";
import { lanes } from "./lanes";
import { participants } from "./participants";
import { platformAccounts } from "./platform-accounts";
import { voiceProfiles, storyBankEntries } from "./voice";
import { targets } from "./targets";
import { queues, queueItems } from "./queue";
import { sessions } from "./auth";
import { pushSubscriptions } from "./push";
import { weeklySummaries } from "./weekly-summary";

export const participantsRelations = relations(participants, ({ one, many }) => ({
  lane: one(lanes, {
    fields: [participants.laneId],
    references: [lanes.id],
  }),
  platformAccounts: many(platformAccounts),
  voiceProfiles: many(voiceProfiles),
  storyBankEntries: many(storyBankEntries),
  targets: many(targets),
  queues: many(queues),
  sessions: many(sessions),
  pushSubscriptions: many(pushSubscriptions),
  weeklySummaries: many(weeklySummaries),
}));

export const lanesRelations = relations(lanes, ({ many }) => ({
  participants: many(participants),
}));

export const platformAccountsRelations = relations(platformAccounts, ({ one }) => ({
  participant: one(participants, {
    fields: [platformAccounts.participantId],
    references: [participants.id],
  }),
}));

export const voiceProfilesRelations = relations(voiceProfiles, ({ one }) => ({
  participant: one(participants, {
    fields: [voiceProfiles.participantId],
    references: [participants.id],
  }),
}));

export const storyBankEntriesRelations = relations(storyBankEntries, ({ one }) => ({
  participant: one(participants, {
    fields: [storyBankEntries.participantId],
    references: [participants.id],
  }),
}));

export const targetsRelations = relations(targets, ({ one, many }) => ({
  owner: one(participants, {
    fields: [targets.ownerParticipantId],
    references: [participants.id],
  }),
  queueItems: many(queueItems),
}));

export const queuesRelations = relations(queues, ({ one, many }) => ({
  participant: one(participants, {
    fields: [queues.participantId],
    references: [participants.id],
  }),
  items: many(queueItems),
}));

export const queueItemsRelations = relations(queueItems, ({ one }) => ({
  queue: one(queues, {
    fields: [queueItems.queueId],
    references: [queues.id],
  }),
  target: one(targets, {
    fields: [queueItems.targetId],
    references: [targets.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  participant: one(participants, {
    fields: [sessions.participantId],
    references: [participants.id],
  }),
}));
