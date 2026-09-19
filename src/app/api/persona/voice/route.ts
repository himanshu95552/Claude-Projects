import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { voiceProfiles } from "@/lib/db/schema";
import { requireParticipant, AuthError } from "@/lib/auth/session";

const slidersSchema = z.object({
  formality: z.number().min(0).max(100),
  sentenceLength: z.number().min(0).max(100),
  hedging: z.number().min(0).max(100),
  humor: z.number().min(0).max(100),
  directness: z.number().min(0).max(100),
  technicalDepth: z.number().min(0).max(100),
});

const saveSchema = z.object({
  sliders: slidersSchema,
  freetextRules: z.array(z.string()),
  bannedPhrases: z.array(z.string()),
  emojiSetting: z.enum(["never", "rare", "normal"]),
});

/**
 * Voice profiles are versioned, never overwritten (build-spec.md §7).
 * Saving creates a new row and flips isCurrent — old versions stay
 * queryable so a participant can see what changed and when.
 */
export async function PATCH(req: NextRequest) {
  try {
    const participant = await requireParticipant();
    const body = saveSchema.parse(await req.json());

    const current = await db
      .select({ version: voiceProfiles.version })
      .from(voiceProfiles)
      .where(and(eq(voiceProfiles.participantId, participant.id), eq(voiceProfiles.isCurrent, true)))
      .orderBy(desc(voiceProfiles.version))
      .limit(1);

    await db.transaction(async (tx) => {
      if (current.length > 0) {
        await tx
          .update(voiceProfiles)
          .set({ isCurrent: false })
          .where(and(eq(voiceProfiles.participantId, participant.id), eq(voiceProfiles.isCurrent, true)));
      }
      await tx.insert(voiceProfiles).values({
        participantId: participant.id,
        version: current.length > 0 ? current[0].version + 1 : 1,
        isCurrent: true,
        sliders: body.sliders,
        freetextRules: body.freetextRules,
        bannedPhrases: body.bannedPhrases,
        emojiSetting: body.emojiSetting,
        source: "manual",
        sourceNotes: "Edited in the persona editor.",
      });
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    throw err;
  }
}
