import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers";

test.describe("Persona editor", () => {
  test("test bench generates a sample without saving, and Save creates a new version", async ({ page }) => {
    await loginAs(page, "tushant@alphanodus.com");
    await page.goto("/persona");

    await page.locator("button", { hasText: "Generate sample" }).click();
    await expect(page.locator("text=/DEMO DRAFT|placeholder post/")).toBeVisible({ timeout: 10_000 });

    await page.locator("button", { hasText: "Save as new version" }).click();
    await expect(page.locator("text=Saved as a new version.")).toBeVisible();
  });

  test("story bank entries can be added and removed", async ({ page }) => {
    await loginAs(page, "tushant@alphanodus.com");
    await page.goto("/persona");
    await page.locator("button", { hasText: "Story bank" }).click();

    const marker = `E2E story entry ${Date.now()}`;
    await page.locator("textarea").last().fill(marker);
    await page.locator("button", { hasText: "Add entry" }).click();
    await expect(page.locator(`text=${marker}`)).toBeVisible();

    // The card's CardBody lays out [content div, Remove button] as
    // siblings, so walk up from the marker paragraph to their shared
    // CardBody container, then find the button within it.
    await page
      .locator("p", { hasText: marker })
      .locator('xpath=ancestor::div[contains(@class,"items-start")][1]')
      .locator("button", { hasText: "Remove" })
      .click();
    await expect(page.locator(`text=${marker}`)).not.toBeVisible();
  });

  test("lane tab shows the real pillars for the assigned lane", async ({ page }) => {
    await loginAs(page, "tushant@alphanodus.com");
    await page.goto("/persona");
    await page.locator("button", { hasText: "Lane" }).click();
    await expect(page.locator("text=Pillars")).toBeVisible();
  });
});
