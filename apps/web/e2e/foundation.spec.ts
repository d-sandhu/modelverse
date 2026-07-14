import { expect, test } from "@playwright/test";

test("boots the platform shell with one working renderer and no worlds", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByTestId("foundation-status")).toContainText(
    "Platform shell ready",
  );
  await expect(page.getByTestId("foundation-status")).toContainText(
    "No worlds are registered",
  );
  await expect(page.getByTestId("renderer-canvas")).toBeVisible();

  await page.keyboard.press("Backquote");
  await expect(page.getByTestId("debug-overlay")).toContainText("Active world: none");
  await expect(page.getByTestId("debug-overlay")).toContainText("Loaded: none");
  await expect(page.getByTestId("debug-overlay")).toContainText("Portal: dormant");
  expect(pageErrors).toEqual([]);
});

test("reserved controls and manual quality selection work", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("KeyM");

  await page.getByLabel("Graphics quality").selectOption("low");
  await page.keyboard.press("Backquote");
  await expect(page.getByTestId("debug-overlay")).toContainText("Quality: low");
  await expect(page.getByTestId("debug-overlay")).toContainText("Audio: muted");
  await expect(page.getByTestId("debug-overlay")).toContainText(
    /API: (offline|available)/,
  );
});

test("the empty shell remains usable at a mobile viewport", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "mobile project only");
  await page.goto("/");
  await expect(page.getByTestId("foundation-status")).toBeVisible();
  await expect(page.getByTestId("renderer-canvas")).toBeVisible();
  await page.keyboard.press("Backquote");
  await expect(page.getByTestId("debug-overlay")).toContainText("Input: touch");
});
