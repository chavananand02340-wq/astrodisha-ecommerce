import Link from "next/link";
import type { Product } from "./ProductCard";
import ProductBrowser, { type BrowserCategory } from "./catalog/ProductBrowser";
import Icon from "./ui/Icon";
import TrustStrip from "./TrustStrip";
import { ButtonLink } from "./ui/Button";
import { categories as localCategories } from "@/data/categories";
import { getCategoryContent, getCategoryFallbackImage } from "@/lib/categoryContent";
import { WHATSAPP_URL, WHATSAPP_ICON_PATH } from "@/lib/site";

type CategoryPageProps = {
  /** Category slug (e.g. "crystals") — drives the hero copy, fallback image and
   *  the "Coming soon" cross-links. */
  slug?: string;
  title?: string;
  description?: string;
  image?: string;
  products: Product[];
  /** Active categories — powers the /shop quick nav and empty-state links */
  categories?: BrowserCategory[];
  /** "shop" shows category chips + a category filter */
  variant?: "category" | "shop";
  /** Pre-filled search (e.g. /gemstones?q=emerald from "Find Your Stone") */
  initialQuery?: string;
};


export default function CategoryPage({
  slug,
  title,
  description,
  image,
  products,
  categories = [],
  variant = "category",
  initialQuery = "",
}: CategoryPageProps) {
  const local = slug ? localCategories.find((c) => c.slug === slug) : undefined;
  const content = getCategoryContent(slug);
  const isShop = variant === "shop";

  const resolvedTitle = title || local?.name || "Collection";
  const resolvedDescription = description || local?.description || "";
  const heroImage =
    image || getCategoryFallbackImage(slug) || (isShop ? "/images/category-gemstones.webp" : local?.image);

  const inStock = products.filter((p) => (p.stock ?? 0) > 0).length;

  return (
    <main className="min-h-screen bg-astro-bg">
      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden border-b border-astro-border bg-astro-surface">
        {/* soft gold aura */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--astro-gold) 28%, transparent), transparent 65%)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-48 -left-32 h-[420px] w-[420px] rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--astro-primary) 12%, transparent), transparent 65%)" }}
        />

        {/* MOBILE: photo as a soft full-bleed backdrop */}
        {heroImage && (
          <div className="absolute inset-0 md:hidden" aria-hidden="true">
            <img src={heroImage} alt="" fetchPriority="high" className="h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-astro-surface from-40% via-astro-surface/70 via-65% to-transparent" />
          </div>
        )}

        <div
          className={`relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-9 sm:px-8 md:grid-cols-12 md:pb-16 md:pt-12 lg:pb-20 lg:pt-14 ${
            heroImage ? "pt-32" : "pt-10"
          }`}
        >
          <div className="md:col-span-7 lg:col-span-7">
            <Breadcrumb title={resolvedTitle} />

            <p className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-astro-accent">
              <span className="h-px w-8 bg-astro-gold" aria-hidden="true" />
              {isShop ? "The complete collection" : content.eyebrow}
            </p>

            <h1 className="astro-serif mt-3 text-[44px] leading-[1.02] text-astro-text sm:text-6xl lg:text-[76px]">
              {resolvedTitle}
            </h1>

            <p className="astro-serif mt-4 max-w-xl text-[20px] font-medium italic leading-snug text-astro-primary sm:text-[24px]">
              {isShop ? "Every stone, seed and sacred object — gathered in one calm place." : content.verse}
            </p>

            {resolvedDescription && (
              <p className="mt-4 max-w-lg text-[14.5px] leading-7 text-astro-body">{resolvedDescription}</p>
            )}

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {content.promises.map((p) => (
                <li key={p} className="flex items-center gap-1.5 text-[13px] font-medium text-astro-text">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-astro-emerald-soft text-astro-emerald">
                    <Icon name="check" className="h-3 w-3" strokeWidth={2.4} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            {products.length > 0 && (
              <p className="mt-6 text-[13px] text-astro-mauve">
                <span className="font-semibold text-astro-text">{products.length}</span>{" "}
                {products.length === 1 ? "piece" : "pieces"}
                {inStock < products.length && <> · {inStock} ready to ship</>}
              </p>
            )}
          </div>

          {/* DESKTOP: temple-arch framed photo */}
          {heroImage && (
            <div className="relative mx-auto hidden w-full max-w-[400px] md:col-span-5 md:block">
              <div
                aria-hidden="true"
                className="astro-drift absolute -inset-4 rounded-t-full rounded-b-[40px] border border-[color-mix(in_srgb,var(--astro-gold)_45%,transparent)]"
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-full rounded-b-[32px] bg-astro-card shadow-astro-lg ring-1 ring-black/5">
                <img src={heroImage} alt={resolvedTitle} fetchPriority="high" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-4 left-0 flex items-center gap-3 rounded-2xl border border-astro-border bg-astro-card/90 px-4 py-3 shadow-astro-md backdrop-blur lg:-left-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-astro-gold-soft text-astro-accent">
                  <Icon name="lotus" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[12.5px] font-semibold text-astro-text">Purified & energised</p>
                  <p className="text-[11.5px] text-astro-mauve">before it reaches you</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <TrustStrip />

      {/* ========================= PRODUCTS / EMPTY ========================= */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-8 sm:pt-12">
        {products.length === 0 ? (
          <ComingSoon
            title={resolvedTitle}
            image={heroImage}
            others={categories.filter((c) => c.slug !== slug).slice(0, 4)}
          />
        ) : (
          <ProductBrowser
            products={products}
            categories={categories}
            showCategoryFilter={isShop}
            collectionName={resolvedTitle}
            initialQuery={initialQuery}
          />
        )}
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */

function Breadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 whitespace-nowrap text-[12px] text-astro-mauve sm:text-[13px]">
        <li>
          <Link href="/" className="transition hover:text-astro-primary">
            Home
          </Link>
        </li>
        <li aria-hidden="true">
          <Icon name="chevronRight" className="h-3 w-3 opacity-60" strokeWidth={2} />
        </li>
        {title !== "All Products" && (
          <>
            <li>
              <Link href="/shop" className="transition hover:text-astro-primary">
                Shop
              </Link>
            </li>
            <li aria-hidden="true">
              <Icon name="chevronRight" className="h-3 w-3 opacity-60" strokeWidth={2} />
            </li>
          </>
        )}
        <li className="font-medium text-astro-text" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}

function ComingSoon({
  title,
  image,
  others,
}: {
  title: string;
  image?: string;
  others: BrowserCategory[];
}) {
  return (
    <div>
      <div className="relative overflow-hidden rounded-[32px] border border-astro-border bg-astro-card px-6 py-14 text-center shadow-astro-sm sm:px-12 sm:py-20">
        {/* concentric gold rings */}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[560, 420, 280].map((size) => (
            <div
              key={size}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color-mix(in_srgb,var(--astro-gold)_22%,transparent)]"
              style={{ width: size, height: size }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="astro-drift mx-auto h-36 w-28 overflow-hidden rounded-t-full rounded-b-2xl bg-astro-surface shadow-astro-md ring-4 ring-astro-card sm:h-44 sm:w-36">
            {image ? (
              <img src={image} alt="" className="h-full w-full object-cover opacity-90" />
            ) : (
              <div className="flex h-full items-center justify-center text-astro-accent">
                <Icon name="lotus" className="h-12 w-12" />
              </div>
            )}
          </div>

          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.26em] text-astro-accent">
            {title} · Coming soon
          </p>
          <h2 className="astro-serif mx-auto mt-3 max-w-xl text-[34px] leading-[1.1] text-astro-text sm:text-[46px]">
            Being lovingly curated
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14.5px] leading-7 text-astro-body">
            Each piece is chosen, purified and energised before it joins the collection. Tell us what you&apos;re looking for
            and we&apos;ll let you know the moment it arrives.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-[52px] items-center gap-2 rounded-full bg-astro-primary px-7 text-[15px] font-semibold text-astro-on-primary shadow-astro-sm transition hover:bg-astro-primary-hover hover:shadow-astro-md"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d={WHATSAPP_ICON_PATH} />
              </svg>
              Notify me on WhatsApp
            </a>
            <ButtonLink href="/shop" variant="secondary" size="lg">
              Browse all products
            </ButtonLink>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <div className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <h3 className="astro-serif text-[28px] text-astro-text sm:text-[34px]">Explore other collections</h3>
            <Link href="/shop" className="hidden items-center gap-1 text-[13px] font-semibold text-astro-primary sm:inline-flex">
              View all <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {others.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-[24px] bg-astro-surface shadow-astro-sm transition duration-500 hover:-translate-y-1 hover:shadow-astro-md"
              >
                {c.image && (
                  <img
                    src={c.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 ease-[var(--ease-astro)] group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(22,8,40,0.72)] via-[rgba(22,8,40,0.1)] to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                  <span className="astro-serif text-[22px] leading-tight text-white sm:text-[26px]">{c.name}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition group-hover:bg-white group-hover:text-[#2d1155]">
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
