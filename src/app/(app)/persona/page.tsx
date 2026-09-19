import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { lanes, storyBankEntries, voiceProfiles } from "@/lib/db/schema";
import { getCurrentParticipant } from "@/lib/auth/session";
import { PersonaClient } from "@/components/persona/persona-client";
import { connectionStatus, getLinkedInAccount } from "@/lib/integrations/linkedin/account";
import { isLinkedInConfigured } from "@/lib/env";

export default async function PersonaPage() {
  const participant = await getCurrentParticipant();
  if (!participant) return null;

  const linkedInAccount = await getLinkedInAccount(participant.id);
  const linkedIn = {
    configured: isLinkedInConfigured(),
    status: connectionStatus(linkedInAccount),
    handle: linkedInAccount?.handle ?? null,
    expiresAt: linkedInAccount?.expiresAt?.toISOString() ?? null,
  };

  const [voiceProfile] = await db
    .select()
    .from(voiceProfiles)
    .where(and(eq(voiceProfiles.participantId, participant.id), eq(voiceProfiles.isCurrent, true)))
    .orderBy(desc(voiceProfiles.version))
    .limit(1);

  const storyBank = await db
    .select()
    .from(storyBankEntries)
    .where(eq(storyBankEntries.participantId, participant.id));

  const lane = participant.laneId
    ? (await db.select().from(lanes).where(eq(lanes.id, participant.laneId)).limit(1))[0]
    : null;

  return (
    <PersonaClient
      voiceProfile={
        voiceProfile
          ? {
              sliders: voiceProfile.sliders,
              freetextRules: voiceProfile.freetextRules,
              bannedPhrases: voiceProfile.bannedPhrases,
              emojiSetting: voiceProfile.emojiSetting,
              version: voiceProfile.version,
            }
          : null
      }
      storyBank={storyBank.map((s) => ({ id: s.id, kind: s.kind, content: s.content }))}
      lane={lane ? { name: lane.name, targetsPersona: lane.targetsPersona, pillars: lane.pillars, doRules: lane.doRules, dontRules: lane.dontRules } : null}
      linkedIn={linkedIn}
    />
  );
}
