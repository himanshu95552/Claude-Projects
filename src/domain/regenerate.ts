import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { queueItemRevisions, queueItems, type Participant, type QueueItem } from "@/lib/db/schema";
import { buildEnvelope } from "./queue-builder";
import { computeReviewSlaDueAt, needsReview, type ReviewFlag } from "./governance";
import { resolveSettings } from "@/lib/config/resolve";
import { generateRegeneratedContent } from "@/lib/generation/generate";
import { COMMENT_CONSTRAINTS } from "@/lib/generation/comments";
import { REPLY_CONSTRAINTS } from "@/lib/generation/replies";

/** Per-item-type length/shape constraints for a regenerated draft. */
function regenerationConstraints(
  itemType: string,
  platform: string,
): { maxChars?: number; mustEndWithQuestion?: boolean } {
  switch (itemType) {
    case "publish":
      return platform === "x" ? { maxChars: 280 } : { mustEndWithQuestion: true };
    case "first_hour_comment":
    case "general_comment":
      return { maxChars: COMMENT_CONSTRAINTS.hardMaxChars };
    case "reply":
      return { maxChars: REPLY_CONSTRAINTS.maxChars };
    case "connect":
      return { maxChars: 300 };
    default:
      return {};
  }
}

export type RegenerateResult = {
  text: string;
  explain: Record<string, string | undefined>;
  isDemoContent: boolean;
  governanceFlags: string[];
  needsReview: boolean;
};

/**
 * "Mark & regenerate" — the domain-layer counterpart to every other
 * generate* call, but working from the current draft instead of the
 * original research signal (see contracts.ts's RegenerationInput doc
 * comment for why). Every call here is its own isolated model session
 * (generateRegeneratedContent()'s doc comment), and every call writes two
 * revision rows first: the pre-regenerate snapshot and the new draft, so
 * the full history is reconstructable and undoable from queue_item_revisions.
 */
export async function regenerateQueueItem(
  participant: Participant,
  item: QueueItem,
  feedback: { markedExcerpts: string[]; reason: string },
): Promise<RegenerateResult> {
  const previousContent = item.editedContent ?? item.content;

  await db.insert(queueItemRevisions).values({
    queueItemId: item.id,
    content: previousContent,
    source: item.editedContent ? "edited" : "original",
    createdByParticipantId: participant.id,
  });

  const envelope = await buildEnvelope(participant.id);
  const { output, meta } = await generateRegeneratedContent({
    ...envelope,
    itemType: item.type,
    platform: item.platform,
    pillar: item.metadata.pillar,
    previousContent,
    markedExcerpts: feedback.markedExcerpts,
    reason: feedback.reason,
    constraints: regenerationConstraints(item.type, item.platform),
  });

  await db.insert(queueItemRevisions).values({
    queueItemId: item.id,
    content: output.text,
    source: "regenerated",
    reason: feedback.reason || null,
    createdByParticipantId: participant.id,
  });

  const settings = await resolveSettings({ participantId: participant.id, laneId: participant.laneId ?? undefined });
  const flagged = needsReview({ reviewTier: participant.reviewTier, flags: meta.governanceFlags as ReviewFlag[] });

  await db
    .update(queueItems)
    .set({
      editedContent: output.text,
      explain: output.explain,
      reviewFlags: meta.governanceFlags,
      needsReview: flagged ? "pending" : "not_required",
      reviewSlaDueAt: flagged ? computeReviewSlaDueAt(new Date(), settings.governance.reviewSlaHours) : null,
    })
    .where(eq(queueItems.id, item.id));

  return {
    text: output.text,
    explain: output.explain,
    isDemoContent: meta.isDemoContent,
    governanceFlags: meta.governanceFlags,
    needsReview: flagged,
  };
}
