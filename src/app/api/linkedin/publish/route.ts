import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { queueItems, queues, targets } from "@/lib/db/schema";
import { requireParticipant, AuthError } from "@/lib/auth/session";
import { getLinkedInAccount, getValidAccessToken } from "@/lib/integrations/linkedin/account";
import { publishLinkedInComment, publishLinkedInPost } from "@/lib/integrations/linkedin/client";
import { advanceStage } from "@/domain/ladder";

const bodySchema = z.object({ itemId: z.string().uuid() });

/**
 * The one place an actual LinkedIn API call happens. Always triggered by
 * a click on this specific request — build-spec.md §2's non-negotiable:
 * "every publish, comment, reply... is a person deciding and clicking."
 */
export async function POST(req: NextRequest) {
  try {
    const participant = await requireParticipant();
    const { itemId } = bodySchema.parse(await req.json());

    const [item] = await db.select().from(queueItems).where(eq(queueItems.id, itemId)).limit(1);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const [queue] = await db.select().from(queues).where(eq(queues.id, item.queueId)).limit(1);
    if (!queue || queue.participantId !== participant.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (item.fulfillment !== "api_publish") {
      return NextResponse.json({ error: "This item isn't API-publishable — use copy/open instead." }, { status: 400 });
    }
    if (item.status !== "pending") {
      return NextResponse.json({ error: "Already acted on." }, { status: 409 });
    }
    if (item.needsReview === "pending") {
      return NextResponse.json({ error: "This item is still waiting on review." }, { status: 409 });
    }

    const account = await getLinkedInAccount(participant.id);
    if (!account) {
      return NextResponse.json({ error: "Connect LinkedIn from the Persona tab first." }, { status: 428 });
    }

    const accessToken = await getValidAccessToken(participant.id);
    const text = item.editedContent ?? item.content;

    let platformPostId: string;
    if (item.type === "publish") {
      const result = await publishLinkedInPost({ accessToken, authorSub: account.platformUserId!, text });
      platformPostId = result.postId;
    } else if (item.type === "first_hour_comment" || item.type === "general_comment" || item.type === "reply") {
      if (!item.sourcePostUrl) {
        return NextResponse.json({ error: "No target post URL on this item." }, { status: 400 });
      }
      const result = await publishLinkedInComment({
        accessToken,
        authorSub: account.platformUserId!,
        targetPostUrn: item.sourcePostUrl,
        text,
      });
      platformPostId = result.commentId;
    } else {
      return NextResponse.json({ error: `Publishing type '${item.type}' isn't supported via API.` }, { status: 400 });
    }

    await db
      .update(queueItems)
      .set({ status: "done", actedAt: new Date(), platformPostId })
      .where(eq(queueItems.id, itemId));

    if (item.targetId) {
      await advanceTargetForPublish(item.targetId, item.type);
    }

    return NextResponse.json({ ok: true, platformPostId });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    const message = err instanceof Error ? err.message : "Publish failed";
    console.error("LinkedIn publish failed:", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

async function advanceTargetForPublish(targetId: string, itemType: string) {
  const [target] = await db.select().from(targets).where(eq(targets.id, targetId)).limit(1);
  if (!target) return;
  if (itemType !== "first_hour_comment" && itemType !== "general_comment") return;

  const stageRank = ["cold", "follow", "warm_up", "recognized", "connect", "conversation", "handoff", "retired"];
  if (stageRank.indexOf("warm_up") <= stageRank.indexOf(target.stage)) {
    await db.update(targets).set({ lastTouchAt: new Date() }).where(eq(targets.id, targetId));
    return;
  }

  const stageHistory = advanceStage({
    stageHistory: target.stageHistory,
    toStage: "warm_up",
    evidence: "Commented via LinkedIn publish",
  });
  await db.update(targets).set({ stage: "warm_up", stageHistory, lastTouchAt: new Date() }).where(eq(targets.id, targetId));
}
