import Link from "next/link";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import Reveal from "@/components/Reveal";
import SwipeRow from "@/components/SwipeRow";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getFeaturedProducts } from "@/lib/getProducts";
import { getActiveBanner } from "@/lib/getBanner";
import { getActiveTestimonials } from "@/lib/getTestimonials";
import { WHATSAPP_URL, ALL_PRODUCTS_URL, WHATSAPP_ICON_PATH } from "@/lib/site";
import { createClient } from "@/utils/supabase/server";

/* Simple line icons (gold via --astro-accent) */
const ICONS = {
  shield: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z" />
      <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  gem: (
    <>
      <path d="M6.5 4h11L21 9l-9 11L3 9l3.5-5z" />
      <path d="M3 9h18M9.5 4L8 9l4 11M14.5 4L16 9l-4 11" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
      <path d="M19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16z" />
    </>
  ),
  lotus: (
    <>
      <path d="M12 4c-1.8 2-2.7 4.2-2.7 6.5S10.2 15 12 17c1.8-2 2.7-4.2 2.7-6.5S13.8 6 12 4z" />
      <path d="M12 17c-2.5-.3-4.6-1.5-6-3.5.3-2.3 1.5-4 3.4-5" />
      <path d="M12 17c2.5-.3 4.6-1.5 6-3.5-.3-2.3-1.5-4-3.4-5" />
      <path d="M12 17c-3.3.6-6.3-.1-9-2 1.2-1.3 2.6-2.1 4.2-2.4" />
      <path d="M12 17c3.3.6 6.3-.1 9-2-1.2-1.3-2.6-2.1-4.2-2.4" />
    </>
  ),
  droplet: <path d="M12 3c3.5 4.2 6 7.3 6 10.5a6 6 0 0 1-12 0C6 10.3 8.5 7.2 12 3z" />,
  flame: (
    <path d="M12 3c1 3 4 4.5 4 8.5a4 4 0 0 1-8 0c0-1.6.7-2.7 1.5-3.6.3 1.3 1 1.9 1.7 2C11.3 7.6 11.3 5.3 12 3z" />
  ),
  truck: (
    <>
      <path d="M3 6h11v9H3z" />
      <path d="M14 9h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17" cy="17.5" r="1.6" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5v-16z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5a2.5 2.5 0 0 1 2.5 2.5v-16z" />
    </>
  ),
};

function LineIcon({ icon, className }: { icon: React.ReactNode; className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="var(--astro-accent)"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icon}
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={WHATSAPP_ICON_PATH} />
    </svg>
  );
}

/* Hero photos: drop these files into public/images/ — until then the
   cream/gold gradient below shows (a missing file simply falls through). */
const HERO_MOBILE = "/images/hero-mobile.jpg";
const HERO_DESKTOP = "/images/hero-desktop.jpg";
const HERO_FALLBACK = "linear-gradient(150deg, #f7efe3 0%, #f0dcc2 55%, #e7cba7 100%)";

/* Journey photos: same idea — public/images/journey-*.jpg */
const JOURNEY_STEPS = [
  { n: "01", title: "DISCOVER", text: "Find what aligns with you.", icon: ICONS.lotus, img: "/images/journey-1-discover.jpg" },
  { n: "02", title: "AUTHENTICATE", text: "Tested for authenticity and quality.", icon: ICONS.gem, img: "/images/journey-2-authenticate.jpg" },
  { n: "03", title: "PURIFY", text: "Cleansed with traditional shuddhi process.", icon: ICONS.droplet, img: "/images/journey-3-purify.jpg" },
  { n: "04", title: "CONSECRATE", text: "Energised with mantra and sankalp.", icon: ICONS.flame, img: "/images/journey-4-consecrate.jpg" },
  { n: "05", title: "DELIVER", text: "Carefully packed and delivered to your doorstep.", icon: ICONS.truck, img: "/images/journey-5-deliver.jpg" },
  { n: "06", title: "ALIGN", text: "Guidance on how to wear and use for best results.", icon: ICONS.book, img: "/images/journey-6-align.jpg" },
];

