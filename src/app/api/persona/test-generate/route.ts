import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireParticipant, AuthError } from "@/lib/auth/session";
import { buildEnvelope } from "@/domain/queue-builder";
import { generatePost } from "@/lib/generation/generate";

const slidersSchema = z.object({
  formality: z.number().min(0).max(100),
  sentenceLength: z.number().min(0).max(100),
  hedging: z.number().min(0).max(100),
  humor: z.number().min(0).max(100),
  directness: z.number().min(0).max(100),
  technicalDepth: z.number().min(0).max(100),
});

const bodySchema = z.object({
  sliders: slidersSchema,
  freetextRules: z.array(z.string()),
  bannedPhrases: z.array(z.string()),
});

/**
 * The persona test bench — app-spec.md: "change a setting, generate a
 * sample post, see the difference side-by-side against current voice,
 * then save or discard." This generates against CANDIDATE voice settings
 * without ever writing them — the save path is /api/persona/voice.
 */
export async function POST(req: NextRequest) {
  try {
    const participant = await requireParticipant();
    const body = bodySchema.parse(await req.json());

    const envelope = await buildEnvelope(participant.id);
    const candidateEnvelope = {
      ...envelope,
      voiceProfile: {
        ...envelope.voiceProfile,
        sliders: body.sliders,
        rules: body.freetextRules,
        bannedPhrases: body.bannedPhrases,
      },
    };

    const { output, meta } = await generatePost({
      ...candidateEnvelope,
      pillar: envelope.participant.lane.pillars[0] ?? envelope.participant.lane.name,
      hookGoal: "comments",
    });

    return NextResponse.json({ output, meta });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    throw err;
  }
}
