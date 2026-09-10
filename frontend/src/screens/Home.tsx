import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Card, CardHeader, CardTitle, CardContent, CardFooter, Input, Label, Table, THead, TBody, TR, TH, TD, Separator } = UI;
const { Search, X, ChevronRight, ChevronDown, Home, Calendar, Filter, ArrowLeft, ArrowRight } = Icons;

const INK = '#2A241C';
const CHERRY = '#A82C1C';
const BOARD = '#241F1A';
const BOARD_LABEL = '#E4C79A';
const BOARD_VALUE = '#FFD36B';

const SITE_META = {
  id: 'site-meta-1',
  hero_tagline: 'Eighteen years at the crease, drawn in pixels — a fan-made scorebook of the numbers, the honours and the innings that mattered.',
  footer_disclaimer:
    'An unofficial fan and portfolio project. Not affiliated with, authorised by or endorsed by Virat Kohli, the BCCI, the ICC or any franchise.',
  snapshot_date: '12 August 2026',
  og_title: 'Virat Kohli — The Scorebook',
  og_description: 'A pixel-art scorebook of Virat Kohli’s career stats, honours and greatest innings.',
  og_image: '/assets/pixel/og-scorebook.png',
};

const FORMAT_STATS = [
  { format: 'Test', matches: 123, runs: 9230, average: 46.85, strike_rate: 55.58, hundreds: 30, fifties: 31, note: 'Debut 2011, Kingston' },
  { format: 'ODI', matches: 302, runs: 14181, average: 57.88, strike_rate: 93.58, hundreds: 51, fifties: 74, note: 'Debut 2008, Dambulla' },
  { format: 'T20I', matches: 125, runs: 4188, average: 48.69, strike_rate: 137.04, hundreds: 1, fifties: 38, note: 'Retired after the 2024 final' },
  { format: 'IPL', matches: 267, runs: 8661, average: 39.55, strike_rate: 132.1, hundreds: 8, fifties: 63, note: 'One franchise, start to finish' },
];

const ACHIEVEMENTS = [
  { id: 'a1', year: 2008, category: 'Trophy', description: 'Captained India to the ICC Under-19 World Cup title in Kuala Lumpur.' },
  { id: 'a2', year: 2011, category: 'Trophy', description: 'Part of the India side that won the ICC Cricket World Cup at the Wankhede, scoring 35 in the final.' },
  { id: 'a3', year: 2012, category: 'Award', description: 'Named ICC ODI Cricketer of the Year after 1,026 one-day runs in the calendar year.' },
  { id: 'a4', year: 2013, category: 'Record', description: 'Fastest batter to 5,000 ODI runs at the time, reaching the mark in 114 innings.' },
  { id: 'a5', year: 2014, category: 'Award', description: 'Player of the Tournament at the ICC World T20, 319 runs at an average of 106.33.' },
  { id: 'a6', year: 2016, category: 'Record', description: '973 runs in a single IPL season — still the highest tally by any batter in a men’s IPL campaign.' },
  { id: 'a7', year: 2017, category: 'Milestone', description: 'Took Test captaincy full time and led India to the top of the ICC Test rankings.' },
  { id: 'a8', year: 2018, category: 'Award', description: 'Won the Sir Garfield Sobers Trophy as ICC Cricketer of the Year, along with the Test and ODI player awards.' },
  { id: 'a9', year: 2019, category: 'Record', description: 'Fastest to 20,000 international runs, needing only 417 innings.' },
  { id: 'a10', year: 2020, category: 'Award', description: 'Named ICC Male Cricketer of the Decade and captain of the ICC ODI and T20I Teams of the Decade.' },
  { id: 'a11', year: 2022, category: 'Milestone', description: 'Ended a 1,020-day wait for an international hundred with 122 not out against Afghanistan in the Asia Cup.' },
  { id: 'a12', year: 2023, category: 'Record', description: 'Record 765 runs at a single ODI World Cup, including a 50th ODI century on his 35th birthday.' },
  { id: 'a13', year: 2024, category: 'Trophy', description: 'Player of the Match in the T20 World Cup final in Barbados, then retired from the format as a world champion.' },
  { id: 'a14', year: 2025, category: 'Trophy', description: 'Won the ICC Champions Trophy in Dubai and passed 14,000 ODI runs in the same tournament.' },
];

