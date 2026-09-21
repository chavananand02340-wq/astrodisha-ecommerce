import Link from "next/link";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
import { categories } from "@/data/categories";
import { getFeaturedProducts } from "@/lib/getProducts";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <main className="min-h-screen bg-[#F7F3EC]">
      <Header />

      {/* HERO */}
      <section className="px-4 pb-10 pt-7 sm:px-6 sm:pb-16 sm:pt-12">
        <div className="mx-auto grid max-w-7xl items-center gap-8 overflow-hidden rounded-2xl bg-[#FBF8F2] p-5 sm:p-8 lg:grid-cols-2 lg:p-12">
          <div className="astro-fade-up">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A607A]">
              ASTRODISHA
            </p>

            <h1 className="astro-serif max-w-xl text-4xl leading-[1.05] text-[#3E2237] sm:text-5xl lg:text-6xl">
              Discover What
              <br />
              Aligns With You.
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-6 text-[#6F5A68] sm:text-base">
              Explore authentic gemstones, crystals, Rudraksha and Puja
              essentials selected for your spiritual journey.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/gemstones"
                className="rounded-sm bg-[#5A3150] px-6 py-3.5 text-center text-xs font-semibold tracking-wide text-white transition hover:bg-[#3E2237]"
              >
                Shop Collection
              </Link>

              <Link
                href="/consult"
                className="rounded-sm border border-[#5A3150] px-6 py-3.5 text-center text-xs font-semibold tracking-wide text-[#5A3150] transition hover:bg-[#5A3150] hover:text-white"
              >
                Consult AstroDisha
              </Link>
            </div>
          </div>

          <div className="h-[300px] overflow-hidden rounded-xl sm:h-[420px]">
            <SafeImage
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=85"
              alt="Premium gemstone jewellery representing spiritual alignment"
            />
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-[#D9CEC1] bg-[#FBF8F2]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#D9CEC1] sm:grid-cols-4">
          {[
            ["✦", "Authentic Products"],
            ["◇", "Secure Payments"],
            ["✧", "Quality Assured"],
            ["☼", "Expert Guidance"],
          ].map(([icon, title]) => (
            <div
              key={title}
              className="flex flex-col items-center px-3 py-5 text-center"
            >
              <span className="text-lg text-[#C6A15B]">{icon}</span>
              <span className="mt-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#5E4A58] sm:text-[10px]">
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
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A607A]">
                Explore
              </p>
              <h2 className="astro-serif mt-1 text-3xl text-[#3E2237] sm:text-4xl">
                Shop by Category
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="group overflow-hidden rounded-xl border border-[#D9CEC1] bg-[#FBF8F2]"
              >
                <div className="h-36 overflow-hidden sm:h-52">
                  <SafeImage
                    src={category.image}
                    alt={category.name}
                  />
                </div>

                <div className="p-4">
                  <h3 className="astro-serif text-lg text-[#3E2237]">
                    {category.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#8A607A]">
                    {category.description}
                  </p>

                  <span className="mt-3 inline-block text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5A3150]">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-[#FBF8F2] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A607A]">
                Curated For You
              </p>

              <h2 className="astro-serif mt-1 text-3xl text-[#3E2237] sm:text-4xl">
                Featured Collection
              </h2>
            </div>

            <Link
              href="/crystals"
              className="text-[10px] font-semibold uppercase tracking-wide text-[#5A3150]"
            >
              View All →
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <p className="text-sm text-[#8A607A]">
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

      {/* CONSULTATION */}
      <section id="consult" className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#3E2237] px-6 py-10 text-center sm:px-10 sm:py-14">
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#C6A15B]">
            Personal Guidance
          </p>

          <h2 className="astro-serif mt-3 text-3xl text-white sm:text-4xl">
            Need Help Choosing?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/70">
            Connect with AstroDisha for guidance around gemstones, crystals,
            Rudraksha and spiritual essentials.
          </p>

          <Link
            href="/consult"
            className="mt-7 inline-block rounded-sm bg-[#C6A15B] px-7 py-3.5 text-xs font-semibold text-[#3E2237] transition hover:bg-white"
          >
            Consult an Expert
          </Link>
        </div>
      </section>

      {/* WHY ASTRODISHA */}
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A607A]">
              Why AstroDisha
            </p>

            <h2 className="astro-serif mt-2 text-3xl text-[#3E2237]">
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
                className="rounded-xl border border-[#D9CEC1] bg-[#FBF8F2] p-6"
              >
                <h3 className="astro-serif text-xl text-[#3E2237]">
                  {item.title}
                </h3>

                <p className="mt-3 text-xs leading-5 text-[#8A607A]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#3E2237] px-5 py-10 text-white sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
          <div>
            <div className="astro-serif text-2xl">ASTRODISHA</div>
            <p className="mt-2 text-[10px] tracking-[0.15em] text-[#C6A15B]">
              GUIDANCE · HEALING · DIVINE ALIGNMENT
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider">
              Explore
            </p>

            <div className="mt-3 flex flex-col gap-2 text-xs text-white/65">
              <Link href="/gemstones">Gemstones</Link>
              <Link href="/crystals">Crystals</Link>
              <Link href="/rudraksha">Rudraksha</Link>
              <Link href="/puja">Puja Essentials</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider">
              Support
            </p>

            <div className="mt-3 flex flex-col gap-2 text-xs text-white/65">
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/consult">Consult an Expert</Link>
              <Link href="/cart">Cart</Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-[9px] text-white/45">
          © {new Date().getFullYear()} ASTRODISHA. All rights reserved.
        </div>
      </footer>

      {/* WHATSAPP */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with AstroDisha on WhatsApp"
        className="fixed bottom-5 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#5A3150] text-xl text-white shadow-lg transition hover:scale-105"
      >
        ✆
      </a>
    </main>
  );
      }
