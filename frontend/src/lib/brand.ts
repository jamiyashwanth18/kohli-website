/**
 * Single source of design tokens for both screens. Every colour, radius and
 * font used by Home and InningsDetail is read from here (or from the CSS
 * custom properties in index.css that mirror these values) -- no screen
 * defines its own ad-hoc hex literal for ink, cherry-red headings or the
 * scoreboard panel.
 */
export const brand = {
  primaryColor: "#1E5AD6",
  accentColor: "#FF5A1F",
  neutralColor: "#6B6152",
  backgroundColor: "#FFF6E0",
  surfaceColor: "#FFFCF2",
  // Light parchment panel used behind illustrations (was inlined as '#F1E4C3').
  surfaceMuted: "#F1E4C3",

  // Shared ink/cherry palette (was duplicated as INK/CHERRY in Home and as
  // '#2B2620'/'#A31E17' in InningsDetail).
  ink: "#2A241C",
  cherry: "#A82C1C",

  // The scoreboard/scorecard motif's dark panel + digital-display colours.
  board: "#241F1A",
  boardPanel: "#171410",
  boardBorder: "#3D352C",
  boardLabel: "#E4C79A",
  boardValue: "#FFD36B",

  borderColor: "rgba(42,36,28,0.25)",
  borderMuted: "rgba(42,36,28,0.18)",

  radius: "0.375rem",

  // One bitmap-style type scale for both heading and body text -- deliberately
  // not Inter. A monospace stack reads as a scoreboard/scorecard typeface at
  // any size without shipping a licensed webfont.
  fontHeading: '"Courier New", ui-monospace, SFMono-Regular, Menlo, monospace',
  fontBody: '"Courier New", ui-monospace, SFMono-Regular, Menlo, monospace',

  density: "spacious",
} as const;
