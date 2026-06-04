import { expect, test } from "@playwright/test";

test("home page presents Medcheck Diagnostic System cockpit", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Medcheck Diagnostic System" })).toBeVisible();
  await expect(page.getByText("Daily Steps")).toBeVisible();
  await expect(page.getByRole("link", { name: /Open dashboard/i })).toBeVisible();
});
