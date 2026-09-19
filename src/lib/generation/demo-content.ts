/**
 * DEMO_MODE fallback generator — used when ANTHROPIC_API_KEY is unset
 * (src/lib/env.ts isDemoMode()). Produces clearly-labeled placeholder
 * content so the whole app (queue, review, publish flow) is runnable and
 * demoable without an API key, per the "guided onboarding" requirement —
 * a fresh clone should show working screens before any account is wired
 * up. Every string here is prefixed [DEMO] so it can never be mistaken
 * for a real draft in a screenshot or a review queue.
 */

export function demoPostText(pillar: string, storyBankLine?: string): string {
  return [
    `[DEMO DRAFT — connect ANTHROPIC_API_KEY to generate real content]`,
    "",
    `This is a placeholder post for the "${pillar}" pillar.`,
    storyBankLine ? `It would draw on: ${storyBankLine}` : "",
    "",
    "Real drafts are generated overnight against your voice profile and story bank, run through the humanizer pass, and land here for your review before anything publishes.",
    "",
    "What's the one thing about this you'd want changed first?",
  ]
    .filter(Boolean)
    .join("\n");
}

export function demoCommentText(authorName: string): string {
  return `[DEMO] A substantive comment on ${authorName}'s post would appear here once generation is connected — referencing something specific from their post, adding a number or example, and ending with a real question.`;
}

export function demoReplyText(): string {
  return "[DEMO] A reply continuing this thread would appear here — shorter than the comment it answers, with one new detail.";
}

export function demoConnectionNote(name: string, evidence: string): string {
  return `[DEMO] ${name} — ${evidence.slice(0, 80)}. (Real notes reference the exact exchange and stay under 300 characters.)`;
}

export function demoReshareCommentary(): string {
  return "[DEMO] Reshare commentary from this participant's own vantage point would appear here — 2-4 sentences adding something the original post didn't say.";
}

export function demoXPostText(pillar: string): string {
  return `[DEMO] A 280-char X post for "${pillar}" would appear here — one sharp idea repurposed from the LinkedIn draft, written for replies and bookmarks, not likes.`;
}

export function demoCreativeBriefSlides(pillar: string, slideCount: number): Array<{ heading: string; subheading?: string; bodyText?: string }> {
  if (slideCount === 1) {
    return [
      {
        heading: `[DEMO] Hook headline for "${pillar}" would appear here`,
        subheading: "[DEMO] One-line support text, connect ANTHROPIC_API_KEY to generate real copy.",
      },
    ];
  }
  return Array.from({ length: slideCount }, (_, i) => {
    if (i === 0) return { heading: `[DEMO] Slide 1 — hook for "${pillar}"`, subheading: "[DEMO] Earns the swipe." };
    if (i === slideCount - 1) return { heading: "[DEMO] Final slide — CTA", subheading: "[DEMO] One focused ask." };
    return { heading: `[DEMO] Slide ${i + 1} — value point`, bodyText: "[DEMO] A step, number, or comparison would appear here." };
  });
}
