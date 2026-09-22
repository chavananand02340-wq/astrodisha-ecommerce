"use client";

import Link from "next/link";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/components/StoreProvider";

export default function WishlistPage() {
  const { wishlist } = useStore();

  return (
    <>
      <Header />

      <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p style={{ color: "var(--astro-accent)" }} className="text-[10px] uppercase tracking-[0.2em]">
            SAVED FOR YOU
          </p>

          <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-2 text-4xl">
            Your Wishlist
          </h1>

          {wishlist.length === 0 ? (
            <div
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="mt-10 rounded-sm border px-6 py-16 text-center"
            >
              <div style={{ color: "var(--astro-primary)" }} className="text-4xl">♡</div>

              <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mt-5 text-2xl">
                Nothing saved yet
              </h2>

              <p style={{ color: "var(--astro-mauve)" }} className="mt-2 text-sm">
                Tap the heart on any product to save it here.
              </p>

              <Link
                href="/"
                style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                className="mt-6 inline-block rounded-sm px-7 py-3 text-xs font-semibold"
              >
                Browse Products
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
