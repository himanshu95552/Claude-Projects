import { describe, expect, it } from "vitest";
import { estimateQueueMinutes, groupBySection, queueProgress, sortQueueItems } from "@/domain/queue-order";

describe("sortQueueItems", () => {
  it("orders by section per app-spec.md, then by position within a section", () => {
    const items = [
      { type: "connect" as const, position: 0, id: "c" },
      { type: "publish" as const, position: 0, id: "a" },
      { type: "first_hour_comment" as const, position: 1, id: "d" },
      { type: "first_hour_comment" as const, position: 0, id: "b" },
    ];
    const sorted = sortQueueItems(items).map((i) => i.id);
    expect(sorted).toEqual(["a", "b", "d", "c"]);
  });
});

describe("groupBySection", () => {
  it("omits empty sections and preserves section order", () => {
    const groups = groupBySection([
      { type: "amplify_reshare" as const },
      { type: "publish" as const },
    ]);
    expect(groups.map((g) => g.section)).toEqual(["publish", "amplify_reshare"]);
  });
});

describe("estimateQueueMinutes", () => {
  it("is always at least 1 minute", () => {
    expect(estimateQueueMinutes([])).toBe(1);
  });

  it("sums per-item estimates and rounds", () => {
    const minutes = estimateQueueMinutes([
      { type: "publish" as const },
      { type: "first_hour_comment" as const },
    ]);
    expect(minutes).toBe(5); // 3 + 2
  });
});

describe("queueProgress", () => {
  it("counts done and skipped as completed, pending as not", () => {
    const progress = queueProgress([
      { status: "done" as const },
      { status: "skipped" as const },
      { status: "pending" as const },
    ]);
    expect(progress).toEqual({ completed: 2, total: 3, pct: 67 });
  });

  it("handles an empty queue without dividing by zero", () => {
    expect(queueProgress([])).toEqual({ completed: 0, total: 0, pct: 0 });
  });
});
