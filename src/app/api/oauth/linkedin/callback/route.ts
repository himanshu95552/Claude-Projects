import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { platformAccounts } from "@/lib/db/schema";
import { requireParticipant } from "@/lib/auth/session";
import { exchangeCodeForToken, fetchLinkedInProfile } from "@/lib/integrations/linkedin/oauth";
import { encryptToken } from "@/lib/integrations/tokens";
import { getEnv } from "@/lib/env";

const STATE_COOKIE = "linkedin_oauth_state";

export async function GET(req: NextRequest) {
  const appUrl = getEnv().APP_URL;
  const participant = await requireParticipant();

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const store = await cookies();
  const expectedState = store.get(STATE_COOKIE)?.value;
  store.delete(STATE_COOKIE);

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(`${appUrl}/persona?linkedin_error=invalid_state`);
  }

  try {
    const token = await exchangeCodeForToken(code);
    const profile = await fetchLinkedInProfile(token.accessToken);

    const existing = await db
      .select({ id: platformAccounts.id })
      .from(platformAccounts)
      .where(and(eq(platformAccounts.participantId, participant.id), eq(platformAccounts.platform, "linkedin")))
      .limit(1);

    const values = {
      participantId: participant.id,
      platform: "linkedin" as const,
      handle: profile.name,
      platformUserId: profile.sub,
      encryptedAccessToken: encryptToken(token.accessToken),
      encryptedRefreshToken: token.refreshToken ? encryptToken(token.refreshToken) : null,
      scopes: token.scope.split(" "),
      expiresAt: new Date(Date.now() + token.expiresInSeconds * 1000),
      refreshExpiresAt: token.refreshTokenExpiresInSeconds
        ? new Date(Date.now() + token.refreshTokenExpiresInSeconds * 1000)
        : null,
      status: "connected" as const,
      lastRefreshedAt: new Date(),
      revokedAt: null,
    };

    if (existing.length > 0) {
      await db.update(platformAccounts).set(values).where(eq(platformAccounts.id, existing[0].id));
    } else {
      await db.insert(platformAccounts).values(values);
    }

    return NextResponse.redirect(`${appUrl}/persona?linkedin=connected`);
  } catch (err) {
    console.error("LinkedIn OAuth callback failed:", err);
    return NextResponse.redirect(`${appUrl}/persona?linkedin_error=exchange_failed`);
  }
}
