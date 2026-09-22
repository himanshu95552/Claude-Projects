import { redirect } from "next/navigation";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { apiUsageLog, participants, platformAccounts, queueItems, queues } from "@/lib/db/schema";
import { getCurrentParticipant, hasRole } from "@/lib/auth/session";
import { resolveSettings } from "@/lib/config/resolve";
import { getConfigHistory } from "@/lib/config/resolve";
import { getEnv } from "@/lib/env";
import { AdminClient } from "@/components/admin/admin-client";

export default async function AdminPage() {
  const participant = await getCurrentParticipant();
  if (!participant || !hasRole(participant, "admin")) redirect("/queue");

  const allParticipants = await db.select().from(participants);

  const linkedInAccounts = allParticipants.length
    ? await db
        .select({ participantId: platformAccounts.participantId, status: platformAccounts.status, handle: platformAccounts.handle })
        .from(platformAccounts)
        .where(
          and(
            inArray(platformAccounts.participantId, allParticipants.map((p) => p.id)),
            eq(platformAccounts.platform, "linkedin"),
          ),
        )
    : [];
  const linkedInByParticipant = new Map(
    linkedInAccounts.map((a) => [a.participantId, { status: a.status, handle: a.handle }]),
  );

  const reviewPending = await db
    .select({
      item: queueItems,
      participantName: participants.fullName,
    })
    .from(queueItems)
    .innerJoin(queues, eq(queues.id, queueItems.queueId))
    .innerJoin(participants, eq(participants.id, queues.participantId))
    .where(eq(queueItems.needsReview, "pending"))
    .orderBy(queueItems.reviewSlaDueAt);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const spendRows = await db
    .select({ total: sql<string>`COALESCE(SUM(${apiUsageLog.costUsd}), 0)` })
    .from(apiUsageLog)
    .where(gte(apiUsageLog.createdAt, thirtyDaysAgo));
  const spendUsd = Number(spendRows[0]?.total ?? 0);

  const globalSettings = await resolveSettings({});
  const configHistory = await getConfigHistory("global", null);

  const activeCount = allParticipants.filter((p) => p.status === "active").length;
  const totalCount = allParticipants.length;

  return (
    <AdminClient
      participants={allParticipants.map((p) => ({
        id: p.id, email: p.email, fullName: p.fullName, status: p.status,
        appRoles: p.appRoles, streakDays: p.streakDays,
        linkedIn: linkedInByParticipant.get(p.id) ?? null,
      }))}
      reviewItems={reviewPending.map((r) => ({
        id: r.item.id,
        participantName: r.participantName,
        type: r.item.type,
        content: r.item.editedContent ?? r.item.content,
        reviewFlags: r.item.reviewFlags,
        reviewSlaDueAt: r.item.reviewSlaDueAt?.toISOString() ?? null,
      }))}
      kpis={{ activeCount, totalCount, spendUsd, spendCapUsd: getEnv().MONTHLY_SPEND_CAP_USD }}
      globalSettings={globalSettings}
      configHistory={configHistory.slice(0, 10).map((c) => ({
        version: c.version,
        changeNote: c.changeNote,
        changedAt: c.changedAt.toISOString(),
      }))}
    />
  );
}
