import Link from "next/link";
import Header from "@/components/Header";

type LegalPageLayoutProps = {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
};

export default function LegalPageLayout({
  title,
  lastUpdated,
  children
}: LegalPageLayoutProps) {
  return (
    <>
      <Header />

      <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/"
            style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
            className="inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-semibold transition hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Back to Home
          </Link>

          <p style={{ color: "var(--astro-accent)" }} className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em]">
            ASTRODISHA Legal
          </p>

          <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-3 text-4xl sm:text-5xl">
            {title}
          </h1>

          {lastUpdated && (
            <p style={{ color: "var(--astro-mauve)" }} className="mt-3 text-xs">
              Last updated: {lastUpdated}
            </p>
          )}

          <div
            style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
            className="mt-8 rounded-2xl border p-6 text-[14px] leading-[1.8] sm:p-8"
          >
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
