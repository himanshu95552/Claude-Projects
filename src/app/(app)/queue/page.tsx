import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { queueItems, queues } from "@/lib/db/schema";
import { getCurrentParticipant } from "@/lib/auth/session";
import { QueueClient } from "@/components/queue/queue-client";
import { sortQueueItems } from "@/domain/queue-order";

export default async function QueuePage() {
  const participant = await getCurrentParticipant();
  if (!participant) return null;

  const todayStr = new Date().toISOString().slice(0, 10);

  const [queue] = await db
    .select()
    .from(queues)
    .where(and(eq(queues.participantId, participant.id), eq(queues.forDate, todayStr)))
    .limit(1);

  const items = queue
    ? sortQueueItems(
        await db.select().from(queueItems).where(eq(queueItems.queueId, queue.id)),
      )
    : [];

  return (
    <QueueClient
      participantName={participant.fullName}
      streakDays={participant.streakDays}
      queue={queue ?? null}
      initialItems={items}
    />
  );
}
