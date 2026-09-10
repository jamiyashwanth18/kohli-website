import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  siteMeta,
  spriteNameFromIllustration,
  useAchievements,
  useFormatStats,
  useInningsList,
} from "@/lib/content";

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: () => Promise.resolve(body),
    })
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useFormatStats", () => {
  it("starts loading, then resolves with validated data on success", async () => {
    const stats = [
      { format: "Test", matches: 1, runs: 1, average: 1, strike_rate: 1, hundreds: 0, fifties: 0 },
    ];
    mockFetchOnce(stats);

    const { result } = renderHook(() => useFormatStats());
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(stats);
    expect(fetch).toHaveBeenCalledWith("/assets/stats.json");
  });

  it("surfaces a non-blank inline error when the request fails", async () => {
    mockFetchOnce(null, false, 500);

    const { result } = renderHook(() => useFormatStats());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeTruthy();
  });

  it("surfaces an error when the payload fails schema validation", async () => {
    mockFetchOnce([{ format: "NotAFormat" }]);

    const { result } = renderHook(() => useFormatStats());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeTruthy();
  });
});

describe("useAchievements", () => {
  it("fetches from the same-origin assets path", async () => {
    mockFetchOnce([{ id: "a1", year: 2020, description: "x", category: "trophy" }]);
    const { result } = renderHook(() => useAchievements());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetch).toHaveBeenCalledWith("/assets/achievements.json");
    expect(result.current.data).toHaveLength(1);
  });
});

describe("useInningsList", () => {
  it("fetches from the same-origin assets path", async () => {
    const item = {
      id: "i1",
      runs: 100,
      balls_faced: 100,
      opposition: "X",
      context: "Y",
      year: 2020,
      summary: "s",
      narrative: "n",
      illustration: "/assets/pixel/batsman.png",
      alt_text: "alt",
    };
    mockFetchOnce(Array.from({ length: 6 }, (_, i) => ({ ...item, id: `i${i}` })));
    const { result } = renderHook(() => useInningsList());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetch).toHaveBeenCalledWith("/assets/innings.json");
    expect(result.current.data).toHaveLength(6);
  });
});

describe("siteMeta", () => {
  it("is loaded and validated from the bundled content file, not fetched", () => {
    expect(siteMeta.hero_tagline).toBeTruthy();
    expect(siteMeta.snapshot_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("spriteNameFromIllustration", () => {
  it("derives the sprite key from the asset file name", () => {
    expect(spriteNameFromIllustration("/assets/pixel/batsman.png")).toBe("batsman");
    expect(spriteNameFromIllustration("helmet.png")).toBe("helmet");
  });
});
