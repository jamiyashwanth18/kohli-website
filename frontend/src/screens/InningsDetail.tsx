import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Separator } = UI;
const { ChevronRight, ChevronLeft, ArrowLeft, CheckCircle } = Icons;

const SPRITE_ROWS = [
  "................",
  ".....CCCC.......",
  "....CCCCCC......",
  "....CSSSSC......",
  "....CSSSSC......",
  ".....SSSS.......",
  "...JJJJJJJJ..BB.",
  "..JJJJJJJJJJ.BB.",
  "..SJJJJJJJJSBB..",
  "..SJJJJJJJJSBB..",
  "...JJJJJJJJBB...",
  "....LLLLLL.BB...",
  "....LLLLLL......",
  "....LL..LL......",
  "....LL..LL......",
  "...LLL..LLL.....",
  "...DDD..DDD.....",
  "GGGGGGGGGGGGGGGG",
];

const PALETTES = {
  whites: { J: "#F7F1DF", C: "#DBD1B7", S: "#C9895A", L: "#EDE5CE", B: "#B0763B", D: "#3A342C", G: "#7E9A54" },
  blue: { J: "#1E5AD6", C: "#16407F", S: "#C9895A", L: "#EDE5CE", B: "#B0763B", D: "#3A342C", G: "#7E9A54" },
  night: { J: "#2C6BE0", C: "#16407F", S: "#C9895A", L: "#EDE5CE", B: "#B0763B", D: "#3A342C", G: "#4F6B39" },
  cherry: { J: "#B8332A", C: "#7E1F19", S: "#C9895A", L: "#EDE5CE", B: "#B0763B", D: "#3A342C", G: "#6E8B3D" },
};