const CATEGORIES = ['All', 'Trophy', 'Award', 'Record', 'Milestone'];

const INNINGS = [
  {
    id: 'i1', runs: 183, balls_faced: 148, not_out: false, opposition: 'Pakistan',
    context: 'Asia Cup, Mirpur', year: 2012, illustration: 'batsman',
    alt_text: 'Pixel-art illustration of a batter in India blue leaning into a cover drive',
    summary: 'Chasing 330 against Pakistan, he made the biggest chase in Asia Cup history look like a net session.',
    narrative:
      'Pakistan had 329 on the board and two of the best new-ball bowlers in the world to defend it. Kohli walked out at 0 for 0 and hit twenty-two boundaries, most of them straight down the ground, most of them off the front foot. Umar Gul and Saeed Ajmal both went for more than sixty. India got home with thirteen balls left, and the innings quietly ended the argument about whether he belonged in the same sentence as the great chasers — it started a different argument about where he ranked among them.',
  },
  {
    id: 'i2', runs: 82, balls_faced: 53, not_out: true, opposition: 'Pakistan',
    context: 'T20 World Cup, Melbourne', year: 2022, illustration: 'helmet',
    alt_text: 'Pixel-art illustration of a cricket helmet with a raised grille',
    summary: '31 for 4 at the MCG, 90,000 people in, and two sixes off Haris Rauf that nobody has stopped describing.',
    narrative:
      'India were 31 for 4 in the eighth over and the game was gone. Kohli farmed the strike with Hardik Pandya, refused a single risk for thirty balls, and then took the nineteenth over apart: a flat-batted six over long-on and a scooped six over the keeper, both off Rauf, both off the last two legal balls of the over. He finished 82 not out from 53 in a chase that went to the final ball. He called it the best T20 innings he had played, and for once the consensus agreed with him immediately.',
  },
  {
    id: 'i3', runs: 133, balls_faced: 86, not_out: true, opposition: 'Sri Lanka',
    context: 'CB Series, Hobart', year: 2012, illustration: 'ball',
    alt_text: 'Pixel-art illustration of a red cricket ball with visible seam stitching',
    summary: '321 needed in 40 overs for a bonus point. India took 36.4 overs.',
    narrative:
      'To stay in the tournament India had to chase 321 inside 40 overs. Kohli came in at 86 for 1 and hit Lasith Malinga — at that point the most feared death bowler alive — for 24 in one over. He reached his hundred off 74 balls and finished with 133 not out off 86, sixteen fours and two sixes. Hobart is the innings people point to when they argue that the chasing template India used for the next decade was written by one player on one afternoon.',
  },
  {
    id: 'i4', runs: 254, balls_faced: 336, not_out: true, opposition: 'South Africa',
    context: 'Second Test, Pune', year: 2019, illustration: 'stumps',
    alt_text: 'Pixel-art illustration of three stumps standing on a strip of green grass',
    summary: 'His highest Test score, and his seventh double hundred as captain — a record for any Test captain.',
    narrative:
      'Pune was the innings where the Test batter caught up with the one-day one. Nine and a half hours, 336 balls, 33 fours and two sixes, declared on with the match already out of South Africa’s reach. It was his seventh Test double century, more than any captain in the game’s history, and it came in a period where he averaged over 60 at home. He batted with the deliberate, unglamorous patience that his critics had once insisted he did not have.',
  },
  {
    id: 'i5', runs: 149, balls_faced: 225, not_out: false, opposition: 'England',
    context: 'First Test, Edgbaston', year: 2018, illustration: 'batsman',
    alt_text: 'Pixel-art illustration of a batter in India blue completing a front-foot drive',
    summary: 'The answer to 2014: 149 out of India’s 274, made while the next best score was 26.',
    narrative:
      'Four years earlier England had made him look like a man batting with his eyes shut — 134 runs in ten innings, all of them poked at outside off. He came back to Edgbaston, left the ball for hours, drove only when it was full, and made 149 out of 274. James Anderson went past him twenty times and beat him once. No other Indian batter passed 26. India lost the Test by 31 runs, which is somehow part of why the innings is remembered so precisely.',
  },
  {
    id: 'i6', runs: 141, balls_faced: 175, not_out: false, opposition: 'Australia',
    context: 'First Test, Adelaide', year: 2014, illustration: 'helmet',
    alt_text: 'Pixel-art illustration of a batting helmet seen from the side',
    summary: 'A century in each innings on his first Test as captain, chasing 364 rather than shaking hands on a draw.',
    narrative:
      'Given the captaincy for the first time, he made 115 in the first innings and then, on the last day, went after 364 in 98 overs when every conventional read of the situation said bat out the draw. He was on 141 when he holed out with India needing 60 more; they folded for 315 and lost. The result went against him, the intent did not. Indian Test cricket abroad has been played that way ever since.',
  },
  {
    id: 'i7', runs: 117, balls_faced: 113, not_out: false, opposition: 'New Zealand',
    context: 'World Cup semi-final, Wankhede', year: 2023, illustration: 'trophy',
    alt_text: 'Pixel-art illustration of a golden trophy on a stepped base',
    summary: 'The 50th ODI hundred, in a World Cup semi-final, in Mumbai, on Tendulkar’s ground, with Tendulkar watching.',
    narrative:
      'He needed one more century to pass Sachin Tendulkar’s record of 49 in one-day internationals, and he got it in a World Cup semi-final at the Wankhede with Tendulkar in the stands. There was nothing showy about it: 117 from 113 balls, a partnership of 163 with Shreyas Iyer, the strike rotated so relentlessly that New Zealand never got a settled over. He finished the tournament with 765 runs, more than anyone has made in a single World Cup.',
  },
  {
    id: 'i8', runs: 76, balls_faced: 59, not_out: false, opposition: 'South Africa',
    context: 'T20 World Cup final, Barbados', year: 2024, illustration: 'trophy',
    alt_text: 'Pixel-art illustration of a trophy with a wide brim and two handles',
    summary: 'A quiet 76 in a final India were losing, and then a retirement announcement on the podium.',
    narrative:
      'He had scored 75 runs in the tournament before the final. Then India lost three wickets in the first three overs of it, and he built the innings back with a 76 that was almost entirely about occupation — reading the slowness of the Kensington Oval surface faster than anyone else, refusing to be the fourth wicket. India defended 176 by seven runs. He was named Player of the Match, and used the presentation to say he had played his last T20 international.',
  },
];

