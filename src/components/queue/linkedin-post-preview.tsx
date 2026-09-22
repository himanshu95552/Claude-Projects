import { Badge } from "@/components/ui/badge";
import { avatarColor, initials, relativeAge } from "@/lib/avatar";

const LINKEDIN_BLUE = "#0A66C2";

/** Small line icons matching LinkedIn's action-row set — no icon library is installed, so these are inline. */
function LikeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 21h3V9H2v12zM9 21h9.4a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 19.8 10H14l1-4.5A2 2 0 0 0 13 3l-4 5.5V21z" />
    </svg>
  );
}
function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4h16v13H8l-4 4V4z" />
    </svg>
  );
}
function RepostIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 2l4 4-4 4M3 11V8a2 2 0 0 1 2-2h16M7 22l-4-4 4-4M21 13v3a2 2 0 0 1-2 2H3" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function ReactionAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-1 cursor-default items-center justify-center gap-1.5 rounded py-2 text-[#00000099]">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

/**
 * Styled to read like a real LinkedIn post/thread, so acting on it feels
 * like being on LinkedIn rather than in a separate tool. The content
 * itself is only as real as research-signals.ts's provider — right now
 * that's DemoResearchProvider, so this is fabricated placeholder text,
 * not a scrape of the target's actual post. The "Demo content" badge is
 * the honesty marker for that until a real research integration exists.
 * The Like/Comment/Repost/Send row is decorative chrome (cursor-default,
 * no onClick) — it's not wired to anything real, unlike the actual
 * comment compose box this card sits above.
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
  // Derived purely for visual completeness — reactions is the only real
  // count research-signals.ts produces today.
  const comments = Math.max(1, Math.round(reactions * 0.6));
  const reposts = Math.max(0, Math.round(reactions * 0.05));

  return (
    <div className="rounded-xl border border-border bg-white p-4 mb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: avatarColor(authorName) }}
          >
            {initials(authorName)}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#000000de] leading-tight">
              {authorName} <span className="text-[#00000099] font-normal">&middot; Following</span>
            </p>
            {authorRole && <p className="text-xs text-[#00000099] leading-tight">{authorRole}</p>}
            <p className="text-xs text-[#00000099] leading-tight">{relativeAge(ageMinutes)} &middot; 🌐</p>
          </div>
        </div>
        {isDemo && <Badge tone="neutral">Demo content</Badge>}
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm text-[#000000de] leading-relaxed">{text}</p>

      <div className="mt-3 flex items-center justify-between text-xs text-[#00000099]">
        <span className="flex items-center gap-1">
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white"
            style={{ backgroundColor: LINKEDIN_BLUE }}
            aria-hidden
          >
            👍
          </span>
          {reactions}
        </span>
        <span>
          {comments} comments {reposts > 0 && <>&middot; {reposts} repost{reposts === 1 ? "" : "s"}</>}
        </span>
      </div>

      <div className="mt-1 flex items-center border-t border-border">
        <ReactionAction icon={<LikeIcon />} label="Like" />
        <ReactionAction icon={<CommentIcon />} label="Comment" />
        <ReactionAction icon={<RepostIcon />} label="Repost" />
        <ReactionAction icon={<SendIcon />} label="Send" />
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

const STAGE_LABELS: Record<string, string> = {
  cold: "Not yet followed",
  follow: "Following",
  warm_up: "Warming up",
  recognized: "Recognized",
  connect: "Connection sent",
  connected: "Connected",
  retired: "Retired",
};

/**
 * A LinkedIn profile-page look for Follow/Connect/amplify_follow_invite
 * items — banner + avatar + headline, same honesty caveat as the post
 * preview above (fabricated roster data, not a real scrape). `stage`
 * substitutes for LinkedIn's "1st/2nd/3rd" badge with something we
 * actually track: where this target sits on the engagement ladder.
 */
export function LinkedInProfilePreview({
  name,
  title,
  center,
  stage,
}: {
  name: string;
  title?: string;
  center?: string;
  stage: string;
}) {
  const color = avatarColor(name);

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden mb-3">
      <div className="h-14" style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }} />
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-8 mb-2">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white text-lg font-semibold text-white"
            style={{ backgroundColor: color }}
          >
            {initials(name)}
          </div>
          <Badge tone="neutral">Demo content</Badge>
        </div>
        <p className="text-base font-semibold text-[#000000de]">{name}</p>
        {(title || center) && (
          <p className="text-sm text-[#00000099]">
            {title}
            {title && center && " at "}
            {center}
          </p>
        )}
        <p className="mt-1 text-xs text-[#00000099]">{STAGE_LABELS[stage] ?? stage}</p>
      </div>
    </div>
  );
}
