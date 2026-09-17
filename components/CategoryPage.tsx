import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "./ProductCard";

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
    <main className="min-h-screen bg-[#f7f3ec]">
      <section className="border-b border-[#d9cec1] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.15em] text-[#8a607a]"
          >
            ← Back to Home
          </Link>

          <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-[#c6a15b]">
            ASTRODISHA COLLECTION
          </p>

          <h1 className="astro-serif mt-3 text-4xl text-[#3e2237] sm:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#765f6d]">
            {description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
        {products.length === 0 ? (
          <div className="rounded-sm border border-[#d9cec1] bg-[#fbf8f2] px-6 py-16 text-center">
            <h2 className="astro-serif text-2xl text-[#3e2237]">
              Coming Soon
            </h2>

            <p className="mt-2 text-sm text-[#8a607a]">
              New products are being added to this collection.
            </p>
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
