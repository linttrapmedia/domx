import { test } from "@playwright/test";
import { chromium } from "playwright";

(async () => {
  // Launch the browser
  const browser = await chromium.launch();
  // Create a new page
  const page = await browser.newPage();

  // Set the HTML content of the page
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Test Page</title>
      </head>
      <body>
        <h1>Hello, Playwright!</h1>
        <div id="test-div">Test Content</div>
      </body>
    </html>
  `);

  // Perform your tests
  const headingText = await page.textContent("h1");
  console.log("Heading text:", headingText); // Should output "Hello, Playwright!"

  const divContent = await page.textContent("#test-div");
  console.log("Div content:", divContent); // Should output "Test Content"

  // Close the browser
  await browser.close();
})();

test("has title", async ({ page }) => {
  // await page.goto("https://playwright.dev/");
  // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/Playwright/);
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
