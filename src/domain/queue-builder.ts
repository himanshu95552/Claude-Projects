import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  clearedCustomers,
  lanes,
  participants,
  queueItems,
  queues,
  storyBankEntries,
  targets,
  voiceProfiles,
  type NewQueueItem,
  type Participant,
} from "@/lib/db/schema";
import { resolveSettings } from "@/lib/config/resolve";
import type { GenerationEnvelope } from "@/lib/generation/contracts";
import {
  generateComment,
  generateConnectionNote,
  generatePost,
  generateReply,
  generateReshareCommentary,
  generateXPost,
} from "@/lib/generation/generate";
import { getXAccount, connectionStatus as xConnectionStatus } from "@/lib/integrations/x/account";
import { canAdvanceToConnect, stageIndex } from "./ladder";
import { needsReview, computeReviewSlaDueAt } from "./governance";
import { estimateQueueMinutes } from "./queue-order";
import { DemoResearchProvider, type ResearchProvider } from "./research-signals";

/** Assembles the shared generation envelope for a participant — prompt-contracts.md. */
export async function buildEnvelope(participantId: string): Promise<GenerationEnvelope> {
  const participant = (
    await db.select().from(participants).where(eq(participants.id, participantId)).limit(1)
  )[0];
  if (!participant) throw new Error(`Participant ${participantId} not found`);

  const lane = participant.laneId
    ? (await db.select().from(lanes).where(eq(lanes.id, participant.laneId)).limit(1))[0]
    : null;

  const voiceProfile = (
    await db
      .select()
      .from(voiceProfiles)
      .where(and(eq(voiceProfiles.participantId, participantId), eq(voiceProfiles.isCurrent, true)))
      .limit(1)
  )[0];

  const storyBank = await db
    .select()
    .from(storyBankEntries)
    .where(eq(storyBankEntries.participantId, participantId));

  const cleared = await db.select().from(clearedCustomers);

  const recentQueues = await db
    .select()
    .from(queues)
    .where(eq(queues.participantId, participantId))
    .orderBy(desc(queues.forDate))
    .limit(10);

  const recentPosts: GenerationEnvelope["recentPosts"] = [];
  for (const q of recentQueues) {
    const items = await db
      .select()
      .from(queueItems)
      .where(and(eq(queueItems.queueId, q.id), eq(queueItems.type, "publish")));
    for (const item of items) {
      recentPosts.push({
        date: q.forDate,
        hookType: item.metadata.hookType,
        pillar: item.metadata.pillar,
        text: item.editedContent ?? item.content,
      });
    }
  }

  const settings = await resolveSettings({ participantId, laneId: participant.laneId ?? undefined });

  return {
    participant: {
      name: participant.fullName,
      role: participant.jobTitle,
      lane: lane
        ? { name: lane.name, pillars: lane.pillars, do: lane.doRules, dont: lane.dontRules }
        : { name: "Unassigned", pillars: [], do: [], dont: [] },
    },
    voiceProfile: voiceProfile
      ? {
          sliders: voiceProfile.sliders,
          rules: voiceProfile.freetextRules,
          bannedPhrases: voiceProfile.bannedPhrases,
          emoji: voiceProfile.emojiSetting,
        }
      : {
          sliders: settings.voice.sliders,
          rules: settings.voice.freetextRules,
          bannedPhrases: settings.voice.bannedPhrases,
          emoji: settings.voice.emoji,
        },
    storyBank: storyBank.map((s) => ({ kind: s.kind, content: s.content })),
    governance: {
      clearedCustomers: cleared.map((c) => c.name),
      bannedClaims: [],
      phiCheck: participant.specialChecks.includes("phi"),
    },
    recentPosts: recentPosts.slice(0, 10),
    config: {
      targetLength: [settings.content.postLengthMin, settings.content.postLengthMax],
      hookRotation: settings.content.hookRotation,
      draftingModel: settings.model.draftingModel,
      researchModel: settings.model.researchModel,
    },
  };
}

