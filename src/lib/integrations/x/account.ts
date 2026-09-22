import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { platformAccounts, type PlatformAccount } from "@/lib/db/schema";
import { decryptToken, encryptToken } from "@/lib/integrations/tokens";
import { refreshXToken } from "./oauth";

// X access tokens are short-lived (2 hours) — far shorter than LinkedIn's
// 60 days — so the refresh margin is minutes, not days, and refresh
// happens far more often. `offline.access` scope is what grants the
// refresh token at all.
const REFRESH_MARGIN_MS = 5 * 60 * 1000;

export type XConnectionStatus = "not_connected" | "connected" | "expired";

export async function getXAccount(participantId: string): Promise<PlatformAccount | null> {
  const rows = await db
    .select()
    .from(platformAccounts)
    .where(and(eq(platformAccounts.participantId, participantId), eq(platformAccounts.platform, "x")))
    .limit(1);
  return rows[0] ?? null;
}

export function connectionStatus(account: PlatformAccount | null): XConnectionStatus {
  if (!account || account.revokedAt) return "not_connected";
  if (!account.expiresAt) return "connected";
  return account.expiresAt.getTime() > Date.now() ? "connected" : "expired";
}

/** Returns a usable access token, transparently refreshing since X tokens expire in ~2 hours. */
export async function getValidAccessToken(participantId: string): Promise<string> {
  const account = await getXAccount(participantId);
  if (!account || !account.encryptedAccessToken) {
    throw new Error("X is not connected for this participant.");
  }
  if (account.revokedAt) {
    throw new Error("This X connection was revoked. Reconnect from the Persona tab.");
  }

  const msRemaining = (account.expiresAt?.getTime() ?? 0) - Date.now();
  if (msRemaining > REFRESH_MARGIN_MS) {
    return decryptToken(account.encryptedAccessToken);
  }

  if (!account.encryptedRefreshToken) {
    throw new Error("X access token expired and no refresh token is on file (offline.access scope missing). Reconnect required.");
  }

  const refreshToken = decryptToken(account.encryptedRefreshToken);
  const refreshed = await refreshXToken(refreshToken);

  await db
    .update(platformAccounts)
    .set({
      encryptedAccessToken: encryptToken(refreshed.accessToken),
      encryptedRefreshToken: encryptToken(refreshed.refreshToken ?? refreshToken),
      expiresAt: new Date(Date.now() + refreshed.expiresInSeconds * 1000),
      status: "connected",
      lastRefreshedAt: new Date(),
    })
    .where(eq(platformAccounts.id, account.id));

  return refreshed.accessToken;
}
