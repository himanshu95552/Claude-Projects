import { Badge } from "@/components/ui/badge";
import { avatarColor, initials, relativeAge } from "@/lib/avatar";

/**
 * Styled to read like a real LinkedIn post/thread, so acting on it feels
 * like being on LinkedIn rather than in a separate tool. The content
 * itself is only as real as research-signals.ts's provider — right now
 * that's DemoResearchProvider, so this is fabricated placeholder text,
 * not a scrape of the target's actual post. The "Demo content" badge is
 * the honesty marker for that until a real research integration exists.
 */
export function LinkedInPostPreview({
  authorName,
  authorRole,
  text,
  ageMinutes,
  reactions,
}: {
  authorName: string;
  authorRole?: string;
  text: string;
  ageMinutes: number;
  reactions: number;
}) {
  const isDemo = text.includes("[DEMO");

  return (
    <div className="rounded-xl border border-border bg-white p-4 mb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: avatarColor(authorName) }}
          >
            {initials(authorName)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#000000de] leading-tight">{authorName}</p>
            {authorRole && <p className="text-xs text-[#00000099] leading-tight">{authorRole}</p>}
            <p className="text-xs text-[#00000099] leading-tight">{relativeAge(ageMinutes)} &middot; 🌐</p>
          </div>
        </div>
        {isDemo && <Badge tone="neutral">Demo content</Badge>}
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm text-[#000000de] leading-relaxed">{text}</p>

      <div className="mt-3 flex items-center gap-1 border-t border-border pt-2 text-xs text-[#00000099]">
        <span aria-hidden>👍</span>
        <span>{reactions}</span>
      </div>
    </div>
  );
}

/** Same idea for a reply-to-a-reply thread — two prior turns, indented like a LinkedIn comment thread. */
export function LinkedInThreadPreview({
  parentText,
  replyingToText,
}: {
  parentText: string;
  replyingToText: string;
}) {
  const isDemo = parentText.includes("[DEMO") || replyingToText.includes("[DEMO");

  return (
    <div className="rounded-xl border border-border bg-white p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-[#00000099] uppercase tracking-wide">Thread</p>
        {isDemo && <Badge tone="neutral">Demo content</Badge>}
      </div>
      <div className="space-y-2">
        <p className="text-sm text-[#00000099] border-l-2 border-border pl-2.5">{parentText}</p>
        <p className="text-sm text-[#000000de] border-l-2 border-[#0A66C2] pl-2.5">{replyingToText}</p>
      </div>
    </div>
  );
}
