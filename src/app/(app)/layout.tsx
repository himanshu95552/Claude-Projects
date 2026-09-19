import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentParticipant, hasRole } from "@/lib/auth/session";
import { NavLinks } from "./nav-links";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const participant = await getCurrentParticipant();
  if (!participant) redirect("/login");
  if (participant.status === "onboarding") redirect("/onboarding");

  const isAdmin = hasRole(participant, "admin");

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-3xl px-4 flex items-center justify-between h-14">
          <Link href="/queue" className="font-semibold text-sm">
            Alpha Nodus Advocacy
          </Link>
          <NavLinks isAdmin={isAdmin} />
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
