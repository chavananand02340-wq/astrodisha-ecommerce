import type { ReactNode } from "react";

type Tone = "neutral" | "gold" | "emerald" | "terracotta" | "primary";

const TONES: Record<Tone, string> = {
  neutral: "bg-astro-surface text-astro-mauve border-astro-border",
  gold: "bg-astro-gold-soft text-astro-accent border-transparent",
  emerald: "bg-astro-emerald-soft text-astro-emerald border-transparent",
  terracotta: "bg-[color-mix(in_srgb,var(--astro-terracotta)_12%,transparent)] text-astro-terracotta border-transparent",
  primary: "bg-astro-primary text-astro-on-primary border-transparent",
};

export default function Badge({
  tone = "neutral",
  className = "",
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-[3px] text-[10.5px] font-semibold uppercase tracking-[0.12em] ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
