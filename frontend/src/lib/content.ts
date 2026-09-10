/**
 * Typed content loaders for the static snapshot produced by US-015-1.
 *
 * `stats.json`, `achievements.json` and `innings.json` are served from
 * `public/assets/*.json` (same-origin, static files) and are fetched at
 * runtime and validated against the shared zod schemas -- the same schemas
 * `scripts/validate-content.mjs` checks at build time. `site-meta.json`
 * lives under `frontend/content/` (not `public/`) and is bundled in at
 * build time via a plain JSON import, so it needs no fetch or loading state.
 *
 * Editing any of these four files and rebuilding changes what the screens
 * render -- no component code names a stat, an achievement, an innings or a
 * tagline directly.
 *
 * Deliberately does not use `apiFetch`/`API_BASE_URL`: this content is part
 * of the static site, not the generated API, and must never leave the
 * origin the page was served from (AC-050).
 */
import * as React from "react";

import {
  AchievementListSchema,
  FormatStatsListSchema,
  InningsListSchema,
  SiteMetaSchema,
  type Achievement,
  type FormatStats,
  type Innings,
  type SiteMeta,
} from "@/content/schema";
import siteMetaRaw from "../../content/site-meta.json";

export { spriteNameFromIllustration } from "@/lib/pixel";

export interface ContentState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function formatDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

const parsedSiteMeta: SiteMeta = SiteMetaSchema.parse(siteMetaRaw);

/** Build-time content: no network request, no loading/error state needed. */
export const siteMeta: SiteMeta = {
  ...parsedSiteMeta,
  snapshot_date: formatDate(parsedSiteMeta.snapshot_date),
};

function useJsonAsset<T>(path: string, schema: { parse: (input: unknown) => T }): ContentState<T> {
  const [state, setState] = React.useState<ContentState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  React.useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GET ${path} failed: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        const parsed = schema.parse(json);
        if (!cancelled) setState({ data: parsed, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load content.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}

export function useFormatStats(): ContentState<FormatStats[]> {
  return useJsonAsset<FormatStats[]>("/assets/stats.json", FormatStatsListSchema);
}

export function useAchievements(): ContentState<Achievement[]> {
  return useJsonAsset<Achievement[]>("/assets/achievements.json", AchievementListSchema);
}

export function useInningsList(): ContentState<Innings[]> {
  return useJsonAsset<Innings[]>("/assets/innings.json", InningsListSchema);
}
