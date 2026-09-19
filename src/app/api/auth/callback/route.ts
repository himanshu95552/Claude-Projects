import { NextRequest, NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { magicLinkTokens, participants } from "@/lib/db/schema";
import { hashToken } from "@/lib/auth/tokens";
import { createSession } from "@/lib/auth/session";
import { getEnv } from "@/lib/env";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const appUrl = getEnv().APP_URL;

  if (!token) {
    return NextResponse.redirect(`${appUrl}/login?error=missing_token`);
  }

  const tokenHash = hashToken(token);
  const rows = await db
    .select()
    .from(magicLinkTokens)
    .where(and(eq(magicLinkTokens.tokenHash, tokenHash), isNull(magicLinkTokens.usedAt)))
    .limit(1);

  const record = rows[0];
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.redirect(`${appUrl}/login?error=expired_link`);
  }

  await db
    .update(magicLinkTokens)
    .set({ usedAt: new Date() })
    .where(eq(magicLinkTokens.id, record.id));

  const participant = (
    await db.select().from(participants).where(eq(participants.email, record.email)).limit(1)
  )[0];

  if (!participant) {
    return NextResponse.redirect(`${appUrl}/login?error=not_invited`);
  }

  await createSession(participant.id, req.headers.get("user-agent") ?? undefined);

  const destination = participant.status === "onboarding" ? "/onboarding" : "/queue";
  return NextResponse.redirect(`${appUrl}${destination}`);
}