const SPRITES = {
  ball: {
    p: { d: '#7E2116', r: '#C0392B', w: '#FFE9C7' },
    rows: ['..dddd..', '.dwrrwd.', 'dwrrrrwd', 'drrrrrrd', 'drrrrrrd', 'dwrrrrwd', '.dwrrwd.', '..dddd..'],
  },
  trophy: {
    p: { g: '#C9A227', d: '#8A6D14' },
    rows: ['.gggggggg.', '.g.dddd.g.', '.gddddddg.', '..dddddd..', '...dddd...', '....dd....', '...dddd...', '..gggggg..', '.gggggggg.'],
  },
  batsman: {
    p: { o: '#2A241C', s: '#E8B98A', k: '#1E5AD6', b: '#8A6D14', w: '#FFF6E0' },
    rows: [
      '....oooo....', '...osssso...', '...osssso...', '....ssss....', '...kkkkkk..b', '..kkkkkkk.b.',
      '..kkkkkkkb..', '...kkkkbb...', '...wwwwww...', '...ww..ww...', '...ww..ww...', '..oww..wwo..',
    ],
  },
  helmet: {
    p: { o: '#2A241C', w: '#FFF6E0' },
    rows: ['..oooooo..', '.owwwwwwo.', 'owwwwwwwwo', 'owwwwwwwwo', 'owww...ooo', 'owww..oooo', '.oww.ooo..', '..oo.oo...', '...oooo...'],
  },
  stumps: {
    p: { b: '#D9BE8A', g: '#3F7A3F' },
    rows: ['.b.b.b.....', '.b.b.b.....', 'bbbbbbb....', '.b.b.b.....', '.b.b.b.....', '.b.b.b.....', '.b.b.b.....', '.b.b.b.....', 'ggggggggggg'],
  },
};

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

