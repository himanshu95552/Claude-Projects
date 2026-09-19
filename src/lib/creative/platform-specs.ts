import type { CreativeFormat, Platform } from "./types";

/**
 * Platform + format -> physical creative spec, researched September 2026
 * (see docs/RESEARCH.md for sources: SocialBee, Hootsuite, SocialPilot,
 * Buffer, Sprout Social image-size guides; Contentdrips LinkedIn carousel
 * guide; postnitro/Buffer 2026 engagement-benchmark reports).
 *
 * "trending" is not a platform-native format -- it's a content strategy
 * (newsjacking / reacting to a live moment) -- so where a platform has no
 * native short-lived vertical surface (LinkedIn, X) it reuses the static
 * spec with different copy guidance; where one exists (Instagram, Facebook
 * Stories) it uses that vertical spec instead.
 */
export type CreativeSpec = {
  widthPx: number;
  heightPx: number;
  aspectRatio: string;
  minSlides: number;
  maxSlides: number;
  idealSlides?: number;
  tips: string[];
};

export const CREATIVE_SPECS: Record<Platform, Record<CreativeFormat, CreativeSpec>> = {
  linkedin: {
    static: {
      widthPx: 1200,
      heightPx: 1200,
      aspectRatio: "1:1",
      minSlides: 1,
      maxSlides: 1,
      tips: [
        "Square (1:1) outperforms landscape in the mobile feed -- it claims more vertical scroll space than a 1.91:1 link card.",
        "Lead with the number or claim in the image itself; the caption is a second surface, not the only place the hook lives.",
      ],
    },
    carousel: {
      widthPx: 1080,
      heightPx: 1080,
      aspectRatio: "1:1",
      minSlides: 3,
      maxSlides: 10,
      idealSlides: 8,
      tips: [
        "Square (1080x1080) unless there's a specific reason to go portrait -- it's the safest default across LinkedIn's carousel/document renderer.",
        "Slide 1 has to earn the swipe alone -- treat it as the hook, not a title card.",
        "Close on a single, focused CTA slide. Don't split the ask across two slides.",
      ],
    },
    trending: {
      widthPx: 1200,
      heightPx: 1200,
      aspectRatio: "1:1",
      minSlides: 1,
      maxSlides: 1,
      tips: [
        "LinkedIn has no Stories surface, so 'trending' here means a timely take in the normal feed format -- same spec as static, sharper hook.",
        "The window on a newsjack is hours, not days -- the tie-in has to read as obviously relevant the moment someone sees it, no explanation needed.",
      ],
    },
  },
  instagram: {
    static: {
      widthPx: 1080,
      heightPx: 1350,
      aspectRatio: "4:5",
      minSlides: 1,
      maxSlides: 1,
      tips: [
        "4:5 portrait claims more of the mobile screen than 1:1 -- use it unless the source image is genuinely square.",
        "Single images post the highest engagement-per-impression of any Instagram format in 2026 -- don't treat static as the fallback format.",
      ],
    },
    carousel: {
      widthPx: 1080,
      heightPx: 1350,
      aspectRatio: "4:5",
      minSlides: 3,
      maxSlides: 10,
      idealSlides: 9,
      tips: [
        "8-10 slides at 4:5 is the best-performing carousel shape in 2026 -- carousels lead every format on saves.",
        "Every slide must share the same aspect ratio -- a mismatched slide gets cropped and breaks the flow.",
        "Structure: hook slide -> value slides (steps/comparisons/proof) -> one clear CTA slide.",
      ],
    },
    trending: {
      widthPx: 1080,
      heightPx: 1920,
      aspectRatio: "9:16",
      minSlides: 1,
      maxSlides: 1,
      tips: [
        "Vertical full-screen (9:16) is the native Reels-cover/Story shape -- built for the urgency a timely post needs.",
        "Keep the hook text inside the safe zone (roughly the middle 60% of the frame) so UI chrome doesn't cover it.",
      ],
    },
  },
  facebook: {
    static: {
      widthPx: 1200,
      heightPx: 628,
      aspectRatio: "1.91:1",
      minSlides: 1,
      maxSlides: 1,
      tips: [
        "1200x628 is Facebook's standard link/feed image ratio -- going square here looks cropped in the link-preview card.",
      ],
    },
    carousel: {
      widthPx: 1080,
      heightPx: 1080,
      aspectRatio: "1:1",
      minSlides: 2,
      maxSlides: 10,
      idealSlides: 5,
      tips: [
        "All cards must share one aspect ratio -- Facebook defaults to the first card's ratio and auto-crops the rest if they don't match.",
        "1:1 square is the safest cross-card default.",
      ],
    },
    trending: {
      widthPx: 1080,
      heightPx: 1920,
      aspectRatio: "9:16",
      minSlides: 1,
      maxSlides: 1,
      tips: [
        "Facebook Stories share Instagram's 9:16 vertical shape -- reuse the same creative for both where the message fits.",
      ],
    },
  },
  x: {
    static: {
      widthPx: 1200,
      heightPx: 675,
      aspectRatio: "16:9",
      minSlides: 1,
      maxSlides: 1,
      tips: [
        "1200x675 (16:9) is what X actually renders in-stream -- taller images get cropped by the timeline grid.",
        "Center the subject; a 1:1 or portrait source gets cropped from the sides in-feed.",
      ],
    },
    carousel: {
      widthPx: 800,
      heightPx: 800,
      aspectRatio: "1:1",
      minSlides: 2,
      maxSlides: 4,
      idealSlides: 4,
      tips: [
        "X has no swipeable carousel surface -- this is a multi-image post (up to 4 images), so treat each image as visible at once, not a sequential reveal.",
        "Keep every image at the same aspect ratio (1:1 is the safe default) or X's grid layout crops unevenly.",
      ],
    },
    trending: {
      widthPx: 1200,
      heightPx: 675,
      aspectRatio: "16:9",
      minSlides: 1,
      maxSlides: 1,
      tips: [
        "No Stories surface on X either -- 'trending' is a single reactive image (quote-card / stat-card style) posted while a topic has velocity.",
        "Early-engagement velocity is everything on X -- the image has to land in the first glance, with zero scroll or thread context.",
      ],
    },
  },
};

export function getCreativeSpec(platform: Platform, format: CreativeFormat): CreativeSpec {
  return CREATIVE_SPECS[platform][format];
}
