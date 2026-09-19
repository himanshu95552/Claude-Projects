import type { MetricSnapshot, QueueItem } from "@/lib/db/schema";
import type { Platform } from "@/lib/creative/types";

/**
 * Composite engagement scoring, weighted per platform. These weights are a
 * directional composite grounded in each platform's own public 2026
 * algorithm signals — not the platforms' actual internal ranking formulas
 * (no one outside the platform knows those exactly), and the dashboard
 * says so. The consistent thread across every platform researched: a
 * save or a share is worth several times a like, because it's a much
 * higher-intent signal (someone acted, not just glanced and tapped).
 *
 * - X: replies and reposts are weighted far above likes in the public
 *   ranking signal set; bookmarks are a high-intent private signal.
 * - LinkedIn: comments are weighted well above reactions (2026 algorithm
 *   guidance puts this at roughly 15x), and saves/shares are the single
 *   most prioritized signal of all — above even comments.
 * - Instagram: saves are the platform's own stated top signal ("a save is
 *   worth more than a like"); shares grew sharply in 2025-26 as DM-forward
 *   behavior overtook public comments.
 * - Facebook: share rate and viral (friend-of-friend) reach are the
 *   documented priority signal over raw reactions.
 *
 * `reactions` stands in for "likes", `comments` for replies, `shares` for
 * reposts/shares, `saves` for bookmarks/saves, `clicks` for link/profile
 * clicks combined — matching the fields metric_snapshots actually has.
 */
const PLATFORM_WEIGHTS: Record<Platform, { reactions: number; comments: number; shares: number; saves: number; clicks: number }> = {
  x: { reactions: 1, comments: 13.5, shares: 20, saves: 10, clicks: 11 },
  linkedin: { reactions: 1, comments: 15, shares: 18, saves: 18, clicks: 4 },
  instagram: { reactions: 1, comments: 4, shares: 8, saves: 10, clicks: 2 },
  facebook: { reactions: 1, comments: 3, shares: 10, saves: 6, clicks: 2 },
};

export function engagementScore(platform: Platform, snapshot: Pick<MetricSnapshot, "reactions" | "comments" | "shares" | "saves" | "clicks">): number {
  const w = PLATFORM_WEIGHTS[platform];
  return (
    (snapshot.reactions ?? 0) * w.reactions +
    (snapshot.comments ?? 0) * w.comments +
    (snapshot.shares ?? 0) * w.shares +
    (snapshot.saves ?? 0) * w.saves +
    (snapshot.clicks ?? 0) * w.clicks
  );
}

export type Rates = {
  engagementRate: number | null; // (reactions+comments+shares+saves) / impressions
  saveRate: number | null;
  shareRate: number | null;
  commentRate: number | null;
};

/** Rate metrics are the "real" numbers — comparable across posts of wildly different reach, unlike raw counts. */
export function computeRates(snapshot: Pick<MetricSnapshot, "impressions" | "reactions" | "comments" | "shares" | "saves">): Rates {
  const impressions = snapshot.impressions;
  if (!impressions || impressions <= 0) {
    return { engagementRate: null, saveRate: null, shareRate: null, commentRate: null };
  }
  const reactions = snapshot.reactions ?? 0;
  const comments = snapshot.comments ?? 0;
  const shares = snapshot.shares ?? 0;
  const saves = snapshot.saves ?? 0;
  return {
    engagementRate: (reactions + comments + shares + saves) / impressions,
    saveRate: saves / impressions,
    shareRate: shares / impressions,
    commentRate: comments / impressions,
  };
}

export type SnapshotWithItem = {
  snapshot: MetricSnapshot;
  item: Pick<QueueItem, "id" | "platform" | "metadata" | "type">;
};

export type GroupStats = {
  key: string;
  count: number;
  avgScore: number;
  avgEngagementRate: number | null;
  avgSaveRate: number | null;
};

