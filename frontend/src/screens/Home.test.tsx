import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Home from "@/screens/Home";

const STATS = [
  { format: "Test", matches: 100, runs: 9000, average: 46.5, strike_rate: 55.1, hundreds: 30, fifties: 30 },
  { format: "ODI", matches: 300, runs: 14000, average: 57.8, strike_rate: 93.5, hundreds: 51, fifties: 74 },
];
const ACHIEVEMENTS = [
  { id: "a1", year: 2011, category: "trophy", description: "World Cup win." },
  { id: "a2", year: 2018, category: "award", description: "ICC Cricketer of the Year." },
];
const INNINGS = Array.from({ length: 6 }).map((_, i) => ({
  id: `i${i}`,
  runs: 100 + i,
  balls_faced: 100,
  opposition: "Australia",
  context: "Test match",
  year: 2020,
  summary: "A great innings.",
  narrative: "It was great.",
  illustration: "/assets/pixel/batsman.png",
  alt_text: "alt",
}));

function mockFetchByPath(map: Record<string, unknown>) {
  vi.stubGlobal(
    "fetch",
    vi.fn((path: string) => {
      const body = map[path];
      return Promise.resolve({
        ok: body !== undefined,
        status: body !== undefined ? 200 : 500,
        json: () => Promise.resolve(body ?? {}),
      } as Response);
    })
  );
}

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe("Home screen content loading", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows loading status before content resolves", () => {
    mockFetchByPath({});
    renderHome();
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
  });

  it("renders an inline error, never a blank screen, when a fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) } as Response))
    );
    renderHome();
    await waitFor(() => expect(screen.getAllByRole("alert").length).toBeGreaterThan(0));
    expect(screen.getByText("Virat Kohli")).toBeInTheDocument();
  });

  it("renders stats, achievements and innings from the content source once loaded", async () => {
    mockFetchByPath({
      "/assets/stats.json": STATS,
      "/assets/achievements.json": ACHIEVEMENTS,
      "/assets/innings.json": INNINGS,
    });
    renderHome();

    await waitFor(() => expect(screen.getByText("World Cup win.")).toBeInTheDocument());
    expect(screen.getAllByText(/v Australia/).length).toBeGreaterThan(0);

    const odiTab = screen.getByRole("tab", { name: "ODI" });
    expect(odiTab).toHaveAttribute("aria-selected", "true");
  });

  it("filters achievements by category and search", async () => {
    mockFetchByPath({
      "/assets/stats.json": STATS,
      "/assets/achievements.json": ACHIEVEMENTS,
      "/assets/innings.json": INNINGS,
    });
    renderHome();
    await waitFor(() => expect(screen.getByText("World Cup win.")).toBeInTheDocument());

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Award/ }));
    expect(screen.queryByText("World Cup win.")).not.toBeInTheDocument();
    expect(screen.getByText("ICC Cricketer of the Year.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /✓ Award/ }));
    await user.click(screen.getByLabelText("Search achievements"));
    await user.type(screen.getByLabelText("Search achievements"), "nope-nothing-matches");
    expect(screen.getByText(/Nothing in the book for that/)).toBeInTheDocument();
  });
});
