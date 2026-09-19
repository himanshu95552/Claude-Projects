/** Parses "YYYY-MM" into a UTC-safe first-of-month Date, defaulting to the current month. */
export function parseMonthParam(param: string | undefined): { year: number; month: number } {
  if (param && /^\d{4}-\d{2}$/.test(param)) {
    const [year, month] = param.split("-").map(Number);
    if (month >= 1 && month <= 12) return { year, month: month - 1 };
  }
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

export function monthParam(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function adjacentMonth(year: number, month: number, delta: number): { year: number; month: number } {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

export type CalendarDay = { date: string; inMonth: boolean; isToday: boolean };

/**
 * A Sunday-anchored grid covering the whole month, padded with the
 * trailing days of the previous/next month so every week is complete —
 * the shape a calendar UI needs, not just the month's own dates.
 */
export function monthGrid(year: number, month: number): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1);
  const startDate = new Date(firstOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // back up to Sunday

  const lastOfMonth = new Date(year, month + 1, 0);
  const endDate = new Date(lastOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // forward to Saturday

  const todayStr = new Date().toISOString().slice(0, 10);
  const days: CalendarDay[] = [];
  const cursor = new Date(startDate);
  while (cursor <= endDate) {
    const dateStr = cursor.toISOString().slice(0, 10);
    days.push({ date: dateStr, inMonth: cursor.getMonth() === month, isToday: dateStr === todayStr });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function monthRangeDates(year: number, month: number): { start: string; end: string } {
  const grid = monthGrid(year, month);
  return { start: grid[0].date, end: grid[grid.length - 1].date };
}
