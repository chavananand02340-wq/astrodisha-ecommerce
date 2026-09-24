"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Product } from "./ProductCard";
import { useStore } from "./StoreProvider";
import { categories } from "@/data/categories";
import { WHATSAPP_NUMBER, WHATSAPP_ICON_PATH } from "@/lib/site";

// Keep same as Header.tsx and Supabase site_settings
const FREE_SHIPPING_THRESHOLD = 999;

const HEART_PATH =
  "M12 20s-7-4.4-9.2-8.6C1.2 8.2 3 4.8 6.4 4.5c2-.2 3.8.9 5.6 3 1.8-2.1 3.6-3.2 5.6-3 3.4.3 5.2 3.7 3.6 6.9C19 15.6 12 20 12 20z";

const TRUST_ICONS = {
  truck: (
    <>
      <path d="M3 6h11v9H3z" />
      <path d="M14 9h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17" cy="17.5" r="1.6" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  cash: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
};

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
  const imgRef = useRef<HTMLImageElement>(null);

  // Cached images can finish loading before React attaches onLoad — check on mount and on image change
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [activeImage]);

  const wishlisted = isWishlisted(product.id);
  const stars = product.rating ? Math.round(Math.min(Math.max(product.rating, 0), 5)) : 0;

  const matchedCategory = categories.find(
    (cat) => cat.name === product.category
  );
  const categoryHref = matchedCategory ? `/${matchedCategory.slug}` : "/shop";

  const askUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent(`Hi AstroDisha, I have a question about "${product.name}".`);

  const trustItems = [
    { icon: TRUST_ICONS.truck, text: `Free shipping on orders above ₹${FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}` },
    { icon: TRUST_ICONS.lock, text: "Secure payments via Razorpay (UPI, cards, net banking)" },
    { icon: TRUST_ICONS.cash, text: "Cash on Delivery available with ₹100 advance" },
  ];

  return (
    <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen px-4 py-8 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          href={categoryHref}
          style={{ color: "var(--astro-mauve)" }}
          className="text-[11px] font-semibold uppercase tracking-[0.15em]"
        >
          ← Back to Collection
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
          {/* GALLERY */}
          <div>
            <div
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="relative aspect-square overflow-hidden rounded-2xl border"
            >
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse opacity-60" style={{ backgroundColor: "var(--astro-border)" }} />
              )}

              <img
                ref={imgRef}
                src={activeImage}
                alt={`${product.name} - ${product.category}`}
                className={`h-full w-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(event) => {
                  const image = event.currentTarget;

                  if (!image.src.includes("placeholder-product.svg")) {
                    image.src = "/images/placeholder-product.svg";
                  }

                  setImageLoaded(true);
                }}
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
                {galleryImages.map((img, index) => (
                  <button
                    key={img + index}
                    type="button"
                    aria-label={`Show image ${index + 1}`}
                    onClick={() => {
                      if (img === activeImage) return;
                      setImageLoaded(false);
                      setActiveImage(img);
                    }}
                    style={{
                      borderColor: activeImage === img ? "var(--astro-primary)" : "var(--astro-border)",
                      borderWidth: activeImage === img ? "2px" : "1px",
                    }}
                    className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border"
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

          {/* INFO */}
          <div className="flex flex-col justify-center">
            <p style={{ color: "var(--astro-mauve)" }} className="text-[11px] font-medium uppercase tracking-[0.2em]">
              {product.category}
            </p>

            <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-2 text-[32px] leading-tight sm:text-5xl">
              {product.name}
            </h1>

            {stars > 0 && (
              <p className="mt-3 text-sm" aria-label={`Rated ${product.rating} out of 5`}>
                <span style={{ color: "var(--astro-accent)" }}>{"★".repeat(stars)}</span>
                <span style={{ color: "var(--astro-border)" }}>{"★".repeat(5 - stars)}</span>
                {product.reviewCount ? (
                  <span style={{ color: "var(--astro-mauve)" }} className="ml-1 text-xs">
                    ({product.reviewCount} reviews)
                  </span>
                ) : null}
              </p>
            )}

            <p style={{ color: "var(--astro-primary)" }} className="mt-4 text-[28px] font-bold">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            {product.description && (
              <p style={{ color: "var(--astro-mauve)" }} className="mt-4 text-[15px] leading-7">
                {product.description}
              </p>
            )}

            {/* ACTIONS */}
            <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
              <button
                type="button"
                onClick={() => addToCart(product)}
                style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                className="h-12 rounded-[10px] text-[15px] font-semibold transition duration-150 hover:opacity-90 active:scale-[0.99]"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlisted}
                style={{
                  borderColor: wishlisted ? "var(--astro-accent)" : "var(--astro-border)",
                  backgroundColor: "var(--astro-card)",
                  color: wishlisted ? "var(--astro-accent)" : "var(--astro-primary)",
                }}
                className="flex h-12 w-12 items-center justify-center rounded-[10px] border transition active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill={wishlisted ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={HEART_PATH} />
                </svg>
              </button>
            </div>

            <a
              href={askUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderColor: "var(--astro-primary)", color: "var(--astro-primary)" }}
              className="mt-3 flex h-12 items-center justify-center gap-2 rounded-[10px] border text-[14px] font-semibold transition hover:opacity-80"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d={WHATSAPP_ICON_PATH} />
              </svg>
              Ask an Expert About This Product
            </a>

            {/* TRUST BOX */}
            <div
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="mt-6 flex flex-col gap-3.5 rounded-2xl border p-5"
            >
              {trustItems.map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 shrink-0"
                    fill="none"
                    stroke="var(--astro-accent)"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </svg>
                  <span style={{ color: "var(--astro-text)" }} className="text-[13px] leading-5">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
