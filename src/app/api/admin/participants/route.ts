import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { participants } from "@/lib/db/schema";
import { requireRole, AuthError } from "@/lib/auth/session";

const createSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1),
  jobTitle: z.string().min(1),
  employment: z.enum(["employee", "contractor", "advisor", "founder"]).default("employee"),
});

/** Admin "add a participant" — build-spec.md §6. Creates an invited row; they self-onboard on first sign-in. */
export async function POST(req: NextRequest) {
  try {
    await requireRole("admin");
    const body = createSchema.parse(await req.json());

    const [created] = await db
      .insert(participants)
      .values({
        email: body.email.toLowerCase().trim(),
        fullName: body.fullName,
        jobTitle: body.jobTitle,
        employment: body.employment,
        appRoles: ["participant"],
        status: "invited",
      })
      .returning();

    return NextResponse.json({ participant: created });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.code === "FORBIDDEN" ? 403 : 401 });
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.issues[0]?.message }, { status: 400 });
    if (err instanceof Error && err.message.includes("unique")) {
      return NextResponse.json({ error: "That email is already in the program" }, { status: 409 });
    }
    throw err;
  }
}
