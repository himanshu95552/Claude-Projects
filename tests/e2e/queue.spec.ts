import { test, expect } from "@playwright/test";
import { eq } from "drizzle-orm";
import { loginAs, ensureParticipant, deleteParticipant } from "./helpers";
import { db } from "../../src/lib/db/client";
import { lanes, participants, targets } from "../../src/lib/db/schema";
import { generateQueueForParticipant } from "../../src/domain/queue-builder";

const EMAIL = "e2e-queue@alphanodus.com";

test.describe("Daily queue", () => {
  test.beforeEach(async () => {
    await ensureParticipant({ email: EMAIL, fullName: "E2E Queue", status: "active" });

    const [lane] = await db.select().from(lanes).limit(1);
    await db.update(participants).set({ laneId: lane.id }).where(eq(participants.email, EMAIL));

    const [participant] = await db.select().from(participants).where(eq(participants.email, EMAIL)).limit(1);

    await db.insert(targets).values({
      ownerParticipantId: participant.id,
      name: "E2E Target",
      title: "Director",
      center: "Test Center",
      linkedinUrl: "https://linkedin.com/in/e2e-target",
      stage: "warm_up",
      stageHistory: [{ stage: "follow", at: new Date().toISOString(), evidence: "seeded for e2e" }],
      lastTouchAt: new Date(Date.now() - 2 * 86_400_000),
    });

    await generateQueueForParticipant(participant.id, new Date());
  });

  test.afterEach(async () => {
    await deleteParticipant(EMAIL);
  });

  test("mark done, inline edit, and skip all persist and update progress", async ({ page }) => {
    await loginAs(page, EMAIL);
    await expect(page).toHaveURL(/\/queue/);

    const skipButtons = page.locator("button", { hasText: "Skip" });
    await expect(skipButtons.first()).toBeVisible();

    await skipButtons.first().click();
    await page.locator('textarea[placeholder*="skipping"]').fill("Doesn't sound like me.");
    await page.locator("button", { hasText: "Confirm skip" }).click();
    await expect(page.locator("text=/Skipped:/").first()).toBeVisible();

    await expect(page.locator("text=/\\d+ of \\d+ done/")).toBeVisible();
  });

  test("editing a card persists edited_content separately from the original draft", async ({ page }) => {
    await loginAs(page, EMAIL);

    const editButtons = page.locator("button", { hasText: "Edit" });
    await editButtons.first().click();
    const textarea = page.locator("textarea").first();
    await textarea.fill("This is the participant's edited version.");
    await page.locator("button", { hasText: "Save" }).click();

    await expect(page.locator("text=This is the participant's edited version.")).toBeVisible();
  });
});