const WHY_ITEMS = [
  {
    slug: "authenticity",
    icon: ICONS.shield,
    title: "Authenticity First",
    text: "Products presented with clear information and quality-focused selection.",
  },
  {
    slug: "secure-checkout",
    icon: ICONS.card,
    title: "Secure Checkout",
    text: "Simple, safe and seamless — every step kept secure and transparent.",
  },
  {
    slug: "quality-assured",
    icon: ICONS.gem,
    title: "Quality Assured",
    text: "Carefully selected products and clear information so you can choose with confidence.",
  },
  {
    slug: "expert-guidance",
    icon: ICONS.user,
    title: "Expert Guidance",
    text: "Get help understanding products before making your choice.",
  },
  {
    slug: "premium-experience",
    icon: ICONS.sparkle,
    title: "Premium Experience",
    text: "A calm, elegant shopping experience designed around your journey.",
  },
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8);
  const activeBanner = await getActiveBanner();
  const testimonials = await getActiveTestimonials(6);

  const supabase = await createClient();
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("name, slug, description, image_url")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const categories = (categoriesData || []).map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    image: c.image_url || "/images/placeholder-product.svg",
  }));

  // An active banner (festival etc.) set in admin overrides the default hero photo
  const heroMobileImage = activeBanner?.image_url || HERO_MOBILE;
  const heroDesktopImage = activeBanner?.image_url || HERO_DESKTOP;

  return (
    <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen">
      <Header />

      {/* HERO — photo behind, text on a soft cream fade (mobile-first) */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage: `url("${heroMobileImage}"), ${HERO_FALLBACK}`,
            backgroundSize: "cover",
            backgroundPosition: "72% center, center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage: `url("${heroDesktopImage}"), ${HERO_FALLBACK}`,
            backgroundSize: "cover",
            backgroundPosition: "right center, center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Readability fades (use the page background token, so they follow the theme).
            Mobile: strong + wide, since the heading/description text spans further right.
            Desktop: lighter + narrower, since that photo already has empty sky on the left. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(90deg, color-mix(in srgb, var(--astro-bg) 90%, transparent) 0%, color-mix(in srgb, var(--astro-bg) 78%, transparent) 45%, color-mix(in srgb, var(--astro-bg) 35%, transparent) 68%, transparent 90%), linear-gradient(0deg, var(--astro-bg) 0%, transparent 30%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, color-mix(in srgb, var(--astro-bg) 80%, transparent) 0%, color-mix(in srgb, var(--astro-bg) 55%, transparent) 20%, transparent 58%)",
          }}
        />

        <div className="relative mx-auto flex min-h-[600px] max-w-7xl flex-col justify-between px-5 pb-8 pt-10 sm:min-h-[640px] md:min-h-[560px] md:justify-center md:px-8 lg:min-h-[640px]">
          <div className="astro-fade-up max-w-[80%] sm:max-w-md lg:max-w-lg">
            <p style={{ color: "var(--astro-mauve)" }} className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em]">
              ASTRODISHA
            </p>

            <span style={{ backgroundColor: "var(--astro-accent)" }} className="mb-5 block h-px w-12" aria-hidden="true" />

            <h1 style={{ color: "var(--astro-text)" }} className="astro-serif text-[40px] leading-[1.05] sm:text-5xl lg:text-6xl">
              {activeBanner ? activeBanner.title : "Discover What Aligns With You."}
            </h1>

            <p style={{ color: "var(--astro-text)", opacity: 0.78 }} className="mt-5 text-[15px] leading-7 sm:text-base">
              {activeBanner?.subtitle ||
                "Explore authentic gemstones, crystals, Rudraksha and Puja essentials selected for your spiritual journey."}
            </p>
          </div>

          <div className="mt-8 flex w-full max-w-sm flex-col gap-3 md:mt-8">
            <Link
              href={activeBanner?.button_link || "/gemstones"}
              style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold tracking-wide transition hover:opacity-90"
            >
              {activeBanner?.button_text || "Explore Collection"}
              <ArrowIcon />
            </Link>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--astro-primary)",
                borderColor: "var(--astro-primary)",
                backgroundColor: "color-mix(in srgb, var(--astro-bg) 70%, transparent)",
              }}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold tracking-wide backdrop-blur-sm transition hover:opacity-80"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Connect with Our Experts
            </a>
          </div>
        </div>
      </section>

      {/* JOURNEY — 6 steps, one connected flow (swipe on mobile, one row on desktop) */}
      <section className="px-5 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-16">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <span style={{ color: "var(--astro-accent)" }} className="text-sm" aria-hidden="true">
              ✦
            </span>
            <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mt-2 text-[28px] leading-tight sm:text-4xl">
              Not Just Chosen.{" "}
              <span style={{ color: "var(--astro-accent)" }}>Prepared For You.</span>
            </h2>
            <p style={{ color: "var(--astro-mauve)" }} className="mx-auto mt-3 max-w-md text-sm leading-6">
              A sacred journey — from selection to guidance, crafted for your higher alignment.
            </p>
          </Reveal>

          <SwipeRow
            ariaLabel="Our process"
            className="-mx-5 mt-10 scroll-px-5 px-5 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:justify-between lg:overflow-visible lg:px-0"
            itemClassName="w-[150px] sm:w-[172px] lg:w-auto lg:flex-1"
            separatorClassName="flex w-7 justify-center pt-[104px] sm:pt-[117px] lg:pt-[113px]"
            dotsClassName="lg:hidden"
            separator={
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="var(--astro-accent)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12h14M13 7l5 5-5 5" />
              </svg>
            }
            items={JOURNEY_STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 80}>
                <div className="flex flex-col items-center text-center">
                  <div className="relative mt-5 w-full">
                    <span
                      className="absolute -top-5 left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border"
                      style={{ backgroundColor: "var(--astro-primary)", borderColor: "var(--astro-accent)" }}
                    >
                      <LineIcon icon={step.icon} className="h-5 w-5" />
                    </span>

                    <div
                      className="relative aspect-[4/5] w-full overflow-hidden rounded-b-2xl rounded-t-[999px] border"
                      style={{
                        borderColor: "var(--astro-accent)",
                        backgroundImage: `url("${step.img}"), linear-gradient(160deg, #f7ecdc 0%, #efd6b6 100%)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <span
                        className="absolute bottom-2 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border text-[12px] font-semibold"
                        style={{
                          backgroundColor: "var(--astro-bg)",
                          borderColor: "var(--astro-accent)",
                          color: "var(--astro-primary)",
                        }}
                      >
                        {step.n}
                      </span>
                    </div>
                  </div>

                  <h3 style={{ color: "var(--astro-primary)" }} className="mt-4 text-[12px] font-semibold uppercase tracking-[0.12em]">
                    {step.title}
                  </h3>
                  <p style={{ color: "var(--astro-mauve)" }} className="mt-1.5 px-1 text-[11px] leading-4">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-center justify-between gap-4 px-4 sm:px-6">
            <div>
              <p style={{ color: "var(--astro-accent)" }} className="text-[9px] font-semibold uppercase tracking-[0.18em]">
                Explore
              </p>
              <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mt-1 text-3xl sm:text-4xl">
                Shop by Category
              </h2>
            </div>

            <Link
              href={ALL_PRODUCTS_URL}
              style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-5 text-xs font-semibold uppercase tracking-wide transition hover:opacity-90"
            >
              View All
              <ArrowIcon />
            </Link>
          </div>

          {/* Horizontal scroll row — categories come live from Supabase */}
          <div className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:scroll-px-6 sm:gap-5 sm:px-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
                className="group w-[44%] shrink-0 snap-start overflow-hidden rounded-xl border sm:w-[30%] lg:w-[23%]"
              >
                <div className="h-36 overflow-hidden sm:h-52">
                  <SafeImage
                    src={category.image}
                    alt={category.name}
                  />
                </div>

                <div className="p-4">
                  <h3 style={{ color: "var(--astro-text)" }} className="astro-serif text-lg">
                    {category.name}
                  </h3>

                  <p style={{ color: "var(--astro-mauve)" }} className="mt-1 line-clamp-2 text-[10px] leading-4">
                    {category.description}
                  </p>

                  <span style={{ color: "var(--astro-primary)" }} className="mt-3 inline-block text-[9px] font-semibold uppercase tracking-[0.12em]">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS — same background as Shop by Category (--astro-bg) */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p style={{ color: "var(--astro-accent)" }} className="text-[9px] font-semibold uppercase tracking-[0.18em]">
                Curated For You
              </p>

              <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mt-1 text-3xl sm:text-4xl">
                Featured Collection
              </h2>
            </div>

            <Link
              href={ALL_PRODUCTS_URL}
              style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-5 text-xs font-semibold uppercase tracking-wide transition hover:opacity-90"
            >
              View All
              <ArrowIcon />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <p style={{ color: "var(--astro-mauve)" }} className="text-sm">
              New products are being added soon. Please check back shortly.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS (text / photo / video / audio) */}
      <TestimonialsSection testimonials={testimonials} />

      {/* CONSULTATION */}
      <section id="consult" className="px-4 pb-6 pt-10 sm:px-6 sm:pb-8 sm:pt-14">
        <div
          style={{ backgroundColor: "var(--astro-primary)" }}
          className="mx-auto max-w-7xl overflow-hidden rounded-2xl px-6 py-10 text-center sm:px-10 sm:py-14"
        >
          <p style={{ color: "var(--astro-accent)" }} className="text-[9px] font-semibold uppercase tracking-[0.22em]">
            Personal Guidance
          </p>

          <h2 style={{ color: "var(--astro-primary-text)" }} className="astro-serif mt-3 text-3xl sm:text-4xl">
            Need Help Choosing?
          </h2>

          <p style={{ color: "var(--astro-primary-text)", opacity: 0.8 }} className="mx-auto mt-4 max-w-xl text-sm leading-6">
            Connect with AstroDisha for guidance around gemstones, crystals,
            Rudraksha and spiritual essentials.
          </p>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: "var(--astro-bg)", color: "var(--astro-primary)" }}
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition hover:opacity-90"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Consult an Expert
          </a>
        </div>
      </section>

      {/* WHY ASTRODISHA — 5 swipeable cards */}
      <section className="px-5 pb-10 pt-8 sm:px-6 md:pb-16 md:pt-12">
        <div className="mx-auto max-w-[1100px] lg:px-8">
          <p style={{ color: "var(--astro-accent)" }} className="mb-3 text-center text-[12px] font-semibold uppercase tracking-[3px] md:mb-5 md:text-[14px]">
            Why AstroDisha
          </p>

          <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mx-auto mb-6 max-w-[800px] text-center text-[30px] font-normal leading-[1.1] sm:text-[38px] md:mb-8 md:text-[52px] lg:text-[64px]">
            Thoughtfully Chosen.
            <br />
            Simply Presented.
          </h2>

          <SwipeRow
            ariaLabel="Why AstroDisha"
            className="-mx-5 scroll-px-5 gap-3 px-5 pb-1 sm:-mx-6 sm:scroll-px-6 sm:gap-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
            itemClassName="w-[82%] sm:w-[46%] lg:w-[31%]"
            items={WHY_ITEMS.map((item) => (
              <Link
                key={item.slug}
                href={`/why/${item.slug}`}
                className="flex h-full items-center gap-3 rounded-[18px] border border-[color:var(--astro-border)] bg-[color:var(--astro-card)] px-4 py-4 shadow-[0_4px_20px_rgba(36,16,70,0.05)] transition duration-200 ease-in-out hover:-translate-y-0.5 hover:border-[#b69bee] sm:gap-4 sm:rounded-[22px] sm:px-5 sm:py-5 md:gap-7 md:p-8 lg:px-8 lg:py-8"
              >
                <span
                  style={{ backgroundColor: "rgba(182, 155, 238, 0.15)" }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16 md:h-[70px] md:w-[70px]"
                  aria-hidden="true"
                >
                  <LineIcon icon={item.icon} className="h-5 w-5 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                </span>

                <div className="min-w-0">
                  <h3 style={{ color: "var(--astro-text)" }} className="astro-serif text-[16px] font-normal leading-tight sm:text-[24px] lg:text-[28px]">
                    {item.title}
                  </h3>

                  <p style={{ color: "var(--astro-mauve)" }} className="mt-1 line-clamp-3 text-[11px] leading-[1.4] sm:mt-1.5 sm:text-[14px] sm:leading-[1.5] lg:text-[15px]">
                    {item.text}
                  </p>

                  <span style={{ color: "var(--astro-primary)" }} className="mt-1.5 inline-block text-[10px] font-semibold uppercase tracking-[0.1em] sm:mt-2 sm:text-[11px]">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          />
        </div>
      </section>

      {/* FOOTER — always dark (client final spec: #160828) */}
      <footer
        style={{ backgroundColor: "#160828", color: "#f4effb", borderTop: "1px solid rgba(244, 239, 251, 0.08)" }}
        className="px-5 py-[45px] sm:px-6 md:py-[55px]"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div className="astro-serif text-[40px] font-normal leading-none lg:text-[48px]">
              ASTRODISHA
            </div>
            <p style={{ color: "#c6a15b" }} className="mt-3 text-[14px] font-medium tracking-[2.5px]">
              GUIDANCE&nbsp;&nbsp;•&nbsp;&nbsp;HEALING&nbsp;&nbsp;•&nbsp;&nbsp;DIVINE ALIGNMENT
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 sm:mx-auto sm:max-w-2xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider">
                Explore
              </p>

              <div className="mt-3 flex flex-col gap-2 text-xs opacity-75">
                <Link href="/gemstones">Gemstones</Link>
                <Link href="/crystals">Crystals</Link>
                <Link href="/crystal-jewellery">Crystal Jewellery</Link>
                <Link href="/rudraksha">Rudraksha</Link>
                <Link href="/puja">Puja Essentials</Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider">
                Support
              </p>

              <div className="mt-3 flex flex-col gap-2 text-xs opacity-75">
                <Link href="/about">About Us</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/consult">Consult an Expert</Link>
                <Link href="/cart">Cart</Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider">
                Legal
              </p>

              <div className="mt-3 flex flex-col gap-2 text-xs opacity-75">
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/terms">Terms & Conditions</Link>
                <Link href="/disclaimer">Disclaimer</Link>
                <Link href="/cancellation-refund">Cancellation & Refund</Link>
                <Link href="/shipping-delivery">Shipping & Delivery</Link>
                <Link href="/faq">FAQs</Link>
              </div>
            </div>
          </div>

          <div style={{ borderColor: "rgba(244, 239, 251, 0.15)" }} className="mt-8 border-t pt-5 text-center text-[9px] opacity-60">
            © {new Date().getFullYear()} ASTRODISHA. All rights reserved.
          </div>
        </div>
      </footer>

      {/* WHATSAPP */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with AstroDisha on WhatsApp"
        style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition hover:scale-105"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </main>
  );
      }
