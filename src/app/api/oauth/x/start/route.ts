import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { requireParticipant } from "@/lib/auth/session";
import { buildAuthorizationUrl, generatePkcePair } from "@/lib/integrations/x/oauth";
import { isXConfigured } from "@/lib/env";

const STATE_COOKIE = "x_oauth_state";
const VERIFIER_COOKIE = "x_oauth_verifier";

export async function GET() {
  await requireParticipant();

  if (!isXConfigured()) {
    return NextResponse.json(
      { error: "X isn't configured on this deployment yet. See docs/SETUP.md." },
      { status: 501 },
    );
  }

  const state = randomBytes(16).toString("hex");
  const { verifier, challenge } = generatePkcePair();

  const store = await cookies();
  store.set(STATE_COOKIE, state, { httpOnly: true, maxAge: 600, path: "/", sameSite: "lax" });
  store.set(VERIFIER_COOKIE, verifier, { httpOnly: true, maxAge: 600, path: "/", sameSite: "lax" });

  return NextResponse.redirect(buildAuthorizationUrl({ state, codeChallenge: challenge }));
}
