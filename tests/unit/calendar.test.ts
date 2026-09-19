import { describe, expect, it } from "vitest";
import { adjacentMonth, monthGrid, monthLabel, monthParam, monthRangeDates, parseMonthParam } from "@/domain/calendar";

describe("parseMonthParam", () => {
  it("parses a valid YYYY-MM param", () => {
    expect(parseMonthParam("2026-03")).toEqual({ year: 2026, month: 2 }); // month is 0-indexed
  });

  it("falls back to the current month for an invalid or missing param", () => {
    const now = new Date();
    expect(parseMonthParam(undefined)).toEqual({ year: now.getFullYear(), month: now.getMonth() });
    expect(parseMonthParam("garbage")).toEqual({ year: now.getFullYear(), month: now.getMonth() });
    expect(parseMonthParam("2026-13")).toEqual({ year: now.getFullYear(), month: now.getMonth() });
  });
});

describe("monthParam / adjacentMonth", () => {
  it("round-trips year/month through monthParam", () => {
    expect(monthParam(2026, 0)).toBe("2026-01");
    expect(monthParam(2026, 11)).toBe("2026-12");
  });

  it("wraps across a year boundary in both directions", () => {
    expect(adjacentMonth(2026, 0, -1)).toEqual({ year: 2025, month: 11 });
    expect(adjacentMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 });
  });
});

describe("monthLabel", () => {
  it("produces a human month/year label", () => {
    expect(monthLabel(2026, 8)).toMatch(/September\s+2026/);
  });
});

describe("monthGrid", () => {
  it("returns a Sunday-anchored grid covering the whole month with no gaps", () => {
    const grid = monthGrid(2026, 8); // September 2026
    // First day of the grid must be a Sunday
    expect(new Date(grid[0].date + "T00:00:00Z").getUTCDay()).toBe(0);
    // Last day must be a Saturday
    expect(new Date(grid[grid.length - 1].date + "T00:00:00Z").getUTCDay()).toBe(6);
    // Every date in the grid is sequential with no gaps
    for (let i = 1; i < grid.length; i++) {
      const prev = new Date(grid[i - 1].date + "T00:00:00Z");
      const cur = new Date(grid[i].date + "T00:00:00Z");
      expect(cur.getTime() - prev.getTime()).toBe(86_400_000);
    }
  });

  it("marks only the actual month's days as inMonth", () => {
    const grid = monthGrid(2026, 8); // September has 30 days
    const inMonthDays = grid.filter((d) => d.inMonth);
    expect(inMonthDays).toHaveLength(30);
    expect(inMonthDays[0].date).toBe("2026-09-01");
    expect(inMonthDays[inMonthDays.length - 1].date).toBe("2026-09-30");
  });
});

describe("monthRangeDates", () => {
  it("matches the first and last date of the grid", () => {
    const grid = monthGrid(2026, 5);
    const range = monthRangeDates(2026, 5);
    expect(range.start).toBe(grid[0].date);
    expect(range.end).toBe(grid[grid.length - 1].date);
  });
});
