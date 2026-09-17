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

      <main className="min-h-screen bg-[#f7f3ec] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#c6a15b]">
            SAVED FOR YOU
          </p>

          <h1 className="astro-serif mt-2 text-4xl text-[#3e2237]">
            Your Wishlist
          </h1>

          {wishlist.length === 0 ? (
            <div className="mt-10 rounded-sm border border-[#d9cec1] bg-[#fbf8f2] px-6 py-16 text-center">
              <div className="text-4xl">♡</div>

              <h2 className="astro-serif mt-5 text-2xl text-[#3e2237]">
                Nothing saved yet
              </h2>

              <p className="mt-2 text-sm text-[#8a607a]">
                Tap the heart on any product to save it here.
              </p>

              <Link
                href="/"
                className="mt-6 inline-block rounded-sm bg-[#5a3150] px-7 py-3 text-xs font-semibold text-white"
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
