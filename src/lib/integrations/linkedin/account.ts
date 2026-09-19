import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { platformAccounts, type PlatformAccount } from "@/lib/db/schema";
import { decryptToken, encryptToken } from "@/lib/integrations/tokens";
import { refreshLinkedInToken } from "./oauth";

const REFRESH_MARGIN_MS = 24 * 60 * 60 * 1000; // refresh a day before expiry

export type LinkedInConnectionStatus = "not_connected" | "connected" | "expiring_soon" | "expired";

export async function getLinkedInAccount(participantId: string): Promise<PlatformAccount | null> {
  const rows = await db
    .select()
    .from(platformAccounts)
    .where(and(eq(platformAccounts.participantId, participantId), eq(platformAccounts.platform, "linkedin")))
    .limit(1);
  return rows[0] ?? null;
}

export function connectionStatus(account: PlatformAccount | null): LinkedInConnectionStatus {
  if (!account || account.revokedAt) return "not_connected";
  if (!account.expiresAt) return "connected";
  const msRemaining = account.expiresAt.getTime() - Date.now();
  if (msRemaining <= 0) return "expired";
  if (msRemaining < 7 * 24 * 60 * 60 * 1000) return "expiring_soon";
  return "connected";
}

/**
 * Returns a usable access token, transparently refreshing if it's within
 * REFRESH_MARGIN_MS of expiry. This is the "re-auth prompt on day one"
 * requirement made concrete: callers never see an expired token, they
 * either get a fresh one or a clear error to show a reconnect prompt.
 */
export async function getValidAccessToken(participantId: string): Promise<string> {
  const account = await getLinkedInAccount(participantId);
  if (!account || !account.encryptedAccessToken) {
    throw new Error("LinkedIn is not connected for this participant.");
  }

  const msRemaining = (account.expiresAt?.getTime() ?? 0) - Date.now();
  if (msRemaining > REFRESH_MARGIN_MS) {
    return decryptToken(account.encryptedAccessToken);
  }

  if (!account.encryptedRefreshToken) {
    throw new Error("LinkedIn access token expired and no refresh token is on file. Reconnect required.");
  }

  const refreshToken = decryptToken(account.encryptedRefreshToken);
  const refreshed = await refreshLinkedInToken(refreshToken);

  await db
    .update(platformAccounts)
    .set({
      encryptedAccessToken: encryptToken(refreshed.accessToken),
      encryptedRefreshToken: refreshed.refreshToken ? encryptToken(refreshed.refreshToken) : account.encryptedRefreshToken,
      expiresAt: new Date(Date.now() + refreshed.expiresInSeconds * 1000),
      status: "connected",
      lastRefreshedAt: new Date(),
    })
    .where(eq(platformAccounts.id, account.id));

  return refreshed.accessToken;
}
