import Link from "next/link";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import { categories } from "@/data/categories";
import { getFeaturedProducts } from "@/lib/getProducts";
import { getActiveBanner } from "@/lib/getBanner";
import { getActiveTestimonials } from "@/lib/getTestimonials";

const WHATSAPP_URL =
  "https://wa.me/917756851026?text=" +
  encodeURIComponent("Hi AstroDisha, I need help choosing a product.");

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
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold tracking-wide transition hover:opacity-90"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91A9.88 9.88 0 0012.04 2zm0 18.15a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.23 8.23 0 018.23 8.24c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
                </svg>
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

      {/* TRUST */}
      <section style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }} className="border-y">
        <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
          {[
            ["✦", "Authentic Products"],
            ["◇", "Secure Payments"],
            ["✧", "Quality Assured"],
            ["☼", "Expert Guidance"],
          ].map(([icon, title], i) => (
            <div
              key={title}
              style={{
                borderColor: "var(--astro-border)",
                borderLeftWidth: i % 2 === 0 ? 0 : "1px",
                borderTopWidth: i >= 2 ? "1px" : 0,
              }}
              className="flex flex-col items-center px-3 py-5 text-center sm:border-l sm:border-t-0"
            >
              <span style={{ color: "var(--astro-accent)" }} className="text-lg">{icon}</span>
              <span style={{ color: "var(--astro-text)", opacity: 0.85 }} className="mt-2 text-[9px] font-semibold uppercase tracking-[0.08em] sm:text-[10px]">
                {title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p style={{ color: "var(--astro-mauve)" }} className="text-[9px] font-semibold uppercase tracking-[0.18em]">
                Explore
              </p>
              <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mt-1 text-3xl sm:text-4xl">
                Shop by Category
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
                className="group overflow-hidden rounded-xl border"
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
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p style={{ color: "var(--astro-mauve)" }} className="text-[9px] font-semibold uppercase tracking-[0.18em]">
                Curated For You
              </p>

              <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mt-1 text-3xl sm:text-4xl">
                Featured Collection
              </h2>
            </div>

            <Link
              href="/crystals"
              style={{ color: "var(--astro-primary)" }}
              className="text-[10px] font-semibold uppercase tracking-wide"
            >
              View All →
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
              <p style={{ color: "var(--astro-mauve)" }} className="text-[9px] font-semibold uppercase tracking-[0.18em]">
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

          <Link
            href="/consult"
            style={{ backgroundColor: "var(--astro-accent)", color: "#fff" }}
            className="mt-7 inline-block rounded-sm px-7 py-3.5 text-xs font-semibold transition hover:opacity-90"
          >
            Consult an Expert
          </Link>
        </div>
      </section>

      {/* WHY ASTRODISHA */}
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p style={{ color: "var(--astro-mauve)" }} className="text-[9px] font-semibold uppercase tracking-[0.18em]">
              Why AstroDisha
            </p>

            <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mt-2 text-3xl">
              Thoughtfully Chosen. Simply Presented.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Authenticity First",
                text: "Products presented with clear information and quality-focused selection.",
              },
              {
                title: "Expert Guidance",
                text: "Get help understanding products before making your choice.",
              },
              {
                title: "Premium Experience",
                text: "A calm, elegant shopping experience designed around your journey.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
                className="rounded-xl border p-6"
              >
                <h3 style={{ color: "var(--astro-text)" }} className="astro-serif text-xl">
                  {item.title}
                </h3>

                <p style={{ color: "var(--astro-mauve)" }} className="mt-3 text-xs leading-5">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }} className="px-5 py-10 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
          <div>
            <div className="astro-serif text-2xl">ASTRODISHA</div>
            <p style={{ color: "var(--astro-accent)" }} className="mt-2 text-[10px] tracking-[0.15em]">
              GUIDANCE · HEALING · DIVINE ALIGNMENT
            </p>
          </div>

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

        <div style={{ borderColor: "rgba(255,255,255,0.15)" }} className="mx-auto mt-8 max-w-7xl border-t pt-5 text-[9px] opacity-60">
          © {new Date().getFullYear()} ASTRODISHA. All rights reserved.
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
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91A9.88 9.88 0 0012.04 2zm0 18.15a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.23 8.23 0 018.23 8.24c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
        </svg>
      </a>
    </main>
  );
                  }
