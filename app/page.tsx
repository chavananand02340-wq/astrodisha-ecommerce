import Link from "next/link";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import { categories } from "@/data/categories";
import { getFeaturedProducts } from "@/lib/getProducts";
import { getActiveBanner } from "@/lib/getBanner";
import { getActiveTestimonials } from "@/lib/getTestimonials";

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

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={activeBanner?.button_link || "/gemstones"}
                style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                className="rounded-sm px-6 py-3.5 text-center text-xs font-semibold tracking-wide transition hover:opacity-90"
              >
                {activeBanner?.button_text || "Shop Collection"}
              </Link>

              <Link
                href="/consult"
                style={{ borderColor: "var(--astro-primary)", color: "var(--astro-primary)" }}
                className="rounded-sm border px-6 py-3.5 text-center text-xs font-semibold tracking-wide transition hover:opacity-80"
              >
                Consult AstroDisha
              </Link>
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
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with AstroDisha on WhatsApp"
        style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
        className="fixed bottom-5 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-lg transition hover:scale-105"
      >
        ✆
      </a>
    </main>
  );
}
