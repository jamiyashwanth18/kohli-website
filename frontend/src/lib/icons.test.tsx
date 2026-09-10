// Unit tests for the generated-screen icon set.
//
// The module's whole point is: a finite, named set of components that each
// render a real <svg>, accept the usual SVG props, and default sensibly when
// none are given. These tests exercise that contract through the public
// `Icons` map and `ICON_NAMES` list rather than the private `paths` table.
import { render } from "@testing-library/react";

import { Icons, ICON_NAMES } from "./icons";

describe("ICON_NAMES", () => {
  it("lists every key exported on Icons, and only those keys", () => {
    expect(ICON_NAMES.sort()).toEqual(Object.keys(Icons).sort());
  });

  it("is non-empty", () => {
    expect(ICON_NAMES.length).toBeGreaterThan(0);
  });

  it("has no duplicate names", () => {
    expect(new Set(ICON_NAMES).size).toBe(ICON_NAMES.length);
  });

  // The module comment says the set is deliberately finite: an icon that
  // isn't listed here doesn't exist. Lock the list itself so a rename or a
  // silent drop shows up as a failing test, not a blank square discovered
  // later in a generated screen.
  it("matches the documented icon set", () => {
    expect(ICON_NAMES.sort()).toEqual(
      [
        "Plus",
        "Search",
        "Check",
        "X",
        "ChevronRight",
        "ChevronLeft",
        "ChevronDown",
        "Menu",
        "User",
        "Users",
        "Settings",
        "Bell",
        "Home",
        "FileText",
        "Package",
        "Calendar",
        "Clock",
        "Trash",
        "Edit",
        "Filter",
        "Download",
        "Upload",
        "ArrowLeft",
        "ArrowRight",
        "AlertCircle",
        "CheckCircle",
        "MoreHorizontal",
      ].sort()
    );
  });
});

describe("Icons", () => {
  it("renders every named icon as an svg without throwing", () => {
    for (const name of ICON_NAMES) {
      const IconComponent = Icons[name];
      const { container, unmount } = render(<IconComponent />);
      const svg = container.querySelector("svg");
      expect(svg, `Icons.${name} did not render an <svg>`).not.toBeNull();
      unmount();
    }
  });

  it("defaults to a 16x16 viewport and hides from the accessibility tree", () => {
    const { container } = render(<Icons.Plus />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "16");
    expect(svg).toHaveAttribute("height", "16");
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("honours a custom size prop", () => {
    const { container } = render(<Icons.Check size={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
  });

  it("forwards arbitrary svg props such as className and onClick", () => {
    const onClick = vi.fn();
    const { container } = render(
      <Icons.X className="text-red-500" onClick={onClick} role="button" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("text-red-500");
    expect(svg).toHaveAttribute("role", "button");

    svg?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("gives each icon distinct markup rather than sharing one fallback shape", () => {
    const rendered = new Set<string>();
    for (const name of ["Plus", "Search", "Check", "Bell"] as const) {
      const { container, unmount } = render(<Icons[name] />);
      rendered.add(container.querySelector("svg")!.innerHTML);
      unmount();
    }
    expect(rendered.size).toBe(4);
  });

  it("has no entry for a name outside the documented set", () => {
    expect((Icons as Record<string, unknown>).DoesNotExist).toBeUndefined();
  });
});