/**
 * Decide which section a publish item belongs on today, rotating across
 * the week to roughly hit `postsPerWeek`. Deterministic (date-seeded), so
 * the same participant+week always gets the same posting days — makes the
 * schedule predictable rather than random.
 */
function isPublishDay(forDate: Date, postsPerWeek: number): boolean {
  if (postsPerWeek <= 0) return false;
  const dayOfWeek = forDate.getDay(); // 0 = Sunday
  const schedule: Record<number, number[]> = {
    1: [2], // Tuesday
    2: [1, 4], // Mon/Thu
    3: [1, 3, 5], // Mon/Wed/Fri
    4: [1, 2, 4, 5],
    5: [1, 2, 3, 4, 5],
  };
  const days = schedule[Math.min(postsPerWeek, 5)] ?? [1, 3, 5];
  return days.includes(dayOfWeek);
}

export type GeneratedQueueSummary = {
  queueId: string;
  itemCount: number;
  reviewNeededCount: number;
};

/**
 * Build (or rebuild) one participant's queue for a given date. Writes
 * drafts into a queue only — never touches a platform (build-spec.md §3:
 * "the nightly job... never touches a platform").
 */
export async function generateQueueForParticipant(
  participantId: string,
  forDate: Date,
  researchProvider: ResearchProvider = new DemoResearchProvider(),
): Promise<GeneratedQueueSummary> {
  const participant = (
    await db.select().from(participants).where(eq(participants.id, participantId)).limit(1)
  )[0] as Participant | undefined;
  if (!participant) throw new Error(`Participant ${participantId} not found`);

  const dateStr = forDate.toISOString().slice(0, 10);
  const dayName = forDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const settings = await resolveSettings({ participantId, laneId: participant.laneId ?? undefined });

  if (settings.timing.daysOff.includes(dayName)) {
    return { queueId: "", itemCount: 0, reviewNeededCount: 0 };
  }

  const envelope = await buildEnvelope(participantId);
  const ownedTargets = await db.select().from(targets).where(eq(targets.ownerParticipantId, participantId));

  const activity = await researchProvider.findActivityForTargets(ownedTargets, forDate);
  const replies = await researchProvider.findRepliesForTargets(ownedTargets, forDate);

  const itemsToInsert: Array<Omit<NewQueueItem, "queueId" | "position">> = [];

  const reviewTier = participant.reviewTier;

  function withReview(item: Omit<NewQueueItem, "queueId" | "position">, flags: string[]) {
    const flagged = needsReview({
      reviewTier,
      flags: flags as Parameters<typeof needsReview>[0]["flags"],
    });
    return {
      ...item,
      reviewFlags: flags,
      needsReview: flagged ? ("pending" as const) : ("not_required" as const),
      reviewSlaDueAt: flagged ? computeReviewSlaDueAt(new Date(), settings.governance.reviewSlaHours) : null,
    };
  }

  // 1. PUBLISH
  if (isPublishDay(forDate, settings.cadence.postsPerWeek)) {
    const pillar = envelope.participant.lane.pillars[0] ?? envelope.participant.lane.name;
    const { output, meta } = await generatePost({
      ...envelope,
      pillar,
      hookGoal: "comments",
    });
    itemsToInsert.push(
      withReview(
        {
          type: "publish",
          fulfillment: "api_publish",
          content: output.text,
          explain: output.explain,
          status: "pending",
          metadata: { pillar: output.pillar, hookType: output.hookType, charCount: output.charCount },
        },
        meta.governanceFlags,
      ),
    );

    // 1b. Companion X post — only if the participant has connected X
    // (mirrors the IG/FB "thin, opt-in" pattern rather than the LinkedIn-
    // primary flow). Generated in its own isolated call with its own
    // prompt — see generateXPost()'s doc comment.
    const xAccount = await getXAccount(participantId);
    if (xConnectionStatus(xAccount) === "connected") {
      const { output: xOutput, meta: xMeta } = await generateXPost({
        ...envelope,
        pillar,
        sourceMaterial: output.text,
        allowThread: true,
      });
      itemsToInsert.push(
        withReview(
          {
            type: "publish",
            fulfillment: "api_publish",
            content: xOutput.text,
            explain: xOutput.explain,
            status: "pending",
            platform: "x",
            metadata: { pillar: xOutput.pillar, charCount: xOutput.charCount },
          },
          xMeta.governanceFlags,
        ),
      );
    }
  }

  // 2. FIRST-HOUR + GENERAL COMMENTS
  for (const signal of activity) {
    const { output, meta } = await generateComment({
      ...envelope,
      targetPost: {
        authorName: signal.targetName,
        authorRole: "",
        text: signal.postText,
        ageMinutes: signal.postAgeMinutes,
        reactions: signal.reactions,
      },
      targetStage: "warm_up",
      isFirstHour: signal.isFirstHour,
    });
    itemsToInsert.push(
      withReview(
        {
          type: signal.isFirstHour ? "first_hour_comment" : "general_comment",
          fulfillment: "api_publish",
          content: output.text,
          variants: output.variants,
          explain: output.explain,
          targetId: signal.targetId,
          sourcePostUrl: signal.postUrl,
          status: "pending",
          metadata: {
            isFirstHour: signal.isFirstHour,
            targetPost: {
              authorName: signal.targetName,
              text: signal.postText,
              ageMinutes: signal.postAgeMinutes,
              reactions: signal.reactions,
            },
          },
        },
        meta.governanceFlags,
      ),
    );
  }

  // 3. REPLIES
  for (const signal of replies) {
    const { output, meta } = await generateReply({
      ...envelope,
      thread: { parentText: signal.parentCommentText, replyingToText: signal.replyingToText },
      originalAuthorReplied: signal.originalAuthorReplied,
      threadHeat: "warm",
    });
    itemsToInsert.push(
      withReview(
        {
          type: "reply",
          fulfillment: "api_publish",
          content: output.text,
          explain: output.explain,
          targetId: signal.targetId,
          sourcePostUrl: signal.threadUrl,
          status: "pending",
          metadata: {
            threadHeat: output.threadHeat,
            thread: { parentText: signal.parentCommentText, replyingToText: signal.replyingToText },
          },
        },
        meta.governanceFlags,
      ),
    );
  }

  // 4. FOLLOW — cold targets due for outreach (manual: no follow API exists)
  const coldTargets = ownedTargets.filter((t) => t.stage === "cold").slice(0, 2);
  for (const target of coldTargets) {
    itemsToInsert.push(
      withReview(
        {
          type: "follow",
          fulfillment: "manual_link",
          content: `Follow ${target.name} (${target.title ?? "target"} at ${target.center ?? "their center"})`,
          targetId: target.id,
          sourcePostUrl: target.linkedinUrl,
          status: "pending",
          metadata: {},
        },
        [],
      ),
    );
  }

  // 5. CONNECT — hard-gated on stage-3 evidence (manual: no invitations API exists)
  for (const target of ownedTargets) {
    const gate = canAdvanceToConnect({
      currentStage: target.stage,
      stageHistory: target.stageHistory,
      daysSinceFollow: target.lastTouchAt
        ? Math.floor((forDate.getTime() - target.lastTouchAt.getTime()) / 86_400_000)
        : null,
      minDaysBeforeInvite: settings.ladder.minDaysBeforeInvite,
      requireStage3Signal: settings.ladder.requireStage3Signal,
    });
    if (!gate.allowed) continue;

    const evidence = [...target.stageHistory].reverse().find((h) => h.stage === "recognized")?.evidence ?? "";
    const { output, meta } = await generateConnectionNote({
      ...envelope,
      target: { name: target.name, profileSummary: `${target.title ?? ""} at ${target.center ?? ""}`.trim() },
      stageEvidence: evidence,
    });
    itemsToInsert.push(
      withReview(
        {
          type: "connect",
          fulfillment: "manual_link",
          content: output.note,
          explain: output.explain,
          targetId: target.id,
          sourcePostUrl: target.linkedinUrl,
          status: "pending",
          metadata: { stageEvidence: evidence },
        },
        meta.governanceFlags,
      ),
    );
  }

  // 6. AMPLIFY — company-page-amplification.md: 2 of N participants
  // rotate per company post, never all of them ("reads as five people
  // who happened to find it worth sharing, not a mandated broadcast").
  // No company-page posting flow exists yet in this build (gated behind
  // the Community Management API approval, same as the source plan
  // flags it — see docs/ARCHITECTURE.md known gaps), so the "company
  // post" this reshares is a deterministic weekly placeholder rather
  // than a real published page post.
  const weekNumber = Math.floor(forDate.getTime() / (7 * 86_400_000));
  const allActive = await db
    .select({ id: participants.id, fullName: participants.fullName })
    .from(participants)
    .where(inArray(participants.status, ["active"]))
    .orderBy(participants.id);

  if (allActive.length >= 2) {
    const rotationStart = weekNumber % allActive.length;
    const rotationPair = [allActive[rotationStart], allActive[(rotationStart + 1) % allActive.length]];
    const isInRotation = rotationPair.some((p) => p.id === participantId);

    if (isInRotation) {
      const { output, meta } = await generateReshareCommentary({
        ...envelope,
        companyPost: {
          text: `[DEMO] This week's Alpha Nodus company page post on ${envelope.participant.lane.pillars[0] ?? "the category"}.`,
          publishedAt: forDate.toISOString(),
        },
        rotationParticipantNames: rotationPair.map((p) => p.fullName),
      });
      itemsToInsert.push(
        withReview(
          {
            type: "amplify_reshare",
            fulfillment: "manual_link",
            content: output.text,
            status: "pending",
            metadata: { rotationWeek: String(weekNumber), companyPostId: output.companyPostId },
          },
          meta.governanceFlags,
        ),
      );
    }
  }

  const followInviteTargets = ownedTargets
    .filter((t) => stageIndex(t.stage) >= stageIndex("warm_up") && t.stage !== "retired")
    .slice(0, 2);
  for (const target of followInviteTargets) {
    itemsToInsert.push(
      withReview(
        {
          type: "amplify_follow_invite",
          fulfillment: "manual_link",
          content: `Invite ${target.name} (${target.title ?? "target"}) to follow the Alpha Nodus page.`,
          targetId: target.id,
          sourcePostUrl: target.linkedinUrl,
          status: "pending",
          metadata: {},
        },
        [],
      ),
    );
  }

  const queueId = await persistQueue(participantId, dateStr, forDate, settings, itemsToInsert);
  const reviewNeededCount = itemsToInsert.filter((i) => i.needsReview === "pending").length;

  return { queueId, itemCount: itemsToInsert.length, reviewNeededCount };
}

