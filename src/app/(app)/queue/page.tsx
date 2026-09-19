import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { queueItems, queues } from "@/lib/db/schema";
import { getCurrentParticipant } from "@/lib/auth/session";
import { QueueClient } from "@/components/queue/queue-client";
import { sortQueueItems } from "@/domain/queue-order";
import { connectionStatus, getLinkedInAccount } from "@/lib/integrations/linkedin/account";
import { getXAccount, connectionStatus as xConnectionStatus } from "@/lib/integrations/x/account";

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

  const linkedInAccount = await getLinkedInAccount(participant.id);
  const linkedInStatus = connectionStatus(linkedInAccount);
  const xAccount = await getXAccount(participant.id);
  const xStatus = xConnectionStatus(xAccount);

  return (
    <QueueClient
      participantName={participant.fullName}
      streakDays={participant.streakDays}
      queue={queue ?? null}
      initialItems={items}
      linkedInConnected={linkedInStatus === "connected" || linkedInStatus === "expiring_soon"}
      xConnected={xStatus === "connected"}
    />
  );
}
