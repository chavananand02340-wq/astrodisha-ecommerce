"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Icon from "../ui/Icon";
import { WHATSAPP_NUMBER } from "@/lib/site";

/* Personal ritual: pick your Rashi (moon sign) → the gemstone traditionally
   associated with its ruling planet. Copy is deliberately soft ("traditionally
   associated") and always points to an expert before wearing. */

type Stone = {
  name: string;
  hindi: string;
  planet: string;
  meaning: string;
  /** search term for /gemstones?q= */
  query: string;
  color: [string, string];
};

const STONES: Record<string, Stone> = {
  coral: { name: "Red Coral", hindi: "Moonga", planet: "Mars", meaning: "Linked with courage, energy and drive.", query: "coral", color: ["#ff8a73", "#c2361f"] },
  opal: { name: "Diamond / Opal", hindi: "Heera", planet: "Venus", meaning: "Linked with harmony, beauty and relationships.", query: "opal", color: ["#ffffff", "#b9c7e6"] },
  emerald: { name: "Emerald", hindi: "Panna", planet: "Mercury", meaning: "Linked with communication, intellect and clarity.", query: "emerald", color: ["#6fe3a6", "#11804f"] },
  pearl: { name: "Pearl", hindi: "Moti", planet: "Moon", meaning: "Linked with a calm mind and emotional balance.", query: "pearl", color: ["#ffffff", "#e7dccb"] },
  ruby: { name: "Ruby", hindi: "Manik", planet: "Sun", meaning: "Linked with confidence, vitality and leadership.", query: "ruby", color: ["#ff6b8a", "#a3082e"] },
  yellowSapphire: { name: "Yellow Sapphire", hindi: "Pukhraj", planet: "Jupiter", meaning: "Linked with wisdom, prosperity and growth.", query: "yellow sapphire", color: ["#ffe98a", "#d49a07"] },
  blueSapphire: { name: "Blue Sapphire", hindi: "Neelam", planet: "Saturn", meaning: "Linked with discipline, focus and protection.", query: "blue sapphire", color: ["#7fa6ff", "#1c3d9e"] },
};

const RASHIS: { name: string; en: string; glyph: string; stone: keyof typeof STONES }[] = [
  { name: "Mesh", en: "Aries", glyph: "♈", stone: "coral" },
  { name: "Vrishabh", en: "Taurus", glyph: "♉", stone: "opal" },
  { name: "Mithun", en: "Gemini", glyph: "♊", stone: "emerald" },
  { name: "Kark", en: "Cancer", glyph: "♋", stone: "pearl" },
  { name: "Simha", en: "Leo", glyph: "♌", stone: "ruby" },
  { name: "Kanya", en: "Virgo", glyph: "♍", stone: "emerald" },
  { name: "Tula", en: "Libra", glyph: "♎", stone: "opal" },
  { name: "Vrishchik", en: "Scorpio", glyph: "♏", stone: "coral" },
  { name: "Dhanu", en: "Sagittarius", glyph: "♐", stone: "yellowSapphire" },
  { name: "Makar", en: "Capricorn", glyph: "♑", stone: "blueSapphire" },
  { name: "Kumbh", en: "Aquarius", glyph: "♒", stone: "blueSapphire" },
  { name: "Meen", en: "Pisces", glyph: "♓", stone: "yellowSapphire" },
];

function GemGlyph({ color, id }: { color: [string, string]; id: string }) {
  return (
    <svg viewBox="0 0 64 64" className="h-20 w-20 drop-shadow-[0_10px_24px_rgba(0,0,0,0.18)]" aria-hidden="true">
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color[0]} />
          <stop offset="100%" stopColor={color[1]} />
        </linearGradient>
      </defs>
      <path d="M18 10h28l12 14-26 32L6 24z" fill={`url(#g-${id})`} />
      <path d="M6 24h52M18 10l8 14 6 32M46 10l-8 14-6 32M26 24l6-14 6 14" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
    </svg>
  );
}

/** Slowly turning gold zodiac wheel — the placeholder before a Rashi is chosen */
function ZodiacWheel() {
  const R = 84;
  // round so server and browser render identical numbers (avoids hydration warnings)
  const pt = (r: number, a: number) => [Math.round((100 + r * Math.cos(a)) * 100) / 100, Math.round((100 + r * Math.sin(a)) * 100) / 100];
  return (
    <div className="relative mx-auto h-[200px] w-[200px]" aria-hidden="true">
      <div
        className="absolute inset-6 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(215,180,106,0.28), transparent 70%)" }}
      />
      <svg viewBox="0 0 200 200" className="astro-wheel absolute inset-0 h-full w-full">
        <circle cx="100" cy="100" r="96" fill="none" stroke="#c6a15b" strokeOpacity="0.55" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="72" fill="none" stroke="#c6a15b" strokeOpacity="0.35" strokeWidth="0.8" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="#c6a15b" strokeOpacity="0.3" strokeWidth="0.8" strokeDasharray="2 4" />
        {RASHIS.map((r, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const a2 = a + Math.PI / 12;
          return (
            <g key={r.name}>
              <line
                x1={pt(72, a2)[0]}
                y1={pt(72, a2)[1]}
                x2={pt(96, a2)[0]}
                y2={pt(96, a2)[1]}
                stroke="#c6a15b"
                strokeOpacity="0.45"
                strokeWidth="0.8"
              />
              <text
                x={pt(R, a)[0]}
                y={pt(R, a)[1]}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fill="#e3c27e"
                style={{ fontFamily: '"Segoe UI Symbol", "Noto Sans Symbols 2", "Apple Symbols", serif' }}
              >
                {r.glyph + "\uFE0E"}
              </text>
            </g>
          );
        })}
      </svg>
      {/* still centre gem */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 64 64" className="h-14 w-14 drop-shadow-[0_0_18px_rgba(227,194,126,0.55)]">
          <defs>
            <linearGradient id="wheel-gem" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff3cf" />
              <stop offset="100%" stopColor="#c6a15b" />
            </linearGradient>
          </defs>
          <path d="M18 10h28l12 14-26 32L6 24z" fill="url(#wheel-gem)" />
          <path d="M6 24h52M18 10l8 14 6 32M46 10l-8 14-6 32M26 24l6-14 6 14" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
        </svg>
      </div>
    </div>
  );
}

