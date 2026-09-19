import { describe, expect, it } from "vitest";
import {
  advanceStage,
  canAdvanceToConnect,
  evaluateHandoffTriggers,
  shouldAutoRetire,
} from "@/domain/ladder";

describe("advanceStage", () => {
  it("refuses to advance without evidence", () => {
    expect(() =>
      advanceStage({ stageHistory: [], toStage: "connect", evidence: "" }),
    ).toThrow(/without evidence/);
  });

  it("appends a stage transition with evidence and timestamp", () => {
    const history = advanceStage({
      stageHistory: [],
      toStage: "follow",
      evidence: "Added to roster, followed",
    });
    expect(history).toHaveLength(1);
    expect(history[0].stage).toBe("follow");
    expect(new Date(history[0].at).getTime()).not.toBeNaN();
  });
});

describe("canAdvanceToConnect", () => {
  it("blocks a target stuck before 'recognized'", () => {
    const result = canAdvanceToConnect({
      currentStage: "warm_up",
      stageHistory: [],
      daysSinceFollow: 10,
      minDaysBeforeInvite: 7,
      requireStage3Signal: true,
    });
    expect(result.allowed).toBe(false);
  });

  it("hard-gates on missing stage-3 evidence per prompt-contracts.md §4", () => {
    const result = canAdvanceToConnect({
      currentStage: "recognized",
      stageHistory: [{ stage: "recognized", at: new Date().toISOString(), evidence: "" }],
      daysSinceFollow: 10,
      minDaysBeforeInvite: 7,
      requireStage3Signal: true,
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/no recorded evidence/i);
  });

  it("blocks when dwell time hasn't elapsed even with evidence", () => {
    const result = canAdvanceToConnect({
      currentStage: "recognized",
      stageHistory: [
        { stage: "recognized", at: new Date().toISOString(), evidence: "replied to comment" },
      ],
      daysSinceFollow: 2,
      minDaysBeforeInvite: 7,
      requireStage3Signal: true,
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/minimum is 7/);
  });

  it("allows connect once stage-3 evidence and dwell time are both satisfied", () => {
    const result = canAdvanceToConnect({
      currentStage: "recognized",
      stageHistory: [
        { stage: "recognized", at: new Date().toISOString(), evidence: "replied twice" },
      ],
      daysSinceFollow: 9,
      minDaysBeforeInvite: 7,
      requireStage3Signal: true,
    });
    expect(result.allowed).toBe(true);
  });
});

describe("shouldAutoRetire", () => {
  it("does not retire a target with no touches yet", () => {
    expect(shouldAutoRetire({ lastTouchAt: null, autoRetireDays: 60 })).toBe(false);
  });

  it("retires after the configured number of days with no touch", () => {
    const sixtyOneDaysAgo = new Date(Date.now() - 61 * 24 * 60 * 60 * 1000);
    expect(shouldAutoRetire({ lastTouchAt: sixtyOneDaysAgo, autoRetireDays: 60 })).toBe(true);
  });

  it("does not retire before the threshold", () => {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    expect(shouldAutoRetire({ lastTouchAt: tenDaysAgo, autoRetireDays: 60 })).toBe(false);
  });
});

describe("evaluateHandoffTriggers", () => {
  it("fires on asking what we do", () => {
    const result = evaluateHandoffTriggers({
      askedWhatWeDo: true,
      productAdjacentEngagements: 0,
      mentionedOurProblemInOwnWords: false,
      repeatedProfileViewsAfterExchange: false,
    });
    expect(result.shouldHandoff).toBe(true);
    expect(result.triggers).toContain("asked_what_we_do");
  });

  it("does not fire under the product-adjacent-engagement threshold", () => {
    const result = evaluateHandoffTriggers({
      askedWhatWeDo: false,
      productAdjacentEngagements: 2,
      mentionedOurProblemInOwnWords: false,
      repeatedProfileViewsAfterExchange: false,
    });
    expect(result.shouldHandoff).toBe(false);
  });

  it("fires at exactly three product-adjacent engagements", () => {
    const result = evaluateHandoffTriggers({
      askedWhatWeDo: false,
      productAdjacentEngagements: 3,
      mentionedOurProblemInOwnWords: false,
      repeatedProfileViewsAfterExchange: false,
    });
    expect(result.shouldHandoff).toBe(true);
  });
});
