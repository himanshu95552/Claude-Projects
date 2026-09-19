import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildAuthorizationUrl, buildRedirectUri, generatePkcePair } from "@/lib/integrations/x/oauth";
import { publishXPost, splitIntoThread } from "@/lib/integrations/x/client";
import { connectionStatus } from "@/lib/integrations/x/account";
import { buildXPostPrompt } from "@/lib/integrations/claude/prompts";
import { generateXPost } from "@/lib/generation/generate";
import type { XPostGenerationInput } from "@/lib/generation/contracts";
import type { PlatformAccount } from "@/lib/db/schema";

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

function account(overrides: Partial<PlatformAccount> = {}): PlatformAccount {
  return {
    id: crypto.randomUUID(),
    participantId: crypto.randomUUID(),
    platform: "x",
    handle: "@tushant",
    platformUserId: "123",
    encryptedAccessToken: "ciphertext",
    encryptedRefreshToken: "ciphertext",
    scopes: [],
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    refreshExpiresAt: null,
    status: "connected",
    connectedAt: new Date(),
    lastRefreshedAt: null,
    revokedAt: null,
    ...overrides,
  };
}

describe("generatePkcePair", () => {
  it("produces a challenge that is the SHA-256(base64url) of the verifier — RFC 7636 S256", () => {
    const { verifier, challenge } = generatePkcePair();
    const expected = createHash("sha256").update(verifier).digest("base64url");
    expect(challenge).toBe(expected);
  });

  it("generates a different pair on every call", () => {
    const a = generatePkcePair();
    const b = generatePkcePair();
    expect(a.verifier).not.toBe(b.verifier);
  });
});

describe("buildAuthorizationUrl / buildRedirectUri", () => {
  it("includes state, code_challenge, S256 method, and the full posting scope set", () => {
    const url = new URL(buildAuthorizationUrl({ state: "abc123", codeChallenge: "xyz" }));
    expect(url.searchParams.get("state")).toBe("abc123");
    expect(url.searchParams.get("code_challenge")).toBe("xyz");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("scope")).toContain("tweet.write");
    expect(url.searchParams.get("scope")).toContain("offline.access");
  });

  it("points the redirect_uri at the X-specific callback route", () => {
    expect(buildRedirectUri()).toMatch(/\/api\/oauth\/x\/callback$/);
  });
});

describe("publishXPost", () => {
  it("rejects text over the 280-char limit before making any network call", async () => {
    const tooLong = "a".repeat(281);
    await expect(publishXPost({ accessToken: "t", text: tooLong })).rejects.toThrow(/280-char limit/);
  });
});

describe("splitIntoThread", () => {
  it("leaves short text as a single untouched post (no numbering)", () => {
    const result = splitIntoThread("A short post.");
    expect(result).toEqual(["A short post."]);
  });

  it("splits long text on sentence boundaries and numbers each post", () => {
    const longText = Array.from({ length: 20 }, (_, i) => `This is sentence number ${i + 1} of the thread.`).join(" ");
    const chunks = splitIntoThread(longText);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(280);
    }
    expect(chunks[0]).toMatch(/\(1\/\d+\)$/);
    expect(chunks[chunks.length - 1]).toMatch(new RegExp(`\\(${chunks.length}/${chunks.length}\\)$`));
  });

  it("respects a custom maxLen", () => {
    const text = "One. Two. Three. Four. Five. Six. Seven. Eight.";
    const chunks = splitIntoThread(text, 20);
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(20);
    }
  });
});

describe("buildXPostPrompt", () => {
  it("carries the 280-char hard limit when threading is disallowed", () => {
    const input: XPostGenerationInput = { ...baseEnvelope, pillar: "ROI", allowThread: false };
    const { system } = buildXPostPrompt(input);
    expect(system).toContain("Hard limit: 280 characters");
  });

  it("allows a thread and references the source material when threading is allowed", () => {
    const input: XPostGenerationInput = {
      ...baseEnvelope,
      pillar: "ROI",
      allowThread: true,
      sourceMaterial: "The LinkedIn draft this repurposes.",
    };
    const { system } = buildXPostPrompt(input);
    expect(system).toContain("thread");
    expect(system).toContain("The LinkedIn draft this repurposes.");
  });
});

describe("generateXPost (demo mode)", () => {
  it("returns demo-labeled text for the given pillar", async () => {
    const input: XPostGenerationInput = { ...baseEnvelope, pillar: "ROI", allowThread: true };
    const { output, meta } = await generateXPost(input);
    expect(meta.isDemoContent).toBe(true);
    expect(output.text).toContain("[DEMO]");
    expect(output.pillar).toBe("ROI");
    expect(output.charCount).toBe(output.text.length);
  });
});

describe("connectionStatus", () => {
  it("is not_connected when there's no account", () => {
    expect(connectionStatus(null)).toBe("not_connected");
  });

  it("is not_connected when the account was revoked", () => {
    expect(connectionStatus(account({ revokedAt: new Date() }))).toBe("not_connected");
  });

  it("is connected when expiresAt is in the future", () => {
    expect(connectionStatus(account({ expiresAt: new Date(Date.now() + 60_000) }))).toBe("connected");
  });

  it("is expired when expiresAt is in the past", () => {
    expect(connectionStatus(account({ expiresAt: new Date(Date.now() - 60_000) }))).toBe("expired");
  });

  it("is connected when there's no expiry set at all", () => {
    expect(connectionStatus(account({ expiresAt: null }))).toBe("connected");
  });
});
