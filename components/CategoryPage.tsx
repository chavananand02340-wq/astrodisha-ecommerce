import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "./ProductCard";
import { WHATSAPP_URL, WHATSAPP_ICON_PATH } from "@/lib/site";

type CategoryPageProps = {
  title: string;
  description: string;
  products: Product[];
};

export default function CategoryPage({
  title,
  description,
  products
}: CategoryPageProps) {
  return (
    <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen">
      <section style={{ borderColor: "var(--astro-border)" }} className="border-b px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            style={{ color: "var(--astro-mauve)" }}
            className="text-[11px] font-semibold uppercase tracking-[0.15em]"
          >
            ← Back to Home
          </Link>

          <p style={{ color: "var(--astro-accent)" }} className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em]">
            ASTRODISHA Collection
          </p>

          <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-3 text-4xl sm:text-5xl">
            {title}
          </h1>

          <p style={{ color: "var(--astro-text)", opacity: 0.75 }} className="mt-4 max-w-2xl text-sm leading-7">
            {description}
          </p>
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
