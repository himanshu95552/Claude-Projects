import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-accent text-accent-foreground hover:opacity-90",
  secondary: "bg-surface-raised border border-border hover:bg-border/40",
  ghost: "hover:bg-border/40",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes = {
  sm: "text-sm px-3 py-1.5 rounded-md",
  md: "text-sm px-4 py-2 rounded-lg",
  lg: "text-base px-5 py-2.5 rounded-lg",
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }
>(({ className, variant = "primary", size = "md", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      variants[variant],
      sizes[size],
      className,
    )}
    {...props}
  />
));
Button.displayName = "Button";

export function LinkButton({
  href,
  className,
  variant = "primary",
  size = "md",
  children,
}: {
  href: string;
  className?: string;
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