async function persistQueue(
  participantId: string,
  dateStr: string,
  forDate: Date,
  settings: Awaited<ReturnType<typeof resolveSettings>>,
  items: Array<Omit<NewQueueItem, "queueId" | "position">>,
): Promise<string> {
  return db.transaction(async (tx) => {
    // Replace any existing queue for this date (e.g. a manual regenerate).
    const existing = await tx
      .select({ id: queues.id })
      .from(queues)
      .where(and(eq(queues.participantId, participantId), eq(queues.forDate, dateStr)))
      .limit(1);
    if (existing.length > 0) {
      await tx.delete(queueItems).where(eq(queueItems.queueId, existing[0].id));
      await tx.delete(queues).where(eq(queues.id, existing[0].id));
    }

    const [queue] = await tx
      .insert(queues)
      .values({
        participantId,
        forDate: dateStr,
        windowStart: settings.timing.preferredPostingWindowStart,
        windowEnd: settings.timing.preferredPostingWindowEnd,
        estimatedMinutes: estimateQueueMinutes(items),
        generatedAt: new Date(),
        totalCount: items.length,
      })
      .returning();

    if (items.length > 0) {
      await tx.insert(queueItems).values(
        items.map((item, index) => ({
          ...item,
          queueId: queue.id,
          position: index,
        })),
      );
    }

    return queue.id;
  });
}
