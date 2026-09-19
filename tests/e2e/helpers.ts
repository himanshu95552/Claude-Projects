import "dotenv/config";
import type { Page } from "@playwright/test";
import { eq } from "drizzle-orm";
import { db } from "../../src/lib/db/client";
import { configs, lanes, participants, queueItems } from "../../src/lib/db/schema";

/**
 * Signs a page in as the given email via the real magic-link flow — not a
 * cookie-injection shortcut — so auth/session/middleware all get exercised
 * exactly as a real user would hit them.
 */
export async function loginAs(page: Page, email: string): Promise<void> {
  const res = await page.request.post("/api/auth/request-link", {
    data: { email },
  });
  const body = await res.json();
  if (!body.magicLinkUrl) {
    throw new Error(
      `No magicLinkUrl in response — is the server running with NODE_ENV=production? (email: ${email})`,
    );
  }
  await page.goto(body.magicLinkUrl, { waitUntil: "networkidle" });
}

/** Ensures a test participant exists with the given status, resetting fields that matter for the test. */
export async function ensureParticipant(params: {
  email: string;
  fullName: string;
  jobTitle?: string;
  status: "invited" | "onboarding" | "active";
  appRoles?: Array<"participant" | "operator" | "admin">;
}): Promise<void> {
  const existing = await db.select().from(participants).where(eq(participants.email, params.email)).limit(1);
  if (existing.length > 0) {
    await db
      .update(participants)
      .set({
        status: params.status,
        laneId: params.status === "invited" || params.status === "onboarding" ? null : existing[0].laneId,
      })
      .where(eq(participants.email, params.email));
  } else {
    await db.insert(participants).values({
      email: params.email,
      fullName: params.fullName,
      jobTitle: params.jobTitle ?? "Team member",
      employment: "employee",
      appRoles: params.appRoles ?? ["participant"],
      status: params.status,
    });
  }
}

/** Full cleanup for a test participant, including rows that lack cascade deletes. */
export async function deleteParticipant(email: string): Promise<void> {
  const [row] = await db.select().from(participants).where(eq(participants.email, email)).limit(1);
  if (!row) return;

  await db.update(configs).set({ changedByParticipantId: null }).where(eq(configs.changedByParticipantId, row.id));
  await db
    .update(queueItems)
    .set({ reviewedByParticipantId: null })
    .where(eq(queueItems.reviewedByParticipantId, row.id));
  await db
    .update(lanes)
    .set({ status: "open", heldByParticipantId: null })
    .where(eq(lanes.heldByParticipantId, row.id));

  await db.delete(participants).where(eq(participants.id, row.id));
}
