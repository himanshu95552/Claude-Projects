import "server-only";
import { cookies } from "next/headers";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { participants, sessions, type AppRole, type Participant } from "@/lib/db/schema";
import { generateToken, hashToken } from "./tokens";

const SESSION_COOKIE = "alphanodus_session";
const SESSION_TTL_DAYS = 30;

export async function createSession(participantId: string, userAgent?: string): Promise<string> {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(sessions).values({
    participantId,
    tokenHash,
    userAgent,
    expiresAt,
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await db
      .update(sessions)
      .set({ revokedAt: new Date() })
      .where(eq(sessions.tokenHash, hashToken(token)));
  }
  store.delete(SESSION_COOKIE);
}

/** The signed-in participant, or null. Safe to call from any server context. */
export async function getCurrentParticipant(): Promise<Participant | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await db
    .select({ participant: participants })
    .from(sessions)
    .innerJoin(participants, eq(sessions.participantId, participants.id))
    .where(
      and(
        eq(sessions.tokenHash, hashToken(token)),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return rows[0]?.participant ?? null;
}

export function hasRole(participant: Participant, role: AppRole): boolean {
  return (participant.appRoles ?? []).includes(role);
}

/** Throws if nobody is signed in — call at the top of any protected route. */
export async function requireParticipant(): Promise<Participant> {
  const participant = await getCurrentParticipant();
  if (!participant) {
    throw new AuthError("UNAUTHENTICATED", "Sign-in required");
  }
  return participant;
}

export async function requireRole(role: AppRole): Promise<Participant> {
  const participant = await requireParticipant();
  if (!hasRole(participant, role)) {
    throw new AuthError("FORBIDDEN", `Requires the '${role}' role`);
  }
  return participant;
}

export class AuthError extends Error {
  constructor(
    public code: "UNAUTHENTICATED" | "FORBIDDEN",
    message: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}