const INNINGS = [
  {
    id: "ind-pak-2012-mirpur",
    runs: 183,
    balls_faced: 148,
    not_out: false,
    opposition: "Pakistan",
    context: "Asia Cup group match, Mirpur",
    format: "ODI",
    year: 2012,
    palette: "blue",
    summary: "Chasing 330 against Pakistan, Kohli made the target look ordinary.",
    situation: "India needed 330 to win in 50 overs. No side had chased that much against Pakistan in an ODI before.",
    narrative:
      "Pakistan had put 329 on the board in Mirpur and the chase began the way most chases against that attack began — carefully, with Umar Gul finding movement and the crowd expecting a collapse. Kohli hit his second ball for four and never really stopped after that.\n\nWhat made it remarkable was the absence of risk. There were 22 fours and a six, but almost no strokes played in hope; he took singles off Saeed Ajmal, waited for width from Aizaz Cheema, and treated the chase as a piece of arithmetic he had already finished. India won with 13 balls to spare and Kohli fell on 183 with the job effectively done.\n\nIt is still the highest score by an Indian against Pakistan in ODIs, and the innings that turned a promising young batter into the man you handed the chase to.",
    alt_text: "Pixel-art illustration of Virat Kohli in India's blue one-day shirt driving through the covers.",
    tags: ["Highest ODI score", "Record chase", "22 fours"],
  },
  {
    id: "ind-pak-2022-mcg",
    runs: 82,
    balls_faced: 53,
    not_out: true,
    opposition: "Pakistan",
    context: "T20 World Cup Super 12, Melbourne",
    format: "T20I",
    year: 2022,
    palette: "night",
    summary: "31 needed off 8 balls, 90,000 people watching, and the two straight sixes off Haris Rauf.",
    situation: "India were 45 for 4 in the 7th over chasing 160. By the 18th over they still needed 48 from 18 balls.",
    narrative:
      "India lost four wickets inside seven overs and the game was, by any reasonable reading, gone. Kohli batted with Hardik Pandya for a while without any pretence of acceleration, simply refusing to be the fifth wicket.\n\nThe 19th over changed it. Two balls from Haris Rauf were hit straight back over the bowler's head, the second of them flat and enormous, and a chase that had needed a miracle now needed a finish. He was 82 not out from 53 when India won off the last ball of a chaotic final over.\n\nKohli has called it his best T20 innings, and it is hard to argue: an innings built out of two very different halves, one patient and one violent, played in front of the biggest crowd of his career.",
    alt_text: "Pixel-art illustration of Virat Kohli under Melbourne floodlights, bat raised after a straight six.",
    tags: ["Player of the Match", "Chase from 45/4", "Last-ball finish"],
  },
  {
    id: "ind-sa-2019-pune",
    runs: 254,
    balls_faced: 336,
    not_out: true,
    opposition: "South Africa",
    context: "2nd Test, Pune",
    format: "Test",
    year: 2019,
    palette: "whites",
    summary: "His highest first-class score, and the first time he had truly batted the opposition out of a Test.",
    situation: "India 1-0 up in the series, batting first on a Pune pitch expected to turn sharply from day three.",
    narrative:
      "The instruction to himself was simple: bat until the pitch does the rest. Kohli came in at 25 for 1 and left the field two days later with 254 beside his name, unbeaten, having declared with the score at 601 for 5.\n\nThere were 33 fours and two sixes, but the memory is of tempo — long passages of ones and twos against Keshav Maharaj, then a burst of four boundaries in an over when a bowler tired. Against Kagiso Rabada he simply refused to be drawn outside off stump, a discipline he had spent five years building.\n\nIt remains his highest score in any format and his seventh Test double century, one more than any other Indian batter has managed.",
    alt_text: "Pixel-art illustration of Virat Kohli in Test whites raising his bat and helmet on a sunlit ground.",
    tags: ["Career-best score", "7th Test double ton", "Declared on 601/5"],
  },
  {
    id: "ind-eng-2018-edgbaston",
    runs: 149,
    balls_faced: 225,
    not_out: false,
    opposition: "England",
    context: "1st Test, Edgbaston",
    format: "Test",
    year: 2018,
    palette: "whites",
    summary: "The answer to 2014, scored alone, in the country where he had failed.",
    situation: "India 100 for 5 in reply to England's 287, on a ground where Kohli averaged 13 from his previous tour.",
    narrative:
      "Four years earlier England had been a wound: ten innings, 134 runs, James Anderson outside off stump every time. Kohli returned to Edgbaston with a rebuilt technique — a shorter backlift, hands closer to the body, the cover drive put away until the ball was old.\n\nHe made 149 of India's 274. The next highest score in the innings was 26. For long spells he batted with the last three of the order, farming the strike, blocking Anderson and taking runs off Ben Stokes, and he ran out of partners rather than form.\n\nIndia lost the Test by 31 runs, which is part of why the innings is remembered so warmly: it settled a question about a batter, not a match.",
    alt_text: "Pixel-art illustration of Virat Kohli leaving a ball outside off stump in Test whites at Edgbaston.",
    tags: ["149 of India's 274", "Answer to 2014", "Player of the Series"],
  },
  {
    id: "ind-sl-2012-hobart",
    runs: 133,
    balls_faced: 86,
    not_out: true,
    opposition: "Sri Lanka",
    context: "CB Series, Hobart",
    format: "ODI",
    year: 2012,
    palette: "blue",
    summary: "320 chased down in 36.4 overs because a bonus point demanded it.",
    situation: "India needed 321 in 40 overs to stay in the tournament — a required rate of just over eight an over from the first ball.",
    narrative:
      "To survive the CB Series, India had to chase 321 inside 40 overs. It was less a chase than a mathematical dare, and for 20 overs it looked exactly as unlikely as it sounded.\n\nThen Kohli took 24 off a Lasith Malinga over and the arithmetic broke. He finished 133 not out from 86 balls, with 16 fours and two sixes, and India got there in 36.4 overs with Gautam Gambhir watching from the other end.\n\nMalinga at the death was, at that point, the hardest problem in one-day cricket. This is the innings where Kohli started being treated as the solution.",
    alt_text: "Pixel-art illustration of Virat Kohli pulling a short ball in India's blue one-day kit.",
    tags: ["24 off a Malinga over", "Chased 321 in 36.4", "16 fours"],
  },
  {
    id: "ind-aus-2014-adelaide",
    runs: 141,
    balls_faced: 175,
    not_out: false,
    opposition: "Australia",
    context: "1st Test, Adelaide",
    format: "Test",
    year: 2014,
    palette: "whites",
    summary: "A hundred in each innings as stand-in captain, and a fourth-innings chase he refused to abandon.",
    situation: "India set 364 on the final day. Kohli, captaining in Adelaide for the first time, chose to chase rather than survive.",
    narrative:
      "He had made 115 in the first innings. On the last afternoon, chasing 364, India were given a choice between a draw and a defeat with a hundred in it, and Kohli chose to keep hitting.\n\nHe was 141 when Nathan Lyon found the edge with 70 still required and four wickets left. India lost by 48 runs. The dressing room, and eventually the country, decided that losing that way said something better about the side than drawing would have.\n\nIt was the first Test of an era: a captain who counted a chase as the default option rather than the reckless one.",
    alt_text: "Pixel-art illustration of Virat Kohli driving on the front foot in Test whites at Adelaide Oval.",
    tags: ["115 and 141", "First Test as captain", "Chased 364"],
  },
  {
    id: "ind-sa-2023-kolkata",
    runs: 101,
    balls_faced: 121,
    not_out: true,
    opposition: "South Africa",
    context: "ODI World Cup league match, Kolkata",
    format: "ODI",
    year: 2023,
    palette: "blue",
    summary: "The 49th ODI hundred, made on his 35th birthday, to level Sachin Tendulkar's record.",
    situation: "India batting first at Eden Gardens, unbeaten in the tournament, with 67,000 people singing happy birthday between overs.",
    narrative:
      "It was the least free-flowing of his great innings and the most watched. Eden Gardens had come to see a hundred on a birthday, Kohli knew it, and for two overs in the forties he barely scored.\n\nHe got there with two balls to spare in the innings, a boundary off Kagiso Rabada, and then stood still for a long moment before the bat went up. 101 not out from 121, India 326 for 5, South Africa beaten by 243 runs.\n\nEquallng Tendulkar's 49 ODI centuries in Tendulkar's home city, in front of Tendulkar, is the kind of coincidence the sport occasionally arranges for itself. He passed the record a fortnight later in the semi-final.",
    alt_text: "Pixel-art illustration of Virat Kohli acknowledging a packed stadium after reaching a one-day century.",
    tags: ["49th ODI hundred", "Birthday century", "Eden Gardens"],
  },
  {
    id: "rcb-kxip-2016",
    runs: 113,
    balls_faced: 50,
    not_out: false,
    opposition: "Kings XI Punjab",
    context: "IPL league match, Bengaluru",
    format: "IPL",
    year: 2016,
    palette: "cherry",
    summary: "The centrepiece of the greatest T20 season anyone has had: 973 runs in one IPL.",
    situation: "RCB needed a win to stay in contention. Chinnaswamy, a flat pitch, and a batter three hundreds into a single season.",
    narrative:
      "The 2016 IPL was a season-long anomaly — 973 runs, four hundreds, an average of 81 — and this was the innings where it stopped being a hot streak and became something else.\n\n113 from 50 balls, with 12 fours and eight sixes, most of them hit straight or through cover rather than slogged across the line. Chris Gayle made 73 at the other end and was comfortably the second most destructive man on the field.\n\nNo one has passed 900 runs in an IPL season since, and only one other batter has managed four hundreds in a single T20 tournament.",
    alt_text: "Pixel-art illustration of Virat Kohli in a red franchise shirt lofting a straight six under floodlights.",
    tags: ["973 runs in a season", "8 sixes", "IPL season record"],
  },
];

