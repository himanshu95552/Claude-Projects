import { test, expect } from "@playwright/test";
import { eq } from "drizzle-orm";
import { loginAs, ensureParticipant, deleteParticipant } from "./helpers";
import { db } from "../../src/lib/db/client";
import { lanes, participants, queueItems, queues } from "../../src/lib/db/schema";

const EMAIL = "e2e-creative@alphanodus.com";

test.describe("Creative brief (banner) generation", () => {
  test.beforeEach(async () => {
    await deleteParticipant(EMAIL); // idempotent — guards against a prior run's afterEach not completing
    await ensureParticipant({ email: EMAIL, fullName: "E2E Creative", status: "active" });

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
      content: "Roughly a dozen handoffs happen between an imaging order arriving and the claim being paid.",
      status: "pending",
      metadata: { pillar: "ROI" },
    });
  });

  test.afterEach(async () => {
    await deleteParticipant(EMAIL);
  });

  test("generates a static banner brief and shows dimensions, headline copy, and brand compliance notes", async ({ page }) => {
    await loginAs(page, EMAIL);
    await expect(page).toHaveURL(/\/queue/);

    await page.locator("text=Generate banner").first().click();
    await page.getByRole("button", { name: "Generate", exact: true }).click();

    await expect(page.locator("text=/\\d+×\\d+px/").first()).toBeVisible();
    await expect(page.locator("text=/\\[DEMO\\]/").first()).toBeVisible();

    await page.locator("text=Brand compliance").click();
    await expect(page.locator("text=/\\[DEMO\\] Brand compliance/")).toBeVisible();
  });

  test("switching to carousel and regenerating produces multiple slides", async ({ page }) => {
    await loginAs(page, EMAIL);

    await page.locator("text=Generate banner").first().click();
    await page.locator("button", { hasText: "Carousel" }).first().click();
    await page.getByRole("button", { name: "Generate", exact: true }).click();

    await expect(page.locator("text=/\\d+ slides/")).toBeVisible();
    await expect(page.locator("text=Slide 1").first()).toBeVisible();

    // Regenerate produces a fresh isolated brief (new row), button label flips to "Regenerate".
    const regenerateBtn = page.getByRole("button", { name: "Regenerate", exact: true });
    await expect(regenerateBtn).toBeVisible();
    await regenerateBtn.click();
    // Wait for the in-flight request to settle (busy label reverts) before the
    // test ends — otherwise afterEach's cleanup can race a still-open POST.
    await expect(page.getByRole("button", { name: "Regenerating…" })).toHaveCount(0);
    await expect(page.locator("text=/\\d+ slides/").first()).toBeVisible();
  });
});
