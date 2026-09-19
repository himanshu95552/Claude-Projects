import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { runNightlyJob } from "@/domain/nightly-job";

/**
 * Triggered by Vercel Cron (or GitHub Actions) once nightly. Protected by
 * a shared secret so the endpoint can't be invoked publicly — build-spec.md
 * §8 lists "Vercel Cron or GitHub Actions" as the nightly-job runner.
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${getEnv().CRON_SECRET}`;
  if (authHeader !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dateParam = req.nextUrl.searchParams.get("date");
  const forDate = dateParam ? new Date(dateParam) : undefined;

  const result = forDate ? await runNightlyJob(forDate) : await runNightlyJob();
  return NextResponse.json(result);
}
