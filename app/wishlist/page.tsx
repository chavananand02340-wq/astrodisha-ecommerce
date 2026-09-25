"use client";

import Link from "next/link";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/components/StoreProvider";

const HEART_PATH =
  "M12 20s-7-4.4-9.2-8.6C1.2 8.2 3 4.8 6.4 4.5c2-.2 3.8.9 5.6 3 1.8-2.1 3.6-3.2 5.6-3 3.4.3 5.2 3.7 3.6 6.9C19 15.6 12 20 12 20z";

export default function WishlistPage() {
  const { wishlist } = useStore();

  return (
    <>
      <Header />

      <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p style={{ color: "var(--astro-accent)" }} className="text-[10px] font-semibold uppercase tracking-[0.2em]">
            Saved For You
          </p>

          <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-2 text-4xl">
            Your Wishlist
          </h1>

          {wishlist.length === 0 ? (
            <div
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="mt-10 rounded-2xl border px-6 py-16 text-center"
            >
              <svg
                viewBox="0 0 24 24"
                className="mx-auto h-10 w-10"
                fill="none"
                stroke="var(--astro-accent)"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={HEART_PATH} />
              </svg>

              <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mt-5 text-2xl">
                Nothing saved yet
              </h2>

              <p style={{ color: "var(--astro-mauve)" }} className="mt-2 text-sm">
                Tap the heart on any product to save it here.
              </p>

              <Link
                href="/shop"
                style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                className="mt-6 inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold transition hover:opacity-90"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
