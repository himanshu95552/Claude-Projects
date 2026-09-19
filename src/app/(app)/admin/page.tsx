import { redirect } from "next/navigation";
import { getCurrentParticipant, hasRole } from "@/lib/auth/session";

export default async function AdminPage() {
  const participant = await getCurrentParticipant();
  if (!participant || !hasRole(participant, "admin")) redirect("/queue");
  return <div>Admin view — coming up next.</div>;
}
