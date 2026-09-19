import { describe, expect, it } from "vitest";
import { assertConnectionNoteGate, assertReshareRotationSize, modelForJob, type ConnectionNoteInput } from "@/lib/generation/contracts";
import { buildVoiceFingerprint, suggestSlidersFromFingerprint } from "@/lib/generation/voice-fingerprint";

const baseEnvelope = {
  participant: { name: "Tushant", role: "Marketing Manager", lane: { name: "Category education", pillars: [], do: [], dont: [] } },
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

describe("assertConnectionNoteGate", () => {
  it("throws when stageEvidence is empty — the hard gate from prompt-contracts.md §4", () => {
    const input: ConnectionNoteInput = {
      ...baseEnvelope,
      target: { name: "Marcus Webb", profileSummary: "Director of Ops" },
      stageEvidence: "",
    };
    expect(() => assertConnectionNoteGate(input)).toThrow(/cold outreach/);
  });

  it("passes when stageEvidence is present", () => {
    const input: ConnectionNoteInput = {
      ...baseEnvelope,
      target: { name: "Marcus Webb", profileSummary: "Director of Ops" },
      stageEvidence: "replied to your comment on Nov 12",
    };
    expect(() => assertConnectionNoteGate(input)).not.toThrow();
  });
});

describe("assertReshareRotationSize", () => {
  it("throws when the rotation isn't exactly 2 people", () => {
    expect(() => assertReshareRotationSize(["Shamit"])).toThrow(/exactly 2/);
    expect(() => assertReshareRotationSize(["Shamit", "Tushant", "Iris"])).toThrow(/exactly 2/);
  });

  it("passes for exactly 2", () => {
    expect(() => assertReshareRotationSize(["Shamit", "Tushant"])).not.toThrow();
  });
});

describe("modelForJob", () => {
  const config = { draftingModel: "claude-sonnet-5", researchModel: "claude-haiku-4-5" };
  it("routes research to the research model", () => {
    expect(modelForJob("research", config)).toBe("claude-haiku-4-5");
  });
  it("routes drafting, humanizing, and voice-profile work to the drafting model", () => {
    expect(modelForJob("draft", config)).toBe("claude-sonnet-5");
    expect(modelForJob("humanize", config)).toBe("claude-sonnet-5");
    expect(modelForJob("voice_profile", config)).toBe("claude-sonnet-5");
  });
});

describe("buildVoiceFingerprint + suggestSlidersFromFingerprint", () => {
  it("extracts sentence lengths and punctuation habits from samples", () => {
    const fp = buildVoiceFingerprint([
      "Short one. Another short sentence here for good measure.",
      "maybe this one starts lowercase, on purpose..",
    ]);
    expect(fp.sentenceLengths.length).toBeGreaterThan(0);
    expect(fp.usesDoubleDot).toBe(true);
  });

  it("suggests sliders within 0-100 bounds", () => {
    const fp = buildVoiceFingerprint(["A reasonably long sentence with a normal amount of words in it."]);
    const sliders = suggestSlidersFromFingerprint(fp);
    expect(sliders.sentenceLength).toBeGreaterThanOrEqual(0);
    expect(sliders.sentenceLength).toBeLessThanOrEqual(100);
    expect(sliders.hedging).toBeGreaterThanOrEqual(0);
    expect(sliders.hedging).toBeLessThanOrEqual(100);
  });
});
