import { describe, expect, it } from "vitest";
import { evaluateGovernanceFlags, needsReview, computeReviewSlaDueAt } from "@/domain/governance";

describe("evaluateGovernanceFlags", () => {
  it("flags a cleared customer name mention for sign-off, per governance.md", () => {
    const flags = evaluateGovernanceFlags({
      text: "Radiology Partners told us this cut their denial rate in half.",
      clearedCustomerNames: ["Radiology Partners"],
      phiCheckRequired: false,
    });
    expect(flags).toContain("customer_name_mentioned");
  });

  it("does not flag ordinary content with no risk markers", () => {
    const flags = evaluateGovernanceFlags({
      text: "The gap between systems is where money disappears.",
      clearedCustomerNames: ["Radiology Partners"],
      phiCheckRequired: true,
    });
    expect(flags).toEqual([]);
  });

  it("flags possible PHI only when the special check is enabled", () => {
    const text = "We reviewed a medical record during the demo.";
    expect(
      evaluateGovernanceFlags({ text, clearedCustomerNames: [], phiCheckRequired: true }),
    ).toContain("possible_phi");
    expect(
      evaluateGovernanceFlags({ text, clearedCustomerNames: [], phiCheckRequired: false }),
    ).not.toContain("possible_phi");
  });

  it("flags unverified reimbursement guarantees", () => {
    const flags = evaluateGovernanceFlags({
      text: "Our platform guarantees your claims are never denied.",
      clearedCustomerNames: [],
      phiCheckRequired: false,
    });
    expect(flags).toContain("unverified_claim");
  });
});

describe("needsReview", () => {
  it("self_approve tier never needs review, even with flags", () => {
    expect(
      needsReview({ reviewTier: "self_approve", flags: ["possible_phi"] }),
    ).toBe(false);
  });

  it("standard tier needs review only when flags are present", () => {
    expect(needsReview({ reviewTier: "standard", flags: [] })).toBe(false);
    expect(needsReview({ reviewTier: "standard", flags: ["unverified_claim"] })).toBe(true);
  });
});

describe("computeReviewSlaDueAt", () => {
  it("adds the configured SLA hours", () => {
    const createdAt = new Date("2026-01-01T00:00:00Z");
    const due = computeReviewSlaDueAt(createdAt, 4);
    expect(due.toISOString()).toBe("2026-01-01T04:00:00.000Z");
  });
});
