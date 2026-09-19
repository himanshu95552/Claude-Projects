import { describe, expect, it } from "vitest";
import { buildRegenerationPrompt } from "@/lib/integrations/claude/prompts";
import { generateRegeneratedContent } from "@/lib/generation/generate";
import type { RegenerationInput } from "@/lib/generation/contracts";

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

describe("buildRegenerationPrompt", () => {
  it("includes the marked excerpts, reason, and constraints", () => {
    const input: RegenerationInput = {
      ...baseEnvelope,
      itemType: "publish",
      platform: "linkedin",
      previousContent: "Line one. Line two. Line three.",
      markedExcerpts: ["Line two."],
      reason: "Too vague",
      constraints: { mustEndWithQuestion: true },
    };
    const { system } = buildRegenerationPrompt(input);
    expect(system).toContain("Line two.");
    expect(system).toContain("Too vague");
    expect(system).toContain("Must end with a genuine question");
  });

  it("tells the model to treat the whole draft as revisable when nothing is marked", () => {
    const input: RegenerationInput = {
      ...baseEnvelope,
      itemType: "general_comment",
      platform: "linkedin",
      previousContent: "A generic comment.",
      markedExcerpts: [],
      reason: "",
      constraints: {},
    };
    const { system } = buildRegenerationPrompt(input);
    expect(system).toContain("No specific lines were marked");
  });
});

describe("generateRegeneratedContent (demo mode)", () => {
  it("returns demo-labeled text referencing the marked count and reason", async () => {
    const input: RegenerationInput = {
      ...baseEnvelope,
      itemType: "publish",
      platform: "x",
      previousContent: "Original draft text.",
      markedExcerpts: ["Original draft text."],
      reason: "Doesn't sound like me",
      constraints: { maxChars: 280 },
    };
    const { output, meta } = await generateRegeneratedContent(input);
    expect(meta.isDemoContent).toBe(true);
    expect(output.text).toContain("[DEMO REGENERATED");
    expect(output.text).toContain("Doesn't sound like me");
  });
});
