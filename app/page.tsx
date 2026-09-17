import Link from "next/link";

const categories = [
  {
    name: "Gemstones",
    description: "Natural gemstones selected with traditional wisdom.",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Crystals",
    description: "Crystals for intention, mindfulness & everyday energy practices.",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Rudraksha",
    description: "Sacred Rudraksha rooted in traditional Indian practices.",
    image:
      "https://images.unsplash.com/photo-1609602582698-7e5b2e6e8f68?auto=format&fit=crop&w=900&q=85"
  },
  {
    name: "Puja Essentials",
    description: "Traditional essentials for your spiritual practices.",
    image:
      "https://images.unsplash.com/photo-1604608672516-f1b9d5c2b8c6?auto=format&fit=crop&w=900&q=85"
  }
];

const products = [
  {
    name: "Rose Quartz Bracelet",
    category: "Love · Healing · Harmony",
    price: "₹1,299",
    rating: "128",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=85"
  },
  {
    name: "Tiger Eye Bracelet",
    category: "Protection · Confidence",
    price: "₹1,299",
    rating: "96",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=700&q=85"
  },
  {
    name: "Clear Quartz Bracelet",
    category: "Clarity · Positive Energy",
    price: "₹1,299",
    rating: "72",
    image:
      "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&w=700&q=85"
  },
  {
    name: "5 Mukhi Rudraksha Mala",
    category: "Peace · Protection",
    price: "₹799",
    rating: "64",
    image:
      "https://images.unsplash.com/photo-1609602582698-7e5b2e6e8f68?auto=format&fit=crop&w=700&q=85"
  }
];