export default function FindYourStone() {
  const [selected, setSelected] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const rashi = RASHIS.find((r) => r.name === selected);
  const stone = rashi ? STONES[rashi.stone] : null;

  function choose(name: string) {
    setSelected(name);
    // On phones the result sits below the grid — bring it into view
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    }
  }

  const askUrl = stone
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hi AstroDisha, my Rashi is ${rashi?.name}. Is ${stone.name} (${stone.hindi}) right for me?`
      )}`
    : "";

  return (
    <section id="find-your-stone" className="scroll-mt-20 px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <div className="text-center lg:text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-astro-accent">Personal ritual</p>
            <h2 className="astro-serif mt-2 text-[34px] leading-tight text-astro-text sm:text-[46px]">Find Your Stone</h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-6 text-astro-body lg:mx-0">
              Select your Rashi and discover the gemstone traditionally associated with it.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-4 gap-2.5 sm:grid-cols-6 sm:gap-3" role="radiogroup" aria-label="Choose your Rashi">
            {RASHIS.map((r) => {
              const active = selected === r.name;
              return (
                <button
                  key={r.name}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => choose(r.name)}
                  className={`group flex flex-col items-center rounded-2xl border px-1 py-3 transition-all duration-300 ${
                    active
                      ? "border-astro-primary bg-astro-primary text-astro-on-primary shadow-astro-md"
                      : "border-astro-border bg-astro-card text-astro-text hover:-translate-y-0.5 hover:border-astro-gold hover:shadow-astro-sm"
                  }`}
                >
                  <span
                    className={`text-[22px] leading-none ${active ? "text-[#e3c27e]" : "text-astro-accent"}`}
                    style={{ fontFamily: '"Segoe UI Symbol", "Noto Sans Symbols 2", "Apple Symbols", serif' }}
                    aria-hidden="true"
                  >
                    {r.glyph}
                    {"︎"}
                  </span>
                  <span className="mt-1.5 text-[12px] font-medium">{r.name}</span>
                  <span className={`text-[10px] ${active ? "opacity-70" : "text-astro-mauve"}`}>{r.en}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div ref={resultRef}>
          <div
            className={`relative overflow-hidden rounded-[32px] border p-8 text-center transition-colors duration-500 sm:p-10 ${
              stone ? "border-astro-border bg-astro-card shadow-astro-md" : "border-transparent bg-[#1b0c33] text-[#f4effb]"
            }`}
            aria-live="polite"
          >
            {stone && rashi ? (
              <div key={rashi.name} className="astro-fade-up">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[radial-gradient(circle,var(--astro-gold-soft),transparent_70%)]">
                  <GemGlyph color={stone.color} id={rashi.stone} />
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-astro-accent">
                  Your Rashi · {rashi.name}
                </p>
                <h3 className="astro-serif mt-2 text-[38px] leading-none text-astro-text">{stone.name}</h3>
                <p className="mt-2 text-[13px] text-astro-mauve">
                  {stone.hindi} · {stone.planet}
                </p>
                <p className="mx-auto mt-4 max-w-xs text-[14.5px] leading-6 text-astro-body">{stone.meaning}</p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Link
                    href={`/gemstones?q=${encodeURIComponent(stone.query)}`}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-astro-primary px-6 text-[14px] font-semibold text-astro-on-primary transition hover:bg-astro-primary-hover"
                  >
                    Shop {stone.name.split(" / ")[0]} <Icon name="arrowRight" className="h-4 w-4" />
                  </Link>
                  <a
                    href={askUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center rounded-full bg-astro-gold px-6 text-[14px] font-semibold text-[#1d0b38] transition hover:brightness-105"
                  >
                    Ask an Expert
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <ZodiacWheel />
                <h3 className="astro-serif mt-6 text-[30px] leading-tight">Your stone awaits</h3>
                <p className="mt-2 text-[13.5px] text-[#f4effb]/70">Tap your Rashi to reveal it ✦</p>
              </div>
            )}
          </div>
          <p className="mx-auto mt-4 max-w-sm text-center text-[11.5px] leading-5 text-astro-mauve">
            Based on traditional Vedic associations. Please consult our expert before wearing any gemstone.
          </p>
        </div>
      </div>
    </section>
  );
}
