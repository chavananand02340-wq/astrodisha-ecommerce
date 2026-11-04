"use client";

import { useState } from "react";

type TestimonialItem = {
  id: string | number;
  customer_name: string;
  testimonial_text?: string | null;
  rating?: number | null;
  image_url?: string | null;
  /** "text" | "image" | "video" | "audio" — added when the admin media upload ships */
  media_type?: string | null;
  media_url?: string | null;
};

const TEXT_PREVIEW_LENGTH = 180;

function TestimonialText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > TEXT_PREVIEW_LENGTH;
  const shown = expanded || !isLong ? text : text.slice(0, TEXT_PREVIEW_LENGTH).trimEnd() + "…";

  return (
    <div className="mt-3">
      <p style={{ color: "var(--astro-text)", opacity: 0.85 }} className="text-sm leading-6">
        "{shown}"
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          style={{ color: "var(--astro-primary)" }}
          className="mt-1 text-xs font-semibold underline underline-offset-2"
        >
          {expanded ? "see less" : "see more"}
        </button>
      )}
    </div>
  );
}

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: TestimonialItem[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <section className="px-4 pb-8 pt-2 sm:px-6 sm:pb-10">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p style={{ color: "var(--astro-accent)" }} className="text-[9px] font-semibold uppercase tracking-[0.18em]">
            Testimonials
          </p>
          <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mt-2 text-3xl sm:text-4xl">
            What Our Customers Say
          </h2>
        </div>

        {/* Horizontal scroll row — same style as Shop by Category */}
        <div className="no-scrollbar mt-8 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-1 pb-2 sm:scroll-px-6 sm:gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="flex w-[70%] shrink-0 snap-start flex-col rounded-xl border p-4 sm:w-[40%] sm:p-5 lg:w-[30%]"
            >
              {t.media_url && t.media_type === "video" && (
                <video
                  src={`${t.media_url}#t=0.1`}
                  controls
                  playsInline
                  preload="metadata"
                  className="mb-3 max-h-[420px] w-full rounded-lg bg-black object-contain"
                />
              )}

              {t.media_url && t.media_type === "audio" && (
                <audio src={t.media_url} controls preload="none" className="mb-3 w-full" />
              )}

              {t.media_url && t.media_type === "image" && (
                <img
                  src={t.media_url}
                  alt={`${t.customer_name}'s testimonial`}
                  loading="lazy"
                  className="mb-3 aspect-square w-full rounded-lg object-cover"
                />
              )}

              {t.rating ? (
                <p style={{ color: "var(--astro-accent)" }} className="text-sm">
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </p>
              ) : null}

              {t.testimonial_text && <TestimonialText text={t.testimonial_text} />}

              <div className="mt-auto flex items-center gap-3 pt-5">
                {t.image_url ? (
                  <img
                    src={t.image_url}
                    alt={t.customer_name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div
                    style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
                  >
                    {t.customer_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <p style={{ color: "var(--astro-text)" }} className="astro-serif text-sm">
                  {t.customer_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
