import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { requireParticipant } from "@/lib/auth/session";
import { buildAuthorizationUrl } from "@/lib/integrations/linkedin/oauth";
import { isLinkedInConfigured } from "@/lib/env";

const STATE_COOKIE = "linkedin_oauth_state";

export async function GET() {
  await requireParticipant();

  if (!isLinkedInConfigured()) {
    return NextResponse.json(
      { error: "LinkedIn isn't configured on this deployment yet. See docs/SETUP.md." },
      { status: 501 },
    );
  }

  const state = randomBytes(16).toString("hex");
  const store = await cookies();
  store.set(STATE_COOKIE, state, { httpOnly: true, maxAge: 600, path: "/", sameSite: "lax" });

  return NextResponse.redirect(buildAuthorizationUrl(state));
}
