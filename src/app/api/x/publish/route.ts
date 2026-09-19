import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { queueItems, queues } from "@/lib/db/schema";
import { requireParticipant, AuthError } from "@/lib/auth/session";
import { getXAccount, getValidAccessToken } from "@/lib/integrations/x/account";
import { publishXPost, publishXThread, splitIntoThread } from "@/lib/integrations/x/client";

const bodySchema = z.object({ itemId: z.string().uuid() });

/**
 * The one place a real X API call happens — same one-click-only rule as
 * /api/linkedin/publish. Text over 280 chars is automatically split into
 * a thread and posted sequentially (never in a burst).
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
    if (item.fulfillment !== "api_publish" || item.platform !== "x") {
      return NextResponse.json({ error: "This item isn't an X api_publish card." }, { status: 400 });
    }
    if (item.status !== "pending") {
      return NextResponse.json({ error: "Already acted on." }, { status: 409 });
    }
    if (item.needsReview === "pending") {
      return NextResponse.json({ error: "This item is still waiting on review." }, { status: 409 });
    }

    const account = await getXAccount(participant.id);
    if (!account) {
      return NextResponse.json({ error: "Connect X from the Persona tab first." }, { status: 428 });
    }

    const accessToken = await getValidAccessToken(participant.id);
    const text = item.editedContent ?? item.content;

    let platformPostId: string;
    if (text.length <= 280) {
      const result = await publishXPost({ accessToken, text });
      platformPostId = result.id;
    } else {
      const chunks = splitIntoThread(text);
      const result = await publishXThread({ accessToken, posts: chunks });
      if (result.failedAtIndex !== null) {
        return NextResponse.json(
          { error: `Thread partially posted (${result.postedIds.length}/${chunks.length}) before a failure.` },
          { status: 502 },
        );
      }
      platformPostId = result.postedIds[0];
    }

    await db
      .update(queueItems)
      .set({ status: "done", actedAt: new Date(), platformPostId })
      .where(eq(queueItems.id, itemId));

    return NextResponse.json({ ok: true, platformPostId });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    const message = err instanceof Error ? err.message : "Publish failed";
    console.error("X publish failed:", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
