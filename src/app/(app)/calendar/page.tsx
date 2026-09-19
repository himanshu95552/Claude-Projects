import Link from "next/link";
import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { participants, queueItems, queues } from "@/lib/db/schema";
import { getCurrentParticipant, hasRole } from "@/lib/auth/session";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adjacentMonth, monthGrid, monthLabel, monthParam, monthRangeDates, parseMonthParam } from "@/domain/calendar";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_TONE = { done: "success", skipped: "neutral", pending: "accent", failed: "danger" } as const;

async function loadCalendarItems(participantIds: string[], start: string, end: string) {
  const rangeQueues = await db
    .select()
    .from(queues)
    .where(and(inArray(queues.participantId, participantIds), gte(queues.forDate, start), lte(queues.forDate, end)));
  if (rangeQueues.length === 0) return [];

  const queueIds = rangeQueues.map((q) => q.id);
  const items = await db
    .select()
    .from(queueItems)
    .where(and(inArray(queueItems.queueId, queueIds), eq(queueItems.type, "publish")));

  const queueById = new Map(rangeQueues.map((q) => [q.id, q]));
  return items.map((item) => ({ item, queue: queueById.get(item.queueId)! }));
}

function DayCell({
  day,
  entries,
  participantNames,
}: {
  day: { date: string; inMonth: boolean; isToday: boolean };
  entries: Array<{ item: typeof queueItems.$inferSelect; queue: typeof queues.$inferSelect }>;
  participantNames?: Map<string, string>;
}) {
  const dayNum = Number(day.date.slice(8, 10));
  const shown = entries.slice(0, 3);
  const overflow = entries.length - shown.length;

  return (
    <div className={`border border-border rounded-md p-1.5 min-h-[92px] ${day.inMonth ? "bg-surface" : "bg-canvas"}`}>
      <div className={`text-xs mb-1 ${day.isToday ? "font-semibold text-accent" : day.inMonth ? "text-foreground" : "text-muted"}`}>
        {day.isToday ? `${dayNum} · today` : dayNum}
      </div>
      <div className="space-y-1">
        {shown.map(({ item, queue }) => (
          <div key={item.id} className="text-[10px] leading-tight rounded bg-canvas px-1 py-0.5 flex items-center gap-1">
            <Badge tone={STATUS_TONE[item.status]} className="shrink-0 !text-[9px] !px-1 !py-0">
              {item.platform === "x" ? "X" : item.platform.slice(0, 2).toUpperCase()}
            </Badge>
            <span className="truncate">
              {participantNames ? `${participantNames.get(queue.participantId) ?? "?"}: ` : ""}
              {(item.editedContent ?? item.content).slice(0, 40)}
            </span>
          </div>
        ))}
        {overflow > 0 && <div className="text-[10px] text-muted">+{overflow} more</div>}
      </div>
    </div>
  );
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; scope?: string }>;
}) {
  const participant = await getCurrentParticipant();
  if (!participant) return null;

  const params = await searchParams;
  const { year, month } = parseMonthParam(params.month);
  const { start, end } = monthRangeDates(year, month);
  const grid = monthGrid(year, month);

  const canSeeTeam = hasRole(participant, "admin") || hasRole(participant, "operator");
  const scope = canSeeTeam && params.scope === "team" ? "team" : "mine";

  let entries: Array<{ item: typeof queueItems.$inferSelect; queue: typeof queues.$inferSelect }>;
  let participantNames: Map<string, string> | undefined;

  if (scope === "team") {
    const all = await db.select({ id: participants.id, fullName: participants.fullName }).from(participants);
    participantNames = new Map(all.map((p) => [p.id, p.fullName]));
    entries = await loadCalendarItems(all.map((p) => p.id), start, end);
  } else {
    entries = await loadCalendarItems([participant.id], start, end);
  }

  const byDate = new Map<string, typeof entries>();
  for (const e of entries) {
    const key = e.queue.forDate;
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(e);
  }

  const prev = adjacentMonth(year, month, -1);
  const next = adjacentMonth(year, month, 1);
  const scopeQuery = scope === "team" ? "&scope=team" : "";

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-lg font-semibold">{monthLabel(year, month)}</h1>
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/calendar?month=${monthParam(prev.year, prev.month)}${scopeQuery}`} className="text-accent hover:underline">
            ← Prev
          </Link>
          <Link href={`/calendar?month=${monthParam(next.year, next.month)}${scopeQuery}`} className="text-accent hover:underline">
            Next →
          </Link>
        </div>
      </div>
      <p className="text-sm text-muted mb-4">
        Spot posting gaps and overlap at a glance — every scheduled or shipped publish item, laid out by day.
      </p>

      {canSeeTeam && (
        <div className="flex gap-2 mb-4">
          <Link
            href={`/calendar?month=${monthParam(year, month)}`}
            className={`text-xs px-2.5 py-1 rounded-full border ${scope === "mine" ? "bg-accent text-white border-accent" : "border-border text-muted"}`}
          >
            My calendar
          </Link>
          <Link
            href={`/calendar?month=${monthParam(year, month)}&scope=team`}
            className={`text-xs px-2.5 py-1 rounded-full border ${scope === "team" ? "bg-accent text-white border-accent" : "border-border text-muted"}`}
          >
            Team calendar
          </Link>
        </div>
      )}

      <Card>
        <CardBody>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAY_LABELS.map((w) => (
              <div key={w} className="text-[10px] font-medium text-muted uppercase text-center">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {grid.map((day) => (
              <DayCell key={day.date} day={day} entries={byDate.get(day.date) ?? []} participantNames={participantNames} />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
