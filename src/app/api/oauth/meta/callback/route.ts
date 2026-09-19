import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { platformAccounts } from "@/lib/db/schema";
import { requireParticipant } from "@/lib/auth/session";
import { exchangeCodeForToken, exchangeForLongLivedToken } from "@/lib/integrations/meta/oauth";
import { encryptToken } from "@/lib/integrations/tokens";
import { getEnv } from "@/lib/env";

const STATE_COOKIE = "meta_oauth_state";

/**
 * Resolves the Facebook Page and, if linked, the Instagram Business
 * account behind it — platform-api-capabilities.md: "A linked Facebook
 * Page is required for Business accounts, not for Creator accounts."
 * This implements the Business-account path; a Creator-only setup will
 * connect Facebook but show no linked Instagram account, which is a
 * real and expected outcome, not an error.
 */
async function resolvePagesAndInstagram(accessToken: string) {
  const pagesRes = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`,
  );
  if (!pagesRes.ok) return { pages: [] as Array<{ id: string; name: string; access_token: string; instagram_business_account?: { id: string } }> };
  const data = await pagesRes.json();
  return { pages: data.data ?? [] };
}

export async function GET(req: NextRequest) {
  const appUrl = getEnv().APP_URL;
  const participant = await requireParticipant();

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const store = await cookies();
  const expectedState = store.get(STATE_COOKIE)?.value;
  store.delete(STATE_COOKIE);

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(`${appUrl}/persona?meta_error=invalid_state`);
  }

  try {
    const shortLived = await exchangeCodeForToken(code);
    const longLived = await exchangeForLongLivedToken(shortLived.accessToken);
    const { pages } = await resolvePagesAndInstagram(longLived.accessToken);

    const expiresAt = new Date(Date.now() + longLived.expiresInSeconds * 1000);

    for (const page of pages) {
      await upsertAccount({
        participantId: participant.id,
        platform: "facebook",
        handle: page.name,
        platformUserId: page.id,
        accessToken: page.access_token,
        expiresAt,
      });

      if (page.instagram_business_account) {
        await upsertAccount({
          participantId: participant.id,
          platform: "instagram",
          handle: page.name,
          platformUserId: page.instagram_business_account.id,
          accessToken: page.access_token,
          expiresAt,
        });
      }
    }

    return NextResponse.redirect(`${appUrl}/persona?meta=connected`);
  } catch (err) {
    console.error("Meta OAuth callback failed:", err);
    return NextResponse.redirect(`${appUrl}/persona?meta_error=exchange_failed`);
  }
}

async function upsertAccount(params: {
  participantId: string;
  platform: "facebook" | "instagram";
  handle: string;
  platformUserId: string;
  accessToken: string;
  expiresAt: Date;
}) {
  const existing = await db
    .select({ id: platformAccounts.id })
    .from(platformAccounts)
    .where(and(eq(platformAccounts.participantId, params.participantId), eq(platformAccounts.platform, params.platform)))
    .limit(1);

  const values = {
    participantId: params.participantId,
    platform: params.platform,
    handle: params.handle,
    platformUserId: params.platformUserId,
    encryptedAccessToken: encryptToken(params.accessToken),
    expiresAt: params.expiresAt,
    status: "connected" as const,
    lastRefreshedAt: new Date(),
    revokedAt: null,
  };

  if (existing.length > 0) {
    await db.update(platformAccounts).set(values).where(eq(platformAccounts.id, existing[0].id));
  } else {
    await db.insert(platformAccounts).values(values);
  }
}
