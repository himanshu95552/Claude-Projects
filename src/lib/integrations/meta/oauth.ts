import { getEnv } from "@/lib/env";

/**
 * Meta (Instagram + Facebook) OAuth — platform-api-capabilities.md.
 * Deliberately thin: build-spec.md's own risk list flags IG/FB as
 * low-cost repurposing with a day-60 cut decision, "organic reach for
 * B2B healthcare buyers is near-dead there." This covers what's needed
 * (IG Business/Creator publish, FB Page publish) without over-building
 * a track the plan itself says to revisit at day 60.
 */

const AUTHORIZATION_URL = "https://www.facebook.com/v19.0/dialog/oauth";
const TOKEN_URL = "https://graph.facebook.com/v19.0/oauth/access_token";
const SCOPES = ["instagram_business_basic", "instagram_business_content_publish", "pages_show_list", "pages_manage_posts", "pages_read_engagement"];

export function buildRedirectUri(): string {
  return `${getEnv().APP_URL}/api/oauth/meta/callback`;
}

export function buildAuthorizationUrl(state: string): string {
  const env = getEnv();
  const params = new URLSearchParams({
    client_id: env.META_APP_ID ?? "",
    redirect_uri: buildRedirectUri(),
    state,
    scope: SCOPES.join(","),
    response_type: "code",
  });
  return `${AUTHORIZATION_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string): Promise<{ accessToken: string; expiresInSeconds: number }> {
  const env = getEnv();
  const params = new URLSearchParams({
    client_id: env.META_APP_ID ?? "",
    client_secret: env.META_APP_SECRET ?? "",
    redirect_uri: buildRedirectUri(),
    code,
  });
  const res = await fetch(`${TOKEN_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`Meta token exchange failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return { accessToken: data.access_token, expiresInSeconds: data.expires_in ?? 60 * 24 * 60 * 60 };
}

/** Long-lived tokens are the practical default for this program's low posting volume. */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<{ accessToken: string; expiresInSeconds: number }> {
  const env = getEnv();
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: env.META_APP_ID ?? "",
    client_secret: env.META_APP_SECRET ?? "",
    fb_exchange_token: shortLivedToken,
  });
  const res = await fetch(`${TOKEN_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`Meta long-lived token exchange failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return { accessToken: data.access_token, expiresInSeconds: data.expires_in ?? 60 * 24 * 60 * 60 };
}
