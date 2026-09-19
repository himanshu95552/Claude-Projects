import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { queueItems, queues } from "@/lib/db/schema";
import { requireParticipant, AuthError } from "@/lib/auth/session";
import { generateQueueForParticipant } from "@/domain/queue-builder";

/** GET /api/queue?date=YYYY-MM-DD — defaults to today in the participant's timezone. */
export async function GET(req: NextRequest) {
  try {
    const participant = await requireParticipant();
    const dateParam = req.nextUrl.searchParams.get("date");
    const dateStr = dateParam ?? new Date().toISOString().slice(0, 10);

    const [queue] = await db
      .select()
      .from(queues)
      .where(and(eq(queues.participantId, participant.id), eq(queues.forDate, dateStr)))
      .limit(1);

    if (!queue) {
      return NextResponse.json({ queue: null, items: [] });
    }

    const items = await db
      .select()
      .from(queueItems)
      .where(eq(queueItems.queueId, queue.id))
      .orderBy(queueItems.position);

    return NextResponse.json({ queue, items });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    throw err;
  }
}

/** POST /api/queue — operator-only manual regenerate for a given date (defaults to today). */
export async function POST(req: NextRequest) {
  try {
    const participant = await requireParticipant();
    if (!(participant.appRoles ?? []).includes("operator") && !(participant.appRoles ?? []).includes("admin")) {
      return NextResponse.json({ error: "Requires operator or admin role" }, { status: 403 });
    }
    const body = await req.json().catch(() => ({}));
    const targetParticipantId: string = body.participantId ?? participant.id;
    const forDate = body.date ? new Date(body.date) : new Date();

    const summary = await generateQueueForParticipant(targetParticipantId, forDate);
    return NextResponse.json(summary);
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    throw err;
  }
}
