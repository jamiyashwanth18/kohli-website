/**
 * The single sprite renderer for both screens (AC-030). Every illustration
 * used by Home and InningsDetail is drawn from the in-repo bitmap grids
 * below -- there is no second sprite system, and no <img> ever references an
 * external asset (AC-031).
 *
 * Sprites are rendered as SVG <rect> grids with shape-rendering="crispEdges"
 * plus a `image-rendering: pixelated` fallback, and are scaled purely via the
 * SVG viewBox/width/height -- vector geometry, not a raster bitmap -- so they
 * stay crisp at any zoom level or device pixel ratio.
 */
import * as React from "react";

import { brand } from "@/lib/brand";

type Grid = string[];
type Palette = Record<string, string>;
interface SpriteDef {
  grid: Grid;
  palette: Palette;
}

const TRANSPARENT = ".";

const SPRITES: Record<string, SpriteDef> = {
  batsman: {
    grid: [
      "...kk...",
      "..kkkk..",
      "..kkkk..",
      ".kkkkkb.",
      "kkkkkkb.",
      ".kk.kkb.",
      ".kk..b..",
      "kkk..b..",
    ],
    palette: { k: brand.primaryColor, b: brand.cherry },
  },
  helmet: {
    grid: [
      "..nnnn..",
      ".nnnnnn.",
      "nnnnnnnn",
      "nnnnnnnn",
      "nn.gg.nn",
      "nn.gg.nn",
      ".nnnnnn.",
      "...nn...",
    ],
    palette: { n: brand.neutralColor, g: brand.ink },
  },
  ball: {
    grid: [
      "..cccc..",
      ".cccccc.",
      "ccc.cccc",
      "cccc.ccc",
      "ccc.cccc",
      "cccc.ccc",
      ".cccccc.",
      "..cccc..",
    ],
    palette: { c: brand.cherry },
  },
  stumps: {
    grid: [
      "b.b.b.b.",
      "b.b.b.b.",
      "b.b.b.b.",
      "b.b.b.b.",
      "b.b.b.b.",
      "b.b.b.b.",
      "bbbbbbbb",
      "........",
    ],
    palette: { b: brand.ink },
  },
  trophy: {
    grid: [
      "..gggg..",
      ".gggggg.",
      "gg.gg.gg",
      "gg.gg.gg",
      ".gggggg.",
      "...gg...",
      "..gggg..",
      "gggggggg",
    ],
    palette: { g: brand.boardValue },
  },
};

const DEFAULT_SPRITE: SpriteDef = {
  grid: [
    "........",
    "........",
    "..gggg..",
    ".gg..gg.",
    ".gg..gg.",
    "..gggg..",
    "........",
    "........",
  ],
  palette: { g: brand.neutralColor },
};

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
  const sprite = SPRITES[name] ?? DEFAULT_SPRITE;
  const rows = sprite.grid.length;
  const cols = sprite.grid[0]?.length ?? 0;
  const cell = Math.max(1, scale);
  const width = cols * cell;
  const height = rows * cell;

  return (
    <svg
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      width={width}
      height={height}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      className="inline-block shrink-0"
      style={{ imageRendering: "pixelated" }}
    >
      {sprite.grid.map((row, y) =>
        Array.from(row).map((ch, x) => {
          if (ch === TRANSPARENT) return null;
          const fill = sprite.palette[ch];
          if (!fill) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
        })
      )}
    </svg>
  );
}
