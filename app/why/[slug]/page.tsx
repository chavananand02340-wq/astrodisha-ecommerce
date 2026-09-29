import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { WHATSAPP_URL, ALL_PRODUCTS_URL, WHATSAPP_ICON_PATH } from "@/lib/site";

type WhyPage = {
  title: string;
  subtitle: string;
  description: string;
  icon: "shield" | "user" | "gem" | "lock" | "sparkle";
  points: string[];
};

const PAGES: Record<string, WhyPage> = {
  authenticity: {
    title: "Authenticity",
    subtitle: "Know what you are choosing.",
    description:
      "Every gemstone, crystal and Rudraksha is selected with attention to authenticity, quality and source.",
    icon: "shield",
    points: [
      "Authentic product selection",
      "Quality and source verification",
      "Clear product details and transparency",
      "Built on customer trust",
    ],
  },

  "secure-checkout": {
    title: "Secure Checkout",
    subtitle: "Simple, safe and seamless.",
    description:
      "Your shopping experience is designed to keep every step simple, secure and transparent.",
    icon: "lock",
    points: [
      "Secure payment processing",
      "A safe, straightforward checkout",
      "Order confirmation for every purchase",
      "Full transparency on payments and orders",
    ],
  },

  "quality-assured": {
    title: "Quality Assured",
    subtitle: "Quality you can choose with confidence.",
    description:
      "We focus on carefully selected products and clear information so you can make an informed choice.",
    icon: "gem",
    points: [
      "Careful, quality-first selection",
      "Every product inspected before listing",
      "Clear, honest product information",
      "Careful packaging for every order",
    ],
  },

  "expert-guidance": {
    title: "Expert Guidance",
    subtitle: "Talk to us before you decide.",
    description:
      "Not sure which gemstone, crystal or Rudraksha is right for you? Message us and we will help you understand your options.",
    icon: "user",
    points: [
      "Message us anytime on WhatsApp",
      "Tell us your intention, budget or requirement",
      "Get guidance on suitable options",
      "Make your decision with confidence",
    ],
  },

  "premium-experience": {
    title: "Premium Experience",
    subtitle: "A calm, elegant experience designed for you.",
    description:
      "From discovering the right product to receiving it with care, every step is designed to feel thoughtful, simple and premium.",
    icon: "sparkle",
    points: [
      "A curated, focused collection",
      "An easy, unhurried shopping experience",
      "Premium presentation, start to finish",
      "Careful packaging, delivery and support when needed",
    ],
  },
};

const ICONS = {
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z" />
      <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" />
    </>
  ),
  gem: (
    <>
      <path d="M6.5 4h11L21 9l-9 11L3 9l3.5-5z" />
      <path d="M3 9h18M9.5 4L8 9l4 11M14.5 4L16 9l-4 11" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16z" />
    </>
  ),
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return {};
  return {
    title: `${page.title} | ASTRODISHA`,
    description: page.description,
  };
}

export default async function WhyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  const others = Object.entries(PAGES).filter(([key]) => key !== slug);

  return (
    <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen">
      <Header />

      <article className="mx-auto max-w-2xl px-5 pb-14 pt-6 sm:px-6 sm:pt-8">
        <Link
          href="/"
          style={{ color: "var(--astro-mauve)" }}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition hover:opacity-70"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Back to Home
        </Link>

        {/* Intro */}
        <div className="mt-6 flex flex-col items-center text-center sm:mt-8">
          <span
            style={{ backgroundColor: "rgba(182, 155, 238, 0.15)" }}
            className="flex h-14 w-14 items-center justify-center rounded-full sm:h-16 sm:w-16"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 sm:h-7 sm:w-7"
              fill="none"
              stroke="var(--astro-accent)"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ICONS[page.icon]}
            </svg>
          </span>

          <p style={{ color: "var(--astro-accent)" }} className="mt-4 text-[11px] font-semibold uppercase tracking-[3px] sm:mt-5 sm:text-[12px]">
            Why AstroDisha
          </p>

          <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-3 text-[30px] leading-[1.1] sm:text-[42px]">
            {page.title}
          </h1>

          <p style={{ color: "var(--astro-text)" }} className="astro-serif mt-2 text-base italic opacity-80 sm:text-lg">
            {page.subtitle}
          </p>

          <p style={{ color: "var(--astro-mauve)" }} className="mt-4 max-w-md text-[14px] leading-[1.6] sm:text-[15px]">
            {page.description}
          </p>
        </div>

        {/* Single detailed content card */}
        <section
          style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
          className="mt-8 w-full rounded-[18px] border p-6 sm:mt-10 sm:p-8"
        >
          <h2 style={{ color: "var(--astro-text)" }} className="astro-serif text-[19px] sm:text-[22px]">
            How it works
          </h2>

          <ul className="mt-4 flex flex-col gap-3">
            {page.points.map((point) => (
              <li key={point} className="flex gap-3">
                <span
                  style={{ backgroundColor: "var(--astro-accent)" }}
                  className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
                  aria-hidden="true"
                />
                <span style={{ color: "var(--astro-mauve)" }} className="text-[14px] leading-[1.6] sm:text-[15px]">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div
          style={{ backgroundColor: "var(--astro-primary)" }}
          className="mt-8 rounded-2xl px-6 py-9 text-center sm:mt-10 sm:py-10"
        >
          <h2 style={{ color: "var(--astro-primary-text)" }} className="astro-serif text-[22px] sm:text-[28px]">
            Have a question?
          </h2>
          <p style={{ color: "var(--astro-primary-text)", opacity: 0.8 }} className="mx-auto mt-2.5 max-w-md text-[13px] leading-6 sm:text-sm">
            Our team is happy to help you before you choose.
          </p>

          <div className="mx-auto mt-6 flex max-w-xs flex-col gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "var(--astro-bg)", color: "var(--astro-primary)" }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d={WHATSAPP_ICON_PATH} />
              </svg>
              Connect with Our Experts
            </a>

            <Link
              href={ALL_PRODUCTS_URL}
              style={{ borderColor: "var(--astro-primary-text)", color: "var(--astro-primary-text)" }}
              className="inline-flex h-12 items-center justify-center rounded-full border px-6 text-sm font-semibold transition hover:opacity-80"
            >
              Explore Collection
            </Link>
          </div>
        </div>

        {/* Other pages */}
        <div className="mt-8 sm:mt-10">
          <p style={{ color: "var(--astro-accent)" }} className="text-center text-[11px] font-semibold uppercase tracking-[3px] sm:text-[12px]">
            Also Read
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {others.map(([key, other]) => (
              <Link
                key={key}
                href={`/why/${key}`}
                style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
                className="flex items-center justify-between rounded-xl border px-5 py-4 transition hover:opacity-90"
              >
                <span style={{ color: "var(--astro-text)" }} className="astro-serif text-base sm:text-lg">
                  {other.title}
                </span>
                <span style={{ color: "var(--astro-primary)" }} aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
                }
