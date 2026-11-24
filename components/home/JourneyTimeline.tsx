"use client";

import { useEffect, useRef } from "react";
import Icon, { type IconName } from "../ui/Icon";

/* "Not Just Chosen. Prepared For You." — six steps on a zig-zag gold line that
   drifts slowly sideways in a seamless loop. Driven by JavaScript (not CSS) so it
   keeps moving on phones with battery-saver / reduced animations; it pauses while
   the visitor touches or hovers it, and can still be swiped by hand.
   Steps alternate high and low; each step draws its own connector to the next,
   so the zig-zag continues unbroken across the loop. */

const STEPS: { title: string; text: string; icon: IconName }[] = [
  { title: "Discover", text: "Find what aligns with you.", icon: "search" },
  { title: "Authenticate", text: "Tested for authenticity and quality.", icon: "shield" },
  { title: "Purify", text: "Cleansed with traditional shuddhi.", icon: "droplet" },
  { title: "Consecrate", text: "Energised with mantra and sankalp.", icon: "sun" },
  { title: "Deliver", text: "Carefully packed to your doorstep.", icon: "box" },
  { title: "Align", text: "Guidance on how to wear and use.", icon: "compass" },
];

// Node centres (px from the top of a 300px-tall step)
const HIGH_Y = 120;
const LOW_Y = 178;
const STEP_H = 300;

function Step({ step, i, copy = false }: { step: (typeof STEPS)[number]; i: number; copy?: boolean }) {
  const high = i % 2 === 0;
  const y = high ? HIGH_Y : LOW_Y;
  const nextY = high ? LOW_Y : HIGH_Y;

  return (
    <li className="relative w-[150px] shrink-0 sm:w-[190px]" style={{ height: STEP_H }} aria-hidden={copy || undefined}>
      {/* connector to the next step's node */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 w-full overflow-visible"
        height={STEP_H}
        viewBox={`0 0 100 ${STEP_H}`}
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1={y}
          x2="100"
          y2={nextY}
          stroke="url(#astro-journey-stroke)"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* node */}
      <span
        className="astro-node-glow absolute left-1/2 z-10 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#3a2160,#1b0c33)] text-[#e3c27e]"
        style={{ top: y, animationDelay: `${i * 0.6}s` }}
      >
        <Icon name={step.icon} className="h-[21px] w-[21px]" strokeWidth={1.6} />
      </span>

      {/* text: above the node when high, below when low */}
      <div
        className="absolute inset-x-0 flex flex-col items-center px-2 text-center"
        style={high ? { bottom: STEP_H - y + 38 } : { top: y + 38 }}
      >
        <span className="text-[10.5px] font-medium tracking-[0.2em] text-[#d7b46a]">
          {String(i + 1).padStart(2, "0")}
        </span>
        <h3 className="astro-serif mt-0.5 text-[16px] uppercase tracking-[0.08em] text-[#f4effb] sm:text-[18px]">
          {step.title}
        </h3>
        <p className="mt-1 text-[11.5px] leading-[1.45] text-[#f4effb]/65 sm:text-[12.5px]">{step.text}</p>
      </div>
    </li>
  );
}

export default function JourneyTimeline() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let pos = el.scrollLeft;
    let paused = false;
    let resumeTimer = 0;
    let frame = 0;
    let last = performance.now();
    const SPEED = 28; // px per second

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64);
      last = now;
      if (!paused) {
        const half = el.scrollWidth / 2;
        pos += (SPEED * dt) / 1000;
        if (pos >= half) pos -= half;
        el.scrollLeft = Math.round(pos);
      }
      frame = requestAnimationFrame(tick);
    };

    const pause = () => {
      paused = true;
      window.clearTimeout(resumeTimer);
    };
    const resumeSoon = (delay: number) => {
      window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(() => {
        const half = el.scrollWidth / 2;
        pos = el.scrollLeft >= half ? el.scrollLeft - half : el.scrollLeft;
        paused = false;
      }, delay);
    };
    const onTouchEnd = () => resumeSoon(2500);
    const onLeave = () => resumeSoon(300);

    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resumeTimer);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#160828] py-12 text-[#f4effb] sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(94, 62, 160, 0.55), transparent)" }}
      />

      {/* shared gradient for every connector */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="astro-journey-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#c6a15b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#e3c27e" stopOpacity="0.55" />
          </linearGradient>
        </defs>
      </svg>

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

        <div ref={scrollerRef} className="astro-journey no-scrollbar mt-6 overflow-x-auto sm:mt-8">
          <ol aria-label="How every piece is prepared" className="flex w-max">
            {STEPS.map((step, i) => (
              <Step key={step.title} step={step} i={i} />
            ))}
            {/* second copy makes the loop seamless */}
            {STEPS.map((step, i) => (
              <Step key={`dup-${step.title}`} step={step} i={i} copy />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
