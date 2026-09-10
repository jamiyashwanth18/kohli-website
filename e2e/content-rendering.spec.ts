// AC-047/AC-048: the screens must render values that come from the content
// snapshot (public/assets/*.json), not from values baked into component
// source, and changing a content fixture must change what is rendered
// without any change to component code.
//
// Against the pre-change hardcoded screens these fixtures happen to match
// (test 1 passes anyway) but the interception test (test 2 and 4) can only
// pass once a screen actually fetches `/assets/*.json` at runtime, per
// US-015-1/US-015-2.
import { expect, test } from "@playwright/test";

test.describe("content-driven rendering (AC-047/AC-048)", () => {
  test("home screen renders values taken from stats.json and achievements.json", async ({ page }) => {
    await page.goto("/");

    // stats.json: ODI is the default active format tab on Home.
    await expect(page.locator("body")).toContainText("302"); // ODI matches
    await expect(page.locator("body")).toContainText("57.88"); // ODI average

    // achievements.json: a description unique to one entry.
    await expect(page.locator("body")).toContainText("ICC Cricket World Cup");
  });

  test("modifying stats.json changes the home scoreboard without touching component code", async ({ page }) => {
    await page.route("**/assets/stats.json", async (route) => {
      const response = await route.fetch();
      const original = await response.json();
      const modified = original.map((entry: { format: string; matches: number }) =>
        entry.format === "ODI" ? { ...entry, matches: 40404 } : entry,
      );
      await route.fulfill({ response, json: modified });
    });

    await page.goto("/");

    await expect(page.locator("body")).toContainText("40404");
    await expect(page.locator("body")).not.toContainText("302");
  });

  test("innings write-up screen renders values taken from innings.json", async ({ page }) => {
    await page.goto("/innings-detail");

    // innings.json: first curated innings, 183 v Pakistan, Asia Cup, Mirpur, 2012.
    await expect(page.locator("body")).toContainText("183");
    await expect(page.locator("body")).toContainText("Pakistan");
    await expect(page.locator("body")).toContainText("Mirpur");
  });

  test("modifying innings.json changes the write-up screen without touching component code", async ({ page }) => {
    await page.route("**/assets/innings.json", async (route) => {
      const response = await route.fetch();
      const original = await response.json();
      const modified = original.map((entry: { id: string; runs: number }) =>
        entry.id === "i1" ? { ...entry, runs: 50505 } : entry,
      );
      await route.fulfill({ response, json: modified });
    });

    await page.goto("/innings-detail");

    await expect(page.locator("body")).toContainText("50505");
  });
});