function Pixel({ name, scale = 4, alt }) {
  const sprite = SPRITES[name];
  if (!sprite) return null;
  const height = sprite.rows.length;
  const width = sprite.rows[0].length;
  const rects = [];
  sprite.rows.forEach((row, y) => {
    row.split('').forEach((ch, x) => {
      const fill = sprite.p[ch];
      if (fill) rects.push(<rect key={x + ':' + y} x={x} y={y} width="1" height="1" fill={fill} />);
    });
  });
  return (
    <svg
      viewBox={'0 0 ' + width + ' ' + height}
      width={width * scale}
      height={height * scale}
      shapeRendering="crispEdges"
      style={{ imageRendering: 'pixelated' }}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : 'true'}
      focusable="false"
    >
      {rects}
    </svg>
  );
}

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
  return (
    <div
      className="border-2 px-4 py-4 sm:px-5 sm:py-5"
      style={{ backgroundColor: BOARD, borderColor: '#3D352C', boxShadow: '4px 4px 0 0 rgba(42,36,28,0.35)' }}
    >
      <div
        className="font-mono text-[11px] uppercase tracking-[0.18em]"
        style={{ color: BOARD_LABEL }}
      >
        {label}
      </div>
      <div
        className="mt-2 font-mono text-3xl sm:text-4xl font-bold tabular-nums leading-none"
        style={{ color: BOARD_VALUE }}
      >
        {shown}
      </div>
    </div>
  );
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

