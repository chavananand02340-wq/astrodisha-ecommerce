"use client";

import { useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "../ui/Icon";

/* "Not Just Chosen. Prepared For You."
   Six steps on a zig-zag gold line, driven by the page scroll (like a scroll story):
   the section pins to the screen while you scroll, a glowing light travels 01 → 06,
   the line fills with gold behind it and each step lights up as the light reaches it.
   Scrolling back up reverses it. On phones the row slides sideways with the light. */

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

// Extra page scroll (px) the section stays pinned for while the light travels
const PIN_SCROLL = 900;

export default function JourneyTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const litRef = useRef<SVGPolylineElement>(null);
  const glowRef = useRef<SVGPolylineElement>(null);
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
    const section = sectionRef.current;
    const scroller = scrollerRef.current;
    const stage = stageRef.current;
    const pin = pinRef.current;
    const lit = litRef.current;
    const orb = orbRef.current;
    if (!section || !scroller || !stage || !pin || !lit || !orb) return;

    const segments = STEPS.length - 1;
    let shown = -1; // progress currently drawn (0..1), eased toward target
    let drawn = -2;
    let frame = 0;
    let lastActive = -1;

    // 0 when the pinned view starts, 1 when it is about to release
    const targetProgress = () => {
      const rect = section.getBoundingClientRect();
      // pinned distance = section height minus the pinned panel and the 68px header;
      // measured from the panel, so mobile address-bar resizing doesn't make it jump
      const range = section.offsetHeight - pin.offsetHeight - 68;
      if (range <= 0) return 1;
      // start a little before pinning and finish just before release so 06 is seen lit
      const p = (68 - rect.top + pin.offsetHeight * 0.15) / (range * 0.9);
      return Math.min(Math.max(p, 0), 1);
    };

    const draw = (p: number) => {
      const t = p * segments;
      const i = Math.min(Math.floor(t), segments - 1);
      const f = t - i;
      const a = points[i];
      const b = points[i + 1];
      const x = a.x + (b.x - a.x) * f;
      const y = a.y + (b.y - a.y) * f;
      const travelled = segLens.slice(0, i).reduce((s2, l) => s2 + l, 0) + segLens[i] * f;

      lit.style.strokeDashoffset = String(total - travelled);
      if (glowRef.current) glowRef.current.style.strokeDashoffset = String(total - travelled);
      orb.setAttribute("transform", `translate(${x} ${y})`);
      orb.style.opacity = p > 0.005 && p < 0.995 ? "1" : "0";

      const nowActive = Math.min(STEPS.length, Math.floor(t + 0.06) + 1);
      if (nowActive !== lastActive) {
        lastActive = nowActive;
        setActive(nowActive);
      }

      // phones: slide the row (GPU transform, not scrollLeft) so the light stays centred
      const max = stage.offsetWidth - scroller.clientWidth;
      const shift = max > 4 ? Math.max(0, Math.min(x - scroller.clientWidth / 2, max)) : 0;
      stage.style.transform = `translate3d(${-shift}px,0,0)`;
    };

    const loop = () => {
      const target = targetProgress();
      shown = shown < 0 ? target : shown + (target - shown) * 0.22;
      if (Math.abs(target - shown) < 0.0004) shown = target;
      if (Math.abs(shown - drawn) > 0.0001) {
        drawn = shown;
        draw(shown);
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frame);
    // geometry depends on the measured step width
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepW]);

  const trackW = stepW * STEPS.length;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#160828] text-[#f4effb]"
      style={{ height: `calc(100svh + ${PIN_SCROLL}px)` }}
    >
      <div ref={pinRef} className="sticky top-[68px] flex h-[calc(100svh-68px)] flex-col justify-center overflow-hidden py-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[1000px] -translate-x-1/2 rounded-full opacity-70"
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

        <div ref={scrollerRef} className="no-scrollbar mt-6 overflow-x-hidden sm:mt-8">
          <div ref={stageRef} className="relative mx-auto will-change-transform" style={{ width: trackW, height: STEP_H }}>
            {/* the zig-zag: dim base line, gold "filled" line, travelling light */}
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
      </div>
    </section>
  );
}
