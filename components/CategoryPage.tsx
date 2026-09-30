import Link from "next/link";
import ProductCard from "./ProductCard";
import SafeImage from "./SafeImage";
import type { Product } from "./ProductCard";
import { categories } from "@/data/categories";
import { WHATSAPP_URL, WHATSAPP_ICON_PATH } from "@/lib/site";

type CategoryPageProps = {
  /** Category slug (e.g. "crystals") — when given, title, description and
   *  the hero image are pulled automatically from data/categories.ts, so a
   *  new category added there needs no extra design work here. */
  slug?: string;
  /** Only used when no slug is given (e.g. the generic /shop page), or as
   *  a fallback if the slug isn't found. */
  title?: string;
  description?: string;
  image?: string;
  products: Product[];
};

export default function CategoryPage({
  slug,
  title,
  description,
  image,
  products
}: CategoryPageProps) {
  const category = slug ? categories.find((c) => c.slug === slug) : undefined;

  const resolvedTitle = category?.name || title || "Collection";
  const resolvedDescription = category?.description || description || "";
  const resolvedImage = category?.image || image;

  return (
    <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen">
      {/* HERO — text overlaid on the category image, one merged banner */}
      <section
        style={{ borderColor: "var(--astro-border)" }}
        className="relative min-h-[340px] overflow-hidden border-b sm:min-h-[400px] lg:min-h-[460px]"
      >
        {resolvedImage && (
          <div className="absolute inset-0">
            <SafeImage src={resolvedImage} alt={resolvedTitle} />
          </div>
        )}

        {/* Left-to-right fade: solid page background on the left (behind text),
            fading to fully transparent so the photo shows clearly on the right —
            works in both light and dark theme since it uses --astro-bg.
            Solid zone kept to ~1/3 of the width so more of the photo is visible. */}
        {resolvedImage && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--astro-bg) 0%, var(--astro-bg) 30%, rgba(0,0,0,0) 65%)",
            }}
            aria-hidden="true"
          />
        )}

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 py-10 sm:px-8 sm:py-14">
          {/* BREADCRUMB — same style as the product page */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 whitespace-nowrap text-[12px] sm:text-[13px]">
              <li>
                <Link href="/" style={{ color: "var(--astro-mauve)" }} className="transition hover:opacity-75">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3 opacity-60"
                  style={{ color: "var(--astro-mauve)" }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </li>
              <li style={{ color: "var(--astro-text)" }} className="font-medium" aria-current="page">
                {resolvedTitle}
              </li>
            </ol>
          </nav>

          <div className="mt-6 max-w-[70%] sm:max-w-sm lg:max-w-md">
            <p style={{ color: "var(--astro-accent)" }} className="text-[10px] font-semibold uppercase tracking-[0.2em]">
              ASTRODISHA Collection
            </p>

            <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-3 text-4xl sm:text-5xl">
              {resolvedTitle}
            </h1>

            {resolvedDescription && (
              <p style={{ color: "var(--astro-text)", opacity: 0.75 }} className="mt-4 text-sm leading-7">
                {resolvedDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
        {products.length === 0 ? (
          <div
            style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
            className="rounded-2xl border px-6 py-16 text-center"
          >
            <h2 style={{ color: "var(--astro-text)" }} className="astro-serif text-2xl">
              Coming Soon
            </h2>

            <p style={{ color: "var(--astro-mauve)" }} className="mt-2 text-sm">
              New products are being added to this collection.
            </p>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
              className="mt-6 inline-flex h-12 items-center gap-2 rounded-full px-7 text-sm font-semibold transition hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d={WHATSAPP_ICON_PATH} />
              </svg>
              Ask When It&apos;s Available
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