function Icon({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9cec1] bg-[#fbf8f2]">
      {children}
    </span>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f3ec]">

      {/* ANNOUNCEMENT */}
      <div className="bg-[#5a3150] px-4 py-2 text-center text-[10px] tracking-[0.08em] text-white sm:text-xs">
        Authentic Products&nbsp;&nbsp; | &nbsp;&nbsp;Secure Payments&nbsp;&nbsp; | &nbsp;&nbsp;Expert Guidance
      </div>

      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#d9cec1]/70 bg-[#f7f3ec]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4">

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c6a15b] text-[#c6a15b]">
              ✦
            </div>

            <div>
              <div className="astro-serif text-[20px] leading-none text-[#3e2237]">
                ASTRODISHA
              </div>

              <div className="mt-1 text-[7px] tracking-[0.12em] text-[#8a607a]">
                GUIDANCE · HEALING · DIVINE ALIGNMENT
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#3e2237]"
            >
              ⌕
            </button>

            <button
              aria-label="Wishlist"
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237]"
            >
              ♡
            </button>

            <button
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237]"
            >
              🛒
              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#5a3150] text-[8px] text-white">
                0
              </span>
            </button>
          </div>
        </div>

        {/* MOBILE CATEGORY NAV */}
        <div className="no-scrollbar flex overflow-x-auto border-t border-[#d9cec1]/50 px-4">
          {["Home", "Gemstones", "Crystals", "Rudraksha", "Puja", "About"].map(
            (item, index) => (
              <Link
                key={item}
                href="#"
                className={`whitespace-nowrap px-4 py-3 text-[11px] ${
                  index === 0
                    ? "font-semibold text-[#5a3150]"
                    : "text-[#6f5969]"
                }`}
              >
                {item}
              </Link>
            )
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grid min-h-[600px] grid-cols-1 lg:grid-cols-2">

          <div className="flex items-center px-6 py-14 sm:px-10 lg:px-16">
            <div className="max-w-xl">
              <p className="mb-4 text-[10px] font-semibold tracking-[0.25em] text-[#8a607a]">
                AUTHENTIC · ENERGETIC · MEANINGFUL
              </p>

              <h1 className="astro-serif text-[42px] leading-[1.03] text-[#3e2237] sm:text-5xl lg:text-6xl">
                Elevate Your
                <br />
                Energy.
                <br />
                Naturally.
              </h1>

              <p className="mt-5 max-w-lg text-[15px] leading-7 text-[#604f5b]">
                Authentic Gemstones, Crystals, Rudraksha & Puja Essentials —
                chosen with clarity and purpose.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#collections"
                  className="inline-flex items-center justify-center rounded-sm bg-[#5a3150] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#3e2237]"
                >
                  Shop Collection
                  <span className="ml-2">→</span>
                </Link>

                <Link
                  href="#consult"
                  className="inline-flex items-center justify-center rounded-sm border border-[#5a3150] px-7 py-3.5 text-sm font-medium text-[#5a3150]"
                >
                  Consult AstroDisha
                </Link>
              </div>

              {/* MOBILE TRUST */}
              <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#d9cec1] pt-6">
                {[
                  ["✦", "Authentic", "Carefully sourced"],
                  ["◇", "Secure", "Safe checkout"],
                  ["♧", "Guidance", "Here when needed"]
                ].map(([icon, title, text]) => (
                  <div key={title}>
                    <div className="mb-2 text-lg text-[#c6a15b]">{icon}</div>
                    <p className="text-[10px] font-semibold text-[#3e2237]">
                      {title}
                    </p>
                    <p className="mt-1 text-[8px] leading-3 text-[#8a607a]">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="min-h-[330px] bg-cover bg-center lg:min-h-full"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1609602582698-7e5b2e6e8f68?auto=format&fit=crop&w=1400&q=90')"
            }}
          />
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-[#d9cec1] bg-[#fbf8f2]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#d9cec1] md:grid-cols-4">
          {[
            ["◇", "Authentic Products", "Genuine & carefully selected"],
            ["▱", "Secure Payments", "Safe & reliable checkout"],
            ["♢", "Quality Assured", "Checked for authenticity"],
            ["♧", "Expert Support", "Guidance whenever you need it"]
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="flex items-center gap-3 px-4 py-5 sm:px-7"
            >
              <span className="text-2xl text-[#c6a15b]">{icon}</span>
              <div>
                <h3 className="text-[11px] font-semibold text-[#3e2237] sm:text-sm">
                  {title}
                </h3>
                <p className="mt-1 text-[9px] text-[#8a607a] sm:text-xs">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="collections" className="px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-[#8a607a]">
              SHOP BY CATEGORY
            </p>

            <div className="mt-1 flex items-end justify-between">
              <h2 className="astro-serif text-3xl text-[#3e2237] sm:text-4xl">
                Explore Our Collections
              </h2>

              <Link
                href="#collections"
                className="hidden text-xs font-medium text-[#5a3150] sm:block"
              >
                View All →
              </Link>
            </div>
          </div>

          <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                href="#"
                key={category.name}
                className="group min-w-[82%] snap-start overflow-hidden rounded-sm border border-[#d9cec1] bg-[#fbf8f2] md:min-w-0"
              >
                <div className="aspect-[1.35/1] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h3 className="astro-serif text-xl text-[#3e2237]">
                    {category.name}
                  </h3>

                  <p className="mt-2 min-h-[40px] text-xs leading-5 text-[#6f5969]">
                    {category.description}
                  </p>

                  <span className="mt-4 inline-block text-xs font-semibold text-[#5a3150]">
                    Explore {category.name} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-4 pb-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">

          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#8a607a]">
                HANDPICKED FOR YOU
              </p>

              <h2 className="astro-serif mt-1 text-3xl text-[#3e2237] sm:text-4xl">
                Featured Collection
              </h2>
            </div>

            <div className="hidden gap-2 sm:flex">
              <button className="h-9 w-9 rounded-full border border-[#d9cec1]">
                ←
              </button>
              <button className="h-9 w-9 rounded-full border border-[#d9cec1]">
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.name}
                className="product-card overflow-hidden rounded-sm border border-[#d9cec1] bg-[#fbf8f2]"
              >
                <div className="relative aspect-square overflow-hidden bg-[#eee5db]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image h-full w-full object-cover"
                  />

                  <button
                    aria-label={`Add ${product.name} to wishlist`}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg text-[#5a3150]"
                  >
                    ♡
                  </button>
                </div>

                <div className="p-3">
                  <h3 className="astro-serif line-clamp-1 text-sm text-[#3e2237] sm:text-base">
                    {product.name}
                  </h3>

                  <p className="mt-1 line-clamp-1 text-[9px] text-[#8a607a] sm:text-[10px]">
                    {product.category}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#5a3150]">
                      {product.price}
                    </span>

                    <span className="text-[9px] text-[#8a607a]">
                      ★★★★★
                    </span>
                  </div>

                  <button className="mt-3 w-full rounded-sm bg-[#5a3150] py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#3e2237] sm:text-xs">
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONSULTATION */}
      <section
        id="consult"
        className="bg-[#3e2237] px-5 py-14 text-white sm:px-8 lg:px-12"
      >
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_1.3fr] md:items-center">

          <div
            className="min-h-[250px] rounded-sm bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1604608672516-f1b9d5c2b8c6?auto=format&fit=crop&w=1000&q=85')"
            }}
          />

          <div>
            <p className="text-[10px] tracking-[0.2em] text-[#c6a15b]">
              NOT SURE WHAT TO CHOOSE?
            </p>

            <h2 className="astro-serif mt-2 text-3xl sm:text-4xl">
              Let AstroDisha Guide You.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-[#eadfe5]">
              Every stone has a story. Get personalised recommendations based
              on your unique energy and goals.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="rounded-sm bg-[#5a3150] px-6 py-3 text-sm font-semibold text-white">
                Consult an Expert →
              </button>

              <button className="rounded-sm border border-[#c6a15b] px-6 py-3 text-sm font-semibold text-white">
                WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="border-y border-[#d9cec1] bg-[#fbf8f2] px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="astro-serif text-2xl text-[#3e2237]">
              Stay Connected
              <br />
              With AstroDisha
            </p>

            <p className="mt-2 max-w-sm text-xs leading-5 text-[#8a607a]">
              Be the first to know about new collections, spiritual insights
              and exclusive offers.
            </p>
          </div>

          <div className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 border border-[#d9cec1] bg-white px-4 py-3 text-xs outline-none"
            />

            <button className="bg-[#5a3150] px-5 py-3 text-xs font-semibold text-white">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#f7f3ec] px-5 py-12">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">

          <div>
            <div className="astro-serif text-2xl text-[#3e2237]">
              ASTRODISHA
            </div>

            <p className="mt-1 text-[9px] tracking-[0.1em] text-[#8a607a]">
              GUIDANCE · HEALING · DIVINE ALIGNMENT
            </p>

            <p className="mt-5 max-w-xs text-xs leading-6 text-[#6f5969]">
              Authentic gemstones, crystals, Rudraksha and puja essentials
              thoughtfully selected for your journey.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3e2237]">
              Shop
            </h3>

            <div className="mt-4 space-y-3 text-xs text-[#6f5969]">
              <Link href="#">Gemstones</Link>
              <Link href="#">Crystals</Link>
              <Link href="#">Rudraksha</Link>
              <Link href="#">Puja Essentials</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3e2237]">
              Help
            </h3>

            <div className="mt-4 space-y-3 text-xs text-[#6f5969]">
              <Link href="#">Contact Us</Link>
              <Link href="#">Shipping & Delivery</Link>
              <Link href="#">Returns & Refunds</Link>
              <Link href="#">FAQs</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#3e2237]">
              Need Help?
            </h3>

            <div className="mt-4 space-y-3 text-xs text-[#6f5969]">
              <p>◉ Chat on WhatsApp</p>
              <p>✉ support@astrodisha.in</p>
              <p>◷ Mon - Sat | 10 AM - 7 PM</p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-[#d9cec1] pt-5 text-[10px] text-[#8a607a]">
          © 2026 ASTRODISHA. All Rights Reserved.
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <button
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#5a3150] text-2xl text-white shadow-xl"
      >
        ◉
      </button>

    </main>
  );
                }
