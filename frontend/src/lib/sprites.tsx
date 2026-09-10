/**
 * Minimal pixel-sprite renderer for illustration names carried on content
 * records (achievements/innings). The content files reference an
 * illustration by path (e.g. "/assets/pixel/batsman.png"); this maps that to
 * a small in-bundle swatch so a missing asset never blanks the page.
 *
 * Not a design system -- deliberately simple, since the content-loading seam
 * (US-015-2) is what owns this file, not the illustration set itself.
 */
import * as React from "react";

const SPRITE_COLORS: Record<string, string> = {
  batsman: "#1E5AD6",
  helmet: "#6B6152",
  ball: "#A82C1C",
  stumps: "#4F8A3D",
  trophy: "#FFD36B",
};

const DEFAULT_COLOR = "#8A8070";

/**
 * Given an illustration reference from content (a bare name like "batsman"
 * or an asset path like "/assets/pixel/batsman.png"), returns the sprite
 * name to render.
 */
export function spriteNameFromIllustration(illustration: string): string {
  if (!illustration) return "";
  const base = illustration.split("/").pop() ?? illustration;
  return base.replace(/\.[a-zA-Z0-9]+$/, "");
}

export function Pixel({
  name,
  scale = 4,
  alt = "",
}: {
  name: string;
  scale?: number;
  alt?: string;
}) {
  const size = Math.max(8, scale * 4);
  const color = SPRITE_COLORS[name] ?? DEFAULT_COLOR;
  return (
    <span
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className="inline-block shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        border: "2px solid #2A241C",
      }}
    />
  );
}
