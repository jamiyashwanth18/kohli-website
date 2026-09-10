/**
 * The one scoreboard/scorecard motif, shared by every content section that
 * displays a label/value pair in the digital-scoreboard style: the career
 * scoreboard tiles and achievement-year badges on Home, and the scorecard
 * facts on InningsDetail (AC-029). One component, three call sites.
 */
import * as React from "react";

import { brand } from "@/lib/brand";

export function ScoreboardTile({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={"border-2 px-4 py-4 sm:px-5 sm:py-5 " + (className ?? "")}
      style={{
        backgroundColor: brand.board,
        borderColor: brand.boardBorder,
        boxShadow: "4px 4px 0 0 rgba(42,36,28,0.35)",
      }}
    >
      <div
        className="font-mono text-[11px] uppercase tracking-[0.18em]"
        style={{ color: brand.boardLabel }}
      >
        {label}
      </div>
      <div
        className="mt-2 font-mono text-3xl sm:text-4xl font-bold tabular-nums leading-none"
        style={{ color: brand.boardValue }}
      >
        {value}
      </div>
    </div>
  );
}

export function ScoreboardBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block font-mono text-lg font-bold tabular-nums px-3 py-1 border-2"
      style={{ color: brand.boardValue, backgroundColor: brand.board, borderColor: brand.ink }}
    >
      {children}
    </span>
  );
}

export function ScorecardRow({ term, value }: { term: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-sm" style={{ color: brand.neutralColor }}>
        {term}
      </dt>
      <dd className="font-mono text-sm sm:text-base font-semibold" style={{ color: brand.ink }}>
        {value}
      </dd>
    </div>
  );
}
