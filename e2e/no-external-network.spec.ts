// AC-050: the running app must not call out to any external service --
// specifically no cricket data API, no backend host, and no database --
// while rendering. Every request observed during a full page load must
// stay on the site's own origin.
import { expect, test } from "@playwright/test";

// Defence in depth beyond the same-origin check: catches a request that is
// technically same-origin (e.g. proxied) but is clearly aimed at one of the
// systems the acceptance criterion names.
const BLOCKED_HOST_SIGNS = [
  "cricapi",
  "cricketdata",
  "espncricinfo",
  "cricbuzz",
  "sportradar",
  ":5432", // postgres
  ":27017", // mongo
  ":8000", // this repo's FastAPI backend
  "database",
];

async function collectOffSiteRequests(page: import("@playwright/test").Page, path: string, baseURL?: string) {
  const requestUrls: string[] = [];
  page.on("request", (req) => requestUrls.push(req.url()));

  await page.goto(path);
  await page.waitForLoadState("networkidle");

  const origin = new URL(baseURL ?? page.url()).origin;

  return requestUrls.filter((url) => {
    if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("about:")) return false;
    let sameOrigin: boolean;
    try {
      sameOrigin = new URL(url).origin === origin;
    } catch {
      sameOrigin = false;
    }
    const flagged = BLOCKED_HOST_SIGNS.some((sign) => url.toLowerCase().includes(sign));
    return !sameOrigin || flagged;
  });
}

test("home page makes no request off-origin, to a cricket data API, backend host or database", async ({
  page,
  baseURL,
}) => {
  const offenders = await collectOffSiteRequests(page, "/", baseURL);
  expect(offenders, `requests left the site origin or hit a blocked host: ${offenders.join(", ")}`).toEqual([]);
});

test("innings write-up page makes no request off-origin, to a cricket data API, backend host or database", async ({
  page,
  baseURL,
}) => {
  const offenders = await collectOffSiteRequests(page, "/innings-detail", baseURL);
  expect(offenders, `requests left the site origin or hit a blocked host: ${offenders.join(", ")}`).toEqual([]);
});
