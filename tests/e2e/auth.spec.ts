import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers";

test.describe("Authentication", () => {
  test("unauthenticated visitors are redirected to /login", async ({ page }) => {
    await page.goto("/queue");
    await expect(page).toHaveURL(/\/login/);
  });

  test("magic-link sign-in lands an active participant on /queue", async ({ page }) => {
    await loginAs(page, "tushant@alphanodus.com");
    await expect(page).toHaveURL(/\/queue/);
    await expect(page.locator("text=Hi Tushant")).toBeVisible();
  });

  test("an expired/invalid token redirects to /login with an error", async ({ page }) => {
    await page.goto("/api/auth/callback?token=not-a-real-token");
    await expect(page).toHaveURL(/\/login\?error=expired_link/);
  });

  test("signing out clears the session and blocks protected routes again", async ({ page }) => {
    await loginAs(page, "tushant@alphanodus.com");
    await expect(page).toHaveURL(/\/queue/);

    await page.locator("button", { hasText: "Sign out" }).click();
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/queue");
    await expect(page).toHaveURL(/\/login/);
  });
});
