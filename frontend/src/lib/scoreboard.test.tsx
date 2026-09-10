/**
 * Unit tests for the shared scoreboard motif (ScoreboardTile,
 * ScoreboardBadge, ScorecardRow) used by the career scoreboard tiles,
 * achievement-year badges and InningsDetail scorecard facts (AC-029).
 *
 * These assert what a user sees -- the label and value text, the semantic
 * markup a screen reader/consumer relies on (dt/dd pairing) -- and the one
 * bit of caller-facing behaviour the component exposes: an extra className
 * on ScoreboardTile is additive, not a replacement.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScorecardRow, ScoreboardBadge, ScoreboardTile } from "@/lib/scoreboard";

describe("ScoreboardTile", () => {
  it("renders the label and value", () => {
    render(<ScoreboardTile label="Runs" value={13289} />);

    expect(screen.getByText("Runs")).toBeInTheDocument();
    expect(screen.getByText("13289")).toBeInTheDocument();
  });

  it("renders a non-text value node, not just strings/numbers", () => {
    render(
      <ScoreboardTile
        label="Strike Rate"
        value={
          <span>
            93.<em>17</em>
          </span>
        }
      />
    );

    expect(screen.getByText("93.")).toBeInTheDocument();
    expect(screen.getByText("17")).toBeInTheDocument();
  });

  it("keeps its own layout classes and appends a caller-supplied className", () => {
    const { container } = render(
      <ScoreboardTile label="Centuries" value={51} className="col-span-2" />
    );

    const tile = container.firstElementChild as HTMLElement;
    expect(tile.className).toContain("col-span-2");
    // The tile's own styling (border, padding) must survive alongside it.
    expect(tile.className).toContain("border-2");
  });

  it("does not blow up when no className is supplied", () => {
    const { container } = render(<ScoreboardTile label="Matches" value={278} />);

    const tile = container.firstElementChild as HTMLElement;
    expect(tile).toBeInTheDocument();
    expect(tile.className.trim().endsWith("undefined")).toBe(false);
  });
});

describe("ScoreboardBadge", () => {
  it("renders its children", () => {
    render(<ScoreboardBadge>2011</ScoreboardBadge>);

    expect(screen.getByText("2011")).toBeInTheDocument();
  });
});

describe("ScorecardRow", () => {
  it("renders the term and value as a definition-list pair", () => {
    render(<ScorecardRow term="Opponent" value="Sri Lanka" />);

    const term = screen.getByText("Opponent");
    const value = screen.getByText("Sri Lanka");
    expect(term.tagName).toBe("DT");
    expect(value.tagName).toBe("DD");
  });

  it("renders a React node as the value, not only plain text", () => {
    render(<ScorecardRow term="Result" value={<strong>Won</strong>} />);

    const value = screen.getByText("Won");
    expect(value.tagName).toBe("STRONG");
  });
});
