import Header from "@/components/Header";
import { WHATSAPP_URL, WHATSAPP_ICON_PATH } from "@/lib/site";

const SUPPORT_EMAIL = "support@astrodisha.com";

export default function ContactPage() {
  return (
    <>
      <Header />

      <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen px-5 py-14 sm:px-8">
        <section className="mx-auto max-w-3xl">
          <p style={{ color: "var(--astro-accent)" }} className="text-[10px] font-semibold uppercase tracking-[0.2em]">
            Get In Touch
          </p>

          <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-3 text-4xl leading-tight sm:text-6xl">
            Contact ASTRODISHA
          </h1>

          <p style={{ color: "var(--astro-mauve)" }} className="mt-4 max-w-xl text-sm leading-7">
            Have a question about a product, an order, or anything else? Reach us through either of these.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="flex items-center gap-4 rounded-2xl border p-6 transition hover:opacity-90"
            >
              <span
                style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d={WHATSAPP_ICON_PATH} />
                </svg>
              </span>

              <span>
                <p style={{ color: "var(--astro-mauve)" }} className="text-[10px] font-semibold uppercase tracking-widest">
                  WhatsApp
                </p>
                <p style={{ color: "var(--astro-text)" }} className="astro-serif mt-1 text-lg">
                  Chat with our team
                </p>
              </span>
            </a>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="flex items-center gap-4 rounded-2xl border p-6 transition hover:opacity-90"
            >
              <span
                style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 7l8 6 8-6" />
                </svg>
              </span>

              <span>
                <p style={{ color: "var(--astro-mauve)" }} className="text-[10px] font-semibold uppercase tracking-widest">
                  Email
                </p>
                <p style={{ color: "var(--astro-text)" }} className="astro-serif mt-1 text-lg">
                  {SUPPORT_EMAIL}
                </p>
              </span>
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
