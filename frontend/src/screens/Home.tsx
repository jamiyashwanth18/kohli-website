import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { Pixel } from "@/lib/pixel";
import { ScoreboardBadge, ScoreboardTile } from "@/lib/scoreboard";
import {
  siteMeta,
  spriteNameFromIllustration,
  useAchievements,
  useFormatStats,
  useInningsList,
} from "@/lib/content";
import type { Achievement, FormatStats, Innings } from "@/content/schema";

const { Card, CardHeader, CardTitle, CardContent, CardFooter, Input, Label, Table, THead, TBody, TR, TH, TD, Separator } = UI;

const CATEGORIES = ['All', 'Trophy', 'Award', 'Record'];

function capitalize(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

const SECTIONS = [
  { id: 'scoreboard', label: 'Career stats' },
  { id: 'timeline', label: 'Achievements' },
  { id: 'showcase', label: 'Great innings' },
];

const METRICS = [
  { key: 'matches', label: 'Matches', decimals: 0 },
  { key: 'runs', label: 'Runs', decimals: 0 },
  { key: 'average', label: 'Average', decimals: 2 },
  { key: 'strike_rate', label: 'Strike rate', decimals: 2 },
  { key: 'hundreds', label: 'Hundreds', decimals: 0 },
  { key: 'fifties', label: 'Fifties', decimals: 0 },
];

function useCountUp(value, decimals, animate) {
  const [display, setDisplay] = React.useState(animate ? 0 : value);
  React.useEffect(() => {
    if (!animate) {
      setDisplay(value);
      return undefined;
    }
    let raf = null;
    let start = null;
    const duration = 750;
    const step = (now) => {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      if (t < 1) {
        setDisplay(value * eased);
        raf = requestAnimationFrame(step);
      } else {
        setDisplay(value);
      }
    };
    raf = requestAnimationFrame(step);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [value, animate]);
  const shown = display === value ? value : display;
  return shown.toFixed(decimals);
}

function ScoreCell({ label, value, decimals, animate }) {
  const shown = useCountUp(value, decimals, animate);
  return <ScoreboardTile label={label} value={shown} />;
}

function Reveal({ children, animate, className }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(!animate);
  React.useEffect(() => {
    if (!animate) {
      setShown(true);
      return undefined;
    }
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [animate]);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(10px)',
        transition: animate ? 'opacity 400ms steps(5, end), transform 400ms steps(5, end)' : 'none',
      }}
    >
      {children}
    </div>
  );
}

function InningsDialog({ item, onClose, navigate }: { item: Innings; onClose: () => void; navigate: (route: string) => void }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const first = node.querySelector(selector);
    if (first) first.focus();
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(node.querySelectorAll(selector)).filter(
        (el: any) => !el.disabled && el.offsetParent !== null
      );
      if (items.length === 0) return;
      const firstEl: any = items[0];
      const lastEl: any = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    node.addEventListener('keydown', onKeyDown);
    return () => node.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8" style={{ backgroundColor: 'rgba(42,36,28,0.6)' }}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="innings-dialog-title"
        className="w-full max-w-2xl border-2 p-6 sm:p-8"
        style={{ backgroundColor: brand.backgroundColor, borderColor: brand.ink, borderRadius: brand.radius, boxShadow: '8px 8px 0 0 rgba(42,36,28,0.45)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: brand.neutralColor }}>
              {item.year} · {item.context}
            </p>
            <h3
              id="innings-dialog-title"
              className="mt-2 text-2xl sm:text-3xl font-bold"
              style={{ color: brand.cherry, fontFamily: brand.fontHeading }}
            >
              {item.runs} ({item.balls_faced}) v {item.opposition}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close innings write-up"
            className="shrink-0 border-2 p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ borderColor: brand.ink, color: brand.ink, borderRadius: brand.radius }}
          >
            <Icons.X aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4 border-y-2 py-4" style={{ borderColor: brand.borderMuted }}>
          <Pixel name={spriteNameFromIllustration(item.illustration)} scale={5} alt={item.alt_text} />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-sm" style={{ color: brand.ink }}>
            <div className="flex gap-2">
              <dt style={{ color: brand.neutralColor }}>Runs</dt>
              <dd className="font-bold">{item.runs}</dd>
            </div>
            <div className="flex gap-2">
              <dt style={{ color: brand.neutralColor }}>Balls</dt>
              <dd className="font-bold">{item.balls_faced}</dd>
            </div>
            <div className="flex gap-2">
              <dt style={{ color: brand.neutralColor }}>Opposition</dt>
              <dd className="font-bold">{item.opposition}</dd>
            </div>
            <div className="flex gap-2">
              <dt style={{ color: brand.neutralColor }}>Year</dt>
              <dd className="font-bold">{item.year}</dd>
            </div>
          </dl>
        </div>

        <p className="mt-5 text-base leading-relaxed" style={{ color: brand.ink }}>
          {item.narrative}
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('innings-detail')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundColor: brand.primaryColor, borderRadius: brand.radius }}
          >
            Open the full write-up
            <Icons.ArrowRight aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 border-2 px-4 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ borderColor: brand.ink, color: brand.ink, borderRadius: brand.radius }}
          >
            Back to the showcase
          </button>
        </div>
      </div>
    </div>
  );
}