const SNAPSHOT_DATE = "2 August 2026";

function PixelSprite({ paletteName, label }) {
  const palette = PALETTES[paletteName] || PALETTES.whites;
  return (
    <div
      role="img"
      aria-label={label}
      className="w-full max-w-[320px] mx-auto p-3"
      style={{ backgroundColor: "#F1E4C3", border: "3px solid #2B2620", borderRadius: brand.radius }}
    >
      <div className="grid" style={{ gridTemplateColumns: "repeat(16, 1fr)", imageRendering: "pixelated" }}>
        {SPRITE_ROWS.map((row, y) =>
          (row + "................").slice(0, 16).split("").map((ch, x) => (
            <div
              key={`${y}-${x}`}
              className="aspect-square"
              style={{ backgroundColor: palette[ch] || "transparent" }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function Screen() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = React.useState(INNINGS[0].id);
  const [returnNotice, setReturnNotice] = React.useState(false);
  const headingRef = React.useRef(null);
  const firstRender = React.useRef(true);

  const innings = INNINGS.find((i) => i.id === activeId) || INNINGS[0];
  const index = INNINGS.findIndex((i) => i.id === innings.id);
  const prev = index > 0 ? INNINGS[index - 1] : null;
  const next = index < INNINGS.length - 1 ? INNINGS[index + 1] : null;

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (headingRef.current) headingRef.current.focus();
  }, [activeId]);

  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") navigate("home");
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const strikeRate = ((innings.runs / innings.balls_faced) * 100).toFixed(2);
  const paragraphs = innings.narrative.split("\n\n");

  const facts = [
    { term: "Runs", value: `${innings.runs}${innings.not_out ? " not out" : ""}` },
    { term: "Balls faced", value: String(innings.balls_faced) },
    { term: "Strike rate", value: strikeRate },
    { term: "Opposition", value: innings.opposition },
    { term: "Format", value: innings.format },
    { term: "Year", value: String(innings.year) },
  ];

  return (
    <div style={{ backgroundColor: brand.backgroundColor, fontFamily: brand.fontBody, color: "#2B2620" }}>
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
            style={{ fontFamily: brand.fontHeading, color: "#A31E17" }}
          >
            {innings.runs}
            {innings.not_out ? "*" : ""} ({innings.balls_faced}) v {innings.opposition}
          </h1>
          <p className="mt-3 text-base sm:text-lg max-w-2xl" style={{ color: "#4A4136" }}>
            {innings.summary}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Badge style={{ backgroundColor: brand.primaryColor, color: "#FFFFFF" }}>{innings.format}</Badge>
            <Badge variant="outline">{innings.year}</Badge>
            <Badge variant="outline">{innings.context}</Badge>
          </div>
        </header>

        <Separator className="my-10" />

        {/* Main body: illustration + scorecard, narrative */}
        <div key={innings.id} className="sb-rise grid gap-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <div className="space-y-8">
            <div>
              <PixelSprite paletteName={innings.palette} label={innings.alt_text} />
              <p className="mt-3 text-xs font-mono text-center" style={{ color: brand.neutralColor }}>
                Original pixel-art illustration
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base" style={{ fontFamily: brand.fontHeading }}>
                  Scorecard
                </CardTitle>
                <CardDescription>{innings.context}</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="divide-y" style={{ borderColor: "#E4D6B4" }}>
                  {facts.map((f) => (
                    <div key={f.term} className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="text-sm" style={{ color: brand.neutralColor }}>
                        {f.term}
                      </dt>
                      <dd className="font-mono text-sm sm:text-base font-semibold" style={{ color: "#2B2620" }}>
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-10">
            <section aria-labelledby="situation-heading">
              <h2
                id="situation-heading"
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: brand.fontHeading, color: "#A31E17" }}
              >
                Match situation
              </h2>
              <div
                className="mt-4 p-5"
                style={{
                  borderLeft: `4px solid ${brand.accentColor}`,
                  backgroundColor: "#FBEFD3",
                  borderRadius: brand.radius,
                }}
              >
                <p className="text-base leading-relaxed" style={{ color: "#3A342C" }}>
                  {innings.situation}
                </p>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {innings.tags.map((t) => (
                  <li key={t}>
                    <span
                      className="inline-block font-mono text-xs px-2.5 py-1"
                      style={{ border: "2px solid #2B2620", borderRadius: "0.25rem", color: "#2B2620" }}
                    >
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="narrative-heading">
              <h2
                id="narrative-heading"
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: brand.fontHeading, color: "#A31E17" }}
              >
                Why it mattered
              </h2>
              <div className="mt-4 space-y-5 max-w-prose">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-base sm:text-[17px] leading-[1.75]" style={{ color: "#3A342C" }}>
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
                  {prev ? `${prev.runs}${prev.not_out ? "*" : ""} v ${prev.opposition}` : "Start of showcase"}
                </span>
              </Button>
              <Button
                variant="outline"
                className="justify-end flex-1"
                disabled={!next}
                onClick={() => next && setActiveId(next.id)}
              >
                <span className="truncate">
                  {next ? `${next.runs}${next.not_out ? "*" : ""} v ${next.opposition}` : "End of showcase"}
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
            style={{ fontFamily: brand.fontHeading, color: "#A31E17" }}
          >
            More great innings
          </h2>
          <p className="mt-2 text-sm" style={{ color: brand.neutralColor }}>
            Eight curated knocks, 2012 to 2023. Choose one to read its write-up here.
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
                      border: isActive ? `3px solid ${brand.primaryColor}` : "2px solid #E0D0AC",
                      backgroundColor: isActive ? "#EDF2FE" : "#FFFCF2",
                    }}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-mono text-lg font-bold" style={{ color: "#2B2620" }}>
                        {item.runs}
                        {item.not_out ? "*" : ""} ({item.balls_faced})
                      </span>
                      <span className="font-mono text-xs" style={{ color: brand.neutralColor }}>
                        {item.year}
                      </span>
                    </span>
                    <span className="mt-1 block font-semibold text-sm" style={{ color: "#3A342C" }}>
                      v {item.opposition}
                    </span>
                    <span className="mt-1 block text-xs" style={{ color: brand.neutralColor }}>
                      {item.format} · {item.context}
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

        <footer className="mt-14 pt-8" style={{ borderTop: "2px solid #E0D0AC" }}>
          <p className="text-sm max-w-2xl leading-relaxed" style={{ color: brand.neutralColor }}>
            An unofficial fan and portfolio project. Not endorsed by or affiliated with Virat Kohli, the BCCI, the ICC
            or any franchise. Career figures and innings details are a point-in-time snapshot compiled from public
            records on {SNAPSHOT_DATE} and may not reflect the current record.
          </p>
        </footer>
      </div>
    </div>
  );
}
