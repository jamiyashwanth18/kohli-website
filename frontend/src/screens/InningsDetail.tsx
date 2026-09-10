import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { Pixel } from "@/lib/pixel";
import { ScorecardRow } from "@/lib/scoreboard";
import { siteMeta, spriteNameFromIllustration, useInningsList } from "@/lib/content";
import type { Innings } from "@/content/schema";

const { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Separator } = UI;
const { ChevronRight, ChevronLeft, ArrowLeft, CheckCircle } = Icons;

function InlineStatus({ loading, error }: { loading: boolean; error: string | null }) {
  if (loading) {
    return (
      <p role="status" className="mt-8 font-mono text-sm" style={{ color: brand.neutralColor }}>
        Loading great innings…
      </p>
    );
  }
  if (error) {
    return (
      <div
        role="alert"
        className="mt-8 border-2 border-dashed p-6"
        style={{ borderColor: brand.cherry, borderRadius: brand.radius, color: brand.cherry }}
      >
        <p className="font-semibold">Could not load this innings.</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }
  return null;
}

export default function Screen() {
  const navigate = useNavigate();
  const inningsQuery = useInningsList();
  const INNINGS: Innings[] = inningsQuery.data ?? [];

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const headingRef = React.useRef<HTMLHeadingElement | null>(null);
  const firstRender = React.useRef(true);

  React.useEffect(() => {
    if (activeId === null && INNINGS.length > 0) {
      setActiveId(INNINGS[0].id);
    }
  }, [INNINGS, activeId]);

  const innings = INNINGS.find((i) => i.id === activeId) || INNINGS[0] || null;
  const index = innings ? INNINGS.findIndex((i) => i.id === innings.id) : -1;
  const prev = innings && index > 0 ? INNINGS[index - 1] : null;
  const next = innings && index < INNINGS.length - 1 ? INNINGS[index + 1] : null;

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (headingRef.current) headingRef.current.focus();
  }, [activeId]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate("home");
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const strikeRate = innings ? ((innings.runs / innings.balls_faced) * 100).toFixed(2) : "0.00";
  const paragraphs = innings ? innings.narrative.split("\n\n") : [];

  const facts = innings
    ? [
        { term: "Runs", value: String(innings.runs) },
        { term: "Balls faced", value: String(innings.balls_faced) },
        { term: "Strike rate", value: strikeRate },
        { term: "Opposition", value: innings.opposition },
        { term: "Year", value: String(innings.year) },
      ]
    : [];

  return (
    <div style={{ backgroundColor: brand.backgroundColor, fontFamily: brand.fontBody, color: brand.ink }}>
      <style>{`
        @keyframes sb-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .sb-rise { animation: sb-rise 260ms steps(4, end) both; }
        @media (prefers-reduced-motion: reduce) {
          .sb-rise { animation: none !important; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        {/* Back / close row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("home")}
            className="!px-3"
            style={{ color: brand.primaryColor }}
          >
            <ArrowLeft aria-hidden="true" className="w-4 h-4 mr-2" />
            Back to the showcase
          </Button>
          <p className="text-sm" style={{ color: brand.neutralColor }}>
            Press <kbd className="font-mono text-xs px-1.5 py-0.5 border border-current rounded">Esc</kbd> to return
          </p>
        </div>

        <InlineStatus loading={inningsQuery.loading} error={inningsQuery.error} />

        {!inningsQuery.loading && !inningsQuery.error && innings && (
          <>
            {/* Header */}
            <header className="mt-8">
              <p
                className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em]"
                style={{ color: brand.neutralColor }}
              >
                Great innings · No. {index + 1} of {INNINGS.length}
              </p>
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="mt-3 text-3xl sm:text-5xl font-extrabold leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
                style={{ fontFamily: brand.fontHeading, color: brand.cherry }}
              >
                {innings.runs} ({innings.balls_faced}) v {innings.opposition}
              </h1>
              <p className="mt-3 text-base sm:text-lg max-w-2xl" style={{ color: brand.ink }}>
                {innings.summary}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Badge variant="outline">{innings.year}</Badge>
                <Badge variant="outline">{innings.context}</Badge>
              </div>
            </header>

            <Separator className="my-10" />

            {/* Main body: illustration + scorecard, narrative */}
            <div key={innings.id} className="sb-rise grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
              <div className="space-y-8">
                <div
                  className="flex items-center justify-center p-6"
                  style={{ backgroundColor: brand.surfaceMuted, border: `3px solid ${brand.ink}`, borderRadius: brand.radius }}
                >
                  <Pixel name={spriteNameFromIllustration(innings.illustration)} scale={8} alt={innings.alt_text} />
                </div>
                <p className="text-xs font-mono text-center" style={{ color: brand.neutralColor }}>
                  Original pixel-art illustration
                </p>

                <Card style={{ borderColor: brand.borderColor }}>
                  <CardHeader>
                    <CardTitle className="text-base" style={{ fontFamily: brand.fontHeading }}>
                      Scorecard
                    </CardTitle>
                    <CardDescription>{innings.context}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="divide-y" style={{ borderColor: brand.borderColor }}>
                      {facts.map((f) => (
                        <ScorecardRow key={f.term} term={f.term} value={f.value} />
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-10">
                <section aria-labelledby="narrative-heading">
                  <h2
                    id="narrative-heading"
                    className="text-xl sm:text-2xl font-bold"
                    style={{ fontFamily: brand.fontHeading, color: brand.cherry }}
                  >
                    Why it mattered
                  </h2>
                  <div className="mt-4 space-y-5 max-w-prose">
                    {paragraphs.map((p, i) => (
                      <p key={i} className="text-base sm:text-[17px] leading-[1.75]" style={{ color: brand.ink }}>
                        {p}
                      </p>
                    ))}
                  </div>
                </section>

                {/* Prev / next */}
                <nav aria-label="Move between innings" className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="justify-start flex-1"
                    disabled={!prev}
                    onClick={() => prev && setActiveId(prev.id)}
                  >
                    <ChevronLeft aria-hidden="true" className="w-4 h-4 mr-2" />
                    <span className="truncate">
                      {prev ? `${prev.runs} v ${prev.opposition}` : "Start of showcase"}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-end flex-1"
                    disabled={!next}
                    onClick={() => next && setActiveId(next.id)}
                  >
                    <span className="truncate">
                      {next ? `${next.runs} v ${next.opposition}` : "End of showcase"}
                    </span>
                    <ChevronRight aria-hidden="true" className="w-4 h-4 ml-2" />
                  </Button>
                </nav>
              </div>
            </div>

            <Separator className="my-12" />

            {/* Other innings */}
            <section aria-labelledby="more-heading">
              <h2
                id="more-heading"
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: brand.fontHeading, color: brand.cherry }}
              >
                More great innings
              </h2>
              <p className="mt-2 text-sm" style={{ color: brand.neutralColor }}>
                Choose one to read its write-up here.
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {INNINGS.map((item) => {
                  const isActive = item.id === innings.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setActiveId(item.id)}
                        aria-current={isActive ? "true" : undefined}
                        className="w-full h-full text-left p-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{
                          borderRadius: brand.radius,
                          border: isActive ? `3px solid ${brand.primaryColor}` : `2px solid ${brand.borderColor}`,
                          backgroundColor: isActive ? "#EDF2FE" : brand.surfaceColor,
                        }}
                      >
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="font-mono text-lg font-bold" style={{ color: brand.ink }}>
                            {item.runs} ({item.balls_faced})
                          </span>
                          <span className="font-mono text-xs" style={{ color: brand.neutralColor }}>
                            {item.year}
                          </span>
                        </span>
                        <span className="mt-1 block font-semibold text-sm" style={{ color: brand.ink }}>
                          v {item.opposition}
                        </span>
                        <span className="mt-1 block text-xs" style={{ color: brand.neutralColor }}>
                          {item.context}
                        </span>
                        {isActive && (
                          <span
                            className="mt-3 inline-flex items-center gap-1 font-mono text-xs font-bold"
                            style={{ color: brand.primaryColor }}
                          >
                            <CheckCircle aria-hidden="true" className="w-3.5 h-3.5" />
                            Now reading
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        )}

        <footer className="mt-14 pt-8" style={{ borderTop: `2px solid ${brand.borderColor}` }}>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: brand.neutralColor }}>
            {siteMeta.footer_disclaimer} Career figures and innings details are a point-in-time snapshot compiled
            from public records on {siteMeta.snapshot_date} and may not reflect the current record.
          </p>
        </footer>
      </div>
    </div>
  );
}
