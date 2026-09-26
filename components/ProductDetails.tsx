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

const CART_ICON_PATH_1 = "M6 7h12l-1 13H7L6 7z";
const CART_ICON_PATH_2 = "M9 7a3 3 0 0 1 6 0";

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

  const [specsOpen, setSpecsOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [activeImage]);

  const wishlisted = isWishlisted(product.id);
  const stars = product.rating ? Math.round(Math.min(Math.max(product.rating, 0), 5)) : 0;

  const stock = product.stock ?? 0;
  const outOfStock = stock <= 0;
  const lowStock = !outOfStock && stock <= 5;

  const matchedCategory = categories.find(
    (cat) => cat.name === product.category
  );
  const categoryHref = matchedCategory ? `/${matchedCategory.slug}` : "/shop";

  const specs = product.specifications || [];

  const askMessage = outOfStock
    ? `Hi AstroDisha, "${product.name}" is out of stock — please let me know when it's back.`
    : `Hi AstroDisha, I have a question about "${product.name}".`;

  const askUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(askMessage)}`;

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
          style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
          className="inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-semibold transition hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Back to Collection
        </Link>

        {/* CATEGORY BANNER — dynamic, pulls from data/categories.ts, so a new category needs no extra design work */}
        {matchedCategory && (
          <Link
            href={categoryHref}
            style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
            className="mt-5 flex items-center gap-4 rounded-2xl border p-4 transition hover:opacity-90 sm:p-5"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20">
              <img
                src={matchedCategory.image}
                alt={matchedCategory.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p style={{ color: "var(--astro-accent)" }} className="text-[9px] font-semibold uppercase tracking-[0.18em]">
                ASTRODISHA Collection
              </p>
              <h2 style={{ color: "var(--astro-text)" }} className="astro-serif text-lg sm:text-xl">
                {matchedCategory.name}
              </h2>
              <p style={{ color: "var(--astro-mauve)" }} className="line-clamp-1 text-xs">
                {matchedCategory.description}
              </p>
            </div>

            <span style={{ color: "var(--astro-primary)" }} className="hidden shrink-0 text-xs font-semibold uppercase tracking-wide sm:block">
              View All →
            </span>
          </Link>
        )}

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
                } ${outOfStock ? "opacity-70 grayscale-[30%]" : ""}`}
                onLoad={() => setImageLoaded(true)}
                onError={(event) => {
                  const image = event.currentTarget;

                  if (!image.src.includes("placeholder-product.svg")) {
                    image.src = "/images/placeholder-product.svg";
                  }

                  setImageLoaded(true);
                }}
              />

              {outOfStock && (
                <div
                  style={{ backgroundColor: "rgba(22,8,40,0.5)" }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <span
                    style={{ backgroundColor: "var(--astro-card)", color: "var(--astro-text)" }}
                    className="rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wide"
                  >
                    Out of Stock
                  </span>
                </div>
              )}
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

            {outOfStock ? (
              <p style={{ color: "var(--astro-accent)" }} className="mt-2 text-sm font-semibold uppercase tracking-wide">
                Currently Out of Stock
              </p>
            ) : lowStock ? (
              <p style={{ color: "var(--astro-accent)" }} className="mt-2 text-sm font-medium">
                Only {stock} left in stock
              </p>
            ) : (
              <p style={{ color: "var(--astro-accent)" }} className="mt-2 text-sm font-medium">
                In Stock
              </p>
            )}

            {/* DESCRIPTION — truncated with See more */}
            {product.description && (
              <div className="mt-4">
                <p
                  style={{
                    color: "var(--astro-mauve)",
                    maxHeight: descExpanded ? "600px" : "3em",
                    transition: "max-height 300ms ease",
                    overflow: "hidden",
                  }}
                  className={`text-[15px] leading-7 ${descExpanded ? "" : "line-clamp-2"}`}
                >
                  {product.description}
                </p>
                <button
                  type="button"
                  onClick={() => setDescExpanded((v) => !v)}
                  style={{ color: "var(--astro-primary)" }}
                  className="mt-1 text-xs font-semibold"
                >
                  {descExpanded ? "See less" : "... See more"}
                </button>
              </div>
            )}

            {/* SPECIFICATIONS ACCORDION */}
            {specs.length > 0 && (
              <div
                style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
                className="mt-5 overflow-hidden rounded-2xl border"
              >
                <button
                  type="button"
                  onClick={() => setSpecsOpen((v) => !v)}
                  aria-expanded={specsOpen}
                  className="flex w-full items-center justify-between px-5 py-4"
                >
                  <span style={{ color: "var(--astro-text)" }} className="astro-serif text-base">
                    Product Specifications
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 transition-transform duration-200"
                    style={{
                      color: "var(--astro-primary)",
                      transform: specsOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                <div
                  style={{
                    maxHeight: specsOpen ? "600px" : "0px",
                    transition: "max-height 300ms ease",
                    overflow: "hidden",
                  }}
                >
                  <dl className="px-5 pb-4">
                    {specs.map((spec, i) => (
                      <div
                        key={spec.key + i}
                        style={{ borderColor: "var(--astro-border)" }}
                        className={`flex justify-between py-2.5 text-sm ${i > 0 ? "border-t" : ""}`}
                      >
                        <dt style={{ color: "var(--astro-mauve)" }}>{spec.key}</dt>
                        <dd style={{ color: "var(--astro-text)" }} className="font-medium">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
              <button
                type="button"
                disabled={outOfStock}
                onClick={() => {
                  if (!outOfStock) addToCart(product);
                }}
                style={
                  outOfStock
                    ? { backgroundColor: "var(--astro-border)", color: "var(--astro-mauve)" }
                    : { backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }
                }
                className={`flex h-12 items-center justify-center gap-2 rounded-[10px] text-[15px] font-semibold transition duration-150 ${
                  outOfStock ? "cursor-not-allowed" : "hover:opacity-90 active:scale-[0.99]"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={CART_ICON_PATH_1} />
                  <path d={CART_ICON_PATH_2} />
                </svg>
                {outOfStock ? "Out of Stock" : "Add to Cart"}
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
              {outOfStock ? "Ask When It's Back in Stock" : "Ask an Expert About This Product"}
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

        {/* REVIEWS — shows the real average rating/count on file; no fabricated review text */}
        <section
          style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
          className="mt-10 rounded-2xl border p-6 sm:p-8"
        >
          <h2 style={{ color: "var(--astro-text)" }} className="astro-serif text-2xl">
            Customer Reviews
          </h2>

          {product.rating ? (
            <div className="mt-4 flex items-center gap-4">
              <span style={{ color: "var(--astro-primary)" }} className="text-4xl font-bold">
                {product.rating.toFixed(1)}
              </span>
              <div>
                <p style={{ color: "var(--astro-accent)" }} className="text-lg">
                  {"★".repeat(stars)}
                  <span style={{ color: "var(--astro-border)" }}>{"★".repeat(5 - stars)}</span>
                </p>
                <p style={{ color: "var(--astro-mauve)" }} className="text-xs">
                  Based on {product.reviewCount || 0} review{product.reviewCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--astro-mauve)" }} className="mt-3 text-sm">
              No reviews yet for this product. Have a question before buying?{" "}
              <a href={askUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--astro-primary)" }} className="font-semibold underline">
                Ask us on WhatsApp
              </a>
              .
            </p>
          )}
        </section>
      </div>
    </main>
  );
                                              }
