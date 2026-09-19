"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/queue", label: "Queue" },
  { href: "/calendar", label: "Calendar" },
  { href: "/persona", label: "Persona" },
  { href: "/weekly", label: "Weekly" },
  { href: "/analytics", label: "Analytics" },
];

export function NavLinks({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = isAdmin ? [...links, { href: "/admin", label: "Admin" }] : links;

  return (
    <nav className="flex items-center gap-0.5 sm:gap-1 text-sm overflow-x-auto whitespace-nowrap">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-2 sm:px-3 py-1.5 rounded-md transition-colors shrink-0",
            pathname.startsWith(item.href)
              ? "bg-accent-muted text-accent font-medium"
              : "text-muted hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
      <form action="/api/auth/logout" method="POST" className="ml-1 sm:ml-2 shrink-0">
        <button type="submit" className="px-2 sm:px-3 py-1.5 rounded-md text-muted hover:text-foreground">
          <span className="hidden sm:inline">Sign out</span>
          <span className="sm:hidden">Out</span>
        </button>
      </form>
    </nav>
  );
}
