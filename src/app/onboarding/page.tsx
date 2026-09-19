import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth/session";

export default async function OnboardingPage() {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/login");
  return <div>Onboarding wizard — coming up next. Hi {participant.fullName}.</div>;
}
