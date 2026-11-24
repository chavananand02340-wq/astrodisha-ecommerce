"use client";

import { useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "../ui/Icon";

/* "Not Just Chosen. Prepared For You."
   Six steps on a zig-zag gold line. A glowing light travels 01 → 06 along the line;
   the line fills with gold behind it and each step lights up as the light reaches it.
   At 06 it rests, then everything resets and starts again from 01.
   On phones the row scrolls along with the light so it always stays in view.
   Driven by JavaScript so it also runs with battery-saver / reduced animations;
   touching the row pauses it (swipe by hand), and it carries on a moment later. */

const STEPS: { title: string; text: string; icon: IconName }[] = [
  { title: "Discover", text: "Find what aligns with you.", icon: "search" },
  { title: "Authenticate", text: "Tested for authenticity and quality.", icon: "shield" },
  { title: "Purify", text: "Cleansed with traditional shuddhi.", icon: "droplet" },
  { title: "Consecrate", text: "Energised with mantra and sankalp.", icon: "sun" },
  { title: "Deliver", text: "Carefully packed to your doorstep.", icon: "box" },
  { title: "Align", text: "Guidance on how to wear and use.", icon: "compass" },
];

const HIGH_Y = 120; // node centre for steps 01, 03, 05
const LOW_Y = 178; // node centre for steps 02, 04, 06
const STEP_H = 300;

const SEGMENT_MS = 1500; // light travel time between two steps
const END_HOLD_MS = 2200; // rest at 06 before starting again
const START_HOLD_MS = 700;

export default function JourneyTimeline() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const litRef = useRef<SVGPolylineElement>(null);
  const orbRef = useRef<SVGGElement>(null);

  const [stepW, setStepW] = useState(150);
  const [active, setActive] = useState(0); // how many steps are lit (0–6)

  // Measure step width (150px phones, 190px larger screens)
  useEffect(() => {
    const measure = () => {
      const first = trackRef.current?.firstElementChild as HTMLElement | null;
      if (first) setStepW(first.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const points = STEPS.map((_, i) => ({ x: stepW * (i + 0.5), y: i % 2 === 0 ? HIGH_Y : LOW_Y }));
  const segLens = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
  const total = segLens.reduce((a, b) => a + b, 0);
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  useEffect(() => {
    const scroller = scrollerRef.current;
    const lit = litRef.current;
    const orb = orbRef.current;
    if (!scroller || !lit || !orb) return;

    const segments = STEPS.length - 1;
    const travelMs = segments * SEGMENT_MS;
    const cycleMs = START_HOLD_MS + travelMs + END_HOLD_MS;

    let elapsed = 0;
    let last = performance.now();
    let paused = false;
    let resumeTimer = 0;
    let frame = 0;
    let lastActive = -1;

    const pointAt = (t: number) => {
      // t: 0..segments (segment index + fraction)
      const i = Math.min(Math.floor(t), segments - 1);
      const f = t - i;
      const a = points[i];
      const b = points[i + 1];
      return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, i, f };
    };

    const render = () => {
      const inTravel = Math.min(Math.max(elapsed - START_HOLD_MS, 0), travelMs);
      // ease each segment so the light slows as it arrives at a step
      const raw = inTravel / SEGMENT_MS;
      const seg = Math.min(Math.floor(raw), segments - 1);
      const frac = raw >= segments ? 1 : raw - seg;
      const eased = frac < 0.5 ? 2 * frac * frac : 1 - Math.pow(-2 * frac + 2, 2) / 2;
      const t = seg + eased;

      const { x, y } = pointAt(t);
      const travelled = segLens.slice(0, seg).reduce((a, b) => a + b, 0) + segLens[seg] * eased;

      lit.style.strokeDashoffset = String(total - travelled);
      orb.setAttribute("transform", `translate(${x} ${y})`);
      orb.style.opacity = elapsed < START_HOLD_MS * 0.5 ? "0" : "1";

      const nowActive = elapsed < START_HOLD_MS ? 1 : Math.min(STEPS.length, Math.floor(t + 0.08) + 1);
      if (nowActive !== lastActive) {
        lastActive = nowActive;
        setActive(nowActive);
      }

      // keep the light in view on narrow screens
      if (!paused && scroller.scrollWidth > scroller.clientWidth + 4) {
        const target = Math.max(0, Math.min(x - scroller.clientWidth / 2, scroller.scrollWidth - scroller.clientWidth));
        scroller.scrollLeft += (target - scroller.scrollLeft) * 0.12;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (!paused) {
        elapsed += dt;
        if (elapsed >= cycleMs) elapsed = 0; // back to 01
        render();
      }
      frame = requestAnimationFrame(tick);
    };

    const pause = () => {
      paused = true;
      window.clearTimeout(resumeTimer);
    };
    const resume = () => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        paused = false;
      }, 2500);
    };

    scroller.addEventListener("touchstart", pause, { passive: true });
    scroller.addEventListener("touchend", resume, { passive: true });
    render();
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resumeTimer);
      scroller.removeEventListener("touchstart", pause);
      scroller.removeEventListener("touchend", resume);
    };
    // re-start when the step width (and so the geometry) changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepW]);

  const trackW = stepW * STEPS.length;

  return (
    <section className="relative overflow-hidden bg-[#160828] py-12 text-[#f4effb] sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(94, 62, 160, 0.55), transparent)" }}
      />

      <div className="relative">
        <div className="px-5 text-center sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#d7b46a]">Not just chosen</p>
          <h2 className="astro-serif mt-2 text-[32px] leading-tight sm:text-[44px]">
            Prepared <span className="italic text-[#e3c27e]">for you</span>
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-6 text-[#f4effb]/70">
            A sacred journey — from selection to guidance, crafted for your higher alignment.
          </p>
        </div>

        <div ref={scrollerRef} className="no-scrollbar mt-6 overflow-x-auto sm:mt-8">
          <div className="relative mx-auto" style={{ width: trackW, height: STEP_H }}>
            {/* the zig-zag: dim base line, gold "filled" line, travelling light */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={trackW}
              height={STEP_H}
            >
              <defs>
                <filter id="astro-journey-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="astro-journey-orb">
                  <stop offset="0%" stopColor="#fff6dc" />
                  <stop offset="35%" stopColor="#f3d48f" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#d7b46a" stopOpacity="0" />
                </radialGradient>
              </defs>
              <polyline points={polyline} fill="none" stroke="#c6a15b" strokeOpacity="0.22" strokeWidth="1.4" />
              <polyline
                ref={litRef}
                points={polyline}
                fill="none"
                stroke="#e3c27e"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#astro-journey-glow)"
                style={{ strokeDasharray: total, strokeDashoffset: total }}
              />
              <g ref={orbRef} style={{ opacity: 0, transition: "opacity 300ms" }}>
                <circle r="16" fill="url(#astro-journey-orb)" />
                <circle r="3.2" fill="#fffaf0" />
              </g>
            </svg>

            <ol ref={trackRef} aria-label="How every piece is prepared" className="relative flex">
              {STEPS.map((step, i) => {
                const high = i % 2 === 0;
                const y = high ? HIGH_Y : LOW_Y;
                const lit = i < active;
                return (
                  <li key={step.title} className="relative w-[150px] shrink-0 sm:w-[190px]" style={{ height: STEP_H }}>
                    <span
                      className={`absolute left-1/2 z-10 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#3a2160,#1b0c33)] transition-all duration-500 ${
                        lit
                          ? "scale-105 text-[#f3d48f] shadow-[0_0_0_1px_rgba(232,194,120,0.95),0_0_28px_rgba(214,172,92,0.6)]"
                          : "text-[#e3c27e]/45 shadow-[0_0_0_1px_rgba(198,161,91,0.3)]"
                      }`}
                      style={{ top: y }}
                    >
                      <Icon name={step.icon} className="h-[21px] w-[21px]" strokeWidth={1.6} />
                    </span>

                    <div
                      className={`absolute inset-x-0 flex flex-col items-center px-2 text-center transition-opacity duration-500 ${
                        lit ? "opacity-100" : "opacity-45"
                      }`}
                      style={high ? { bottom: STEP_H - y + 38 } : { top: y + 38 }}
                    >
                      <span className="text-[10.5px] font-medium tracking-[0.2em] text-[#d7b46a]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="astro-serif mt-0.5 text-[16px] uppercase tracking-[0.08em] text-[#f4effb] sm:text-[18px]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-[11.5px] leading-[1.45] text-[#f4effb]/70 sm:text-[12.5px]">{step.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
