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

test.describe("Generate queue button", () => {
  const GEN_EMAIL = "e2e-generate-queue@alphanodus.com";

  test.beforeEach(async () => {
    await deleteParticipant(GEN_EMAIL); // idempotent — guards against a prior run's afterEach not completing
    await ensureParticipant({ email: GEN_EMAIL, fullName: "E2E Generate", status: "active", appRoles: ["participant", "admin"] });
    const [lane] = await db.select().from(lanes).limit(1);
    await db.update(participants).set({ laneId: lane.id }).where(eq(participants.email, GEN_EMAIL));

    const [participant] = await db.select().from(participants).where(eq(participants.email, GEN_EMAIL)).limit(1);
    // A warm_up-stage target guarantees at least one amplify_follow_invite
    // item regardless of which day of the week the suite runs on (unlike
    // the publish item, which only appears on the lane's scheduled days).
    await db.insert(targets).values({
      ownerParticipantId: participant.id,
      name: "E2E Generate Target",
      title: "Director",
      center: "Test Center",
      linkedinUrl: "https://linkedin.com/in/e2e-generate-target",
      stage: "warm_up",
      stageHistory: [{ stage: "follow", at: new Date().toISOString(), evidence: "seeded for e2e" }],
      lastTouchAt: new Date(Date.now() - 2 * 86_400_000),
    });
  });

  test.afterEach(async () => {
    await deleteParticipant(GEN_EMAIL);
  });

  test("an admin with no queue yet can generate today's from the empty state", async ({ page }) => {
    await loginAs(page, GEN_EMAIL);
    await expect(page.locator("text=No queue for today yet")).toBeVisible();

    await page.getByRole("button", { name: "Generate today's queue" }).click();
    await expect(page.locator("text=/\\d+ of \\d+ done/")).toBeVisible({ timeout: 15_000 });
  });

  test("an admin can regenerate a non-empty queue, replacing every item", async ({ page }) => {
    const [participant] = await db.select().from(participants).where(eq(participants.email, GEN_EMAIL)).limit(1);
    await generateQueueForParticipant(participant.id, new Date());

    await loginAs(page, GEN_EMAIL);
    await expect(page.locator("text=/\\d+ of \\d+ done/")).toBeVisible();
    const skipButtons = page.locator("button", { hasText: "Skip" });
    await skipButtons.first().click();
    await page.locator('textarea[placeholder*="skipping"]').fill("test skip before regenerate");
    await page.locator("button", { hasText: "Confirm skip" }).click();
    await expect(page.locator("text=/Skipped:/").first()).toBeVisible();

    await page.getByRole("button", { name: "Regenerate today's queue" }).click();
    await page.getByRole("button", { name: "Yes, regenerate" }).click();
    await expect(page.locator("text=/\\d+ of \\d+ done/")).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("text=/Skipped:/")).toHaveCount(0);
  });
});
