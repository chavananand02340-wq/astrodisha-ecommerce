"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "./ProductCard";
import { useStore } from "./StoreProvider";
import { categories } from "@/data/categories";

export default function ProductDetails({
  product
}: {
  product: Product;
}) {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted
  } = useStore();

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const matchedCategory = categories.find(
    (cat) => cat.name === product.category
  );
  const categoryHref = matchedCategory ? `/${matchedCategory.slug}` : "/";

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-4 py-8 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          href={categoryHref}
          className="text-[10px] uppercase tracking-[0.15em] text-[#8a607a]"
        >
          ← Back to Collection
        </Link>

        <div className="mt-7 grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-sm border border-[#d9cec1] bg-[#fbf8f2]">
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-[#e8ddd2]" />
              )}

              <img
                src={activeImage}
                alt={`${product.name} - ${product.category}`}
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  imageLoaded
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(event) => {
                  event.currentTarget.src =
                    "/images/placeholder-product.svg";

                  setImageLoaded(true);
                }}
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {galleryImages.map((img, index) => (
                  <button
                    key={img + index}
                    type="button"
                    onClick={() => {
                      setImageLoaded(false);
                      setActiveImage(img);
                    }}
                    className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm border transition ${
                      activeImage === img
                        ? "border-[#5a3150] border-2"
                        : "border-[#d9cec1]"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a607a]">
              {product.category}
            </p>

            <h1 className="astro-serif mt-3 text-4xl leading-tight text-[#3e2237] sm:text-5xl">
              {product.name}
            </h1>

            {product.rating && (
              <p className="mt-4 text-xs text-[#8a607a]">
                ★★★★★{" "}
                {product.reviewCount
                  ? `(${product.reviewCount} reviews)`
                  : ""}
              </p>
            )}

            <p className="mt-5 text-2xl font-semibold text-[#5a3150]">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <p className="mt-5 text-sm leading-7 text-[#765f6d]">
              {product.description}
            </p>

            <div className="mt-6 border-y border-[#d9cec1] py-5">
              <p className="text-xs font-semibold text-[#3e2237]">
                Delivery
              </p>

              <p className="mt-1 text-xs text-[#8a607a]">
                Delivery charges are calculated separately at checkout.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
              <button
                type="button"
                onClick={() => addToCart(product)}
                className="rounded-sm bg-[#5a3150] py-4 text-xs font-semibold text-white transition hover:bg-[#3e2237] active:scale-[0.99]"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Toggle wishlist"
                aria-pressed={wishlisted}
                className="flex w-14 items-center justify-center rounded-sm border border-[#d9cec1] bg-[#fbf8f2] text-2xl text-[#5a3150]"
              >
                {wishlisted ? "♥" : "♡"}
              </button>
            </div>

            <Link
              href="/consult"
              className="mt-3 rounded-sm border border-[#5a3150] py-4 text-center text-xs font-semibold text-[#5a3150] transition hover:bg-[#5a3150] hover:text-white"
            >
              Ask AstroDisha for Guidance
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
