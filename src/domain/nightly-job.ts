import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { apiUsageLog, generationJobs, participants } from "@/lib/db/schema";
import { estimateCostUsd } from "@/lib/integrations/claude/client";
import { isDemoMode } from "@/lib/env";
import { sendPushToParticipant } from "@/lib/push/send";
import { generateQueueForParticipant } from "./queue-builder";

/**
 * The nightly job — build-spec.md §3: "research sweep -> draft -> build
 * tomorrow's queues. It only ever *writes drafts into a queue*. It never
 * touches a platform." Runs once per night, generating tomorrow's queue
 * for every active participant. In DEMO_MODE this still runs end-to-end
 * with placeholder content, so the app is testable without an API key.
 *
 * Invoked from scripts/nightly-job.ts (CLI) or
 * POST /api/cron/nightly-generation (Vercel Cron / GitHub Actions).
 */
export async function runNightlyJob(forDate: Date = tomorrow()): Promise<{
  jobId: string;
  participantsProcessed: number;
  itemsGenerated: number;
}> {
  const [job] = await db
    .insert(generationJobs)
    .values({ status: "running", startedAt: new Date() })
    .returning();

  console.log(
    `[nightly-job] Started ${job.id} for ${forDate.toISOString().slice(0, 10)} (demo mode: ${isDemoMode()})`,
  );

  const active = await db
    .select()
    .from(participants)
    .where(inArray(participants.status, ["active", "onboarding"]));

  let itemsGenerated = 0;
  let errorMessage: string | null = null;

  try {
    for (const participant of active) {
      try {
        const summary = await generateQueueForParticipant(participant.id, forDate);
        itemsGenerated += summary.itemCount;
        console.log(
          `[nightly-job] ${participant.fullName}: ${summary.itemCount} items (${summary.reviewNeededCount} need review)`,
        );

        if (summary.itemCount > 0) {
          await sendPushToParticipant(participant.id, {
            title: "Your queue is ready",
            body: `${summary.itemCount} item${summary.itemCount === 1 ? "" : "s"} — about ${Math.ceil(summary.itemCount * 2)} minutes`,
            url: "/queue",
          });
        }

        if (!isDemoMode()) {
          await db.insert(apiUsageLog).values({
            generationJobId: job.id,
            model: "claude-sonnet-5",
            jobType: "draft",
            inputTokens: 0,
            outputTokens: 0,
            costUsd: String(
              estimateCostUsd({ model: "claude-sonnet-5", inputTokens: 0, outputTokens: 0, cachedInputTokens: 0 }),
            ),
          });
        }
      } catch (err) {
        console.error(`[nightly-job] Failed for ${participant.fullName}:`, err);
      }
    }
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : String(err);
  }

  await db
    .update(generationJobs)
    .set({
      status: errorMessage ? "failed" : "succeeded",
      finishedAt: new Date(),
      participantsProcessed: active.length,
      itemsGenerated,
      errorMessage,
    })
    .where(eq(generationJobs.id, job.id));

  console.log(`[nightly-job] Finished ${job.id}: ${active.length} participants, ${itemsGenerated} items.`);

  return { jobId: job.id, participantsProcessed: active.length, itemsGenerated };
}

function tomorrow(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
}
