import { describe, expect, it } from "vitest";
import { deepMerge, resolveSettings, writeConfig } from "@/lib/config/resolve";
import { GLOBAL_DEFAULTS } from "@/lib/config/schema";

describe("deepMerge", () => {
  it("keeps base values untouched when override is empty", () => {
    const result = deepMerge({ a: 1, b: { c: 2 } }, {});
    expect(result).toEqual({ a: 1, b: { c: 2 } });
  });

  it("overrides only the keys present in the override, at every depth", () => {
    const result = deepMerge(
      { a: 1, b: { c: 2, d: 3 } },
      { b: { c: 99 } },
    );
    expect(result).toEqual({ a: 1, b: { c: 99, d: 3 } });
  });

  it("replaces arrays wholesale rather than merging elements", () => {
    const result = deepMerge({ list: [1, 2, 3] }, { list: [9] });
    expect(result.list).toEqual([9]);
  });

  it("does not mutate the base object", () => {
    const base = { a: 1, b: { c: 2 } };
    deepMerge(base, { b: { c: 99 } });
    expect(base.b.c).toBe(2);
  });
});

describe("resolveSettings", () => {
  it("falls back to GLOBAL_DEFAULTS with no participant/lane and no DB overrides", async () => {
    const resolved = await resolveSettings({});
    expect(resolved.cadence.postsPerWeek).toBe(GLOBAL_DEFAULTS.cadence.postsPerWeek);
    expect(resolved.ladder.touchesBeforeInvite).toBe(2);
  });
});

describe("writeConfig + resolveSettings integration", () => {
  it("a global override changes the resolved value for everyone", async () => {
    const laneId = "00000000-0000-0000-0000-000000000001";
    await writeConfig({
      scope: "global",
      scopeRef: null,
      settings: { cadence: { commentsPerDay: 42 } },
      changeNote: "test: bump comments/day",
    });
    const resolved = await resolveSettings({ laneId });
    expect(resolved.cadence.commentsPerDay).toBe(42);
    // untouched sibling field still comes from defaults
    expect(resolved.cadence.postsPerWeek).toBe(GLOBAL_DEFAULTS.cadence.postsPerWeek);

    // restore default so the test is idempotent across runs
    await writeConfig({
      scope: "global",
      scopeRef: null,
      settings: { cadence: { commentsPerDay: GLOBAL_DEFAULTS.cadence.commentsPerDay } },
      changeNote: "test: restore default",
    });
  });

  it("participant scope wins over lane scope which wins over global", async () => {
    const laneId = "00000000-0000-0000-0000-000000000002";
    const participantId = "00000000-0000-0000-0000-000000000003";

    await writeConfig({
      scope: "lane",
      scopeRef: laneId,
      settings: { cadence: { postsPerWeek: 5 } },
    });
    await writeConfig({
      scope: "participant",
      scopeRef: participantId,
      settings: { cadence: { postsPerWeek: 2 } },
    });

    const laneOnly = await resolveSettings({ laneId });
    expect(laneOnly.cadence.postsPerWeek).toBe(5);

    const participantResolved = await resolveSettings({ laneId, participantId });
    expect(participantResolved.cadence.postsPerWeek).toBe(2);
  });
});
