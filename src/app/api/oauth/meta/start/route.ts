import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { requireParticipant } from "@/lib/auth/session";
import { buildAuthorizationUrl } from "@/lib/integrations/meta/oauth";
import { getEnv } from "@/lib/env";

const STATE_COOKIE = "meta_oauth_state";

export async function GET() {
  await requireParticipant();

  const env = getEnv();
  if (!env.META_APP_ID || !env.META_APP_SECRET) {
    return NextResponse.json(
      { error: "Instagram/Facebook aren't configured on this deployment yet. See docs/SETUP.md." },
      { status: 501 },
    );
  }

  const state = randomBytes(16).toString("hex");
  const store = await cookies();
  store.set(STATE_COOKIE, state, { httpOnly: true, maxAge: 600, path: "/", sameSite: "lax" });

  return NextResponse.redirect(buildAuthorizationUrl(state));
}
