import { describe, expect, it } from "vitest";
import { classifyHook, GOAL_TO_FORMULAS, HOOK_FORMULAS } from "@/lib/generation/hooks";

describe("HOOK_FORMULAS", () => {
  it("has all 20 formulas", () => {
    expect(Object.keys(HOOK_FORMULAS)).toHaveLength(20);
  });

  it("marks F17-F20 as structural", () => {
    expect(HOOK_FORMULAS.F17.structural).toBe(true);
    expect(HOOK_FORMULAS.F20.structural).toBe(true);
    expect(HOOK_FORMULAS.F1.structural).toBe(false);
  });
});

describe("GOAL_TO_FORMULAS", () => {
  it("maps every engagement goal to at least one formula", () => {
    for (const goal of ["comments", "reposts", "likes", "saves"] as const) {
      expect(GOAL_TO_FORMULAS[goal].length).toBeGreaterThan(0);
    }
  });
});

describe("classifyHook", () => {
  it("classifies an obituary-phrase hook as F2", () => {
    const result = classifyHook({ obituaryPhrase: true, hasNumberedList: true });
    expect(result.some((r) => r.code === "F2")).toBe(true);
  });

  it("classifies a dated-receipts hook as F10 (contrarian)", () => {
    const result = classifyHook({ hasDatedReceipts: true });
    expect(result.some((r) => r.code === "F10")).toBe(true);
  });

  it("returns nothing when no required feature is present", () => {
    const result = classifyHook({});
    expect(result).toHaveLength(0);
  });

  it("returns at most 2 classifications, highest confidence first", () => {
    const result = classifyHook({
      obituaryPhrase: true,
      hasNumberedList: true,
      identityReframe: true,
      hasDatedReceipts: true,
    });
    expect(result.length).toBeLessThanOrEqual(2);
    if (result.length === 2) {
      expect(result[0].confidence).toBeGreaterThanOrEqual(result[1].confidence);
    }
  });
});
