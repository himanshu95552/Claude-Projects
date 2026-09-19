import { describe, expect, it } from "vitest";
import { checkCommentAntiPatterns } from "@/lib/generation/comments";
import {
  filterComment,
  findTopCommentUrn,
  normalizeCommentUrn,
  planSweepPublishOrder,
  type CommentNode,
} from "@/lib/generation/replies";

describe("checkCommentAntiPatterns", () => {
  it("refuses generic praise", () => {
    expect(checkCommentAntiPatterns("Great post!").passed).toBe(false);
  });

  it("refuses bare agreement", () => {
    expect(checkCommentAntiPatterns("100%").passed).toBe(false);
  });

  it("refuses text with a hashtag", () => {
    expect(checkCommentAntiPatterns("Interesting point about the payer landscape here today #healthcare").passed).toBe(false);
  });

  it("passes a substantive comment with a number and a question", () => {
    const text =
      "The scheduling cost gets underestimated — we saw a 30% jump in soft-held slots last quarter. Do you hold or release?";
    expect(checkCommentAntiPatterns(text).passed).toBe(true);
  });
});

describe("findTopCommentUrn", () => {
  const tree: CommentNode[] = [
    { id: "111", text: "top", replies: [{ id: "222", text: "reply B", replies: [{ id: "333", text: "reply C" }] }] },
  ];

  it("resolves a top-level comment to its own URN", () => {
    expect(findTopCommentUrn("activity:P", "111", tree)).toBe("urn:li:comment:(activity:P,111)");
  });

  it("resolves a 2nd-level reply to the TOP comment's URN, never an intermediate one", () => {
    expect(findTopCommentUrn("activity:P", "222", tree)).toBe("urn:li:comment:(activity:P,111)");
  });

  it("throws for an unknown comment id", () => {
    expect(() => findTopCommentUrn("activity:P", "999", tree)).toThrow();
  });
});

describe("normalizeCommentUrn", () => {
  it("converts short form to long form", () => {
    expect(normalizeCommentUrn("urn:li:comment:(activity:P,111)")).toBe(
      "urn:li:comment:(urn:li:activity:P,111)",
    );
  });

  it("leaves an already-long-form URN untouched", () => {
    const longForm = "urn:li:comment:(urn:li:activity:P,111)";
    expect(normalizeCommentUrn(longForm)).toBe(longForm);
  });
});

describe("filterComment", () => {
  it("drops generic praise", () => {
    const result = filterComment({
      comment: { id: "1", text: "great post!" },
      seenNormalizedTexts: new Set(),
    });
    expect(result.keep).toBe(false);
    expect(result.reason).toBe("generic_praise");
  });

  it("keeps a short comment with a specific reference despite low word count", () => {
    const result = filterComment({
      comment: { id: "1", text: "This happened to us in March too?" },
      seenNormalizedTexts: new Set(),
    });
    expect(result.keep).toBe(true);
  });

  it("drops the commenter's own comments", () => {
    const result = filterComment({
      comment: { id: "1", text: "A perfectly substantive comment with real content in it.", authorProfileUrl: "me" },
      ownProfileUrl: "me",
      seenNormalizedTexts: new Set(),
    });
    expect(result.reason).toBe("own_comment");
  });

  it("drops a link-only spam comment", () => {
    const result = filterComment({
      comment: { id: "1", text: "https://example.com/spam" },
      seenNormalizedTexts: new Set(),
    });
    expect(result.reason).toBe("spam");
  });

  it("drops duplicate/near-duplicate template phrases", () => {
    const seen = new Set(["this happened to us too, exact same story honestly"]);
    const result = filterComment({
      comment: { id: "1", text: "This happened to us too, exact same story honestly" },
      seenNormalizedTexts: seen,
    });
    expect(result.reason).toBe("duplicate");
  });
});

describe("planSweepPublishOrder", () => {
  it("keeps a small batch as one group", () => {
    expect(planSweepPublishOrder([1, 2, 3])).toEqual([[1, 2, 3]]);
  });

  it("splits a large sweep into batches of at most 10", () => {
    const items = Array.from({ length: 23 }, (_, i) => i);
    const batches = planSweepPublishOrder(items);
    expect(batches).toHaveLength(3);
    expect(batches[0]).toHaveLength(10);
    expect(batches[2]).toHaveLength(3);
  });
});
