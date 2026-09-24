import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { WHATSAPP_URL, ALL_PRODUCTS_URL, WHATSAPP_ICON_PATH } from "@/lib/site";

type Section = {
  heading: string;
  points: string[];
  numbered?: boolean;
};

type WhyPage = {
  title: string;
  tagline: string;
  intro: string;
  icon: "shield" | "user" | "gem";
  sections: Section[];
  note?: string;
};

const PAGES: Record<string, WhyPage> = {
  authenticity: {
    title: "Authenticity First",
    tagline: "Know exactly what you are choosing.",
    intro:
      "Every product on AstroDisha is presented with clear, honest information, so you can choose with confidence and without confusion.",
    icon: "shield",
    sections: [
      {
        heading: "What you will see on every product",
        points: [
          "A clear product name and category.",
          "Real product photos, so you know what you are getting.",
          "A simple description of the product and its traditional significance.",
          "Transparent pricing, with delivery charges shown before you pay.",
        ],
      },
      {
        heading: "How we choose our products",
        points: [
          "We focus on quality over quantity.",
          "Our collection stays focused on gemstones, crystals, crystal jewellery, Rudraksha and puja essentials.",
          "Products are added only when their details are complete and clear.",
        ],
      },
      {
        heading: "Have a question about a product?",
        points: [
          "Ask us before you buy: size, weight, origin or any other detail.",
          "We would rather answer every question than have you guess.",
        ],
      },
    ],
  },

  "expert-guidance": {
    title: "Expert Guidance",
    tagline: "Talk to us before you decide.",
    intro:
      "Not sure which gemstone, crystal or Rudraksha is right for you? Message us and we will help you understand your options.",
    icon: "user",
    sections: [
      {
        heading: "How it works",
        numbered: true,
        points: [
          "Message us on WhatsApp.",
          "Tell us what you are looking for: your intention, budget, or a product you are considering.",
          "We help you understand the options, so you can make your own choice.",
        ],
      },
      {
        heading: "What you can ask us",
        points: [
          "The difference between similar products.",
          "How to wear, use or care for a product.",
          "Which category may suit your purpose.",
          "Questions about your order or delivery.",
        ],
      },
    ],
    note:
      "Our guidance is based on traditional practices and product knowledge. It is not a substitute for medical, legal or financial advice.",
  },

  "premium-experience": {
    title: "Premium Experience",
    tagline: "Calm and simple, from browsing to delivery.",
    intro:
      "We have designed every step of shopping with AstroDisha to feel simple, secure and unhurried.",
    icon: "gem",
    sections: [
      {
        heading: "Easy browsing",
        points: [
          "Clean categories, so you find what you need quickly.",
          "Save products to your wishlist and come back to them anytime.",
        ],
      },
      {
        heading: "Secure payments",
        points: [
          "Online payments are processed securely through Razorpay (UPI, cards and net banking).",
          "Cash on Delivery is available with a small ₹100 advance booking amount.",
        ],
      },
      {
        heading: "After you order",
        points: [
          "You receive an order confirmation email with your order details.",
          "Any question about your order? We are one WhatsApp message away.",
        ],
      },
    ],
  },
};

const ICONS = {
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
    description: page.intro,
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

      <article className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
        <Link href="/" style={{ color: "var(--astro-mauve)" }} className="text-xs font-semibold">
          ← Back to Home
        </Link>

        {/* Intro */}
        <div className="mt-8 flex flex-col items-center text-center">
          <span
            style={{ backgroundColor: "rgba(182, 155, 238, 0.15)" }}
            className="flex h-16 w-16 items-center justify-center rounded-full"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="var(--astro-accent)"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ICONS[page.icon]}
            </svg>
          </span>

          <p style={{ color: "var(--astro-accent)" }} className="mt-5 text-[12px] font-semibold uppercase tracking-[3px]">
            Why AstroDisha
          </p>

          <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-3 text-[34px] leading-[1.1] sm:text-[48px]">
            {page.title}
          </h1>

          <p style={{ color: "var(--astro-text)" }} className="astro-serif mt-2 text-lg italic opacity-80 sm:text-xl">
            {page.tagline}
          </p>

          <p style={{ color: "var(--astro-mauve)" }} className="mt-5 max-w-xl text-[15px] leading-[1.6] sm:text-base">
            {page.intro}
          </p>
        </div>

        {/* Sections */}
        <div className="mt-10 flex flex-col gap-5">
          {page.sections.map((section) => (
            <section
              key={section.heading}
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="rounded-[18px] border p-6 sm:p-8"
            >
              <h2 style={{ color: "var(--astro-text)" }} className="astro-serif text-[22px] sm:text-[26px]">
                {section.heading}
              </h2>

              <ul className="mt-4 flex flex-col gap-3">
                {section.points.map((point, i) => (
                  <li key={point} className="flex gap-3">
                    {section.numbered ? (
                      <span
                        style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                      >
                        {i + 1}
                      </span>
                    ) : (
                      <span
                        style={{ backgroundColor: "var(--astro-accent)" }}
                        className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
                        aria-hidden="true"
                      />
                    )}
                    <span style={{ color: "var(--astro-mauve)" }} className="text-[15px] leading-[1.6]">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {page.note && (
          <p
            style={{ color: "var(--astro-mauve)", borderColor: "var(--astro-border)" }}
            className="mt-5 rounded-xl border border-dashed p-4 text-xs leading-5"
          >
            {page.note}
          </p>
        )}

        {/* CTA */}
        <div
          style={{ backgroundColor: "var(--astro-primary)" }}
          className="mt-10 rounded-2xl px-6 py-10 text-center"
        >
          <h2 style={{ color: "var(--astro-primary-text)" }} className="astro-serif text-[26px] sm:text-[32px]">
            Have a question?
          </h2>
          <p style={{ color: "var(--astro-primary-text)", opacity: 0.8 }} className="mx-auto mt-3 max-w-md text-sm leading-6">
            Our team is happy to help you before you choose.
          </p>

          <div className="mx-auto mt-7 flex max-w-xs flex-col gap-3">
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
        <div className="mt-10">
          <p style={{ color: "var(--astro-accent)" }} className="text-center text-[12px] font-semibold uppercase tracking-[3px]">
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
                <span style={{ color: "var(--astro-text)" }} className="astro-serif text-lg">
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
