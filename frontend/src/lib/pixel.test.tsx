import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pixel, spriteNameFromIllustration } from "@/lib/pixel";

describe("spriteNameFromIllustration", () => {
  it("returns a bare sprite name unchanged", () => {
    expect(spriteNameFromIllustration("batsman")).toBe("batsman");
  });

  it("strips a directory prefix and file extension from an asset path", () => {
    expect(spriteNameFromIllustration("/assets/pixel/batsman.png")).toBe("batsman");
  });

  it("strips the extension when there is no directory", () => {
    expect(spriteNameFromIllustration("trophy.svg")).toBe("trophy");
  });

  it("leaves a path with no extension as the trailing segment", () => {
    expect(spriteNameFromIllustration("/assets/pixel/stumps")).toBe("stumps");
  });

  it("returns an empty string for empty input", () => {
    expect(spriteNameFromIllustration("")).toBe("");
  });
});

describe("Pixel", () => {
  it("is decorative (aria-hidden, no accessible role) when no alt is given", () => {
    const { container } = render(<Pixel name="batsman" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
    expect(svg).not.toHaveAttribute("aria-label");
  });

  it("exposes an accessible name when alt text is given", () => {
    render(<Pixel name="batsman" alt="Batsman in stance" />);
    const svg = screen.getByRole("img", { name: "Batsman in stance" });
    expect(svg).not.toHaveAttribute("aria-hidden");
  });

  it("sizes the svg from the viewBox and the scale prop (default scale=4 on an 8x8 grid)", () => {
    const { container } = render(<Pixel name="ball" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("viewBox", "0 0 8 8");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("scales width and height linearly with the scale prop", () => {
    const { container } = render(<Pixel name="ball" scale={2} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
  });

  it("clamps a zero or negative scale to a single-pixel cell instead of collapsing or inverting", () => {
    const zero = render(<Pixel name="ball" scale={0} />);
    expect(zero.container.querySelector("svg")).toHaveAttribute("width", "8");
    zero.unmount();

    const negative = render(<Pixel name="ball" scale={-5} />);
    expect(negative.container.querySelector("svg")).toHaveAttribute("width", "8");
  });

  it("renders crisp, non-raster geometry: crispEdges shape-rendering and a pixelated CSS fallback", () => {
    const { container } = render(<Pixel name="ball" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("shape-rendering", "crispEdges");
    expect(svg?.style.imageRendering).toBe("pixelated");
  });

  it("never renders an <img> tag -- sprites are drawn, not loaded from an external asset", () => {
    const { container } = render(<Pixel name="batsman" alt="Batsman" />);
    expect(container.querySelector("img")).toBeNull();
  });

  it("draws one rect per non-transparent grid cell and skips transparent cells", () => {
    // The "ball" grid's 'c' cells count to 48; the '.' cells must not render.
    const { container } = render(<Pixel name="ball" />);
    const rects = container.querySelectorAll("rect");
    expect(rects.length).toBe(48);
    rects.forEach((rect) => {
      expect(rect.getAttribute("fill")).toBeTruthy();
    });
  });

  it.each(["batsman", "helmet", "ball", "stumps", "trophy"])(
    "renders the known sprite %s without throwing and with visible pixels",
    (name) => {
      const { container } = render(<Pixel name={name} />);
      const rects = container.querySelectorAll("rect");
      expect(rects.length).toBeGreaterThan(0);
    }
  );

  it("falls back to a default placeholder sprite for an unrecognised name, instead of rendering nothing", () => {
    const known = render(<Pixel name="batsman" />);
    const unknown = render(<Pixel name="does-not-exist" />);

    const unknownRects = unknown.container.querySelectorAll("rect");
    // The fallback sprite is its own fixed 8x8 diamond -- 16 filled cells --
    // distinct from "batsman" but still a real, non-empty render.
    expect(unknownRects.length).toBe(16);
    expect(unknown.container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 8 8");

    known.unmount();
    unknown.unmount();
  });
});
