import { test, expect } from "@playwright/test";
import { eq } from "drizzle-orm";
import { loginAs, ensureParticipant, deleteParticipant } from "./helpers";
import { db } from "../../src/lib/db/client";
import { lanes, participants, queueItems, queues } from "../../src/lib/db/schema";

const EMAIL = "e2e-regenerate@alphanodus.com";
const ORIGINAL_CONTENT =
  "Roughly a dozen handoffs happen between an imaging order arriving and the claim being paid.\nEach one is a place the claim can stall.";

test.describe("Mark & regenerate", () => {
  test.beforeEach(async () => {
    await deleteParticipant(EMAIL); // idempotent — guards against a prior run's afterEach not completing
    await ensureParticipant({ email: EMAIL, fullName: "E2E Regenerate", status: "active" });

    const [lane] = await db.select().from(lanes).limit(1);
    await db.update(participants).set({ laneId: lane.id }).where(eq(participants.email, EMAIL));
    const [participant] = await db.select().from(participants).where(eq(participants.email, EMAIL)).limit(1);

    const todayStr = new Date().toISOString().slice(0, 10);
    const [queue] = await db
      .insert(queues)
      .values({ participantId: participant.id, forDate: todayStr, totalCount: 1 })
      .returning();

    await db.insert(queueItems).values({
      queueId: queue.id,
      type: "publish",
      fulfillment: "api_publish",
      content: ORIGINAL_CONTENT,
      status: "pending",
      metadata: { pillar: "ROI" },
    });
  });

  test.afterEach(async () => {
    await deleteParticipant(EMAIL);
  });

  test("marking a line and regenerating replaces the content and logs revision history", async ({ page }) => {
    await loginAs(page, EMAIL);
    await expect(page).toHaveURL(/\/queue/);

    await page.locator("text=Mark & regenerate").first().click();

    // Mark the first segment (first line of the content).
    const firstSegment = page.locator("button", { hasText: "Roughly a dozen handoffs" }).first();
    await firstSegment.click();
    await expect(firstSegment).toHaveClass(/border-danger/);

    await page.locator('textarea[placeholder*="What\'s wrong"]').fill("Doesn't sound like me");
    await page.getByRole("button", { name: "Regenerate", exact: true }).click();

    await expect(page.locator("text=/\\[DEMO REGENERATED/").first()).toBeVisible();
    await expect(page.locator("text=Doesn't sound like me").first()).toBeVisible();

    // The original content should no longer be the displayed content.
    await expect(page.locator(`text=${ORIGINAL_CONTENT.split("\n")[0]}`)).not.toBeVisible();

    await page.locator("text=History").first().click();
    await expect(page.locator("text=original").first()).toBeVisible();
    await expect(page.locator("text=regenerated").first()).toBeVisible();
  });
});
