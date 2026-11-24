"use client";

import { useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "../ui/Icon";

/* "Not Just Chosen. Prepared For You."
   Six steps on a zig-zag gold line. When the section comes into view it plays by
   itself: a glowing light travels 01 → 06, the line fills with gold behind it and
   each step lights up; the row slides along on phones. At 06 it rests, glides back
   and plays again.
   The moment a visitor touches / swipes (or hovers on desktop) it stops and hands
   over control: swiping the row back and forth moves the light with it. Tapping a
   step jumps to it. After a few quiet seconds it carries on by itself. */

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

const SEGMENT_MS = 1100; // light travel between two steps
const START_HOLD_MS = 400;
const END_HOLD_MS = 1800;
const REWIND_MS = 1200;
const IDLE_RESUME_MS = 4000; // carry on by itself after the visitor stops touching

const ease = (f: number) => (f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2);

export default function JourneyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const litRef = useRef<SVGPolylineElement>(null);
  const glowRef = useRef<SVGPolylineElement>(null);
  const orbRef = useRef<SVGGElement>(null);
  const jumpRef = useRef<(i: number) => void>(() => {});

  const [stepW, setStepW] = useState(150);
  const [active, setActive] = useState(1); // how many steps are lit (1–6)

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
    const section = sectionRef.current;
    const scroller = scrollerRef.current;
    const lit = litRef.current;
    const glow = glowRef.current;
    const orb = orbRef.current;
    if (!section || !scroller || !lit || !glow || !orb) return;

    const segments = STEPS.length - 1;
    const travelMs = segments * SEGMENT_MS;

    type Mode = "play" | "hold" | "rewind" | "user";
    let mode: Mode = "play";
    let clock = 0; // ms inside the current mode
    let p = 0; // light position along the whole path, 0..1
    let rewindFrom = 1;
    let visible = false;
    let drawn = -1;
    let lastActive = -1;
    let idleTimer = 0;
    let frame = 0;
    let last = performance.now();

    const maxScroll = () => scroller.scrollWidth - scroller.clientWidth;

    const draw = () => {
      if (Math.abs(p - drawn) < 0.0002) return;
      drawn = p;
      const t = p * segments;
      const i = Math.min(Math.floor(t), segments - 1);
      const f = t - i;
      const a = points[i];
      const b = points[i + 1];
      const x = a.x + (b.x - a.x) * f;
      const y = a.y + (b.y - a.y) * f;
      const travelled = segLens.slice(0, i).reduce((s, l) => s + l, 0) + segLens[i] * f;
      const offset = String(total - travelled);
      lit.style.strokeDashoffset = offset;
      glow.style.strokeDashoffset = offset;
      orb.setAttribute("transform", `translate(${x} ${y})`);

      const nowActive = Math.min(STEPS.length, Math.floor(t + 0.06) + 1);
      if (nowActive !== lastActive) {
        lastActive = nowActive;
        setActive(nowActive);
      }
    };

    // while playing by itself, slide the row on phones to follow the light
    const follow = () => {
      const max = maxScroll();
      if (max > 4 && Math.abs(scroller.scrollLeft - p * max) >= 0.5) {
        scroller.scrollLeft = p * max;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;

      if (visible && mode !== "user") {
        clock += dt;
        if (mode === "play") {
          const moving = Math.max(clock - START_HOLD_MS, 0);
          const raw = Math.min(moving / SEGMENT_MS, segments);
          const seg = Math.min(Math.floor(raw), segments - 1);
          p = (seg + ease(raw - seg)) / segments;
          if (moving >= travelMs) {
            p = 1;
            mode = "hold";
            clock = 0;
          }
        } else if (mode === "hold") {
          if (clock >= END_HOLD_MS) {
            mode = "rewind";
            clock = 0;
            rewindFrom = p;
          }
        } else if (mode === "rewind") {
          const f = Math.min(clock / REWIND_MS, 1);
          p = rewindFrom * (1 - ease(f));
          if (f >= 1) {
            p = 0;
            mode = "play";
            clock = 0;
          }
        }
        follow();
      }

      draw();
      frame = requestAnimationFrame(tick);
    };

    // Visitor takes over: stop, and resume by itself after a quiet moment
    const takeOver = () => {
      mode = "user";
      window.clearTimeout(idleTimer);
    };
    const releaseSoon = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (p >= 0.999) {
          mode = "hold";
          clock = 0;
        } else {
          // continue playing from where the light is now
          mode = "play";
          clock = START_HOLD_MS + p * travelMs;
        }
      }, IDLE_RESUME_MS);
    };

    // swiping the row moves the light with it
    const onScroll = () => {
      const max = maxScroll();
      if (max <= 4) return;
      // ignore the scrolls we make ourselves while auto-playing
      if (mode !== "user" && Math.abs(scroller.scrollLeft - p * max) < 2) return;
      takeOver();
      p = Math.min(Math.max(scroller.scrollLeft / max, 0), 1);
      releaseSoon();
    };

    const onTouchStart = () => takeOver();
    const onTouchEnd = () => releaseSoon();
    const onEnter = () => takeOver();
    const onLeave = () => releaseSoon();

    jumpRef.current = (i: number) => {
      takeOver();
      p = i / segments;
      const max = maxScroll();
      if (max > 4) scroller.scrollTo({ left: p * max, behavior: "smooth" });
      releaseSoon();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.35 }
    );
    io.observe(section);

    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchend", onTouchEnd, { passive: true });
    scroller.addEventListener("mouseenter", onEnter);
    scroller.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(idleTimer);
      io.disconnect();
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("touchstart", onTouchStart);
      scroller.removeEventListener("touchend", onTouchEnd);
      scroller.removeEventListener("mouseenter", onEnter);
      scroller.removeEventListener("mouseleave", onLeave);
    };
    // geometry depends on the measured step width
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepW]);

  const trackW = stepW * STEPS.length;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#160828] py-12 text-[#f4effb] sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[1000px] -translate-x-1/2 rounded-full opacity-70"
        style={{ background: "radial-gradient(closest-side, rgba(94, 62, 160, 0.5), transparent)" }}
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

        <div ref={scrollerRef} className="no-scrollbar mt-4 overflow-x-auto overscroll-x-contain sm:mt-6">
          <div className="relative mx-auto" style={{ width: trackW, height: STEP_H }}>
            {/* zig-zag: dim base line, soft glow + gold "filled" line, travelling light */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-visible"
              width={trackW}
              height={STEP_H}
            >
              <defs>
                <radialGradient id="astro-journey-orb">
                  <stop offset="0%" stopColor="#fff6dc" />
                  <stop offset="35%" stopColor="#f3d48f" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#d7b46a" stopOpacity="0" />
                </radialGradient>
              </defs>
              <polyline points={polyline} fill="none" stroke="#c6a15b" strokeOpacity="0.22" strokeWidth="1.4" />
              <polyline
                ref={glowRef}
                points={polyline}
                fill="none"
                stroke="#e3c27e"
                strokeOpacity="0.25"
                strokeWidth="7"
                strokeLinecap="round"
                style={{ strokeDasharray: total, strokeDashoffset: total }}
              />
              <polyline
                ref={litRef}
                points={polyline}
                fill="none"
                stroke="#e3c27e"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ strokeDasharray: total, strokeDashoffset: total }}
              />
              <g ref={orbRef} transform={`translate(${points[0].x} ${points[0].y})`}>
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
                    <button
                      type="button"
                      onClick={() => jumpRef.current(i)}
                      aria-label={`Step ${i + 1}: ${step.title}`}
                      className={`absolute left-1/2 z-10 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#3a2160,#1b0c33)] transition-[box-shadow,color,transform] duration-500 ${
                        lit
                          ? "scale-105 text-[#f3d48f] shadow-[0_0_0_1px_rgba(232,194,120,0.95),0_0_28px_rgba(214,172,92,0.6)]"
                          : "text-[#e3c27e]/45 shadow-[0_0_0_1px_rgba(198,161,91,0.3)]"
                      }`}
                      style={{ top: y }}
                    >
                      <Icon name={step.icon} className="h-[21px] w-[21px]" strokeWidth={1.6} />
                    </button>

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

        <p className="mt-2 text-center text-[11px] tracking-wide text-[#f4effb]/45 md:hidden">Swipe to explore ↔</p>
      </div>
    </section>
  );
}
