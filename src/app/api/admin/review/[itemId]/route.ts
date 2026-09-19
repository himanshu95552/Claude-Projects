import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { queueItems } from "@/lib/db/schema";
import { requireRole, AuthError } from "@/lib/auth/session";

const bodySchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  note: z.string().optional(),
});

/**
 * Review-queue action — governance.md's 4-hour SLA items. Approving
 * clears needs_review so the participant sees it in their queue normally;
 * rejecting keeps it blocked and records why, per governance.md's
 * escalation table (cut the claim, ship without it; or hard stop for PHI).
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const admin = await requireRole("admin");
    const { itemId } = await params;
    const body = bodySchema.parse(await req.json());

    await db
      .update(queueItems)
      .set({
        needsReview: body.decision,
        reviewedByParticipantId: admin.id,
        reviewedAt: new Date(),
        reviewNote: body.note,
      })
      .where(eq(queueItems.id, itemId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.code === "FORBIDDEN" ? 403 : 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    throw err;
  }
}
