import { test, expect } from "@playwright/test";
import { eq } from "drizzle-orm";
import { loginAs, ensureParticipant, deleteParticipant } from "./helpers";
import { db } from "../../src/lib/db/client";
import { lanes, participants, queueItems, queues } from "../../src/lib/db/schema";

const EMAIL = "e2e-calendar@alphanodus.com";

function todayMonthParam(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

test.describe("Content calendar", () => {
  test.beforeEach(async () => {
    await deleteParticipant(EMAIL); // idempotent — guards against a prior run's afterEach not completing
    await ensureParticipant({ email: EMAIL, fullName: "E2E Calendar", status: "active", appRoles: ["participant", "admin"] });

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
      content: "Calendar smoke-test post about ROI.",
      status: "done",
      actedAt: new Date(),
      metadata: { pillar: "ROI" },
    });
  });

  test.afterEach(async () => {
    await deleteParticipant(EMAIL);
  });

  test("shows today's publish item on the month grid, and the team toggle switches scope", async ({ page }) => {
    await loginAs(page, EMAIL);
    await page.goto("/calendar", { waitUntil: "networkidle" });

    await expect(page.locator("text=today").first()).toBeVisible();
    await expect(page.locator("text=Calendar smoke-test").first()).toBeVisible();

    await page.getByRole("link", { name: "Team calendar" }).click();
    await page.waitForURL(new RegExp(`scope=team`));
    await expect(page).toHaveURL(new RegExp(`month=${todayMonthParam()}&scope=team`));
  });
});
