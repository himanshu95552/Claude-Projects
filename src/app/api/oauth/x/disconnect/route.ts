import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { platformAccounts } from "@/lib/db/schema";
import { requireParticipant, AuthError } from "@/lib/auth/session";

/** Same real-disconnect shape as /api/oauth/linkedin/disconnect — see that route's comment. */
export async function POST() {
  try {
    const participant = await requireParticipant();

    await db
      .update(platformAccounts)
      .set({
        encryptedAccessToken: null,
        encryptedRefreshToken: null,
        status: "revoked",
        revokedAt: new Date(),
      })
      .where(and(eq(platformAccounts.participantId, participant.id), eq(platformAccounts.platform, "x")));

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    throw err;
  }
}
