import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { lanes } from "@/lib/db/schema";
import { getCurrentParticipant } from "@/lib/auth/session";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function OnboardingPage() {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/login");
  if (participant.status !== "onboarding" && participant.status !== "invited") redirect("/queue");

  const openLanes = await db
    .select()
    .from(lanes)
    .where(eq(lanes.status, "open"));

  const allLanes = await db.select().from(lanes);
  const currentLane = allLanes.find((l) => l.id === participant.laneId);
  const selectableLanes = currentLane ? [currentLane, ...openLanes] : openLanes;

  return (
    <main className="flex-1 mx-auto w-full max-w-xl px-4 py-10">
      <OnboardingWizard
        participant={{ fullName: participant.fullName, jobTitle: participant.jobTitle }}
        lanes={selectableLanes.map((l) => ({
          id: l.id,
          name: l.name,
          targetsPersona: l.targetsPersona,
          pillars: l.pillars,
        }))}
      />
    </main>
  );
}
