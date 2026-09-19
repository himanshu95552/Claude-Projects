import { describe, expect, it } from "vitest";
import { scoreParagraph, emDashExcess, fragmentCount, detectTriads } from "@/lib/generation/humanizer/score";
import { auditHumanizedText } from "@/lib/generation/humanizer/audit";

describe("scoreParagraph", () => {
  it("leaves a clean paragraph alone", () => {
    const result = scoreParagraph(
      "Six years ago I watched a billing manager keep a denial log in a spiral notebook.",
    );
    expect(result.action).toBe("LEAVE");
  });

  it("flags 3+ density markers for a full rewrite", () => {
    const paragraph =
      "We need to leverage our platform to streamline operations and foster a comprehensive, robust ecosystem.";
    const result = scoreParagraph(paragraph);
    expect(result.count).toBeGreaterThanOrEqual(3);
    expect(result.action).toBe("REWRITE_PARAGRAPH");
  });

  it("always scrubs a reveal bridge regardless of density count", () => {
    const paragraph = "Here's what nobody tells you about revenue cycle.";
    const result = scoreParagraph(paragraph, {
      reveal_bridge: /here'?s (what|how|why|the thing)\b/gi,
    });
    expect(result.action).toBe("REPLACE");
  });
});

describe("emDashExcess", () => {
  it("allows the floor of 1 em dash in a short post", () => {
    // Cap floors to 1 regardless of word count; exactly 1 em dash is within it.
    const singleDash = "A short post with exactly one em dash — right here in the middle.";
    expect(emDashExcess(singleDash)).toBe(0);
  });

  it("flags dashes over the ~1/100-word cap", () => {
    const words = Array.from({ length: 50 }, (_, i) => `word${i}`).join(" ");
    const text = `${words} — one — two — three — four dashes in fifty words`;
    expect(emDashExcess(text)).toBeGreaterThan(0);
  });
});

describe("fragmentCount", () => {
  it("counts standalone sentences under 4 words", () => {
    const text = "Still. Mostly true. This changes everything about how we think.";
    expect(fragmentCount(text)).toBeGreaterThanOrEqual(2);
  });
});

describe("detectTriads", () => {
  it("marks an all-abstract triad with no receipt as hollow", () => {
    const triads = detectTriads("We deliver growth, impact, and value for every customer.");
    expect(triads.some((t) => t.isHollow)).toBe(true);
  });

  it("does not mark a concrete triad with proper nouns as hollow", () => {
    const triads = detectTriads("Stripe invoices, Vercel logs, and GitHub alerts all fired.");
    expect(triads.every((t) => !t.isHollow)).toBe(true);
  });
});

describe("auditHumanizedText", () => {
  it("passes clean, human-sounding prose", () => {
    const text = `Six years ago I watched a billing manager keep a denial log in a spiral notebook.

Not because she didn't have software. She had four systems. The notebook existed because none of them talked to each other.

What's the handoff in your workflow that nobody fully trusts?`;
    const result = auditHumanizedText(text);
    expect(result.verdict).not.toBe("fail");
    expect(result.forensicHits).toHaveLength(0);
  });

  it("fails on forensic model-leakage patterns regardless of everything else", () => {
    const text = "Great point about this topic oaicite turn1search3 attached_file reference.";
    const result = auditHumanizedText(text);
    expect(result.verdict).toBe("fail");
    expect(result.blockers.length).toBeGreaterThan(0);
  });

  it("fails a paragraph dense with AI-vocabulary markers", () => {
    const text =
      "We need to leverage our platform to streamline operations and foster a comprehensive, robust, holistic ecosystem that empowers every stakeholder.";
    const result = auditHumanizedText(text);
    expect(result.verdict).toBe("fail");
  });
});
