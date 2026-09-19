import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-border/50 text-foreground",
  accent: "bg-accent-muted text-accent",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  danger: "bg-danger-muted text-danger",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: keyof typeof tones;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
