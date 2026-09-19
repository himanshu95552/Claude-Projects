import { test, expect } from "@playwright/test";
import { eq } from "drizzle-orm";
import { loginAs, ensureParticipant, deleteParticipant } from "./helpers";
import { db } from "../../src/lib/db/client";
import { lanes, participants, queueItems, queues } from "../../src/lib/db/schema";

const EMAIL = "e2e-analytics@alphanodus.com";

test.describe("Analytics dashboard", () => {
  test.beforeEach(async () => {
    await deleteParticipant(EMAIL); // idempotent — guards against a prior run's afterEach not completing
    await ensureParticipant({ email: EMAIL, fullName: "E2E Analytics", status: "active" });

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
      fulfillment: "manual_link",
      content: "A post about ROI.",
      status: "done",
      actedAt: new Date(),
      metadata: { pillar: "ROI" },
    });
  });

  test.afterEach(async () => {
    await deleteParticipant(EMAIL);
  });

  test("logging metrics on a posted item surfaces on the Analytics page", async ({ page }) => {
    await loginAs(page, EMAIL);
    await expect(page).toHaveURL(/\/queue/);

    await page.locator("text=Log metrics").first().click();
    await page.locator('input[type="number"]').nth(0).fill("1000"); // Impressions
    await page.locator('input[type="number"]').nth(1).fill("40"); // Reactions
    await page.locator('input[type="number"]').nth(2).fill("8"); // Comments
    await page.locator('input[type="number"]').nth(3).fill("5"); // Shares
    await page.locator('input[type="number"]').nth(4).fill("25"); // Saves

    await page.locator("button", { hasText: "Save metrics" }).click();
    await expect(page.locator("text=Saved — see the Analytics tab")).toBeVisible();

    await page.goto("/analytics", { waitUntil: "networkidle" });
    await expect(page.locator("text=Not enough logged metrics yet")).toBeVisible();
    await expect(page.locator("text=By platform").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "How this is scored" })).toBeVisible();
  });
});
