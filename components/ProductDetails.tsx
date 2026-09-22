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
    <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen px-4 py-8 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          href={categoryHref}
          style={{ color: "var(--astro-mauve)" }}
          className="text-[10px] uppercase tracking-[0.15em]"
        >
          ← Back to Collection
        </Link>

        <div className="mt-7 grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <div
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="relative aspect-square overflow-hidden rounded-sm border"
            >
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
                    style={{
                      borderColor: activeImage === img ? "var(--astro-primary)" : "var(--astro-border)",
                      borderWidth: activeImage === img ? "2px" : "1px",
                    }}
                    className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-sm border"
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
            <p style={{ color: "var(--astro-mauve)" }} className="text-[10px] uppercase tracking-[0.2em]">
              {product.category}
            </p>

            <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-3 text-4xl leading-tight sm:text-5xl">
              {product.name}
            </h1>

            {product.rating && (
              <p style={{ color: "var(--astro-mauve)" }} className="mt-4 text-xs">
                ★★★★★{" "}
                {product.reviewCount
                  ? `(${product.reviewCount} reviews)`
                  : ""}
              </p>
            )}

            <p style={{ color: "var(--astro-primary)" }} className="mt-5 text-2xl font-semibold">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <p style={{ color: "var(--astro-text)", opacity: 0.85 }} className="mt-5 text-sm leading-7">
              {product.description}
            </p>

            <div style={{ borderColor: "var(--astro-border)" }} className="mt-6 border-y py-5">
              <p style={{ color: "var(--astro-text)" }} className="text-xs font-semibold">
                Delivery
              </p>

              <p style={{ color: "var(--astro-mauve)" }} className="mt-1 text-xs">
                Delivery charges are calculated separately at checkout.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
              <button
                type="button"
                onClick={() => addToCart(product)}
                style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                className="rounded-sm py-4 text-xs font-semibold transition hover:opacity-90 active:scale-[0.99]"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Toggle wishlist"
                aria-pressed={wishlisted}
                style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)", color: "var(--astro-primary)" }}
                className="flex w-14 items-center justify-center rounded-sm border text-2xl"
              >
                {wishlisted ? "♥" : "♡"}
              </button>
            </div>

            <Link
              href="/consult"
              style={{ borderColor: "var(--astro-primary)", color: "var(--astro-primary)" }}
              className="mt-3 rounded-sm border py-4 text-center text-xs font-semibold transition hover:opacity-80"
            >
              Ask AstroDisha for Guidance
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
      }
