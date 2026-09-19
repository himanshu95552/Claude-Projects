import { describe, expect, it } from "vitest";
import {
  byHookType,
  byPillar,
  byPlatform,
  computeRates,
  engagementScore,
  generateInsights,
  weeklySeries,
  type SnapshotWithItem,
} from "@/domain/analytics";
import type { MetricSnapshot, QueueItem } from "@/lib/db/schema";

function snap(overrides: Partial<MetricSnapshot> = {}): MetricSnapshot {
  return {
    id: crypto.randomUUID(),
    participantId: null,
    queueItemId: null,
    platform: "linkedin",
    impressions: null,
    reactions: null,
    comments: null,
    shares: null,
    saves: null,
    clicks: null,
    videoViews: null,
    videoCompletionPct: null,
    profileViews: null,
    followers: null,
    source: "manual",
    capturedAt: new Date("2026-06-01T12:00:00Z"),
    ...overrides,
  };
}

function item(overrides: Partial<Pick<QueueItem, "id" | "platform" | "metadata" | "type">> = {}): SnapshotWithItem["item"] {
  return {
    id: crypto.randomUUID(),
    platform: "linkedin",
    metadata: {},
    type: "publish",
    ...overrides,
  };
}

describe("engagementScore", () => {
  it("weighs shares and saves far above reactions on X", () => {
    const fifteenLikes = engagementScore("x", { reactions: 15, comments: 0, shares: 0, saves: 0, clicks: 0 });
    const oneShare = engagementScore("x", { reactions: 0, comments: 0, shares: 1, saves: 0, clicks: 0 });
    expect(oneShare).toBeGreaterThan(fifteenLikes);
  });

  it("treats null fields as zero", () => {
    expect(engagementScore("instagram", { reactions: null, comments: null, shares: null, saves: null, clicks: null })).toBe(0);
  });

  it("weighs comments well above reactions on LinkedIn", () => {
    const score = engagementScore("linkedin", { reactions: 0, comments: 1, shares: 0, saves: 0, clicks: 0 });
    expect(score).toBeGreaterThanOrEqual(15);
  });
});

describe("computeRates", () => {
  it("returns null rates when there are no impressions", () => {
    const rates = computeRates({ impressions: null, reactions: 5, comments: 1, shares: 1, saves: 1 });
    expect(rates.engagementRate).toBeNull();
  });

  it("computes save rate as saves/impressions", () => {
    const rates = computeRates({ impressions: 1000, reactions: 10, comments: 2, shares: 1, saves: 20 });
    expect(rates.saveRate).toBeCloseTo(0.02);
  });
});

describe("byPillar / byHookType / byPlatform", () => {
  it("groups by metadata.pillar and sorts by avg score descending", () => {
    const rows: SnapshotWithItem[] = [
      { snapshot: snap({ shares: 10 }), item: item({ metadata: { pillar: "ROI" } }) },
      { snapshot: snap({ reactions: 1 }), item: item({ metadata: { pillar: "Trust" } }) },
    ];
    const groups = byPillar(rows);
    expect(groups[0].key).toBe("ROI");
    expect(groups.map((g) => g.key)).toContain("Trust");
  });

  it("skips rows with no pillar/hookType set", () => {
    const rows: SnapshotWithItem[] = [{ snapshot: snap(), item: item({ metadata: {} }) }];
    expect(byPillar(rows)).toHaveLength(0);
    expect(byHookType(rows)).toHaveLength(0);
  });

  it("groups by item.platform", () => {
    const rows: SnapshotWithItem[] = [
      { snapshot: snap({ shares: 5 }), item: item({ platform: "x" }) },
      { snapshot: snap({ reactions: 1 }), item: item({ platform: "linkedin" }) },
    ];
    const groups = byPlatform(rows);
    expect(groups.map((g) => g.key).sort()).toEqual(["linkedin", "x"]);
  });
});

describe("weeklySeries", () => {
  it("buckets snapshots into Sunday-anchored weeks, oldest first", () => {
    const rows: SnapshotWithItem[] = [
      { snapshot: snap({ capturedAt: new Date("2026-06-08T00:00:00Z"), reactions: 1 }), item: item() },
      { snapshot: snap({ capturedAt: new Date("2026-06-01T00:00:00Z"), reactions: 1 }), item: item() },
    ];
    const series = weeklySeries(rows);
    expect(series).toHaveLength(2);
    expect(series[0].weekStart < series[1].weekStart).toBe(true);
  });
});

describe("generateInsights", () => {
  it("returns a not-enough-data insight below the minimum snapshot threshold", () => {
    const rows: SnapshotWithItem[] = [{ snapshot: snap(), item: item() }];
    const insights = generateInsights(rows);
    expect(insights).toHaveLength(1);
    expect(insights[0].id).toBe("not-enough-data");
  });

  it("flags a pillar comparison once both pillars have enough posts", () => {
    const strong = Array.from({ length: 3 }, () => ({
      snapshot: snap({ shares: 20, comments: 10 }),
      item: item({ metadata: { pillar: "ROI" } }),
    }));
    const weak = Array.from({ length: 3 }, () => ({
      snapshot: snap({ reactions: 1 }),
      item: item({ metadata: { pillar: "Culture" } }),
    }));
    const insights = generateInsights([...strong, ...weak]);
    expect(insights.some((i) => i.id === "pillar-comparison")).toBe(true);
  });

  it("never fabricates a comparison from a single post per group", () => {
    const rows: SnapshotWithItem[] = [
      { snapshot: snap({ shares: 20 }), item: item({ metadata: { pillar: "ROI" } }) },
      { snapshot: snap({ reactions: 1 }), item: item({ metadata: { pillar: "Culture" } }) },
      { snapshot: snap({ reactions: 1 }), item: item({ metadata: { pillar: "Trust" } }) },
      { snapshot: snap({ reactions: 1 }), item: item({ metadata: { pillar: "Proof" } }) },
      { snapshot: snap({ reactions: 1 }), item: item({ metadata: { pillar: "Voice" } }) },
    ];
    const insights = generateInsights(rows);
    expect(insights.some((i) => i.id === "pillar-comparison")).toBe(false);
  });

  it("flags high-reach posts whose save rate lags the overall average", () => {
    const highReachLowSaves = Array.from({ length: 3 }, () => ({
      snapshot: snap({ impressions: 10000, saves: 5, reactions: 50, comments: 5, shares: 2 }),
      item: item(),
    }));
    const lowReachHighSaves = Array.from({ length: 3 }, () => ({
      snapshot: snap({ impressions: 500, saves: 50, reactions: 10, comments: 2, shares: 1 }),
      item: item(),
    }));
    const insights = generateInsights([...highReachLowSaves, ...lowReachHighSaves]);
    expect(insights.some((i) => i.id === "high-reach-low-intent")).toBe(true);
  });

  it("does not flag high-reach-low-intent when save rate holds steady across reach levels", () => {
    const rows = Array.from({ length: 6 }, (_, i) => ({
      snapshot: snap({ impressions: 1000 + i * 100, saves: 20 + i * 2, reactions: 30, comments: 3, shares: 2 }),
      item: item(),
    }));
    const insights = generateInsights(rows);
    expect(insights.some((i) => i.id === "high-reach-low-intent")).toBe(false);
  });
});
