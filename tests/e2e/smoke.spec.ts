import { expect, test } from "@playwright/test";

test("home page presents Aura Health cockpit", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Aura Health" })).toBeVisible();
  await expect(page.getByText("Daily Steps")).toBeVisible();
  await expect(page.getByRole("link", { name: /Open dashboard/i })).toBeVisible();
});
