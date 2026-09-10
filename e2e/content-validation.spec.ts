// AC-049: the build-time content validator must fail loudly -- non-zero exit,
// and an error naming both the offending file and the offending field -- when
// the versioned content snapshot is malformed or missing a required field.
//
// These tests mutate the real fixture files on disk for the duration of a
// single assertion and always restore the original bytes in a `finally`, so
// the repository is left exactly as it was found regardless of pass/fail.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

const here = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.join(here, "..", "frontend");
const validatorScript = path.join(frontendDir, "scripts", "validate-content.mjs");
const statsFile = path.join(frontendDir, "public", "assets", "stats.json");
const achievementsFile = path.join(frontendDir, "public", "assets", "achievements.json");

function runValidator(): { status: number; output: string } {
  try {
    const stdout = execFileSync("node", [validatorScript], { encoding: "utf-8" });
    return { status: 0, output: stdout };
  } catch (err) {
    const e = err as { status?: number | null; stdout?: string; stderr?: string };
    return { status: e.status ?? 1, output: `${e.stdout ?? ""}${e.stderr ?? ""}` };
  }
}

// These three tests share on-disk fixtures; running them one after another
// avoids one test's temporary corruption bleeding into another's assertion.
test.describe.configure({ mode: "serial" });

test.describe("content validator (AC-049)", () => {
  test("exits non-zero and names the file and field for a malformed value", async () => {
    const original = readFileSync(statsFile, "utf-8");
    try {
      const data = JSON.parse(original);
      data[0].average = "not-a-number"; // schema requires a nonnegative number
      writeFileSync(statsFile, JSON.stringify(data, null, 2));

      const result = runValidator();

      expect(result.status).not.toBe(0);
      expect(result.output).toContain("stats.json");
      expect(result.output).toContain("average");
    } finally {
      writeFileSync(statsFile, original);
    }
  });

  test("exits non-zero and names the file and field for a missing required field", async () => {
    const original = readFileSync(achievementsFile, "utf-8");
    try {
      const data = JSON.parse(original);
      delete data[0].category; // required field on every achievement
      writeFileSync(achievementsFile, JSON.stringify(data, null, 2));

      const result = runValidator();

      expect(result.status).not.toBe(0);
      expect(result.output).toContain("achievements.json");
      expect(result.output).toContain("category");
    } finally {
      writeFileSync(achievementsFile, original);
    }
  });

  test("exits zero against the unmodified, valid content snapshot", async () => {
    const result = runValidator();
    expect(result.status).toBe(0);
  });
});
