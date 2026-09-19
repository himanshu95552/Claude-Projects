import type { Target } from "@/lib/db/schema";

/**
 * What the nightly "research sweep" (build-spec.md §3) needs to decide
 * which targets get a comment/reply item today. In production this would
 * be backed by a real monitoring integration (LinkedIn activity feed,
 * or a scraping/search service) — that integration is a known gap in this
 * build, same shape as the handoff package's own "Apify key compromised"
 * / "engager analytics" gaps (see docs/ARCHITECTURE.md §Known gaps).
 * This interface is the seam: swap DemoResearchProvider for a real one
 * without touching the queue builder.
 */
export type TargetActivitySignal = {
  targetId: string;
  targetName: string;
  postUrl: string;
  postText: string;
  postAgeMinutes: number;
  reactions: number;
  isFirstHour: boolean;
};

export type ReplySignal = {
  targetId: string;
  targetName: string;
  threadUrl: string;
  parentCommentText: string;
  replyingToText: string;
  originalAuthorReplied: boolean;
};

export interface ResearchProvider {
  findActivityForTargets(targets: Target[], forDate: Date): Promise<TargetActivitySignal[]>;
  findRepliesForTargets(targets: Target[], forDate: Date): Promise<ReplySignal[]>;
}

/**
 * Deterministic, date-seeded mock signals — no network calls. Picks a
 * rotating subset of targets to "have activity" so demo queues stay
 * varied day to day without being random/untestable. Clearly a stand-in:
 * every generated draft downstream is DEMO_MODE-labeled by the content
 * generator, not by this provider.
 */
export class DemoResearchProvider implements ResearchProvider {
  async findActivityForTargets(targets: Target[], forDate: Date): Promise<TargetActivitySignal[]> {
    const eligible = targets.filter((t) => t.stage !== "cold" && t.stage !== "retired");
    if (eligible.length === 0) return [];

    const dayOfYear = Math.floor(
      (forDate.getTime() - new Date(forDate.getFullYear(), 0, 0).getTime()) / 86_400_000,
    );
    const rotationSize = Math.min(2, eligible.length);
    const startIndex = dayOfYear % eligible.length;

    const picked: Target[] = [];
    for (let i = 0; i < rotationSize; i++) {
      picked.push(eligible[(startIndex + i) % eligible.length]);
    }

    return picked.map((target, i) => ({
      targetId: target.id,
      targetName: target.name,
      postUrl: `https://linkedin.com/posts/${target.name.toLowerCase().replace(/\s+/g, "-")}-demo`,
      postText: `[DEMO] ${target.name} posted about a challenge in their day-to-day work.`,
      postAgeMinutes: i === 0 ? 34 : 52,
      reactions: i === 0 ? 11 : 6,
      isFirstHour: i === 0,
    }));
  }

  async findRepliesForTargets(targets: Target[], forDate: Date): Promise<ReplySignal[]> {
    const withHistory = targets.filter((t) => t.stageHistory.length > 0 && t.stage !== "cold");
    if (withHistory.length === 0) return [];
    const dayOfYear = Math.floor(
      (forDate.getTime() - new Date(forDate.getFullYear(), 0, 0).getTime()) / 86_400_000,
    );
    if (dayOfYear % 3 !== 0) return []; // not every day has a reply signal

    const target = withHistory[dayOfYear % withHistory.length];
    return [
      {
        targetId: target.id,
        targetName: target.name,
        threadUrl: `https://linkedin.com/posts/${target.name.toLowerCase().replace(/\s+/g, "-")}-demo`,
        parentCommentText: "[DEMO] Your original comment on their post.",
        replyingToText: `[DEMO] ${target.name} replied to your comment.`,
        originalAuthorReplied: true,
      },
    ];
  }
}
