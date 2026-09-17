import Link from "next/link";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <Header />

      <main className="bg-[#f7f3ec]">

        {/* HERO */}
        <section className="px-5 pb-12 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#c6a15b]">
                ASTRODISHA
              </p>

              <h1 className="astro-serif mt-4 text-[42px] leading-[1.02] text-[#3e2237] sm:text-6xl lg:text-7xl">
                Discover What
                <br />
                Aligns With You.
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#765f6d] sm:text-base">
                Explore authentic gemstones, crystals,
                Rudraksha and Puja essentials selected
                with clarity and purpose.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/gemstones"
                  className="rounded-sm bg-[#5a3150] px-6 py-3.5 text-xs font-semibold text-white transition hover:bg-[#3e2237] active:scale-[0.98]"
                >
                  Shop Collection
                </Link>

                <Link
                  href="/consult"
                  className="rounded-sm border border-[#5a3150] px-6 py-3.5 text-xs font-semibold text-[#5a3150] transition hover:bg-[#5a3150] hover:text-white active:scale-[0.98]"
                >
                  Consult AstroDisha
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-sm border border-[#d9cec1] bg-[#fbf8f2]">
              <img
                src="https://images.unsplash.com/photo-1604608672516-f1b9d5c2b8c6?auto=format&fit=crop&w=1200&q=90"
                alt="Traditional spiritual essentials arranged for AstroDisha"
                className="aspect-[4/5] w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src =
                    "/images/placeholder-product.svg";
                }}
              />

              <div className="absolute bottom-4 left-4 right-4 rounded-sm bg-[#3e2237]/90 p-4 text-white backdrop-blur-sm">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#c6a15b]">
                  GUIDANCE · HEALING · DIVINE ALIGNMENT
                </p>

                <p className="astro-serif mt-1 text-xl">
                  Choose with clarity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="border-y border-[#d9cec1] bg-[#fbf8f2]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
            {[
              "Authentic Products",
              "Secure Payments",
              "Quality Assured",
              "Expert Guidance"
            ].map((item) => (
              <div
                key={item}
                className="border-r border-[#d9cec1] px-4 py-5 text-center last:border-r-0"
              >
                <p className="text-[10px] font-semibold text-[#3e2237]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#c6a15b]">
                  EXPLORE
                </p>

                <h2 className="astro-serif mt-2 text-3xl text-[#3e2237] sm:text-4xl">
                  Shop by Category
                </h2>
              </div>

              <Link
                href="/gemstones"
                className="text-[10px] font-semibold uppercase tracking-widest text-[#5a3150]"
              >
                View All →
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="group overflow-hidden rounded-sm border border-[#d9cec1] bg-[#fbf8f2]"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[#eee5db]">
                    <img
                      src={category.image}
                      alt={`${category.name} collection`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.src =
                          "/images/placeholder-product.svg";
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="astro-serif text-lg text-[#3e2237]">
                      {category.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#8a607a]">
                      {category.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED */}
        <section className="bg-[#fbf8f2] px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#c6a15b]">
              CURATED FOR YOU
            </p>

            <h2 className="astro-serif mt-2 text-3xl text-[#3e2237] sm:text-4xl">
              Featured Collection
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CONSULTATION */}
        <section className="px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-sm bg-[#3e2237] px-6 py-12 text-center sm:px-12">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#c6a15b]">
              EXPERT GUIDANCE
            </p>

            <h2 className="astro-serif mt-3 text-3xl text-white sm:text-5xl">
              Not sure what to choose?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#e4d8df]">
              Get thoughtful guidance before choosing a
              gemstone, crystal, Rudraksha or spiritual
              essential.
            </p>

            <Link
              href="/consult"
              className="mt-7 inline-block rounded-sm bg-[#c6a15b] px-7 py-3.5 text-xs font-semibold text-[#3e2237] transition hover:bg-white"
            >
              Consult AstroDisha
            </Link>
          </div>
        </section>

        {/* WHY US */}
        <section className="border-t border-[#d9cec1] px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#c6a15b]">
                WHY ASTRODISHA
              </p>

              <h2 className="astro-serif mt-2 text-3xl text-[#3e2237] sm:text-4xl">
                Thoughtful products. Clear guidance.
              </h2>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Authentic Selection",
                  text: "Products presented with clarity and attention to quality."
                },
                {
                  title: "Traditional Wisdom",
                  text: "Learn about traditional associations without exaggerated promises."
                },
                {
                  title: "Personal Guidance",
                  text: "When you are unsure, our consultation experience can help."
                }
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-[#d9cec1] bg-[#fbf8f2] p-6"
                >
                  <h3 className="astro-serif text-xl text-[#3e2237]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#8a607a]">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#3e2237] px-5 py-12 text-white sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-3">
            <div>
              <h2 className="astro-serif text-2xl">
                ASTRODISHA
              </h2>

              <p className="mt-3 text-xs leading-6 text-[#d9cbd4]">
                Guidance • Healing • Divine Alignment
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#c6a15b]">
                Collections
              </p>

              <div className="mt-4 space-y-3 text-xs text-[#e5dce2]">
                <Link href="/gemstones" className="block">
                  Gemstones
                </Link>

                <Link href="/crystals" className="block">
                  Crystals
                </Link>

                <Link href="/rudraksha" className="block">
                  Rudraksha
                </Link>

                <Link href="/puja" className="block">
                  Puja Essentials
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#c6a15b]">
                Company
              </p>

              <div className="mt-4 space-y-3 text-xs text-[#e5dce2]">
                <Link href="/about" className="block">
                  About Us
                </Link>

                <Link href="/contact" className="block">
                  Contact
                </Link>

                <Link href="/consult" className="block">
                  Consult an Expert
                </Link>

                <Link href="/wishlist" className="block">
                  Wishlist
                </Link>

                <Link href="/cart" className="block">
                  Cart
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-center text-[10px] text-[#bbaeb7]">
            © {new Date().getFullYear()} ASTRODISHA. All rights reserved.
          </div>
        </footer>
      </main>
    </>
  );
}
