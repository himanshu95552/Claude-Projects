import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { pushSubscriptions } from "@/lib/db/schema";
import { requireParticipant, AuthError } from "@/lib/auth/session";
import { getEnv, isPushConfigured } from "@/lib/env";

const bodySchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({ p256dh: z.string(), auth: z.string() }),
});

export async function GET() {
  return NextResponse.json({ configured: isPushConfigured(), publicKey: getEnv().VAPID_PUBLIC_KEY ?? null });
}

export async function POST(req: NextRequest) {
  try {
    const participant = await requireParticipant();
    const body = bodySchema.parse(await req.json());

    await db
      .insert(pushSubscriptions)
      .values({ participantId: participant.id, endpoint: body.endpoint, p256dh: body.keys.p256dh, auth: body.keys.auth })
      .onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: { p256dh: body.keys.p256dh, auth: body.keys.auth, participantId: participant.id },
      });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    throw err;
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireParticipant();
    const endpoint = req.nextUrl.searchParams.get("endpoint");
    if (!endpoint) return NextResponse.json({ error: "endpoint required" }, { status: 400 });
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    throw err;
  }
}
