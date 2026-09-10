/**
 * Zod schemas for the versioned content snapshot (content_snapshot in the
 * approved architecture).
 *
 * These mirror the data_model entities exactly -- format_stats, achievement,
 * innings, site_meta -- so that:
 *   - `scripts/validate-content.mjs` can fail the build on malformed or
 *     missing fields before anything ships (the build_pipeline component), and
 *   - screens that later fetch `/assets/*.json` at runtime have a typed shape
 *     to parse the response against instead of trusting it blindly.
 *
 * Nothing in the current screens imports this yet -- wiring a screen to fetch
 * and validate the snapshot at runtime is development-sprint work, not
 * toolchain setup.
 */
import { z } from "zod";

export const FormatEnum = z.enum(["Test", "ODI", "T20I", "IPL"]);
export type Format = z.infer<typeof FormatEnum>;

export const FormatStatsSchema = z.object({
  format: FormatEnum,
  matches: z.number().int().nonnegative(),
  runs: z.number().int().nonnegative(),
  average: z.number().nonnegative(),
  strike_rate: z.number().nonnegative(),
  hundreds: z.number().int().nonnegative(),
  fifties: z.number().int().nonnegative(),
});
export type FormatStats = z.infer<typeof FormatStatsSchema>;
export const FormatStatsListSchema = z.array(FormatStatsSchema);

export const AchievementCategoryEnum = z.enum(["trophy", "award", "record"]);
export type AchievementCategory = z.infer<typeof AchievementCategoryEnum>;

export const AchievementSchema = z.object({
  id: z.string().min(1),
  year: z.number().int(),
  description: z.string().min(1),
  category: AchievementCategoryEnum,
});
export type Achievement = z.infer<typeof AchievementSchema>;
export const AchievementListSchema = z.array(AchievementSchema);

export const InningsSchema = z.object({
  id: z.string().min(1),
  runs: z.number().int().nonnegative(),
  balls_faced: z.number().int().positive(),
  opposition: z.string().min(1),
  context: z.string().min(1),
  year: z.number().int(),
  summary: z.string().min(1),
  // Stored as MDX/markdown source text, per the approved data model
  // (innings.narrative: text (MDX)). Rendering it is a screen's job.
  narrative: z.string().min(1),
  illustration: z.string().min(1),
  alt_text: z.string().min(1),
});
export type Innings = z.infer<typeof InningsSchema>;
// AC-050 / api_spec: curated 6-10 great innings.
export const InningsListSchema = z.array(InningsSchema).min(6).max(10);

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "expected an ISO date, e.g. 2026-08-12");

export const SiteMetaSchema = z.object({
  id: z.string().min(1),
  hero_tagline: z.string().min(1),
  footer_disclaimer: z.string().min(1),
  snapshot_date: isoDate,
  og_title: z.string().min(1),
  og_description: z.string().min(1),
  og_image: z.string().min(1),
});
export type SiteMeta = z.infer<typeof SiteMetaSchema>;
