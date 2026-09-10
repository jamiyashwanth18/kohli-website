#!/usr/bin/env node
/**
 * Static Build & Content Validation (build_pipeline in the approved
 * architecture): fails the build when the versioned content snapshot does
 * not match the approved data model, rather than shipping a scoreboard with
 * a missing field.
 *
 * Runs on plain Node before Vite so it needs no TypeScript toolchain of its
 * own -- see `npm run build`. The shapes below mirror
 * `src/content/schema.ts`; keep the two in sync if the data model changes.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { z } from "zod";

const here = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(here, "..", "public", "assets");
const contentDir = path.join(here, "..", "content");

const FormatStatsSchema = z.object({
  format: z.enum(["Test", "ODI", "T20I", "IPL"]),
  matches: z.number().int().nonnegative(),
  runs: z.number().int().nonnegative(),
  average: z.number().nonnegative(),
  strike_rate: z.number().nonnegative(),
  hundreds: z.number().int().nonnegative(),
  fifties: z.number().int().nonnegative(),
});

const AchievementSchema = z.object({
  id: z.string().min(1),
  year: z.number().int(),
  description: z.string().min(1),
  category: z.enum(["trophy", "award", "record"]),
});

const InningsSchema = z.object({
  id: z.string().min(1),
  runs: z.number().int().nonnegative(),
  balls_faced: z.number().int().positive(),
  opposition: z.string().min(1),
  context: z.string().min(1),
  year: z.number().int(),
  summary: z.string().min(1),
  narrative: z.string().min(1),
  illustration: z.string().min(1),
  alt_text: z.string().min(1),
});

const SiteMetaSchema = z.object({
  id: z.string().min(1),
  hero_tagline: z.string().min(1),
  footer_disclaimer: z.string().min(1),
  snapshot_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  og_title: z.string().min(1),
  og_description: z.string().min(1),
  og_image: z.string().min(1),
});

const checks = [
  { file: path.join(assetsDir, "stats.json"), schema: z.array(FormatStatsSchema).min(1) },
  { file: path.join(assetsDir, "achievements.json"), schema: z.array(AchievementSchema).min(1) },
  { file: path.join(assetsDir, "innings.json"), schema: z.array(InningsSchema).min(6).max(10) },
  { file: path.join(contentDir, "site-meta.json"), schema: SiteMetaSchema },
];

let failed = false;

for (const { file, schema } of checks) {
  const rel = path.relative(path.join(here, ".."), file);
  try {
    const raw = readFileSync(file, "utf-8");
    const data = JSON.parse(raw);
    schema.parse(data);
    console.log(`content ok: ${rel}`);
  } catch (err) {
    failed = true;
    console.error(`content INVALID: ${rel}`);
    console.error(err instanceof Error ? err.message : String(err));
  }
}

if (failed) {
  console.error("\nContent snapshot failed schema validation; build stopped.");
  process.exit(1);
}
