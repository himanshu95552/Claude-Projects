import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { lanes, participants, storyBankEntries, voiceProfiles } from "@/lib/db/schema";
import { requireParticipant, AuthError } from "@/lib/auth/session";
import { writeConfig } from "@/lib/config/resolve";
import { buildVoiceFingerprint, suggestSlidersFromFingerprint } from "@/lib/generation/voice-fingerprint";

const CONSENT_VERSION = "v1";

const payloadSchema = z.object({
  fullName: z.string().min(1),
  jobTitle: z.string().min(1),
  consentAgreed: z.literal(true),
  laneId: z.string().uuid(),
  writingSamples: z.array(z.string()).default([]),
  voiceRules: z.array(z.string()).default([]),
  bannedPhrases: z.array(z.string()).default([]),
  sliders: z.object({
    formality: z.number().min(0).max(100),
    sentenceLength: z.number().min(0).max(100),
    hedging: z.number().min(0).max(100),
    humor: z.number().min(0).max(100),
    directness: z.number().min(0).max(100),
    technicalDepth: z.number().min(0).max(100),
  }),
  storyBank: z.array(z.object({ kind: z.enum(["number", "turning_point", "position", "anecdote"]), content: z.string().min(1) })).default([]),
  postsPerWeek: z.number().min(0).max(7),
  commentsPerDay: z.number().min(0).max(20),
  timezone: z.string(),
  reminderTime: z.string(),
  availableWindowStart: z.string(),
  availableWindowEnd: z.string(),
});

/**
 * Onboarding submits once, at the end of the wizard — app-spec.md
 * "~10 min, once." Consent is not skippable: the API refuses to complete
 * onboarding without consentAgreed === true, and records a timestamp +
 * version so a later terms change can require re-consent.
 */
export async function POST(req: NextRequest) {
  try {
    const participant = await requireParticipant();
    const body = payloadSchema.parse(await req.json());

    const lane = (await db.select().from(lanes).where(eq(lanes.id, body.laneId)).limit(1))[0];
    if (!lane) return NextResponse.json({ error: "Lane not found" }, { status: 400 });
    if (lane.status === "claimed" && lane.heldByParticipantId && lane.heldByParticipantId !== participant.id) {
      return NextResponse.json({ error: "That lane is already claimed" }, { status: 409 });
    }

    await db.transaction(async (tx) => {
      await tx
        .update(participants)
        .set({
          fullName: body.fullName,
          jobTitle: body.jobTitle,
          laneId: body.laneId,
          consentAt: new Date(),
          consentVersion: CONSENT_VERSION,
          timezone: body.timezone,
          reminderTime: body.reminderTime,
          availableWindowStart: body.availableWindowStart,
          availableWindowEnd: body.availableWindowEnd,
          status: "active",
        })
        .where(eq(participants.id, participant.id));

      await tx
        .update(lanes)
        .set({ status: "claimed", heldByParticipantId: participant.id })
        .where(eq(lanes.id, body.laneId));

      await tx.insert(voiceProfiles).values({
        participantId: participant.id,
        version: 1,
        isCurrent: true,
        sliders: body.sliders,
        freetextRules: body.voiceRules,
        bannedPhrases: body.bannedPhrases,
        emojiSetting: "never",
        source: body.writingSamples.length > 0 ? "writing_samples" : "interview",
        sourceNotes:
          body.writingSamples.length > 0
            ? `Built from ${body.writingSamples.length} writing sample(s) at onboarding.`
            : "Built from onboarding interview answers.",
      });

      if (body.storyBank.length > 0) {
        await tx.insert(storyBankEntries).values(
          body.storyBank.map((s) => ({ participantId: participant.id, kind: s.kind, content: s.content })),
        );
      }
    });

    await writeConfig({
      scope: "participant",
      scopeRef: participant.id,
      settings: {
        cadence: { postsPerWeek: body.postsPerWeek, commentsPerDay: body.commentsPerDay },
        timing: {
          timezone: body.timezone,
          queueDeliveryTime: body.reminderTime,
          preferredPostingWindowStart: body.availableWindowStart,
          preferredPostingWindowEnd: body.availableWindowEnd,
        },
      },
      changedByParticipantId: participant.id,
      changeNote: "Set during onboarding",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    throw err;
  }
}

/** Precomputes voice-slider suggestions from pasted writing samples — used by the wizard's voice step. */
export async function PUT(req: NextRequest) {
  try {
    await requireParticipant();
    const body = z.object({ samples: z.array(z.string()) }).parse(await req.json());
    const fingerprint = buildVoiceFingerprint(body.samples);
    const suggestions = suggestSlidersFromFingerprint(fingerprint);
    return NextResponse.json({ suggestions, fingerprint });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    throw err;
  }
}
