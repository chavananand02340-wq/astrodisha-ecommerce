import Link from "next/link";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import { categories } from "@/data/categories";
import { getFeaturedProducts } from "@/lib/getProducts";
import { getActiveBanner } from "@/lib/getBanner";
import { getActiveTestimonials } from "@/lib/getTestimonials";
import { WHATSAPP_URL, ALL_PRODUCTS_URL, WHATSAPP_ICON_PATH } from "@/lib/site";

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

const TRUST_ITEMS = [
  { icon: ICONS.shield, title: "Authentic Selection", href: "/why/authenticity" },
  { icon: ICONS.card, title: "Secure Checkout", href: "/why/secure-checkout" },
  { icon: ICONS.gem, title: "Quality Assured", href: "/why/quality-assured" },
  { icon: ICONS.user, title: "Expert Guidance", href: "/why/expert-guidance" },
];

const WHY_ITEMS = [
  {
    slug: "authenticity",
    icon: ICONS.shield,
    title: "Authenticity First",
    text: "Products presented with clear information and quality-focused selection.",
  },
  {
    slug: "expert-guidance",
    icon: ICONS.user,
    title: "Expert Guidance",
    text: "Get help understanding products before making your choice.",
  },
  {
    slug: "premium-experience",
    icon: ICONS.gem,
    title: "Premium Experience",
    text: "A calm, elegant shopping experience designed around your journey.",
  },
];

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8);
  const activeBanner = await getActiveBanner();
  const testimonials = await getActiveTestimonials(6);

  return (
    <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="px-4 pb-10 pt-7 sm:px-6 sm:pb-16 sm:pt-12">
        <div
          style={{ backgroundColor: "var(--astro-card)" }}
          className="mx-auto grid max-w-7xl items-center gap-8 overflow-hidden rounded-2xl p-5 sm:p-8 lg:grid-cols-2 lg:p-12"
        >
          <div className="astro-fade-up">
            <p style={{ color: "var(--astro-mauve)" }} className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em]">
              ASTRODISHA
            </p>

            <span style={{ backgroundColor: "var(--astro-accent)" }} className="mb-5 block h-px w-12" aria-hidden="true" />

            <h1 style={{ color: "var(--astro-text)" }} className="astro-serif max-w-xl text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              {activeBanner ? activeBanner.title : (
                <>
                  Discover What
                  <br />
                  Aligns With You.
                </>
              )}
            </h1>

            <p style={{ color: "var(--astro-text)", opacity: 0.75 }} className="mt-5 max-w-lg text-sm leading-6 sm:text-base">
              {activeBanner?.subtitle ||
                "Explore authentic gemstones, crystals, Rudraksha and Puja essentials selected for your spiritual journey."}
            </p>

            <div className="mt-7 flex w-full max-w-xs flex-col gap-3">
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
                style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold tracking-wide transition hover:opacity-90"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Connect with Our Experts
              </a>
            </div>
          </div>

          <div className="h-[300px] overflow-hidden rounded-xl sm:h-[420px]">
            <SafeImage
              src={
                activeBanner?.image_url ||
                "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=85"
              }
              alt={activeBanner?.title || "Premium gemstone jewellery representing spiritual alignment"}
            />
          </div>
        </div>
      </section>

      {/* TRUST — now clickable cards with Learn More */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
          {TRUST_ITEMS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="flex flex-col items-center rounded-2xl border px-4 py-6 text-center shadow-[0_4px_20px_rgba(36,16,70,0.05)] transition duration-200 ease-in-out hover:-translate-y-0.5 hover:border-[#b69bee]"
            >
              <span
                style={{ backgroundColor: "rgba(182, 155, 238, 0.15)" }}
                className="flex h-14 w-14 items-center justify-center rounded-full"
                aria-hidden="true"
              >
                <LineIcon icon={item.icon} className="h-7 w-7" />
              </span>

              <span style={{ color: "var(--astro-text)" }} className="mt-3 text-[12px] font-semibold uppercase tracking-[0.06em] sm:text-[13px]">
                {item.title}
              </span>

              <span style={{ color: "var(--astro-primary)" }} className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em]">
                Learn More →
              </span>
            </Link>
          ))}
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

          {/* Horizontal scroll row — add any number of categories */}
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

      {/* FEATURED PRODUCTS */}
      <section style={{ backgroundColor: "var(--astro-card)" }} className="px-4 py-12 sm:px-6 sm:py-16">
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

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
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
                  {t.rating && (
                    <p style={{ color: "var(--astro-accent)" }} className="text-sm">
                      {"★".repeat(t.rating)}
                      {"☆".repeat(5 - t.rating)}
                    </p>
                  )}

                  <p style={{ color: "var(--astro-text)", opacity: 0.85 }} className="mt-3 text-sm leading-6">
                    "{t.testimonial_text}"
                  </p>

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
      )}

      {/* CONSULTATION */}
      <section id="consult" className="px-4 py-12 sm:px-6 sm:py-16">
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

      {/* WHY ASTRODISHA — now horizontal scroll */}
      <section className="px-5 py-[55px] md:px-6 md:py-[70px] lg:py-[90px]">
        <div className="mx-auto max-w-[1100px] lg:px-8">
          <p style={{ color: "var(--astro-accent)" }} className="mb-6 text-center text-[14px] font-semibold uppercase tracking-[3px]">
            Why AstroDisha
          </p>

          <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mx-auto mb-10 max-w-[800px] text-center text-[42px] font-normal leading-[1.05] md:mb-[65px] md:text-[52px] lg:text-[64px]">
            Thoughtfully Chosen.
            <br />
            Simply Presented.
          </h2>

          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:gap-6 lg:px-0">
            {WHY_ITEMS.map((item) => (
              <Link
                key={item.slug}
                href={`/why/${item.slug}`}
                className="flex w-[82%] shrink-0 snap-start items-center gap-4 rounded-[22px] border border-[color:var(--astro-border)] bg-[color:var(--astro-card)] px-5 py-6 shadow-[0_4px_20px_rgba(36,16,70,0.05)] transition duration-200 ease-in-out hover:-translate-y-0.5 hover:border-[#b69bee] sm:w-[46%] sm:min-h-[150px] md:gap-7 md:p-8 lg:w-[31%] lg:px-12 lg:py-10"
              >
                <span
                  style={{ backgroundColor: "rgba(182, 155, 238, 0.15)" }}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16 md:h-[70px] md:w-[70px] lg:h-[76px] lg:w-[76px]"
                  aria-hidden="true"
                >
                  <LineIcon icon={item.icon} className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                </span>

                <div className="min-w-0">
                  <h3 style={{ color: "var(--astro-text)" }} className="astro-serif text-[20px] font-normal leading-tight sm:text-[26px] lg:text-[36px]">
                    {item.title}
                  </h3>

                  <p style={{ color: "var(--astro-mauve)" }} className="mt-1.5 text-[13px] leading-[1.5] sm:text-[15px] lg:text-[18px]">
                    {item.text}
                  </p>

                  <span style={{ color: "var(--astro-primary)" }} className="mt-2 inline-block text-[11px] font-semibold uppercase tracking-[0.12em]">
                    Learn more →
                  </span>
                </div>
              </Link>
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
            <p style={{ color: "#c6a15b" }} className="mt-3 text-[14px] font-medium tracking-[2.5px]">
              GUIDANCE&nbsp;&nbsp;•&nbsp;&nbsp;HEALING&nbsp;&nbsp;•&nbsp;&nbsp;DIVINE ALIGNMENT
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-8 sm:mx-auto sm:max-w-md">
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
