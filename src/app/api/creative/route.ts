import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { creativeBriefs, queueItems, queues } from "@/lib/db/schema";
import { requireParticipant, AuthError } from "@/lib/auth/session";
import { buildEnvelope } from "@/domain/queue-builder";
import { generateCreativeBrief } from "@/lib/generation/generate";
import { getCreativeSpec } from "@/lib/creative/platform-specs";
import type { CreativeFormat, Platform } from "@/lib/creative/types";

const PLATFORMS: Platform[] = ["linkedin", "instagram", "facebook", "x"];
const FORMATS: CreativeFormat[] = ["static", "carousel", "trending"];

const bodySchema = z.object({
  queueItemId: z.string().uuid(),
  format: z.enum(["static", "carousel", "trending"]),
  platform: z.enum(["linkedin", "instagram", "facebook", "x"]).optional(),
});

async function loadOwnedPublishItem(participantId: string, queueItemId: string) {
  const [item] = await db.select().from(queueItems).where(eq(queueItems.id, queueItemId)).limit(1);
  if (!item) return null;
  const [queue] = await db.select().from(queues).where(eq(queues.id, item.queueId)).limit(1);
  if (!queue || queue.participantId !== participantId) return null;
  if (item.type !== "publish") return null;
  return item;
}

/**
 * Generates a brand-guided creative brief (banner copy + platform-correct
 * dimensions, not a rendered image — see creative.ts's doc comment) for a
 * publish item, and persists it. Every call is a fresh generateCreativeBrief()
 * invocation — regenerating never edits a prior brief, it inserts a new row,
 * so "regenerate" always starts from a clean model session (no accumulated
 * back-and-forth to drift the copy off the AN27 rules).
 */
export async function POST(req: NextRequest) {
  try {
    const participant = await requireParticipant();
    const { queueItemId, format, platform: platformOverride } = bodySchema.parse(await req.json());

    const item = await loadOwnedPublishItem(participant.id, queueItemId);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const platform = (platformOverride ?? item.platform) as Platform;
    if (!PLATFORMS.includes(platform)) {
      return NextResponse.json({ error: "Unsupported platform" }, { status: 400 });
    }

    const spec = getCreativeSpec(platform, format);
    const envelope = await buildEnvelope(participant.id);
    const pillar = item.metadata.pillar ?? envelope.participant.lane.pillars[0] ?? envelope.participant.lane.name;

    const { output, meta } = await generateCreativeBrief({
      ...envelope,
      pillar,
      sourceMaterial: item.editedContent ?? item.content,
      platform,
      format,
      spec,
    });

    const [brief] = await db
      .insert(creativeBriefs)
      .values({
        queueItemId: item.id,
        platform: output.platform,
        format: output.format,
        widthPx: output.widthPx,
        heightPx: output.heightPx,
        aspectRatio: output.aspectRatio,
        slides: output.slides,
        cta: output.cta,
        brandComplianceNotes: output.brandComplianceNotes,
      })
      .returning();

    return NextResponse.json({
      brief,
      explain: output.explain,
      isDemoContent: meta.isDemoContent,
      governanceFlags: meta.governanceFlags,
    });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    const message = err instanceof Error ? err.message : "Creative brief generation failed";
    console.error("Creative brief generation failed:", err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

const querySchema = z.object({ queueItemId: z.string().uuid() });

/** Lists previously generated briefs for one queue item, newest first. */
export async function GET(req: NextRequest) {
  try {
    const participant = await requireParticipant();
    const { queueItemId } = querySchema.parse({
      queueItemId: req.nextUrl.searchParams.get("queueItemId"),
    });

    const item = await loadOwnedPublishItem(participant.id, queueItemId);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const briefs = await db
      .select()
      .from(creativeBriefs)
      .where(eq(creativeBriefs.queueItemId, queueItemId))
      .orderBy(desc(creativeBriefs.createdAt));

    return NextResponse.json({ briefs, specs: Object.fromEntries(FORMATS.map((f) => [f, getCreativeSpec(item.platform as Platform, f)])) });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    return NextResponse.json({ error: "Failed to load creative briefs" }, { status: 500 });
  }
}
