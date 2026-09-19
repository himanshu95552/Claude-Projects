import { desc, eq, inArray, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { metricSnapshots, queueItems } from "@/lib/db/schema";
import { getCurrentParticipant, hasRole } from "@/lib/auth/session";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  byHookType,
  byPillar,
  byPlatform,
  generateInsights,
  weeklySeries,
  type GroupStats,
  type SnapshotWithItem,
} from "@/domain/analytics";

const TONE_BADGE: Record<string, "success" | "warning" | "accent"> = {
  positive: "success",
  warning: "warning",
  info: "accent",
};

async function loadRows(participantId?: string): Promise<SnapshotWithItem[]> {
  const snapshots = participantId
    ? await db
        .select()
        .from(metricSnapshots)
        .where(eq(metricSnapshots.participantId, participantId))
        .orderBy(desc(metricSnapshots.capturedAt))
    : await db.select().from(metricSnapshots).where(isNotNull(metricSnapshots.queueItemId)).orderBy(desc(metricSnapshots.capturedAt));

  const itemIds = [...new Set(snapshots.map((s) => s.queueItemId).filter((id): id is string => Boolean(id)))];
  if (itemIds.length === 0) return [];

  const items = await db.select().from(queueItems).where(inArray(queueItems.id, itemIds));
  const itemsById = new Map(items.map((i) => [i.id, i]));

  return snapshots
    .filter((s) => s.queueItemId && itemsById.has(s.queueItemId))
    .map((s) => ({ snapshot: s, item: itemsById.get(s.queueItemId!)! }));
}

function GroupBars({ title, groups, unit }: { title: string; groups: GroupStats[]; unit: string }) {
  if (groups.length === 0) return null;
  const max = Math.max(...groups.map((g) => g.avgScore), 1);
  return (
    <Card className="mb-6">
      <CardBody>
        <h2 className="text-sm font-semibold mb-3">{title}</h2>
        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g.key}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium">{g.key}</span>
                <span className="text-muted">
                  {Math.round(g.avgScore)} avg score · {g.count} {unit}
                </span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-accent transition-all"
                  style={{ width: `${Math.max(4, Math.round((g.avgScore / max) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default async function AnalyticsPage() {
  const participant = await getCurrentParticipant();
  if (!participant) return null;

  const myRows = await loadRows(participant.id);
  const myInsights = generateInsights(myRows);
  const myPillars = byPillar(myRows);
  const myHooks = byHookType(myRows);
  const myPlatforms = byPlatform(myRows);
  const mySeries = weeklySeries(myRows);

  const canSeeProgram = hasRole(participant, "admin") || hasRole(participant, "operator");
  const programRows = canSeeProgram ? await loadRows() : [];
  const programInsights = canSeeProgram ? generateInsights(programRows) : [];
  const programPlatforms = canSeeProgram ? byPlatform(programRows) : [];

  return (
    <div>
      <h1 className="text-lg font-semibold mb-1">Analytics</h1>
      <p className="text-sm text-muted mb-6">
        Real insights, not raw counts — every score below weighs saves and shares far above likes, because that&apos;s
        what 2026 platform research says actually predicts reach and trust.{" "}
        <a href="#methodology" className="text-accent hover:underline">How this is scored</a>.
      </p>

      <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3">Your performance</h2>

      <div className="space-y-3 mb-6">
        {myInsights.map((insight) => (
          <Card key={insight.id} className={insight.tone === "warning" ? "border-warning" : undefined}>
            <CardBody>
              <div className="flex items-center gap-2 mb-1">
                <Badge tone={TONE_BADGE[insight.tone]}>{insight.tone}</Badge>
                <h3 className="text-sm font-semibold">{insight.title}</h3>
              </div>
              <p className="text-sm text-muted">{insight.body}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {mySeries.length > 0 && (
        <Card className="mb-6">
          <CardBody>
            <h2 className="text-sm font-semibold mb-3">Weekly trend</h2>
            <div className="flex gap-2 h-24">
              {mySeries.slice(-12).map((w) => {
                const max = Math.max(...mySeries.map((s) => s.avgScore), 1);
                return (
                  <div key={w.weekStart} className="flex-1 h-full flex flex-col justify-end items-center gap-1">
                    <div
                      className="w-full bg-accent rounded-t"
                      style={{ height: `${Math.max(4, Math.round((w.avgScore / max) * 100))}%` }}
                      title={`Week of ${w.weekStart}: avg score ${Math.round(w.avgScore)}, ${w.count} posts`}
                    />
                    <span className="text-[10px] text-muted">{w.weekStart.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      )}

      <GroupBars title="By content pillar" groups={myPillars} unit="posts" />
      <GroupBars title="By hook formula" groups={myHooks} unit="posts" />
      <GroupBars title="By platform" groups={myPlatforms} unit="posts" />

      {myRows.length === 0 && (
        <Card className="mb-6">
          <CardBody className="text-center py-10 text-muted text-sm">
            No metrics logged yet. Open a posted item in your queue and use &quot;Log metrics&quot; to start building
            real insights.
          </CardBody>
        </Card>
      )}

      {canSeeProgram && (
        <>
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-3 mt-8">Program overview</h2>
          <div className="space-y-3 mb-6">
            {programInsights.map((insight) => (
              <Card key={insight.id} className={insight.tone === "warning" ? "border-warning" : undefined}>
                <CardBody>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone={TONE_BADGE[insight.tone]}>{insight.tone}</Badge>
                    <h3 className="text-sm font-semibold">{insight.title}</h3>
                  </div>
                  <p className="text-sm text-muted">{insight.body}</p>
                </CardBody>
              </Card>
            ))}
          </div>
          <GroupBars title="Program-wide, by platform" groups={programPlatforms} unit="posts" />
        </>
      )}

      <Card id="methodology">
        <CardBody>
          <h2 className="text-sm font-semibold mb-2">How this is scored</h2>
          <p className="text-xs text-muted mb-2">
            The engagement score weighs each platform&apos;s own 2026 algorithm priorities — a save or share counts for
            several times a like, because that&apos;s a much higher-intent signal than a passive tap. Weights are a
            directional composite grounded in each platform&apos;s public research, not the platforms&apos; actual internal
            ranking formulas (nobody outside the platform knows those exactly).
          </p>
          <p className="text-xs text-muted">
            Save rate and share rate (per impression) matter more than raw counts, since they&apos;re comparable across
            posts with very different reach. Insights above only fire once there&apos;s enough logged data to compare —
            never off a single post.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
