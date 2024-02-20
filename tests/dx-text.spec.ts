import { expect, test } from "@playwright/test";

test("dx-text custom element renders with correct styles", async ({ page }) => {
  await page.goto("http://localhost:3000/dx-text.html");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector("dx-text");
  const el = await page.$("dx-text");
  const computedStyles = await page.evaluate((element) => {
    if (!element) return {} as CSSStyleDeclaration;
    return window.getComputedStyle(element);
  }, el);
  expect(computedStyles.fontSize).toBe("13px");
});
