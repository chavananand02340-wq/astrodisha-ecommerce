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

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: TestimonialItem[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <section className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p style={{ color: "var(--astro-accent)" }} className="text-[9px] font-semibold uppercase tracking-[0.18em]">
            Testimonials
          </p>
          <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mt-2 text-3xl sm:text-4xl">
            What Our Customers Say
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="rounded-xl border p-6"
            >
              {t.media_url && t.media_type === "video" && (
                <video
                  src={`${t.media_url}#t=0.1`}
                  controls
                  playsInline
                  preload="metadata"
                  className="mb-4 max-h-[420px] w-full rounded-lg bg-black object-contain"
                />
              )}

              {t.media_url && t.media_type === "audio" && (
                <audio src={t.media_url} controls preload="none" className="mb-4 w-full" />
              )}

              {t.media_url && t.media_type === "image" && (
                <img
                  src={t.media_url}
                  alt={`${t.customer_name}'s testimonial`}
                  loading="lazy"
                  className="mb-4 max-h-[360px] w-full rounded-lg object-cover"
                />
              )}

              {t.rating ? (
                <p style={{ color: "var(--astro-accent)" }} className="text-sm">
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </p>
              ) : null}

              {t.testimonial_text && (
                <p style={{ color: "var(--astro-text)", opacity: 0.85 }} className="mt-3 text-sm leading-6">
                  "{t.testimonial_text}"
                </p>
              )}

              <div className="mt-5 flex items-center gap-3">
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
