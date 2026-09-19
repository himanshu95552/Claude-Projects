import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { metricSnapshots, queueItems, queues } from "@/lib/db/schema";
import { requireParticipant, AuthError } from "@/lib/auth/session";

const numOrNull = z.number().int().nonnegative().optional();

const bodySchema = z.object({
  queueItemId: z.string().uuid().optional(), // omit for a profile/page-level snapshot
  platform: z.enum(["linkedin", "instagram", "facebook", "x"]),
  impressions: numOrNull,
  reactions: numOrNull,
  comments: numOrNull,
  shares: numOrNull,
  saves: numOrNull,
  clicks: numOrNull,
  videoViews: numOrNull,
  videoCompletionPct: z.number().int().min(0).max(100).optional(),
  profileViews: numOrNull,
  followers: numOrNull,
});

/**
 * Manual metric entry — the baseline per platform-api-capabilities.md:
 * member-level post analytics may never be obtainable via API on most of
 * these platforms, so the dashboard has to work from numbers a person
 * copies in from the platform's own analytics view. This is that one
 * entry point, used both for a specific post (queueItemId set) and for a
 * profile-level rollup (followers, profile views — queueItemId omitted).
 */
export async function POST(req: NextRequest) {
  try {
    const participant = await requireParticipant();
    const body = bodySchema.parse(await req.json());

    if (body.queueItemId) {
      const [item] = await db.select().from(queueItems).where(eq(queueItems.id, body.queueItemId)).limit(1);
      if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const [queue] = await db.select().from(queues).where(eq(queues.id, item.queueId)).limit(1);
      if (!queue || queue.participantId !== participant.id) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
    }

    const [snapshot] = await db
      .insert(metricSnapshots)
      .values({
        participantId: participant.id,
        queueItemId: body.queueItemId,
        platform: body.platform,
        impressions: body.impressions,
        reactions: body.reactions,
        comments: body.comments,
        shares: body.shares,
        saves: body.saves,
        clicks: body.clicks,
        videoViews: body.videoViews,
        videoCompletionPct: body.videoCompletionPct,
        profileViews: body.profileViews,
        followers: body.followers,
        source: "manual",
      })
      .returning();

    return NextResponse.json({ snapshot });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    throw err;
  }
}
