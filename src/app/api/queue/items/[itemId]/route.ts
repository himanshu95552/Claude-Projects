import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { queueItemRevisions, queueItems, queues, targets } from "@/lib/db/schema";
import { requireParticipant, AuthError } from "@/lib/auth/session";
import { advanceStage } from "@/domain/ladder";
import { regenerateQueueItem } from "@/domain/regenerate";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("done"), platformPostId: z.string().optional() }),
  z.object({ action: z.literal("skip"), reason: z.string().min(1, "A skip reason is required") }),
  z.object({ action: z.literal("edit"), editedContent: z.string() }),
  z.object({
    action: z.literal("regenerate"),
    markedExcerpts: z.array(z.string()).default([]),
    reason: z.string().default(""),
  }),
]);

/**
 * A single queue item action. Marking an item "done" is the moment a
 * human clicks — build-spec.md §2's one non-negotiable — so this is the
 * only place a target's engagement-ladder stage advances, and only with
 * the recorded evidence of what the person actually did.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const participant = await requireParticipant();
    const { itemId } = await params;
    const body = actionSchema.parse(await req.json());

    const [item] = await db.select().from(queueItems).where(eq(queueItems.id, itemId)).limit(1);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const [queue] = await db.select().from(queues).where(eq(queues.id, item.queueId)).limit(1);
    if (!queue || queue.participantId !== participant.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (body.action === "edit") {
      await db.update(queueItems).set({ editedContent: body.editedContent }).where(eq(queueItems.id, itemId));
      return NextResponse.json({ ok: true });
    }

    if (body.action === "regenerate") {
      const result = await regenerateQueueItem(participant, item, {
        markedExcerpts: body.markedExcerpts,
        reason: body.reason,
      });
      return NextResponse.json({ ok: true, ...result });
    }

    if (body.action === "skip") {
      await db
        .update(queueItems)
        .set({ status: "skipped", skipReason: body.reason, actedAt: new Date() })
        .where(eq(queueItems.id, itemId));
    } else {
      await db
        .update(queueItems)
        .set({ status: "done", actedAt: new Date(), platformPostId: body.platformPostId })
        .where(eq(queueItems.id, itemId));

      if (item.targetId) {
        await advanceTargetOnCompletion(item.targetId, item.type);
      }
    }

    // Recompute queue progress.
    const allItems = await db.select().from(queueItems).where(eq(queueItems.queueId, item.queueId));
    const completedCount = allItems.filter((i) => i.status === "done" || i.status === "skipped").length;
    const clearedAt = completedCount === allItems.length ? new Date() : null;
    await db
      .update(queues)
      .set({ completedCount, ...(clearedAt ? { clearedAt } : {}) })
      .where(eq(queues.id, item.queueId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    throw err;
  }
}

/** Revision history for one item — the audit trail behind "mark & regenerate". */
export async function GET(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const participant = await requireParticipant();
    const { itemId } = await params;

    const [item] = await db.select().from(queueItems).where(eq(queueItems.id, itemId)).limit(1);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const [queue] = await db.select().from(queues).where(eq(queues.id, item.queueId)).limit(1);
    if (!queue || queue.participantId !== participant.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const revisions = await db
      .select()
      .from(queueItemRevisions)
      .where(eq(queueItemRevisions.queueItemId, itemId))
      .orderBy(queueItemRevisions.createdAt);

    return NextResponse.json({ revisions });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    throw err;
  }
}

/** Advances the ladder stage that corresponds to the completed action, always with evidence. */
async function advanceTargetOnCompletion(targetId: string, itemType: string) {
  const [target] = await db.select().from(targets).where(eq(targets.id, targetId)).limit(1);
  if (!target) return;

  const stageForAction: Record<string, { stage: "follow" | "warm_up" | "connect"; evidence: string } | undefined> = {
    follow: { stage: "follow", evidence: "Followed via daily queue" },
    first_hour_comment: { stage: "warm_up", evidence: "Commented within the first hour" },
    general_comment: { stage: "warm_up", evidence: "Commented substantively" },
    connect: { stage: "connect", evidence: "Connection invite sent via daily queue" },
  };

  const transition = stageForAction[itemType];
  if (!transition) return;

  // Never move backward, and never repeat a transition already recorded.
  const stageRank = ["cold", "follow", "warm_up", "recognized", "connect", "conversation", "handoff", "retired"];
  if (stageRank.indexOf(transition.stage) <= stageRank.indexOf(target.stage)) {
    await db.update(targets).set({ lastTouchAt: new Date() }).where(eq(targets.id, targetId));
    return;
  }

  const stageHistory = advanceStage({
    stageHistory: target.stageHistory,
    toStage: transition.stage,
    evidence: transition.evidence,
  });
  await db
    .update(targets)
    .set({ stage: transition.stage, stageHistory, lastTouchAt: new Date() })
    .where(eq(targets.id, targetId));
}
