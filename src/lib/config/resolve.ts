import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { configs } from "@/lib/db/schema";
import { GLOBAL_DEFAULTS, settingsSchema, type ResolvedSettings, type Settings } from "./schema";

/** Every property, at every depth, made optional. */
export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

/** Deep-merge two partial settings trees, `override` winning on conflicts. */
export function deepMerge<T extends Record<string, unknown>>(
  base: T,
  override: DeepPartial<T>,
): T {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const overrideValue = (override as Record<string, unknown>)[key];
    const baseValue = (base as Record<string, unknown>)[key];
    if (
      overrideValue &&
      typeof overrideValue === "object" &&
      !Array.isArray(overrideValue) &&
      baseValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue)
    ) {
      result[key] = deepMerge(
        baseValue as Record<string, unknown>,
        overrideValue as Record<string, unknown>,
      );
    } else if (overrideValue !== undefined) {
      result[key] = overrideValue;
    }
  }
  return result as T;
}

async function getCurrentSettings(
  scope: "global" | "lane" | "participant",
  scopeRef: string | null,
): Promise<Settings | null> {
  const rows = await db
    .select()
    .from(configs)
    .where(
      and(
        eq(configs.scope, scope),
        scopeRef ? eq(configs.scopeRef, scopeRef) : isNull(configs.scopeRef),
        eq(configs.isCurrent, true),
      ),
    )
    .orderBy(desc(configs.version))
    .limit(1);

  if (rows.length === 0) return null;
  const parsed = settingsSchema.safeParse(rows[0].settings);
  return parsed.success ? parsed.data : null;
}

/**
 * Resolve the effective settings for a participant: global -> lane ->
 * participant, each layer overriding only the keys it sets. This is the
 * one function every UI screen and generation call should read config
 * through — never read the `configs` table directly elsewhere.
 */
export async function resolveSettings(params: {
  participantId?: string;
  laneId?: string | null;
}): Promise<ResolvedSettings> {
  const { participantId, laneId } = params;

  const [globalOverride, laneOverride, participantOverride] = await Promise.all([
    getCurrentSettings("global", null),
    laneId ? getCurrentSettings("lane", laneId) : Promise.resolve(null),
    participantId ? getCurrentSettings("participant", participantId) : Promise.resolve(null),
  ]);

  let merged = GLOBAL_DEFAULTS;
  if (globalOverride) merged = deepMerge(merged, globalOverride);
  if (laneOverride) merged = deepMerge(merged, laneOverride);
  if (participantOverride) merged = deepMerge(merged, participantOverride);

  return merged;
}

/**
 * Write a new config version. Never updates a row in place — build-spec.md
 * §7: "config is versioned, not overwritten." The previous current row for
 * this scope+scopeRef is flipped to isCurrent=false in the same
 * transaction, so history is queryable as a change log with no separate
 * audit table.
 */
export async function writeConfig(params: {
  scope: "global" | "lane" | "participant";
  scopeRef: string | null;
  settings: Settings;
  changedByParticipantId?: string;
  changeNote?: string;
}): Promise<void> {
  const parsed = settingsSchema.parse(params.settings);

  await db.transaction(async (tx) => {
    const current = await tx
      .select({ id: configs.id, version: configs.version })
      .from(configs)
      .where(
        and(
          eq(configs.scope, params.scope),
          params.scopeRef ? eq(configs.scopeRef, params.scopeRef) : isNull(configs.scopeRef),
          eq(configs.isCurrent, true),
        ),
      )
      .orderBy(desc(configs.version))
      .limit(1);

    const nextVersion = current.length > 0 ? current[0].version + 1 : 1;

    if (current.length > 0) {
      await tx
        .update(configs)
        .set({ isCurrent: false })
        .where(eq(configs.id, current[0].id));
    }

    await tx.insert(configs).values({
      scope: params.scope,
      scopeRef: params.scopeRef,
      settings: parsed,
      version: nextVersion,
      isCurrent: true,
      changedByParticipantId: params.changedByParticipantId,
      changeNote: params.changeNote,
    });
  });
}

/** Full version history for a scope — the change log the admin UI shows. */
export async function getConfigHistory(
  scope: "global" | "lane" | "participant",
  scopeRef: string | null,
) {
  return db
    .select()
    .from(configs)
    .where(
      and(
        eq(configs.scope, scope),
        scopeRef ? eq(configs.scopeRef, scopeRef) : isNull(configs.scopeRef),
      ),
    )
    .orderBy(desc(configs.version));
}