function InlineStatus({ loading, error, loadingLabel, retry }: { loading: boolean; error: string | null; loadingLabel: string; retry?: () => void }) {
  if (loading) {
    return (
      <p role="status" className="mt-6 font-mono text-sm" style={{ color: brand.neutralColor }}>
        {loadingLabel}
      </p>
    );
  }
  if (error) {
    return (
      <div
        role="alert"
        className="mt-6 border-2 border-dashed p-6"
        style={{ borderColor: brand.cherry, borderRadius: brand.radius, color: brand.cherry }}
      >
        <p className="font-semibold">Could not load this section.</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }
  return null;
}

export default function Screen() {
  const navigate = useNavigate();
  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const statsQuery = useFormatStats();
  const achievementsQuery = useAchievements();
  const inningsQuery = useInningsList();

  const FORMAT_STATS: FormatStats[] = statsQuery.data ?? [];
  const ACHIEVEMENTS: Achievement[] = achievementsQuery.data ?? [];
  const INNINGS: Innings[] = inningsQuery.data ?? [];

  const [reduceMotion, setReduceMotion] = React.useState(prefersReduced);
  const [activeFormat, setActiveFormat] = React.useState('ODI');
  const [inView, setInView] = React.useState(false);
  const [showCompare, setShowCompare] = React.useState(false);
  const [category, setCategory] = React.useState('All');
  const [query, setQuery] = React.useState('');
  const [openInnings, setOpenInnings] = React.useState<Innings | null>(null);
  const [currentSection, setCurrentSection] = React.useState('scoreboard');

  const boardRef = React.useRef(null);
  const sectionRefs = React.useRef<Record<string, any>>({});
  const triggerRef = React.useRef(null);
  const tabRefs = React.useRef<Record<string, any>>({});

  const animate = !reduceMotion;

  React.useEffect(() => {
    const node = boardRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  React.useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const nodes = SECTIONS.map((s) => sectionRefs.current[s.id]).filter(Boolean);
    if (nodes.length === 0) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id) setCurrentSection(e.target.id);
        });
      },
      { rootMargin: '-96px 0px -45% 0px', threshold: 0.01 }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  const stats = FORMAT_STATS.find((f) => f.format === activeFormat) || FORMAT_STATS[0];
  const maxRuns = FORMAT_STATS.length ? Math.max.apply(null, FORMAT_STATS.map((f) => f.runs)) : 0;

  const filteredAchievements = ACHIEVEMENTS.filter((a) => {
    const matchesCategory = category === 'All' || a.category.toLowerCase() === category.toLowerCase();
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === '' || a.description.toLowerCase().includes(q) || String(a.year).includes(q) || a.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const years: Array<{ year: number; items: Achievement[] }> = [];
  filteredAchievements
    .slice()
    .sort((a, b) => a.year - b.year)
    .forEach((a) => {
      const bucket = years.find((y) => y.year === a.year);
      if (bucket) bucket.items.push(a);
      else years.push({ year: a.year, items: [a] });
    });

  const goToSection = (id) => {
    setCurrentSection(id);
    const node = sectionRefs.current[id];
    if (node && node.scrollIntoView) {
      node.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const onTabKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
    if (FORMAT_STATS.length === 0) return;
    e.preventDefault();
    const list = FORMAT_STATS.map((f) => f.format);
    const i = list.indexOf(activeFormat);
    let next = i < 0 ? 0 : i;
    if (e.key === 'ArrowRight') next = (i + 1) % list.length;
    if (e.key === 'ArrowLeft') next = (i - 1 + list.length) % list.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = list.length - 1;
    setActiveFormat(list[next]);
    const btn = tabRefs.current[list[next]];
    if (btn) btn.focus();
  };

  const openWriteUp = (item, e) => {
    triggerRef.current = e && e.currentTarget ? e.currentTarget : null;
    setOpenInnings(item);
  };

  const closeWriteUp = () => {
    setOpenInnings(null);
    if (triggerRef.current && (triggerRef.current as any).focus) (triggerRef.current as any).focus();
  };

  const categoryTint = (cat: string) => {
    const c = cat.toLowerCase();
    if (c === 'trophy') return { color: '#7A2015', backgroundColor: '#F7DDD3' };
    if (c === 'award') return { color: '#1A4A9E', backgroundColor: '#DCE6FA' };
    if (c === 'record') return { color: '#5A4A12', backgroundColor: '#F4E7C4' };
    return { color: '#3F3A32', backgroundColor: '#EDE5D2' };
  };

  return (
    <div style={{ backgroundColor: brand.backgroundColor, fontFamily: brand.fontBody, color: brand.ink }} className="w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* HERO */}
        <header className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em]" style={{ color: brand.neutralColor }}>
            The Scorebook · Unofficial fan project
          </p>
          <div className="mt-4 flex items-start gap-5">
            <div className="hidden sm:block shrink-0 pt-1">
              <Pixel name="batsman" scale={7} alt="Pixel-art illustration of Virat Kohli driving through the covers" />
            </div>
            <div>
              <h1
                className="text-4xl sm:text-5xl font-extrabold tracking-tight"
                style={{ color: brand.cherry, fontFamily: brand.fontHeading }}
              >
                Virat Kohli
              </h1>
              <p className="mt-4 text-lg leading-relaxed" style={{ color: brand.ink }}>
                {siteMeta.hero_tagline}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="inline-flex items-center gap-2 font-mono text-xs" style={{ color: brand.neutralColor }}>
              <Icons.Calendar aria-hidden="true" />
              Figures snapshot: {siteMeta.snapshot_date}
            </p>
            <div className="flex items-center gap-3">
              <span id="motion-label" className="font-mono text-xs" style={{ color: brand.neutralColor }}>
                Reduce motion
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={reduceMotion}
                aria-labelledby="motion-label"
                onClick={() => setReduceMotion((v) => !v)}
                className="relative inline-flex h-6 w-11 shrink-0 items-center border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  borderColor: brand.ink,
                  backgroundColor: reduceMotion ? brand.primaryColor : 'transparent',
                  borderRadius: brand.radius,
                }}
              >
                <span
                  className="ml-0.5 h-4 w-4"
                  style={{
                    backgroundColor: reduceMotion ? '#FFFFFF' : brand.ink,
                    transform: reduceMotion ? 'translateX(20px)' : 'translateX(0)',
                    transition: 'transform 120ms steps(3, end)',
                  }}
                  aria-hidden="true"
                />
              </button>
              <span className="font-mono text-xs" style={{ color: brand.neutralColor }}>
                {reduceMotion ? 'On' : 'Off'}
              </span>
            </div>
          </div>
        </header>

        {/* SECTION NAV */}
        <nav aria-label="Page sections" className="mt-10 border-y-2 py-3" style={{ borderColor: brand.borderMuted }}>
          <ul className="flex flex-wrap gap-2">
            {SECTIONS.map((s) => {
              const active = currentSection === s.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => goToSection(s.id)}
                    aria-current={active ? 'true' : undefined}
                    className="px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      borderColor: active ? brand.primaryColor : brand.borderColor,
                      backgroundColor: active ? brand.primaryColor : 'transparent',
                      color: active ? '#FFFFFF' : brand.ink,
                      borderRadius: brand.radius,
                    }}
                  >
                    {active ? '▸ ' : ''}{s.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* SCOREBOARD */}
        <section
          id="scoreboard"
          ref={(el) => { sectionRefs.current.scoreboard = el; }}
          aria-labelledby="scoreboard-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2 id="scoreboard-heading" className="text-2xl sm:text-3xl font-bold" style={{ color: brand.cherry, fontFamily: brand.fontHeading }}>
            Career scoreboard
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed" style={{ color: brand.ink }}>
            Batting only — matches, runs, average, strike rate, hundreds and fifties. Pick a format; the board changes without
            leaving the page.
          </p>

          <InlineStatus loading={statsQuery.loading} error={statsQuery.error} loadingLabel="Loading career scoreboard…" />

          {!statsQuery.loading && !statsQuery.error && stats && (
            <div ref={boardRef} className="mt-7">
              <div role="tablist" aria-label="Choose a format" onKeyDown={onTabKeyDown} className="flex flex-wrap gap-2">
                {FORMAT_STATS.map((f) => {
                  const active = f.format === activeFormat;
                  return (
                    <button
                      key={f.format}
                      ref={(el) => { tabRefs.current[f.format] = el; }}
                      type="button"
                      role="tab"
                      id={'tab-' + f.format}
                      aria-selected={active}
                      aria-controls={'panel-' + f.format}
                      tabIndex={active ? 0 : -1}
                      onClick={() => setActiveFormat(f.format)}
                      className="px-5 py-2.5 font-mono text-sm font-bold uppercase tracking-[0.12em] border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{
                        borderColor: brand.ink,
                        backgroundColor: active ? brand.ink : 'transparent',
                        color: active ? brand.boardValue : brand.ink,
                        boxShadow: active ? '4px 4px 0 0 rgba(42,36,28,0.3)' : 'none',
                      }}
                    >
                      {f.format}
                    </button>
                  );
                })}
              </div>

              <div
                role="tabpanel"
                id={'panel-' + stats.format}
                aria-labelledby={'tab-' + stats.format}
                tabIndex={-1}
                className="mt-5 border-2 p-4 sm:p-6"
                style={{ borderColor: brand.ink, backgroundColor: brand.boardPanel }}
              >
                <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 pb-4" style={{ borderColor: brand.boardBorder }}>
                  <p className="font-mono text-lg font-bold uppercase tracking-[0.2em]" style={{ color: brand.boardValue }}>
                    {stats.format} — batting
                  </p>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                  {METRICS.map((m) => (
                    <ScoreCell
                      key={stats.format + m.key}
                      label={m.label}
                      value={stats[m.key]}
                      decimals={m.decimals}
                      animate={animate && inView}
                    />
                  ))}
                </div>
              </div>

              {/* Chunky bitmap chart */}
              <div className="mt-8">
                <h3 className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: brand.neutralColor }}>
                  Runs by format — one block ≈ 1,000 runs
                </h3>
                <ul className="mt-4 space-y-3">
                  {FORMAT_STATS.map((f) => {
                    const blocks = Math.max(1, Math.round(f.runs / 1000));
                    const total = Math.round(maxRuns / 1000);
                    const isActive = f.format === activeFormat;
                    return (
                      <li key={f.format} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="w-14 font-mono text-sm font-bold" style={{ color: brand.ink }}>
                          {f.format}
                        </span>
                        <span className="flex gap-1" aria-hidden="true">
                          {Array.from({ length: total }).map((_, i) => (
                            <span
                              key={i}
                              className="inline-block h-4 w-3"
                              style={{
                                backgroundColor: i < blocks ? (isActive ? brand.accentColor : brand.primaryColor) : 'transparent',
                                border: '2px solid ' + (i < blocks ? 'transparent' : brand.borderMuted),
                              }}
                            />
                          ))}
                        </span>
                        <span className="font-mono text-sm tabular-nums" style={{ color: brand.ink }}>
                          {f.runs.toLocaleString()} runs
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setShowCompare((v) => !v)}
                  aria-expanded={showCompare}
                  aria-controls="compare-table"
                  className="inline-flex items-center gap-2 border-2 px-4 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ borderColor: brand.ink, color: brand.ink, borderRadius: brand.radius }}
                >
                  {showCompare ? <Icons.ChevronDown aria-hidden="true" /> : <Icons.ChevronRight aria-hidden="true" />}
                  {showCompare ? 'Hide the all-format comparison' : 'Compare all four formats'}
                </button>
                {showCompare && (
                  <div id="compare-table" className="mt-5 overflow-x-auto">
                    <Table>
                      <caption className="sr-only">Virat Kohli batting figures by format, snapshot {siteMeta.snapshot_date}</caption>
                      <THead>
                        <TR>
                          <TH scope="col">Format</TH>
                          <TH scope="col">Matches</TH>
                          <TH scope="col">Runs</TH>
                          <TH scope="col">Average</TH>
                          <TH scope="col">Strike rate</TH>
                          <TH scope="col">100s</TH>
                          <TH scope="col">50s</TH>
                        </TR>
                      </THead>
                      <TBody>
                        {FORMAT_STATS.map((f) => (
                          <TR key={f.format}>
                            <TH scope="row">{f.format}</TH>
                            <TD>{f.matches}</TD>
                            <TD>{f.runs.toLocaleString()}</TD>
                            <TD>{f.average.toFixed(2)}</TD>
                            <TD>{f.strike_rate.toFixed(2)}</TD>
                            <TD>{f.hundreds}</TD>
                            <TD>{f.fifties}</TD>
                          </TR>
                        ))}
                      </TBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <Separator className="my-14" />

        {/* TIMELINE */}
        <section
          id="timeline"
          ref={(el) => { sectionRefs.current.timeline = el; }}
          aria-labelledby="timeline-heading"
          className="scroll-mt-24"
        >
          <h2 id="timeline-heading" className="text-2xl sm:text-3xl font-bold" style={{ color: brand.cherry, fontFamily: brand.fontHeading }}>
            Achievements &amp; records
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed" style={{ color: brand.ink }}>
            Year by year, from a captain at the Under-19 World Cup to a Champions Trophy winner.
          </p>

          <InlineStatus loading={achievementsQuery.loading} error={achievementsQuery.error} loadingLabel="Loading achievements…" />

          {!achievementsQuery.loading && !achievementsQuery.error && (
            <>
              <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: brand.neutralColor }}>
                    Filter by kind
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => {
                      const active = category === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setCategory(c)}
                          className="border-2 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                          style={{
                            borderColor: active ? brand.primaryColor : brand.borderColor,
                            backgroundColor: active ? brand.primaryColor : 'transparent',
                            color: active ? '#FFFFFF' : brand.ink,
                            borderRadius: brand.radius,
                          }}
                        >
                          {active ? '✓ ' : ''}{c}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="sm:w-72">
                  <Label htmlFor="timeline-search">Search achievements</Label>
                  <div className="mt-1.5 flex items-center gap-2 border-2 px-3" style={{ borderColor: brand.borderColor, borderRadius: brand.radius }}>
                    <Icons.Search aria-hidden="true" />
                    <Input
                      id="timeline-search"
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. 2023, World Cup"
                      className="border-0 bg-transparent focus:ring-0"
                    />
                  </div>
                </div>
              </div>

              <p className="mt-4 font-mono text-xs" style={{ color: brand.neutralColor }} aria-live="polite">
                Showing {filteredAchievements.length} of {ACHIEVEMENTS.length} entries
              </p>

              {years.length === 0 ? (
                <div
                  className="mt-6 border-2 border-dashed p-10 text-center"
                  style={{ borderColor: brand.borderColor, borderRadius: brand.radius }}
                >
                  <div className="flex justify-center">
                    <Pixel name="stumps" scale={4} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold" style={{ color: brand.ink }}>
                    Nothing in the book for that
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
                    No achievement matches “{query.trim() || category}”. Try a different year or clear the filters.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setQuery(''); setCategory('All'); }}
                    className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ backgroundColor: brand.primaryColor, borderRadius: brand.radius }}
                  >
                    <Icons.X aria-hidden="true" />
                    Clear filters
                  </button>
                </div>
              ) : (
                <ol className="mt-8 space-y-10">
                  {years.map((bucket) => (
                    <li key={bucket.year}>
                      <Reveal animate={animate}>
                        <div className="flex items-center gap-4">
                          <h3 className="m-0">
                            <ScoreboardBadge>{bucket.year}</ScoreboardBadge>
                          </h3>
                          <span className="h-0.5 flex-1" style={{ backgroundColor: brand.borderMuted }} aria-hidden="true" />
                        </div>
                        <ul className="mt-4 space-y-4 border-l-2 pl-5 sm:pl-7" style={{ borderColor: brand.borderColor }}>
                          {bucket.items.map((a) => (
                            <li key={a.id} className="relative">
                              <span
                                className="absolute -left-[27px] sm:-left-[35px] top-2 h-3 w-3"
                                style={{ backgroundColor: brand.accentColor, border: '2px solid ' + brand.ink }}
                                aria-hidden="true"
                              />
                              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                                <span
                                  className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-1"
                                  style={Object.assign({ borderRadius: brand.radius }, categoryTint(a.category))}
                                >
                                  {capitalize(a.category)}
                                </span>
                                <p className="min-w-0 flex-1 text-base leading-relaxed" style={{ color: brand.ink }}>
                                  {a.description}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </Reveal>
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}
        </section>

        <Separator className="my-14" />

        {/* SHOWCASE */}
        <section
          id="showcase"
          ref={(el) => { sectionRefs.current.showcase = el; }}
          aria-labelledby="showcase-heading"
          className="scroll-mt-24"
        >
          <h2 id="showcase-heading" className="text-2xl sm:text-3xl font-bold" style={{ color: brand.cherry, fontFamily: brand.fontHeading }}>
            Great innings
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed" style={{ color: brand.ink }}>
            Not an archive — each card carries the score, the situation and why it mattered. Open one to read the whole thing.
          </p>

          <InlineStatus loading={inningsQuery.loading} error={inningsQuery.error} loadingLabel="Loading great innings…" />

          {!inningsQuery.loading && !inningsQuery.error && (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {INNINGS.map((item) => (
                <li key={item.id}>
                  <Reveal animate={animate} className="h-full">
                    <Card className="flex h-full flex-col" style={{ borderColor: brand.borderColor }}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: brand.neutralColor }}>
                              {item.year} · {item.context}
                            </p>
                            <CardTitle className="mt-2" style={{ color: brand.cherry }}>
                              <span className="font-mono tabular-nums">
                                {item.runs} ({item.balls_faced})
                              </span>{' '}
                              v {item.opposition}
                            </CardTitle>
                          </div>
                          <span className="shrink-0">
                            <Pixel name={spriteNameFromIllustration(item.illustration)} scale={4} alt={item.alt_text} />
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="leading-relaxed" style={{ color: brand.ink }}>
                          {item.summary}
                        </p>
                      </CardContent>
                      <CardFooter>
                        <button
                          type="button"
                          onClick={(e) => openWriteUp(item, e)}
                          className="inline-flex items-center gap-2 border-2 px-4 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                          style={{ borderColor: brand.ink, color: brand.ink, borderRadius: brand.radius }}
                        >
                          Read the write-up
                          <Icons.ChevronRight aria-hidden="true" />
                          <span className="sr-only">
                            for {item.runs} against {item.opposition}, {item.year}
                          </span>
                        </button>
                      </CardFooter>
                    </Card>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* FOOTER */}
        <footer className="mt-16 border-t-2 pt-8" style={{ borderColor: brand.borderMuted }}>
          <div className="flex items-start gap-4">
            <Pixel name="ball" scale={4} />
            <div className="max-w-2xl space-y-3">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: brand.neutralColor }}>
                About this scorebook
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: brand.ink }}>
                {siteMeta.footer_disclaimer}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
                Career figures are a point-in-time snapshot taken on {siteMeta.snapshot_date}, compiled from public records, and
                may not reflect the current record. All illustrations are original pixel art drawn for this project.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {openInnings && <InningsDialog item={openInnings} onClose={closeWriteUp} navigate={navigate} />}
    </div>
  );
}
