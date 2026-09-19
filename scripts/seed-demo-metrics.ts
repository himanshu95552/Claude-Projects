import "dotenv/config";
import { db } from "../src/lib/db/client";
import { metricSnapshots, participants, queueItems, queues } from "../src/lib/db/schema";
import { and, eq } from "drizzle-orm";

/**
 * Demo-only: synthesizes plausible metric_snapshots for every existing
 * publish item so the Analytics dashboard (src/domain/analytics.ts) has
 * something to show — real installs log metrics by hand (see
 * docs/ARCHITECTURE.md's manual-entry rationale), which produces nothing
 * to look at on a freshly seeded program. Skips items that already have a
 * snapshot, so it's safe to re-run.
 */
async function main() {
  const allParticipants = await db.select().from(participants);

  for (const participant of allParticipants) {
    const participantQueues = await db.select().from(queues).where(eq(queues.participantId, participant.id));
    let seeded = 0;

    for (const queue of participantQueues) {
      const items = await db
        .select()
        .from(queueItems)
        .where(and(eq(queueItems.queueId, queue.id), eq(queueItems.type, "publish")));

      for (const item of items) {
        const [existing] = await db
          .select({ id: metricSnapshots.id })
          .from(metricSnapshots)
          .where(eq(metricSnapshots.queueItemId, item.id))
          .limit(1);
        if (existing) continue;

        // Vary numbers by pillar so a pillar-comparison insight actually fires.
        const isStrongPillar = (item.metadata.pillar ?? "").length % 2 === 0;
        const impressions = isStrongPillar ? 2500 + Math.floor(Math.random() * 2000) : 900 + Math.floor(Math.random() * 600);
        const reactions = Math.floor(impressions * 0.02);
        const comments = Math.floor(impressions * (isStrongPillar ? 0.006 : 0.003));
        const shares = Math.floor(impressions * (isStrongPillar ? 0.008 : 0.001));
        const saves = Math.floor(impressions * (isStrongPillar ? 0.02 : 0.004));

        await db.insert(metricSnapshots).values({
          participantId: participant.id,
          queueItemId: item.id,
          platform: item.platform,
          impressions,
          reactions,
          comments,
          shares,
          saves,
          clicks: Math.floor(impressions * 0.01),
          source: "manual",
          capturedAt: queue.generatedAt ?? new Date(),
        });
        seeded++;
      }
    }
    console.log(`Seeded ${seeded} metric snapshots for ${participant.fullName}`);
  }

  process.exit(0);
}

main();
