import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { magicLinkTokens, participants } from "@/lib/db/schema";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { sendMagicLinkEmail } from "@/lib/auth/mailer";
import { getEnv } from "@/lib/env";

const bodySchema = z.object({ email: z.string().email() });

const TOKEN_TTL_MINUTES = 15;

/**
 * Request a sign-in link for an email address.
 *
 * Bootstrap rule: if the participant table is completely empty (fresh
 * install, nobody has ever signed in), the first email to request a link
 * becomes an admin automatically. Every subsequent request only works for
 * an email an admin has already added via the admin "add participant"
 * flow — this app is invite-only by design (build-spec.md: participants
 * are onboarded through a runbook, not self-serve signup).
 *
 * Always returns success regardless of whether the email is known, so this
 * endpoint can't be used to enumerate the participant roster.
 */
export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();

  const existingCount = await db.$count(participants);
  let participant = (
    await db.select().from(participants).where(eq(participants.email, email)).limit(1)
  )[0];

  if (!participant && existingCount === 0) {
    const [created] = await db
      .insert(participants)
      .values({
        email,
        fullName: email.split("@")[0],
        jobTitle: "Admin",
        employment: "employee",
        appRoles: ["participant", "operator", "admin"],
        status: "onboarding",
      })
      .returning();
    participant = created;
  }

  // Always behave the same way whether or not the participant exists, so
  // the response can't be used to probe the roster.
  if (participant) {
    const token = generateToken();
    await db.insert(magicLinkTokens).values({
      email,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000),
    });

    const magicLinkUrl = `${getEnv().APP_URL}/api/auth/callback?token=${token}`;
    await sendMagicLinkEmail({ to: email, magicLinkUrl });
  }

  return NextResponse.json({ ok: true });
}
