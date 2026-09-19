import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth/session";

export default async function RootPage() {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/login");
  redirect(participant.status === "onboarding" ? "/onboarding" : "/queue");
}
