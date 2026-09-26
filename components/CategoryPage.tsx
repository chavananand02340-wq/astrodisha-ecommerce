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
      <section style={{ borderColor: "var(--astro-border)" }} className="border-b px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
            className="inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-semibold transition hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Back to Home
          </Link>

          <div className="mt-7 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <p style={{ color: "var(--astro-accent)" }} className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                ASTRODISHA Collection
              </p>

              <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-3 text-4xl sm:text-5xl">
                {resolvedTitle}
              </h1>

              {resolvedDescription && (
                <p style={{ color: "var(--astro-text)", opacity: 0.75 }} className="mt-4 max-w-lg text-sm leading-7">
                  {resolvedDescription}
                </p>
              )}
            </div>

            {resolvedImage && (
              <div
                style={{ backgroundColor: "var(--astro-card)" }}
                className="h-[220px] overflow-hidden rounded-2xl sm:h-[300px] lg:h-[340px]"
              >
                <SafeImage src={resolvedImage} alt={resolvedTitle} />
              </div>
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
              Ask When It's Available
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
