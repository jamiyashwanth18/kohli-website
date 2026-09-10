/**
 * sprites.tsx is a back-compat re-export -- the one sprite renderer lives in
 * `@/lib/pixel` (AC-030) and is fully unit-tested there (pixel.test.tsx).
 * These tests exist to prove the re-export itself: that an old import from
 * "@/lib/sprites" still works, resolves to the *same* implementation (not a
 * second copy), and renders real, functioning output through that path.
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pixel as PixelFromPixelModule } from "@/lib/pixel";
import { Pixel, spriteNameFromIllustration } from "@/lib/sprites";

describe("sprites.tsx re-export", () => {
  it("re-exports the exact same Pixel implementation as @/lib/pixel, not a second copy", () => {
    expect(Pixel).toBe(PixelFromPixelModule);
  });

  it("re-exports a working spriteNameFromIllustration through the old import path", () => {
    expect(spriteNameFromIllustration("/assets/pixel/batsman.png")).toBe("batsman");
    expect(spriteNameFromIllustration("trophy.svg")).toBe("trophy");
    expect(spriteNameFromIllustration("")).toBe("");
  });

  it("renders a known sprite via the old import path with real pixel output", () => {
    const { container } = render(<Pixel name="batsman" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("shape-rendering", "crispEdges");
    expect(container.querySelectorAll("rect").length).toBeGreaterThan(0);
  });

  it("honours the alt prop for accessible naming through the old import path", () => {
    render(<Pixel name="ball" alt="Cricket ball" />);
    expect(screen.getByRole("img", { name: "Cricket ball" })).toBeInTheDocument();
  });

  it("never renders an <img> tag through the old import path -- no external asset is loaded", () => {
    const { container } = render(<Pixel name="helmet" alt="Helmet" />);
    expect(container.querySelector("img")).toBeNull();
  });
});
