import { test, expect } from "@playwright/test";
import { loginAs, ensureParticipant, deleteParticipant } from "./helpers";

const EMAIL = "e2e-onboarding@alphanodus.com";

test.describe("Onboarding", () => {
  test.beforeEach(async () => {
    await ensureParticipant({ email: EMAIL, fullName: "E2E Onboarding", status: "onboarding" });
  });
  test.afterEach(async () => {
    await deleteParticipant(EMAIL);
  });

  test("consent is a hard gate and the full wizard completes to an active queue", async ({ page }) => {
    await loginAs(page, EMAIL);
    await expect(page).toHaveURL(/\/onboarding/);

    // Step 1: identity.
    await page.locator("button", { hasText: "Continue" }).click();

    // Step 2: consent — blocked without checking the box.
    await page.locator("button", { hasText: "Continue" }).click();
    await expect(page.locator("text=Consent is required")).toBeVisible();
    await page.locator('input[type="checkbox"]').check();
    await page.locator("button", { hasText: "Continue" }).click();

    // Step 3: lane.
    const firstLane = page.locator('label[class*="border"]').first();
    await firstLane.click();
    await page.locator("button", { hasText: "Continue" }).click();

    // Step 4: voice.
    await page.locator("textarea").first().fill("I say what I mean and keep it short.\n\nNo fluff, ever.");
    await page.locator("button", { hasText: "Continue" }).click();

    // Step 5: cadence.
    await page.locator("button", { hasText: "Continue" }).click();

    // Step 6: schedule.
    await page.locator("button", { hasText: "Continue" }).click();

    // Step 7: tour -> finish.
    await page.locator("button", { hasText: "Start using the app" }).click();

    await expect(page).toHaveURL(/\/queue/);
  });
});
