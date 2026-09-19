import { getEnv } from "@/lib/env";

/**
 * OAuth 2.0 for the "Share on LinkedIn" self-serve product —
 * 03-research/platform-api-capabilities.md: `w_member_social` scope,
 * approval-free, covers posts and comments as the authenticated member.
 * Access tokens expire in 60 days, refresh tokens ~365 —
 * "build the re-auth prompt on day one."
 */

const AUTHORIZATION_URL = "https://www.linkedin.com/oauth/v2/authorization";
const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const SCOPES = ["openid", "profile", "w_member_social"];

export function buildRedirectUri(): string {
  return `${getEnv().APP_URL}/api/oauth/linkedin/callback`;
}

export function buildAuthorizationUrl(state: string): string {
  const env = getEnv();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.LINKEDIN_CLIENT_ID ?? "",
    redirect_uri: buildRedirectUri(),
    state,
    scope: SCOPES.join(" "),
  });
  return `${AUTHORIZATION_URL}?${params.toString()}`;
}

export type LinkedInTokenResponse = {
  accessToken: string;
  expiresInSeconds: number;
  refreshToken?: string;
  refreshTokenExpiresInSeconds?: number;
  scope: string;
};

export async function exchangeCodeForToken(code: string): Promise<LinkedInTokenResponse> {
  const env = getEnv();
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: buildRedirectUri(),
      client_id: env.LINKEDIN_CLIENT_ID ?? "",
      client_secret: env.LINKEDIN_CLIENT_SECRET ?? "",
    }),
  });
  if (!res.ok) throw new Error(`LinkedIn token exchange failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return {
    accessToken: data.access_token,
    expiresInSeconds: data.expires_in,
    refreshToken: data.refresh_token,
    refreshTokenExpiresInSeconds: data.refresh_token_expires_in,
    scope: data.scope,
  };
}

export async function refreshLinkedInToken(refreshToken: string): Promise<LinkedInTokenResponse> {
  const env = getEnv();
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: env.LINKEDIN_CLIENT_ID ?? "",
      client_secret: env.LINKEDIN_CLIENT_SECRET ?? "",
    }),
  });
  if (!res.ok) throw new Error(`LinkedIn token refresh failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return {
    accessToken: data.access_token,
    expiresInSeconds: data.expires_in,
    refreshToken: data.refresh_token,
    refreshTokenExpiresInSeconds: data.refresh_token_expires_in,
    scope: data.scope,
  };
}

export async function fetchLinkedInProfile(accessToken: string): Promise<{ sub: string; name: string }> {
  const res = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`LinkedIn userinfo failed: ${res.status} ${await res.text()}`);
  return res.json();
}
