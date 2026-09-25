import Header from "@/components/Header";
import { WHATSAPP_URL, WHATSAPP_ICON_PATH } from "@/lib/site";

const FEATURES = [
  {
    title: "Authentic Products",
    text: "Every gemstone, crystal and Rudraksha is chosen with quality-focused selection and clear information.",
  },
  {
    title: "Quality Assured",
    text: "We focus on a curated collection rather than mass listings, so every product gets real attention.",
  },
  {
    title: "Expert Guidance",
    text: "Not sure what suits your journey? Our team is a message away on WhatsApp.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen px-5 py-14 sm:px-8">
        <section className="mx-auto max-w-4xl">
          <p style={{ color: "var(--astro-accent)" }} className="text-[10px] font-semibold uppercase tracking-[0.2em]">
            About ASTRODISHA
          </p>

          <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-3 text-4xl leading-tight sm:text-6xl">
            Guidance • Healing • Divine Alignment
          </h1>

          <p style={{ color: "var(--astro-mauve)" }} className="mt-7 max-w-2xl text-[15px] leading-8">
            ASTRODISHA brings together authentic gemstones,
            crystals, Rudraksha and Puja essentials with a
            focus on thoughtful selection and meaningful
            spiritual practices.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {FEATURES.map((item) => (
              <div
                key={item.title}
                style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
                className="rounded-2xl border p-6"
              >
                <h2 style={{ color: "var(--astro-text)" }} className="astro-serif text-xl">
                  {item.title}
                </h2>
                <p style={{ color: "var(--astro-mauve)" }} className="mt-2 text-[13px] leading-6">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div
            style={{ backgroundColor: "var(--astro-primary)" }}
            className="mt-10 rounded-2xl px-6 py-10 text-center sm:px-10"
          >
            <h2 style={{ color: "var(--astro-primary-text)" }} className="astro-serif text-2xl sm:text-3xl">
              Have a question for us?
            </h2>
            <p style={{ color: "var(--astro-primary-text)", opacity: 0.8 }} className="mx-auto mt-3 max-w-md text-sm leading-6">
              We're happy to help you choose the right product for your journey.
            </p>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "var(--astro-bg)", color: "var(--astro-primary)" }}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold transition hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d={WHATSAPP_ICON_PATH} />
              </svg>
              Connect with Our Experts
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
