import type { QueueItem } from "@/lib/db/schema";

/**
 * Fixed section order — app-spec.md "Daily — the queue": publish →
 * first-hour comments → general comments → replies → follow → connect →
 * amplify. Within a section, items keep their generated order (stored as
 * `position`); this only defines section-to-section ordering.
 */
export const QUEUE_SECTION_ORDER = [
  "publish",
  "first_hour_comment",
  "general_comment",
  "reply",
  "follow",
  "connect",
  "amplify_reshare",
  "amplify_follow_invite",
] as const;

export type QueueSection = (typeof QUEUE_SECTION_ORDER)[number];

export const SECTION_LABELS: Record<QueueSection, string> = {
  publish: "Publish",
  first_hour_comment: "First-hour comments",
  general_comment: "General comments",
  reply: "Replies",
  follow: "Follow",
  connect: "Connect",
  amplify_reshare: "Company page — reshare",
  amplify_follow_invite: "Company page — follow invites",
};

/** Rough per-item time estimates, used for the queue's honest time estimate. */
const ESTIMATED_MINUTES_PER_ITEM: Record<QueueSection, number> = {
  publish: 3,
  first_hour_comment: 2,
  general_comment: 1.5,
  reply: 1,
  connect: 1,
  follow: 0.5,
  amplify_reshare: 2,
  amplify_follow_invite: 0.5,
};

export function sortQueueItems<T extends { type: QueueSection; position: number }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    const sectionDiff = QUEUE_SECTION_ORDER.indexOf(a.type) - QUEUE_SECTION_ORDER.indexOf(b.type);
    if (sectionDiff !== 0) return sectionDiff;
    return a.position - b.position;
  });
}

export function groupBySection<T extends { type: QueueSection }>(
  items: T[],
): Array<{ section: QueueSection; items: T[] }> {
  return QUEUE_SECTION_ORDER.map((section) => ({
    section,
    items: items.filter((item) => item.type === section),
  })).filter((group) => group.items.length > 0);
}

export function estimateQueueMinutes(items: Array<{ type: QueueSection }>): number {
  const total = items.reduce((sum, item) => sum + ESTIMATED_MINUTES_PER_ITEM[item.type], 0);
  return Math.max(1, Math.round(total));
}

export function queueProgress(items: Pick<QueueItem, "status">[]): {
  completed: number;
  total: number;
  pct: number;
} {
  const total = items.length;
  const completed = items.filter((i) => i.status === "done" || i.status === "skipped").length;
  return { completed, total, pct: total === 0 ? 0 : Math.round((completed / total) * 100) };
}
