import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { platformAccounts } from "@/lib/db/schema";
import { requireParticipant, AuthError } from "@/lib/auth/session";

/**
 * Actually stops this participant's LinkedIn connection from being usable
 * — not just a display flag. Nulls the encrypted tokens (so
 * getValidAccessToken's own "no token" check fails closed even without
 * the revokedAt check) and sets revokedAt/status for the UI and the
 * belt-and-suspenders check in getValidAccessToken.
 */
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
      .where(and(eq(platformAccounts.participantId, participant.id), eq(platformAccounts.platform, "linkedin")));

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    throw err;
  }
}
