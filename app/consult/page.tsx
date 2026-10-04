import type { Metadata } from "next";
import Header from "@/components/Header";
import { WHATSAPP_URL, WHATSAPP_ICON_PATH } from "@/lib/site";

export const metadata: Metadata = {
  title: "Consult an Expert | ASTRODISHA",
};

export default function ConsultPage() {
  return (
    <>
      <Header />

      <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen px-5 py-14 sm:px-8">
        <section className="mx-auto max-w-4xl text-center">
          <p style={{ color: "var(--astro-accent)" }} className="text-[10px] font-semibold uppercase tracking-[0.2em]">
            Expert Guidance
          </p>

          <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-4 text-4xl leading-tight sm:text-6xl">
            Find What Aligns With You.
          </h1>

          <p style={{ color: "var(--astro-mauve)" }} className="mx-auto mt-5 max-w-2xl text-sm leading-7">
            Connect with AstroDisha for guidance around gemstones,
            crystals, Rudraksha and spiritual practices.
          </p>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold transition hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d={WHATSAPP_ICON_PATH} />
            </svg>
            Continue on WhatsApp
          </a>
        </section>
      </main>
    </>
  );
}
