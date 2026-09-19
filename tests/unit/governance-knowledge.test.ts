import { describe, expect, it } from "vitest";
import { evaluateGovernanceFlags } from "@/domain/governance";

describe("evaluateGovernanceFlags — knowledge-base rules", () => {
  it("flags the banned 'replaces your RIS' claim", () => {
    const flags = evaluateGovernanceFlags({
      text: "Gravity basically replaces your RIS at this point.",
      clearedCustomerNames: [],
      phiCheckRequired: false,
    });
    expect(flags).toContain("banned_claim");
  });

  it("flags 'revolutionary' as a banned claim", () => {
    const flags = evaluateGovernanceFlags({
      text: "This is a truly revolutionary approach to imaging.",
      clearedCustomerNames: [],
      phiCheckRequired: false,
    });
    expect(flags).toContain("banned_claim");
  });

  it("flags an unsourced statistic", () => {
    const flags = evaluateGovernanceFlags({
      text: "Everyone knows 65% of denied claims are never reworked.",
      clearedCustomerNames: [],
      phiCheckRequired: false,
    });
    expect(flags).toContain("unsourced_statistic");
  });

  it("flags a security-certification mention for Shamit routing", () => {
    const flags = evaluateGovernanceFlags({
      text: "We're proud to be SOC 2 certified.",
      clearedCustomerNames: [],
      phiCheckRequired: false,
    });
    expect(flags).toContain("needs_shamit_routing");
  });

  it("flags a KLAS score claim for Shamit routing", () => {
    const flags = evaluateGovernanceFlags({
      text: "We're rated #1 in the latest KLAS score for imaging AI.",
      clearedCustomerNames: [],
      phiCheckRequired: false,
    });
    expect(flags).toContain("needs_shamit_routing");
  });

  it("does not flag the KLAS Spotlight Report mention on its own (that's safe)", () => {
    const flags = evaluateGovernanceFlags({
      text: "We were featured in a 2023 KLAS Spotlight Report on prior authorization.",
      clearedCustomerNames: [],
      phiCheckRequired: false,
    });
    expect(flags).not.toContain("needs_shamit_routing");
  });

  it("passes clean, accurate content with no flags", () => {
    const flags = evaluateGovernanceFlags({
      text: "Independent imaging centers run at 60-65% utilization while patients wait weeks -- the constraint is the front office, not the scanner.",
      clearedCustomerNames: [],
      phiCheckRequired: false,
    });
    expect(flags).toEqual([]);
  });
});
