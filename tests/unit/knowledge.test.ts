import { describe, expect, it } from "vitest";
import { buildKnowledgeContext, CLIENT_STORIES, NAMEABLE_CLIENTS, NEVER_IN_WRITING, SCOPE_BOUNDARIES } from "@/lib/knowledge";

describe("buildKnowledgeContext", () => {
  it("includes the founding story and product positioning", () => {
    const ctx = buildKnowledgeContext();
    expect(ctx).toContain("60-65%");
    expect(ctx).toContain("autonomous AI front office");
  });

  it("includes the hard scope boundaries", () => {
    const ctx = buildKnowledgeContext();
    for (const boundary of SCOPE_BOUNDARIES) {
      expect(ctx).toContain(boundary.split(" -- ")[0]);
    }
  });

  it("includes the never-say list", () => {
    const ctx = buildKnowledgeContext();
    expect(ctx).toContain("replaces your RIS");
  });

  it("lists real client stories, never invented ones", () => {
    const ctx = buildKnowledgeContext();
    for (const client of CLIENT_STORIES) {
      expect(ctx).toContain(client.name);
    }
  });
});

describe("client story data integrity", () => {
  it("every quoted client story has at least one real quote", () => {
    for (const client of CLIENT_STORIES) {
      if (client.hasPublicQuote) {
        expect(client.quotes && client.quotes.length).toBeGreaterThan(0);
      }
    }
  });

  it("nameable clients don't overlap with quoted client stories (no duplicate source of truth)", () => {
    const quotedNames = new Set(CLIENT_STORIES.map((c) => c.name));
    for (const name of NAMEABLE_CLIENTS) {
      expect(quotedNames.has(name)).toBe(false);
    }
  });
});

describe("NEVER_IN_WRITING", () => {
  it("includes the single most important banned phrase", () => {
    expect(NEVER_IN_WRITING).toContain("replaces your RIS");
  });
});