function groupBy(rows: SnapshotWithItem[], keyFn: (row: SnapshotWithItem) => string | undefined): GroupStats[] {
  const groups = new Map<string, SnapshotWithItem[]>();
  for (const row of rows) {
    const key = keyFn(row);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  }
  return [...groups.entries()]
    .map(([key, group]) => {
      const scores = group.map((r) => engagementScore(r.item.platform as Platform, r.snapshot));
      const rates = group.map((r) => computeRates(r.snapshot));
      const engagementRates = rates.map((r) => r.engagementRate).filter((v): v is number => v !== null);
      const saveRates = rates.map((r) => r.saveRate).filter((v): v is number => v !== null);
      return {
        key,
        count: group.length,
        avgScore: average(scores),
        avgEngagementRate: engagementRates.length ? average(engagementRates) : null,
        avgSaveRate: saveRates.length ? average(saveRates) : null,
      };
    })
    .sort((a, b) => b.avgScore - a.avgScore);
}

function average(nums: number[]): number {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

export function byPillar(rows: SnapshotWithItem[]): GroupStats[] {
  return groupBy(rows, (r) => r.item.metadata?.pillar);
}

export function byHookType(rows: SnapshotWithItem[]): GroupStats[] {
  return groupBy(rows, (r) => r.item.metadata?.hookType);
}

export function byPlatform(rows: SnapshotWithItem[]): GroupStats[] {
  return groupBy(rows, (r) => r.item.platform);
}

export type WeeklyBucket = { weekStart: string; count: number; avgScore: number; avgEngagementRate: number | null };

/** Sunday-anchored weekly buckets, oldest first — the shape a trend line needs. */
export function weeklySeries(rows: SnapshotWithItem[]): WeeklyBucket[] {
  const buckets = new Map<string, SnapshotWithItem[]>();
  for (const row of rows) {
    const d = new Date(row.snapshot.capturedAt);
    const sunday = new Date(d);
    sunday.setDate(d.getDate() - d.getDay());
    sunday.setHours(0, 0, 0, 0);
    const key = sunday.toISOString().slice(0, 10);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(row);
  }
  return [...buckets.entries()]
    .map(([weekStart, group]) => {
      const scores = group.map((r) => engagementScore(r.item.platform as Platform, r.snapshot));
      const rates = group.map((r) => computeRates(r.snapshot).engagementRate).filter((v): v is number => v !== null);
      return { weekStart, count: group.length, avgScore: average(scores), avgEngagementRate: rates.length ? average(rates) : null };
    })
    .sort((a, b) => a.weekStart.localeCompare(b.weekStart));
}

export type Insight = { id: string; tone: "positive" | "warning" | "info"; title: string; body: string };

const MIN_SNAPSHOTS_FOR_INSIGHTS = 5;
const MIN_GROUP_SIZE_FOR_COMPARISON = 3;

/**
 * Rule-based, not a black box — every insight here traces to a specific
 * comparison a person could redo by hand. That's a deliberate choice to
 * match the rest of the app's governance/classification logic (hooks.ts's
 * classifyHook, governance.ts's flag rules): transparent rules over an
 * opaque model call, because the whole point of an insight is that the
 * person can trust and act on it.
 */
export function generateInsights(rows: SnapshotWithItem[]): Insight[] {
  if (rows.length < MIN_SNAPSHOTS_FOR_INSIGHTS) {
    return [
      {
        id: "not-enough-data",
        tone: "info",
        title: "Not enough logged metrics yet",
        body: `Log metrics on a few more posts (${rows.length}/${MIN_SNAPSHOTS_FOR_INSIGHTS} so far) to unlock real comparisons instead of noise.`,
      },
    ];
  }

  const insights: Insight[] = [];

  const pillars = byPillar(rows).filter((g) => g.count >= MIN_GROUP_SIZE_FOR_COMPARISON);
  if (pillars.length >= 2) {
    const [best, worst] = [pillars[0], pillars[pillars.length - 1]];
    if (best.key !== worst.key && best.avgScore > 0) {
      const lift = worst.avgScore > 0 ? Math.round(((best.avgScore - worst.avgScore) / worst.avgScore) * 100) : null;
      insights.push({
        id: "pillar-comparison",
        tone: "positive",
        title: `"${best.key}" is your strongest pillar`,
        body:
          lift !== null && lift > 0
            ? `Averaging ${lift}% higher engagement score than "${worst.key}" (${best.count} vs ${worst.count} posts logged). Worth leaning into.`
            : `Averaging the highest engagement score of your pillars with ${best.count} posts logged.`,
      });
    }
  }

  const hooks = byHookType(rows).filter((g) => g.count >= MIN_GROUP_SIZE_FOR_COMPARISON);
  if (hooks.length >= 2) {
    const best = hooks[0];
    insights.push({
      id: "hook-comparison",
      tone: "positive",
      title: `Hook formula ${best.key} is outperforming your others`,
      body: `${best.count} posts using this hook average the highest engagement score in your logged data.`,
    });
  }

  const series = weeklySeries(rows);
  if (series.length >= 2) {
    const last = series[series.length - 1];
    const prev = series[series.length - 2];
    if (prev.avgEngagementRate !== null && last.avgEngagementRate !== null && prev.avgEngagementRate > 0) {
      const change = Math.round(((last.avgEngagementRate - prev.avgEngagementRate) / prev.avgEngagementRate) * 100);
      if (Math.abs(change) >= 15) {
        insights.push({
          id: "trend",
          tone: change > 0 ? "positive" : "warning",
          title: change > 0 ? "Engagement rate trending up" : "Engagement rate trending down",
          body: `${change > 0 ? "+" : ""}${change}% week over week (${(prev.avgEngagementRate * 100).toFixed(1)}% -> ${(last.avgEngagementRate * 100).toFixed(1)}%).`,
        });
      }
    }
  }

  // High reach, low intent: impressions are healthy but saves/shares aren't
  // following — the hook is landing, the idea underneath isn't sticky.
  const withImpressions = rows.filter((r) => (r.snapshot.impressions ?? 0) > 0);
  if (withImpressions.length >= MIN_GROUP_SIZE_FOR_COMPARISON) {
    const avgImpressions = average(withImpressions.map((r) => r.snapshot.impressions ?? 0));
    const highReach = withImpressions.filter((r) => (r.snapshot.impressions ?? 0) >= avgImpressions);
    const avgSaveRateOverall = average(
      withImpressions.map((r) => computeRates(r.snapshot).saveRate).filter((v): v is number => v !== null),
    );
    const avgSaveRateHighReach = average(
      highReach.map((r) => computeRates(r.snapshot).saveRate).filter((v): v is number => v !== null),
    );
    if (avgSaveRateOverall > 0 && avgSaveRateHighReach < avgSaveRateOverall * 0.6) {
      insights.push({
        id: "high-reach-low-intent",
        tone: "warning",
        title: "Your highest-reach posts aren't converting to saves",
        body: "Above-average impressions but below-average save rate on those same posts — the hook is landing, but consider whether the payoff underneath is worth bookmarking.",
      });
    }
  }

  const platforms = byPlatform(rows).filter((g) => g.count >= MIN_GROUP_SIZE_FOR_COMPARISON);
  if (platforms.length >= 2) {
    const best = platforms[0];
    insights.push({
      id: "platform-comparison",
      tone: "info",
      title: `${best.key} is your best-performing connected platform`,
      body: `Highest average engagement score across ${best.count} logged posts.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "steady",
      tone: "info",
      title: "Performance is steady",
      body: "No sharp swings or clear pillar/hook winners yet in your logged data — keep logging metrics as more posts ship.",
    });
  }

  return insights;
}
