import Link from "next/link";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import JourneyTimeline from "@/components/home/JourneyTimeline";
import FindYourStone from "@/components/home/FindYourStone";
import MobileActionBar from "@/components/home/MobileActionBar";
import TrustStrip from "@/components/TrustStrip";
import { getCategoryContent } from "@/lib/categoryContent";
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

/* Hero photos (compressed WebP in public/images/) — until a file exists the
   cream/gold gradient below shows (a missing file simply falls through). */
const HERO_MOBILE = "/images/hero-mobile-2-1.webp";
const HERO_DESKTOP = "/images/hero-desktop.webp";
const HERO_FALLBACK = "linear-gradient(150deg, #f7efe3 0%, #f0dcc2 55%, #e7cba7 100%)";

/* Default homepage "Shop by Category" photos (files in public/images/).
   Order used on the homepage card:
   1) "Homepage card photo" uploaded in admin (categories.home_image_url)
   2) this default WebP
   3) the category page banner (categories.image_url)
   The category page banner is never changed by the homepage photo, and vice versa. */
const HOME_CATEGORY_IMAGES: Record<string, string> = {
  gemstones: "/images/category-gemstones.webp",
  crystals: "/images/category-crystals.webp",
  rudraksha: "/images/category-rudraksha.webp",
  puja: "/images/category-puja.webp",
  "crystal-jewellery": "/images/category-crystal-jewellery.webp",
  "divine-products": "/images/category-divine-products.webp",
};

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
    .select("name, slug, description, image_url, home_image_url")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  const categories = (categoriesData || []).map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    // Homepage card photo from admin → our default WebP → category banner
    image: c.home_image_url || HOME_CATEGORY_IMAGES[c.slug] || c.image_url || "/images/placeholder-product.svg",
  }));

  // An active banner (festival etc.) set in admin overrides the default hero photo
  const heroMobileImage = activeBanner?.image_url || HERO_MOBILE;
  const heroDesktopImage = activeBanner?.image_url || HERO_DESKTOP;

  const isDefaultTitle = !activeBanner?.title;

  return (
    <main className="min-h-screen bg-astro-bg pb-24 md:pb-0">
      {/* The hero photo is the largest thing on screen: tell the browser to fetch it first.
          Each screen size downloads only its own photo. */}
      <link
        rel="preload"
        as="image"
        href={heroMobileImage}
        media="(max-width: 767px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={heroDesktopImage}
        media="(min-width: 768px)"
        fetchPriority="high"
      />

      <Header />

      {/* ================================ HERO ================================ */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage: `url("${heroMobileImage}"), ${HERO_FALLBACK}`,
            backgroundSize: "cover",
            backgroundPosition: "right bottom, center",
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

        {/* Readability fades (follow the theme via --astro-bg) */}
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
              "linear-gradient(90deg, color-mix(in srgb, var(--astro-bg) 82%, transparent) 0%, color-mix(in srgb, var(--astro-bg) 55%, transparent) 22%, transparent 58%)",
          }}
        />

        <div className="relative mx-auto flex max-w-7xl flex-col justify-start px-5 pb-12 pt-9 sm:min-h-[600px] md:min-h-[560px] md:justify-center md:px-8 md:pt-10 lg:min-h-[640px]">
          <div className="astro-fade-up max-w-[66%] md:max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-astro-accent sm:text-[11px]">
              ✦ Gemstones · Crystals · Rudraksha
            </p>

            <h1 className="astro-serif mt-3 text-[34px] leading-[1.04] text-astro-text md:text-[56px] lg:text-[72px]">
              {isDefaultTitle ? (
                <>
                  Discover What <span className="italic text-astro-accent">Aligns With You.</span>
                </>
              ) : (
                activeBanner?.title
              )}
            </h1>

            <p className="mt-4 max-w-md text-[14.5px] leading-7 text-astro-body sm:text-base">
              {activeBanner?.subtitle ||
                "Explore authentic gemstones, crystals, Rudraksha and Puja essentials — purified, energised and selected for your spiritual journey."}
            </p>
          </div>

          <div className="mt-6 flex max-w-[66%] flex-col gap-2.5 sm:max-w-none sm:flex-row sm:gap-3 md:mt-9">
            <Link
              href={activeBanner?.button_link || ALL_PRODUCTS_URL}
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-astro-primary px-5 text-[13px] font-semibold text-astro-on-primary shadow-astro-md transition hover:bg-astro-primary-hover sm:h-[52px] sm:px-8 sm:text-[15px]"
            >
              {activeBanner?.button_text || "Explore Collection"}
              <ArrowIcon />
            </Link>

            <a
              href="#find-your-stone"
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-astro-gold bg-[color-mix(in_srgb,var(--astro-bg)_80%,transparent)] px-5 text-[13px] font-semibold text-astro-text backdrop-blur-sm transition hover:bg-astro-gold-soft sm:h-[52px] sm:px-8 sm:text-[15px]"
            >
              <span className="text-astro-accent">✦</span> Find Your Stone
            </a>
          </div>
        </div>
      </section>

      <TrustStrip layout="grid" />

      {/* ============================ SHOP BY CATEGORY ============================ */}
      <section className="px-4 pb-6 pt-14 sm:px-8 sm:pt-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Explore" title="Shop by Category" href={ALL_PRODUCTS_URL} />

          <div
            className="mt-7 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:[grid-template-columns:repeat(var(--cat-cols),minmax(0,1fr))]"
            style={{ "--cat-cols": Math.min(Math.max(categories.length, 3), 6) } as React.CSSProperties}
          >
            {categories.map((category, i) => {
              // odd count on phones: the last card spans the full row as a wide banner
              const wideOnMobile = categories.length % 2 === 1 && i === categories.length - 1;
              return (
              <Reveal key={category.slug} delay={i * 70} className={wideOnMobile ? "col-span-2 lg:col-span-1" : ""}>
                <Link
                  href={`/${category.slug}`}
                  className={`group relative block overflow-hidden rounded-[24px] bg-astro-surface shadow-astro-sm transition duration-500 ease-[var(--ease-astro)] hover:-translate-y-1 hover:shadow-astro-lg ${
                    wideOnMobile ? "aspect-[16/9] lg:aspect-[3/4]" : "aspect-[4/5] lg:aspect-[3/4]"
                  }`}

                >
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 ease-[var(--ease-astro)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(22,8,40,0.85)] via-[rgba(22,8,40,0.15)] to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                    <p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e3c27e] sm:block">
                      {getCategoryContent(category.slug).eyebrow}
                    </p>
                    <div className="mt-1 flex items-end justify-between gap-2">
                      <h3 className="astro-serif text-[22px] leading-[1.05] text-white sm:text-[26px] xl:text-[30px]">{category.name}</h3>
                      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition duration-300 group-hover:bg-white group-hover:text-[#2d1155] sm:flex">
                        <ArrowIcon />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================ FEATURED ============================ */}
      <section className="px-4 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Curated for you" title="Featured Collection" href={ALL_PRODUCTS_URL} />

          {featuredProducts.length === 0 ? (
            <p className="mt-6 text-center text-sm text-astro-mauve">
              New products are being added soon. Please check back shortly.
            </p>
          ) : (
            <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-9 flex justify-center">
            <Link
              href={ALL_PRODUCTS_URL}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-astro-border bg-astro-card px-7 text-[14px] font-semibold text-astro-text transition hover:border-astro-gold hover:shadow-astro-sm"
            >
              View all products <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================== JOURNEY (compact, horizontal) ======================== */}
      <JourneyTimeline />

      {/* ========================== FIND YOUR STONE ========================== */}
      <FindYourStone />

      {/* TESTIMONIALS (text / photo / video / audio) */}
      <TestimonialsSection testimonials={testimonials} />

      {/* ============================ CONSULTATION ============================ */}
      <section id="consult" className="px-4 py-10 sm:px-8 sm:py-14">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#1b0c33] px-6 py-12 text-center text-[#f4effb] sm:px-10 sm:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {[640, 480, 320].map((size) => (
              <div
                key={size}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c6a15b]/15"
                style={{ width: size, height: size }}
              />
            ))}
          </div>
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#d7b46a]">Personal guidance</p>
            <h2 className="astro-serif mt-3 text-[34px] leading-tight sm:text-[48px]">Need Help Choosing?</h2>
            <p className="mx-auto mt-3 max-w-xl text-[14px] leading-6 text-[#f4effb]/75">
              Connect with AstroDisha for guidance around gemstones, crystals, Rudraksha and spiritual essentials.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#d7b46a] px-7 text-[14px] font-semibold text-[#1d0b38] shadow-[0_10px_30px_rgba(215,180,106,0.35)] transition hover:brightness-105"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Consult an Expert
            </a>
          </div>
        </div>
      </section>

      {/* ============================ WHY ASTRODISHA ============================ */}
      <section className="px-4 pb-14 pt-6 sm:px-8 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-astro-accent">Why AstroDisha</p>
            <h2 className="astro-serif mx-auto mt-2 max-w-3xl text-[32px] leading-[1.1] text-astro-text sm:text-[48px]">
              Thoughtfully Chosen. <span className="italic text-astro-accent">Simply Presented.</span>
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-5">
            {WHY_ITEMS.map((item, i) => (
              <Reveal key={item.slug} delay={i * 60} className={i === WHY_ITEMS.length - 1 ? "col-span-2 lg:col-span-1" : ""}>
                <Link
                  href={`/why/${item.slug}`}
                  className="group flex h-full flex-col rounded-[22px] border border-astro-border bg-astro-card p-4 shadow-astro-sm transition duration-300 hover:-translate-y-1 hover:border-astro-gold hover:shadow-astro-md sm:p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-astro-gold-soft" aria-hidden="true">
                    <LineIcon icon={item.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="astro-serif mt-4 text-[19px] leading-tight text-astro-text sm:text-[22px]">{item.title}</h3>
                  <p className="mt-1.5 line-clamp-3 text-[12px] leading-[1.5] text-astro-mauve sm:text-[13px]">{item.text}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-astro-primary">
                    Learn more <span className="transition group-hover:translate-x-0.5">→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
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
            <p style={{ color: "#c6a15b" }} className="mt-3 text-[12px] font-medium tracking-[2.5px] sm:text-[14px]">
              GUIDANCE&nbsp;&nbsp;•&nbsp;&nbsp;HEALING&nbsp;&nbsp;•&nbsp;&nbsp;DIVINE ALIGNMENT
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-8 sm:mx-auto sm:max-w-2xl sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#d7b46a]">Explore</p>

              {/* Footer categories come live from Supabase (same list as Shop by Category) */}
              <div className="mt-3 flex flex-col gap-2.5 text-[13px] opacity-75">
                {categories.map((category) => (
                  <Link key={category.slug} href={`/${category.slug}`} className="transition hover:opacity-100">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#d7b46a]">Support</p>

              <div className="mt-3 flex flex-col gap-2.5 text-[13px] opacity-75">
                <Link href="/about">About Us</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/consult">Consult an Expert</Link>
                <Link href="/cart">Cart</Link>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#d7b46a]">Legal</p>

              <div className="mt-3 flex flex-col gap-2.5 text-[13px] opacity-75">
                <Link href="/privacy-policy">Privacy Policy</Link>
                <Link href="/terms">Terms & Conditions</Link>
                <Link href="/disclaimer">Disclaimer</Link>
                <Link href="/cancellation-refund">Cancellation & Refund</Link>
                <Link href="/shipping-delivery">Shipping & Delivery</Link>
                <Link href="/faq">FAQs</Link>
              </div>
            </div>
          </div>

          <div style={{ borderColor: "rgba(244, 239, 251, 0.15)" }} className="mt-8 border-t pt-5 text-center text-[11px] opacity-60">
            © {new Date().getFullYear()} ASTRODISHA. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Phones: Shop Now + WhatsApp bar. Larger screens: floating WhatsApp button. */}
      <MobileActionBar />
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with AstroDisha on WhatsApp"
        className="fixed bottom-5 right-4 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-astro-primary text-astro-on-primary shadow-astro-lg transition hover:scale-105 md:flex"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </main>
  );
}

function SectionHeading({ eyebrow, title, href }: { eyebrow: string; title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-astro-accent">{eyebrow}</p>
        <h2 className="astro-serif mt-1.5 text-[32px] leading-tight text-astro-text sm:text-[46px]">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="mb-1.5 inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-astro-primary underline-offset-4 hover:underline"
        >
          View all <ArrowIcon />
        </Link>
      )}
    </div>
  );
}
