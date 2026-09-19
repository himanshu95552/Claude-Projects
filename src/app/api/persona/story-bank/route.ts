import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { storyBankEntries } from "@/lib/db/schema";
import { requireParticipant, AuthError } from "@/lib/auth/session";

const createSchema = z.object({
  kind: z.enum(["number", "turning_point", "position", "anecdote"]),
  content: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const participant = await requireParticipant();
    const body = createSchema.parse(await req.json());
    const [entry] = await db
      .insert(storyBankEntries)
      .values({ participantId: participant.id, kind: body.kind, content: body.content })
      .returning();
    return NextResponse.json({ entry });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    throw err;
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const participant = await requireParticipant();
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db
      .delete(storyBankEntries)
      .where(and(eq(storyBankEntries.id, id), eq(storyBankEntries.participantId, participant.id)));
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    throw err;
  }
}
