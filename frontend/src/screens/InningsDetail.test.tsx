import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import InningsDetail from "@/screens/InningsDetail";

const INNINGS = [
  {
    id: "i1",
    runs: 183,
    balls_faced: 148,
    opposition: "Pakistan",
    context: "Asia Cup, Mirpur",
    year: 2012,
    summary: "Chasing 330.",
    narrative: "First paragraph.\n\nSecond paragraph.",
    illustration: "/assets/pixel/batsman.png",
    alt_text: "alt",
  },
  {
    id: "i2",
    runs: 82,
    balls_faced: 53,
    opposition: "Pakistan",
    context: "T20 World Cup, Melbourne",
    year: 2022,
    summary: "31 for 4.",
    narrative: "Something happened.",
    illustration: "/assets/pixel/helmet.png",
    alt_text: "alt2",
  },
];

function render_() {
  return render(
    <MemoryRouter>
      <InningsDetail />
    </MemoryRouter>
  );
}

describe("InningsDetail screen content loading", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows a loading status before the innings resolve", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    render_();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders an inline error, never a blank screen, on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) } as Response))
    );
    render_();
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(screen.getByText(/Back to the showcase/)).toBeInTheDocument();
  });

  it("renders the first innings and supports selecting another from the list", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(INNINGS) } as Response)
      )
    );
    render_();

    await waitFor(() => expect(screen.getByText("183 (148) v Pakistan")).toBeInTheDocument());
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();

    const user = userEvent.setup();
    const otherCard = screen.getByRole("button", { name: /82 \(53\)/ });
    await user.click(otherCard);
    expect(screen.getByText("82 (53) v Pakistan")).toBeInTheDocument();
  });
});
