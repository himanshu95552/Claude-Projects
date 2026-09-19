import { createHash, randomBytes } from "node:crypto";
import { getEnv } from "@/lib/env";

/**
 * X (Twitter) API v2 uses OAuth 2.0 with PKCE for user-context auth —
 * the recommended method for posting (`tweet.write` scope), unlike
 * LinkedIn/Meta's plain authorization-code flow. PKCE adds a
 * code_verifier/code_challenge pair that must survive between the
 * /start redirect and the /callback — stored the same way `state` is,
 * in a short-lived httpOnly cookie.
 */

const AUTHORIZATION_URL = "https://x.com/i/oauth2/authorize";
const TOKEN_URL = "https://api.x.com/2/oauth2/token";
const SCOPES = ["tweet.read", "tweet.write", "users.read", "offline.access"];

export function buildRedirectUri(): string {
  return `${getEnv().APP_URL}/api/oauth/x/callback`;
}

export function generatePkcePair(): { verifier: string; challenge: string } {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export function buildAuthorizationUrl(params: { state: string; codeChallenge: string }): string {
  const env = getEnv();
  const query = new URLSearchParams({
    response_type: "code",
    client_id: env.X_CLIENT_ID ?? "",
    redirect_uri: buildRedirectUri(),
    scope: SCOPES.join(" "),
    state: params.state,
    code_challenge: params.codeChallenge,
    code_challenge_method: "S256",
  });
  return `${AUTHORIZATION_URL}?${query.toString()}`;
}

export type XTokenResponse = {
  accessToken: string;
  refreshToken?: string;
  expiresInSeconds: number;
  scope: string;
};

/** X requires HTTP Basic auth with client_id:client_secret for confidential clients, plus the PKCE verifier. */
function basicAuthHeader(): string {
  const env = getEnv();
  return "Basic " + Buffer.from(`${env.X_CLIENT_ID}:${env.X_CLIENT_SECRET}`).toString("base64");
}

export async function exchangeCodeForToken(code: string, codeVerifier: string): Promise<XTokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: basicAuthHeader(),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: buildRedirectUri(),
      code_verifier: codeVerifier,
    }),
  });
  if (!res.ok) throw new Error(`X token exchange failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresInSeconds: data.expires_in,
    scope: data.scope,
  };
}

export async function refreshXToken(refreshToken: string): Promise<XTokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: basicAuthHeader(),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error(`X token refresh failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken, // X may or may not rotate the refresh token
    expiresInSeconds: data.expires_in,
    scope: data.scope,
  };
}

export async function fetchXProfile(accessToken: string): Promise<{ id: string; username: string; name: string }> {
  const res = await fetch("https://api.x.com/2/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`X users/me failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.data;
}
