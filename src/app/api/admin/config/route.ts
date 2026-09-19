import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole, AuthError } from "@/lib/auth/session";
import { writeConfig } from "@/lib/config/resolve";
import { settingsSchema } from "@/lib/config/schema";

const bodySchema = z.object({
  scope: z.enum(["global", "lane", "participant"]),
  scopeRef: z.string().uuid().nullable(),
  settings: settingsSchema,
  changeNote: z.string().optional(),
});

/** Admin config editor — every number in build-spec.md §5 is editable here, always versioned. */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireRole("admin");
    const body = bodySchema.parse(await req.json());

    await writeConfig({
      scope: body.scope,
      scopeRef: body.scopeRef,
      settings: body.settings,
      changedByParticipantId: admin.id,
      changeNote: body.changeNote,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.code === "FORBIDDEN" ? 403 : 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    throw err;
  }
}
