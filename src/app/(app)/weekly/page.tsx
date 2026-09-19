import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { queueItems, queues } from "@/lib/db/schema";
import { getCurrentParticipant } from "@/lib/auth/session";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function startOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day; // back up to Sunday
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default async function WeeklyPage() {
  const participant = await getCurrentParticipant();
  if (!participant) return null;

  const weekStart = startOfWeek(new Date());
  const weekStartStr = weekStart.toISOString().slice(0, 10);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const weekEndStr = weekEnd.toISOString().slice(0, 10);

  const weekQueues = await db
    .select()
    .from(queues)
    .where(
      and(
        eq(queues.participantId, participant.id),
        gte(queues.forDate, weekStartStr),
        lte(queues.forDate, weekEndStr),
      ),
    );

  const queueIds = weekQueues.map((q) => q.id);
  const allItems = queueIds.length
    ? (
        await Promise.all(queueIds.map((id) => db.select().from(queueItems).where(eq(queueItems.queueId, id))))
      ).flat()
    : [];

  const posts = allItems.filter((i) => i.type === "publish");
  const postsShipped = posts.filter((i) => i.status === "done").length;

  const totalItems = allItems.length;
  const completedItems = allItems.filter((i) => i.status === "done" || i.status === "skipped").length;
  const completionPct = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  const skipped = allItems.filter((i) => i.status === "skipped" && i.skipReason);
  const daysWithQueue = weekQueues.length;
  const daysCleared = weekQueues.filter((q) => q.clearedAt).length;

  const participationSlipped = daysWithQueue > 0 && daysCleared / daysWithQueue < 0.5;

  return (
    <div>
      <h1 className="text-lg font-semibold mb-1">Week of {weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</h1>
      <p className="text-sm text-muted mb-6">What posted, how the week went, and what to adjust.</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card><CardBody><div className="text-2xl font-semibold">{postsShipped}</div><div className="text-xs text-muted">Posts shipped</div></CardBody></Card>
        <Card><CardBody><div className="text-2xl font-semibold">{completionPct}%</div><div className="text-xs text-muted">Queue completion</div></CardBody></Card>
        <Card><CardBody><div className="text-2xl font-semibold">{daysCleared}/{daysWithQueue}</div><div className="text-xs text-muted">Days fully cleared</div></CardBody></Card>
      </div>

      {participationSlipped && (
        <Card className="mb-6 border-warning">
          <CardBody>
            <Badge tone="warning" className="mb-2">Gentle nudge</Badge>
            <p className="text-sm">
              Completion dipped below half this week. If the committed cadence is too high right now,
              adjusting it in Persona is a better fix than pushing through — a sustained lower number
              beats an abandoned higher one.
            </p>
          </CardBody>
        </Card>
      )}

      {posts.length > 0 && (
        <Card className="mb-6">
          <CardBody>
            <h2 className="text-sm font-semibold mb-3">Posts this week</h2>
            <div className="space-y-2">
              {posts.map((p) => (
                <div key={p.id} className="text-sm">
                  <Badge tone={p.status === "done" ? "success" : "neutral"} className="mr-2">{p.status}</Badge>
                  {(p.editedContent ?? p.content).slice(0, 100)}...
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {skipped.length > 0 && (
        <Card>
          <CardBody>
            <h2 className="text-sm font-semibold mb-1">What felt wrong to post</h2>
            <p className="text-xs text-muted mb-3">
              Skips are the most valuable signal in the system — three people skipping the same draft
              means the draft was wrong, not that they were lazy.
            </p>
            <div className="space-y-2">
              {skipped.map((s) => (
                <div key={s.id} className="text-sm border-l-2 border-border pl-3">
                  <span className="text-muted">{s.type}:</span> {s.skipReason}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {totalItems === 0 && (
        <Card><CardBody className="text-center py-10 text-muted text-sm">No queue activity yet this week.</CardBody></Card>
      )}
    </div>
  );
}
