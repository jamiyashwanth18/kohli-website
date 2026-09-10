import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { siteMeta, spriteNameFromIllustration, useAchievements, useFormatStats, useInningsList } from "@/lib/content";

const STATS = [
  { format: "Test", matches: 1, runs: 1, average: 1, strike_rate: 1, hundreds: 0, fifties: 0 },
];
const ACHIEVEMENTS = [{ id: "a1", year: 2020, category: "trophy", description: "Won something." }];
const INNINGS = Array.from({ length: 6 }).map((_, i) => ({
  id: `i${i}`,
  runs: 100,
  balls_faced: 100,
  opposition: "Australia",
  context: "Test match",
  year: 2020,
  summary: "A great innings.",
  narrative: "It was great.",
  illustration: "/assets/pixel/batsman.png",
  alt_text: "alt",
}));

function jsonResponse(body: unknown, ok = true, status = 200) {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

describe("lib/content", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("siteMeta is loaded from the static content file with a human-readable date", () => {
    expect(siteMeta.hero_tagline).toBeTruthy();
    expect(siteMeta.footer_disclaimer).toBeTruthy();
    expect(siteMeta.snapshot_date).not.toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("spriteNameFromIllustration strips path and extension", () => {
    expect(spriteNameFromIllustration("/assets/pixel/batsman.png")).toBe("batsman");
    expect(spriteNameFromIllustration("batsman")).toBe("batsman");
    expect(spriteNameFromIllustration("")).toBe("");
  });

  it("useFormatStats starts loading, then resolves with same-origin fetched data", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(jsonResponse(STATS));
    const { result } = renderHook(() => useFormatStats());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(STATS);
    expect(fetch).toHaveBeenCalledWith("/assets/stats.json");
  });

  it("useAchievements resolves with validated data", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(jsonResponse(ACHIEVEMENTS));
    const { result } = renderHook(() => useAchievements());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(ACHIEVEMENTS);
    expect(fetch).toHaveBeenCalledWith("/assets/achievements.json");
  });

  it("useInningsList resolves with validated data", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(jsonResponse(INNINGS));
    const { result } = renderHook(() => useInningsList());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(INNINGS);
    expect(fetch).toHaveBeenCalledWith("/assets/innings.json");
  });

  it("surfaces a network failure as an error rather than throwing", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(jsonResponse({}, false, 500));
    const { result } = renderHook(() => useFormatStats());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toMatch(/500/);
  });

  it("surfaces a schema mismatch as an error, not a crash", async () => {
    (fetch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(jsonResponse([{ nope: true }]));
    const { result } = renderHook(() => useFormatStats());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeTruthy();
  });
});
