"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/queue", label: "Queue" },
  { href: "/persona", label: "Persona" },
  { href: "/weekly", label: "Weekly" },
];

export function NavLinks({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const items = isAdmin ? [...links, { href: "/admin", label: "Admin" }] : links;

  return (
    <nav className="flex items-center gap-1 text-sm">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-3 py-1.5 rounded-md transition-colors",
            pathname.startsWith(item.href)
              ? "bg-accent-muted text-accent font-medium"
              : "text-muted hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
      <form action="/api/auth/logout" method="POST" className="ml-2">
        <button type="submit" className="px-3 py-1.5 rounded-md text-muted hover:text-foreground">
          Sign out
        </button>
      </form>
    </nav>
  );
}
