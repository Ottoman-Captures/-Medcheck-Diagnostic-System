import { expect, test } from "@playwright/test";
import path from "path";

test("AI Coach supports file upload and PDF report download", async ({ page }) => {
  const email = `test-analysis-${Date.now()}@medcheck.system`;

  // 1. Sign up
  await page.goto("/signup");
  await page.getByLabel("Name").fill("Alex Rivera");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("Password123!");
  await page.getByRole("button", { name: /Sign up/i }).click();

  // 2. Complete onboarding (automatic redirect to dashboard)
  await page.waitForURL("**/onboarding");
  await page.getByRole("button", { name: /Continue/i }).click(); // step 1
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: /Continue/i }).click(); // step 2
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: /Continue/i }).click(); // step 3
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: /Continue/i }).click(); // step 4
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: /Generate plan/i }).click(); // step 5

  // 3. Wait for redirect to dashboard
  await page.waitForURL("**/dashboard");
  await expect(page.getByRole("heading", { name: "Health overview" })).toBeVisible();

  // 4. Navigate to AI Coach
  await page.goto("/coach");
  await expect(page.getByRole("heading", { name: "Medcheck Diagnostic Coach" })).toBeVisible();

  // 5. Attach file
  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.locator("label[for='coach-file-upload']").click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(__dirname, "../../test_report.png"));

  // Verify attachment pill shows up
  await expect(page.locator("text=test_report.png")).toBeVisible();

  // 6. Enter query and send
  await page.getByLabel("Message to AI health coach").fill("Analyze this report and summarize it.");
  await page.getByRole("button", { name: /Send/i }).click();

  // 7. Wait for assistant reply and verify the Download PDF button is visible
  const downloadButton = page.getByRole("button", { name: /Download Report PDF/i });
  await expect(downloadButton).toBeVisible({ timeout: 15000 });

  // 8. Trigger PDF download
  const downloadPromise = page.waitForEvent("download");
  await downloadButton.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toContain("medcheck-diagnostic-system-analysis-");
  expect(download.suggestedFilename()).toContain(".pdf");
});