function InningsDialog({ item, onClose }) {
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
        (el) => !el.disabled && el.offsetParent !== null
      );
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
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
        style={{ backgroundColor: brand.backgroundColor, borderColor: INK, borderRadius: brand.radius, boxShadow: '8px 8px 0 0 rgba(42,36,28,0.45)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: brand.neutralColor }}>
              {item.year} · {item.context}
            </p>
            <h3
              id="innings-dialog-title"
              className="mt-2 text-2xl sm:text-3xl font-bold"
              style={{ color: CHERRY, fontFamily: brand.fontHeading }}
            >
              {item.runs}
              {item.not_out ? '*' : ''} ({item.balls_faced}) v {item.opposition}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close innings write-up"
            className="shrink-0 border-2 p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ borderColor: INK, color: INK, borderRadius: brand.radius }}
          >
            <Icons.X aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4 border-y-2 py-4" style={{ borderColor: 'rgba(42,36,28,0.18)' }}>
          <Pixel name={item.illustration} scale={5} alt={item.alt_text} />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-sm" style={{ color: INK }}>
            <div className="flex gap-2">
              <dt style={{ color: brand.neutralColor }}>Runs</dt>
              <dd className="font-bold">{item.runs}{item.not_out ? '*' : ''}</dd>
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

        <p className="mt-5 text-base leading-relaxed" style={{ color: INK }}>
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
            style={{ borderColor: INK, color: INK, borderRadius: brand.radius }}
          >
            Back to the showcase
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Screen() {
  const navigate = useNavigate();
  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const [reduceMotion, setReduceMotion] = React.useState(prefersReduced);
  const [activeFormat, setActiveFormat] = React.useState('ODI');
  const [inView, setInView] = React.useState(false);
  const [showCompare, setShowCompare] = React.useState(false);
  const [category, setCategory] = React.useState('All');
  const [query, setQuery] = React.useState('');
  const [openInnings, setOpenInnings] = React.useState(null);
  const [currentSection, setCurrentSection] = React.useState('scoreboard');

  const boardRef = React.useRef(null);
  const sectionRefs = React.useRef({});
  const triggerRef = React.useRef(null);
  const tabRefs = React.useRef({});

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
  const maxRuns = Math.max.apply(null, FORMAT_STATS.map((f) => f.runs));

  const filteredAchievements = ACHIEVEMENTS.filter((a) => {
    const matchesCategory = category === 'All' || a.category === category;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === '' || a.description.toLowerCase().includes(q) || String(a.year).includes(q) || a.category.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const years = [];
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
    e.preventDefault();
    const list = FORMAT_STATS.map((f) => f.format);
    const i = list.indexOf(activeFormat);
    let next = i;
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
    if (triggerRef.current && triggerRef.current.focus) triggerRef.current.focus();
  };

  const categoryTint = (cat) => {
    if (cat === 'Trophy') return { color: '#7A2015', backgroundColor: '#F7DDD3' };
    if (cat === 'Award') return { color: '#1A4A9E', backgroundColor: '#DCE6FA' };
    if (cat === 'Record') return { color: '#5A4A12', backgroundColor: '#F4E7C4' };
    return { color: '#3F3A32', backgroundColor: '#EDE5D2' };
  };

  return (
    <div style={{ backgroundColor: brand.backgroundColor, fontFamily: brand.fontBody, color: INK }} className="w-full overflow-x-hidden">
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
                style={{ color: CHERRY, fontFamily: brand.fontHeading }}
              >
                Virat Kohli
              </h1>
              <p className="mt-4 text-lg leading-relaxed" style={{ color: INK }}>
                {SITE_META.hero_tagline}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="inline-flex items-center gap-2 font-mono text-xs" style={{ color: brand.neutralColor }}>
              <Icons.Calendar aria-hidden="true" />
              Figures snapshot: {SITE_META.snapshot_date}
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
                  borderColor: INK,
                  backgroundColor: reduceMotion ? brand.primaryColor : 'transparent',
                  borderRadius: brand.radius,
                }}
              >
                <span
                  className="ml-0.5 h-4 w-4"
                  style={{
                    backgroundColor: reduceMotion ? '#FFFFFF' : INK,
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
        <nav aria-label="Page sections" className="mt-10 border-y-2 py-3" style={{ borderColor: 'rgba(42,36,28,0.18)' }}>
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
                      borderColor: active ? brand.primaryColor : 'rgba(42,36,28,0.25)',
                      backgroundColor: active ? brand.primaryColor : 'transparent',
                      color: active ? '#FFFFFF' : INK,
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
          <h2 id="scoreboard-heading" className="text-2xl sm:text-3xl font-bold" style={{ color: CHERRY, fontFamily: brand.fontHeading }}>
            Career scoreboard
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed" style={{ color: INK }}>
            Batting only — matches, runs, average, strike rate, hundreds and fifties. Pick a format; the board changes without
            leaving the page.
          </p>

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
                      borderColor: INK,
                      backgroundColor: active ? INK : 'transparent',
                      color: active ? BOARD_VALUE : INK,
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
              style={{ borderColor: INK, backgroundColor: '#171410' }}
            >
              <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 pb-4" style={{ borderColor: '#3D352C' }}>
                <p className="font-mono text-lg font-bold uppercase tracking-[0.2em]" style={{ color: BOARD_VALUE }}>
                  {stats.format} — batting
                </p>
                <p className="font-mono text-xs" style={{ color: BOARD_LABEL }}>
                  {stats.note}
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
                      <span className="w-14 font-mono text-sm font-bold" style={{ color: INK }}>
                        {f.format}
                      </span>
                      <span className="flex gap-1" aria-hidden="true">
                        {Array.from({ length: total }).map((_, i) => (
                          <span
                            key={i}
                            className="inline-block h-4 w-3"
                            style={{
                              backgroundColor: i < blocks ? (isActive ? brand.accentColor : brand.primaryColor) : 'transparent',
                              border: '2px solid ' + (i < blocks ? 'transparent' : 'rgba(42,36,28,0.2)'),
                            }}
                          />
                        ))}
                      </span>
                      <span className="font-mono text-sm tabular-nums" style={{ color: INK }}>
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
                style={{ borderColor: INK, color: INK, borderRadius: brand.radius }}
              >
                {showCompare ? <Icons.ChevronDown aria-hidden="true" /> : <Icons.ChevronRight aria-hidden="true" />}
                {showCompare ? 'Hide the all-format comparison' : 'Compare all four formats'}
              </button>
              {showCompare && (
                <div id="compare-table" className="mt-5 overflow-x-auto">
                  <Table>
                    <caption className="sr-only">Virat Kohli batting figures by format, snapshot {SITE_META.snapshot_date}</caption>
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
        </section>

        <Separator className="my-14" />

        {/* TIMELINE */}
        <section
          id="timeline"
          ref={(el) => { sectionRefs.current.timeline = el; }}
          aria-labelledby="timeline-heading"
          className="scroll-mt-24"
        >
          <h2 id="timeline-heading" className="text-2xl sm:text-3xl font-bold" style={{ color: CHERRY, fontFamily: brand.fontHeading }}>
            Achievements &amp; records
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed" style={{ color: INK }}>
            Year by year, from a captain at the Under-19 World Cup to a Champions Trophy winner. Fourteen entries, curated by
            hand.
          </p>

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
                        borderColor: active ? brand.primaryColor : 'rgba(42,36,28,0.25)',
                        backgroundColor: active ? brand.primaryColor : 'transparent',
                        color: active ? '#FFFFFF' : INK,
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
              <div className="mt-1.5 flex items-center gap-2 border-2 px-3" style={{ borderColor: 'rgba(42,36,28,0.35)', borderRadius: brand.radius }}>
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
              style={{ borderColor: 'rgba(42,36,28,0.3)', borderRadius: brand.radius }}
            >
              <div className="flex justify-center">
                <Pixel name="stumps" scale={4} />
              </div>
              <h3 className="mt-4 text-lg font-bold" style={{ color: INK }}>
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
                      <h3
                        className="font-mono text-lg font-bold tabular-nums px-3 py-1 border-2"
                        style={{ color: BOARD_VALUE, backgroundColor: BOARD, borderColor: INK }}
                      >
                        {bucket.year}
                      </h3>
                      <span className="h-0.5 flex-1" style={{ backgroundColor: 'rgba(42,36,28,0.18)' }} aria-hidden="true" />
                    </div>
                    <ul className="mt-4 space-y-4 border-l-2 pl-5 sm:pl-7" style={{ borderColor: 'rgba(42,36,28,0.2)' }}>
                      {bucket.items.map((a) => (
                        <li key={a.id} className="relative">
                          <span
                            className="absolute -left-[27px] sm:-left-[35px] top-2 h-3 w-3"
                            style={{ backgroundColor: brand.accentColor, border: '2px solid ' + INK }}
                            aria-hidden="true"
                          />
                          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                            <span
                              className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] px-2 py-1"
                              style={Object.assign({ borderRadius: brand.radius }, categoryTint(a.category))}
                            >
                              {a.category}
                            </span>
                            <p className="min-w-0 flex-1 text-base leading-relaxed" style={{ color: INK }}>
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
        </section>

        <Separator className="my-14" />

        {/* SHOWCASE */}
        <section
          id="showcase"
          ref={(el) => { sectionRefs.current.showcase = el; }}
          aria-labelledby="showcase-heading"
          className="scroll-mt-24"
        >
          <h2 id="showcase-heading" className="text-2xl sm:text-3xl font-bold" style={{ color: CHERRY, fontFamily: brand.fontHeading }}>
            Great innings
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed" style={{ color: INK }}>
            Eight knocks, not an archive. Each card carries the score, the situation and why it mattered — open one to read the
            whole thing.
          </p>

          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {INNINGS.map((item) => (
              <li key={item.id}>
                <Reveal animate={animate} className="h-full">
                  <Card className="flex h-full flex-col" style={{ borderColor: 'rgba(42,36,28,0.25)' }}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: brand.neutralColor }}>
                            {item.year} · {item.context}
                          </p>
                          <CardTitle className="mt-2" style={{ color: CHERRY }}>
                            <span className="font-mono tabular-nums">
                              {item.runs}
                              {item.not_out ? '*' : ''} ({item.balls_faced})
                            </span>{' '}
                            v {item.opposition}
                          </CardTitle>
                        </div>
                        <span className="shrink-0">
                          <Pixel name={item.illustration} scale={4} alt={item.alt_text} />
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="leading-relaxed" style={{ color: INK }}>
                        {item.summary}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <button
                        type="button"
                        onClick={(e) => openWriteUp(item, e)}
                        className="inline-flex items-center gap-2 border-2 px-4 py-2.5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        style={{ borderColor: INK, color: INK, borderRadius: brand.radius }}
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
        </section>

        {/* FOOTER */}
        <footer className="mt-16 border-t-2 pt-8" style={{ borderColor: 'rgba(42,36,28,0.2)' }}>
          <div className="flex items-start gap-4">
            <Pixel name="ball" scale={4} />
            <div className="max-w-2xl space-y-3">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: brand.neutralColor }}>
                About this scorebook
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: INK }}>
                {SITE_META.footer_disclaimer}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
                Career figures are a point-in-time snapshot taken on {SITE_META.snapshot_date}, compiled from public records, and
                may not reflect the current record. All illustrations are original pixel art drawn for this project.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {openInnings && <InningsDialog item={openInnings} onClose={closeWriteUp} />}
    </div>
  );
}
