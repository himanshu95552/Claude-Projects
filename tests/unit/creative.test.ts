import { describe, expect, it } from "vitest";
import { CREATIVE_SPECS, getCreativeSpec } from "@/lib/creative/platform-specs";
import type { CreativeFormat, Platform } from "@/lib/creative/types";
import { buildCreativeBriefPrompt } from "@/lib/integrations/claude/prompts";
import { generateCreativeBrief } from "@/lib/generation/generate";
import type { CreativeBriefGenerationInput } from "@/lib/generation/contracts";

const PLATFORMS: Platform[] = ["linkedin", "instagram", "facebook", "x"];
const FORMATS: CreativeFormat[] = ["static", "carousel", "trending"];

const baseEnvelope = {
  participant: { name: "Tushant", role: "Marketing Manager", lane: { name: "Category education", pillars: ["ROI"], do: [], dont: [] } },
  voiceProfile: { sliders: { formality: 50, sentenceLength: 50, hedging: 30, humor: 30, directness: 60, technicalDepth: 50 }, rules: [], bannedPhrases: [], emoji: "never" as const },
  storyBank: [],
  governance: { clearedCustomers: [], bannedClaims: [], phiCheck: false },
  recentPosts: [],
  config: {
    targetLength: [1300, 2500] as [number, number],
    hookRotation: true,
    draftingModel: "claude-sonnet-5",
    researchModel: "claude-haiku-4-5",
  },
};

describe("CREATIVE_SPECS", () => {
  it("defines every platform x format combination", () => {
    for (const platform of PLATFORMS) {
      for (const format of FORMATS) {
        const spec = getCreativeSpec(platform, format);
        expect(spec.widthPx).toBeGreaterThan(0);
        expect(spec.heightPx).toBeGreaterThan(0);
        expect(spec.minSlides).toBeGreaterThanOrEqual(1);
        expect(spec.maxSlides).toBeGreaterThanOrEqual(spec.minSlides);
        expect(spec.tips.length).toBeGreaterThan(0);
      }
    }
  });

  it("caps X carousel at 4 images (X has no swipeable carousel, only a 4-image post)", () => {
    expect(CREATIVE_SPECS.x.carousel.maxSlides).toBe(4);
  });

  it("uses a vertical 9:16 canvas for Instagram/Facebook 'trending' (their native Stories/Reels surface)", () => {
    expect(CREATIVE_SPECS.instagram.trending.aspectRatio).toBe("9:16");
    expect(CREATIVE_SPECS.facebook.trending.aspectRatio).toBe("9:16");
  });

  it("falls back 'trending' to the static spec's canvas on platforms with no Stories surface", () => {
    expect(CREATIVE_SPECS.linkedin.trending.aspectRatio).toBe(CREATIVE_SPECS.linkedin.static.aspectRatio);
    expect(CREATIVE_SPECS.x.trending.aspectRatio).toBe(CREATIVE_SPECS.x.static.aspectRatio);
  });
});

describe("buildCreativeBriefPrompt", () => {
  it("includes the canvas spec and AN27 brand rules in the prompt", () => {
    const spec = getCreativeSpec("instagram", "carousel");
    const input: CreativeBriefGenerationInput = {
      ...baseEnvelope,
      pillar: "ROI",
      sourceMaterial: "Riverbend cut no-show follow-up time by two-thirds.",
      platform: "instagram",
      format: "carousel",
      spec,
    };
    const { system } = buildCreativeBriefPrompt(input);
    expect(system).toContain("1080x1350px");
    expect(system).toContain("Sentence case");
    expect(system).toContain("AN27");
  });
});

describe("generateCreativeBrief (demo mode)", () => {
  it("returns slides matching the spec's slide count and platform dimensions", async () => {
    const spec = getCreativeSpec("linkedin", "carousel");
    const input: CreativeBriefGenerationInput = {
      ...baseEnvelope,
      pillar: "ROI",
      sourceMaterial: "Some source post text.",
      platform: "linkedin",
      format: "carousel",
      spec,
    };
    const { output, meta } = await generateCreativeBrief(input);
    expect(meta.isDemoContent).toBe(true);
    expect(output.widthPx).toBe(spec.widthPx);
    expect(output.heightPx).toBe(spec.heightPx);
    expect(output.slides.length).toBe(spec.idealSlides ?? spec.minSlides);
    expect(output.slides.every((s) => s.heading.includes("[DEMO]"))).toBe(true);
  });

  it("returns a single slide for a static/trending format", async () => {
    const spec = getCreativeSpec("x", "static");
    const input: CreativeBriefGenerationInput = {
      ...baseEnvelope,
      pillar: "ROI",
      sourceMaterial: "Some source post text.",
      platform: "x",
      format: "static",
      spec,
    };
    const { output } = await generateCreativeBrief(input);
    expect(output.slides).toHaveLength(1);
    expect(output.cta).toBeNull();
  });
});
