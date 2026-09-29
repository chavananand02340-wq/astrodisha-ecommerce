"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Product } from "./ProductCard";
import { useStore } from "./StoreProvider";
import { WHATSAPP_NUMBER, WHATSAPP_ICON_PATH } from "@/lib/site";
import { createClient } from "@/utils/supabase/client";

const HEART_PATH =
  "M12 20s-7-4.4-9.2-8.6C1.2 8.2 3 4.8 6.4 4.5c2-.2 3.8.9 5.6 3 1.8-2.1 3.6-3.2 5.6-3 3.4.3 5.2 3.7 3.6 6.9C19 15.6 12 20 12 20z";

const CART_ICON_PATH_1 = "M6 7h12l-1 13H7L6 7z";
const CART_ICON_PATH_2 = "M9 7a3 3 0 0 1 6 0";

const STAR_PATH =
  "M12 2.5l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3l-6.2 3.5 1.6-6.8-5.2-4.6 6.9-.6z";

const GOLD = "#C6A15B";

const TRUST_STRIP = [
  {
    label: "100% Authentic",
    icon: (
      <>
        <path d="M6 3h12l3 6-9 12L3 9z" />
        <path d="M3 9h18" />
        <path d="M9 3l3 6 3-6" />
        <path d="M12 21L9 9M12 21l3-12" />
      </>
    ),
  },
  {
    label: "Lab Certified & Purity Check",
    icon: (
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="M9 14.5L7.5 21 12 18.5 16.5 21 15 14.5" />
        <path d="M9.5 9l1.8 1.8 3.2-3.3" />
      </>
    ),
  },
  {
    label: "Pan India Delivery",
    icon: (
      <>
        <path d="M3 6h11v9H3z" />
        <path d="M14 9h4l3 3v3h-7" />
        <circle cx="7" cy="17.5" r="1.6" />
        <circle cx="17" cy="17.5" r="1.6" />
      </>
    ),
  },
  {
    label: "Secure Payments",
    icon: (
      <>
        <path d="M12 3L4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

type ReviewRow = {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string | null;
  created_at: string;
};

function Star({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "var(--astro-accent)" : "none"}
      stroke={filled ? "var(--astro-accent)" : "var(--astro-border)"}
      strokeWidth={1.5}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

function ChevronIcon({ direction, className }: { direction: "left" | "right"; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

export default function ProductDetails({ product }: { product: Product }) {
  const router = useRouter();
  const { cart, addToCart, updateQuantity, showToast, toggleWishlist, isWishlisted } = useStore();

  const galleryImages =
    product.images && product.images.length > 0 ? product.images : [product.image];
  const imageCount = galleryImages.length;

  // Gallery
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Lightbox (full-screen zoom)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const zoomBoxRef = useRef<HTMLDivElement>(null);

  // Purchase
  const [qty, setQty] = useState(1);

  const [specsOpen, setSpecsOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [activeIndex]);

  function showImage(index: number) {
    const next = ((index % imageCount) + imageCount) % imageCount;
    if (next === activeIndex) return;
    setImageLoaded(false);
    setZoomed(false);
    setActiveIndex(next);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40 || imageCount < 2) return;
    showImage(dx < 0 ? activeIndex + 1 : activeIndex - 1);
  }

  // Lock page scroll + keyboard controls while the lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowRight") showImage(activeIndex + 1);
      else if (e.key === "ArrowLeft") showImage(activeIndex - 1);
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, activeIndex]);

  // When zooming in, start from the centre of the image
  useEffect(() => {
    const box = zoomBoxRef.current;
    if (!zoomed || !box) return;
    const timer = window.setTimeout(() => {
      box.scrollLeft = (box.scrollWidth - box.clientWidth) / 2;
      box.scrollTop = (box.scrollHeight - box.clientHeight) / 2;
    }, 30);
    return () => window.clearTimeout(timer);
  }, [zoomed]);

  function openLightbox() {
    setZoomed(false);
    setLightboxOpen(true);
  }

  function closeLightbox() {
    setZoomed(false);
    setLightboxOpen(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("reviews")
        .select("id, customer_name, rating, review_text, created_at")
        .eq("product_id", product.id)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        setReviews(!error && data ? (data as ReviewRow[]) : []);
        setReviewsLoading(false);
      }
    }

    loadReviews();
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  const liveCount = reviews.length;
  const liveAverage =
    liveCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / liveCount : 0;
  const liveStars = Math.round(liveAverage);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setReviewMsg("");

    if (!reviewerName.trim() || reviewRating === 0) {
      setReviewMsg("Please add your name and a star rating.");
      return;
    }

    setSubmittingReview(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        product_id: product.id,
        customer_name: reviewerName.trim(),
        rating: reviewRating,
        review_text: reviewText.trim() || null,
        is_approved: true,
      })
      .select("id, customer_name, rating, review_text, created_at")
      .single();

    setSubmittingReview(false);

    if (error) {
      setReviewMsg("Failed to submit: " + error.message);
      return;
    }

    if (data) {
      setReviews((current) => [data as ReviewRow, ...current]);
    }

    setReviewerName("");
    setReviewRating(0);
    setReviewText("");
    setReviewMsg("Thank you! Your review has been posted.");
  }

  const wishlisted = isWishlisted(product.id);

  const stock = product.stock ?? 0;
  const outOfStock = stock <= 0;
  const lowStock = !outOfStock && stock <= 5;
  const safeQty = Math.min(Math.max(qty, 1), Math.max(stock, 1));

  const categoryHref = product.categorySlug ? `/${product.categorySlug}` : "/shop";

  const specs = product.specifications || [];
  const longDescription = (product.description || "").length > 140;

  const askMessage = outOfStock
    ? `Hi ASTRODISHA, "${product.name}" is out of stock. Please let me know when it's back.`
    : `Hi ASTRODISHA, I am interested in "${product.name}". I would like expert guidance regarding this product.`;

  const askUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(askMessage)}`;

  // Adds the selected quantity. Returns false if nothing could be added.
  function addSelectedToCart(): boolean {
    if (outOfStock) return false;

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      if (existing.quantity >= stock) {
        showToast(`Only ${stock} of ${product.name} available`);
        return false;
      }
      updateQuantity(product.id, Math.min(existing.quantity + safeQty, stock));
      showToast(`${product.name} added to cart`);
      return true;
    }

    addToCart(product);
    if (safeQty > 1) {
      updateQuantity(product.id, safeQty);
    }
    return true;
  }

  // Buy Now: make sure the product is in the cart (without doubling it), then go to checkout.
  function handleBuyNow() {
    if (outOfStock) return;

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      if (existing.quantity < safeQty) {
        updateQuantity(product.id, safeQty);
      }
    } else {
      addToCart(product);
      if (safeQty > 1) {
        updateQuantity(product.id, safeQty);
      }
    }

    router.push("/checkout");
  }

  return (
    <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen px-4 pb-10 pt-3 sm:px-8 sm:pt-6">
      <div className="mx-auto max-w-6xl">
        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="no-scrollbar overflow-x-auto">
          <ol className="flex items-center gap-1.5 whitespace-nowrap text-[12px]">
            <li>
              <Link href="/" style={{ color: "var(--astro-mauve)" }} className="transition hover:opacity-75">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronIcon direction="right" className="h-3 w-3 opacity-60" />
            </li>
            <li>
              <Link href={categoryHref} style={{ color: "var(--astro-mauve)" }} className="transition hover:opacity-75">
                {product.category}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronIcon direction="right" className="h-3 w-3 opacity-60" />
            </li>
            <li style={{ color: "var(--astro-text)" }} className="font-medium" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-3 grid gap-6 md:mt-5 md:grid-cols-2 md:gap-12">
          {/* GALLERY */}
          <div>
            <div
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse opacity-60" style={{ backgroundColor: "var(--astro-border)" }} />
              )}

              <button
                type="button"
                onClick={openLightbox}
                aria-label="Open image full screen"
                className="block h-full w-full cursor-zoom-in"
              >
                <img
                  ref={imgRef}
                  src={galleryImages[activeIndex]}
                  alt={`${product.name} - image ${activeIndex + 1}`}
                  loading="eager"
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
              </button>

              {/* Zoom button */}
              <button
                type="button"
                onClick={openLightbox}
                aria-label="Zoom image"
                style={{ backgroundColor: "var(--astro-card)", color: "var(--astro-primary)" }}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-[0_2px_8px_rgba(36,16,70,0.15)] transition active:scale-95"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5" />
                </svg>
              </button>

              {imageCount > 1 && (
                <span
                  style={{ backgroundColor: "rgba(22,8,40,0.55)" }}
                  className="pointer-events-none absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-[10px] font-medium text-white"
                >
                  {activeIndex + 1} / {imageCount}
                </span>
              )}

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

            {/* THUMBNAILS — 4 visible, scroll if more */}
            {imageCount > 1 && (
              <div className="no-scrollbar mt-2.5 flex gap-2 overflow-x-auto">
                {galleryImages.map((img, index) => (
                  <button
                    key={img + index}
                    type="button"
                    aria-label={`Show image ${index + 1}`}
                    aria-current={index === activeIndex}
                    onClick={() => showImage(index)}
                    style={{
                      borderColor: index === activeIndex ? "var(--astro-primary)" : "var(--astro-border)",
                      borderWidth: index === activeIndex ? "2px" : "1px",
                      flex: "0 0 calc((100% - 1.5rem) / 4)",
                    }}
                    className="aspect-[4/3] overflow-hidden rounded-lg border"
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="md:pt-1">
            <h1 style={{ color: "var(--astro-text)" }} className="astro-serif text-[28px] leading-tight sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating — real reviews only */}
            <div className="mt-2 min-h-[20px]">
              {!reviewsLoading &&
                (liveCount > 0 ? (
                  <a href="#reviews" className="flex items-center gap-1 text-sm">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} filled={n <= liveStars} className="h-4 w-4" />
                    ))}
                    <span style={{ color: "var(--astro-mauve)" }} className="ml-1 text-xs">
                      {liveAverage.toFixed(1)} ({liveCount} review{liveCount === 1 ? "" : "s"})
                    </span>
                  </a>
                ) : (
                  <a href="#reviews" style={{ color: "var(--astro-mauve)" }} className="text-xs">
                    No reviews yet
                  </a>
                ))}
            </div>

            <p style={{ color: "var(--astro-primary)" }} className="mt-2 text-[28px] font-bold leading-none">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            {/* Stock pill */}
            <div className="mt-3">
              {outOfStock ? (
                <span
                  style={{ backgroundColor: "rgba(194,65,42,0.12)", color: "#C2412A" }}
                  className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                >
                  Out of Stock
                </span>
              ) : (
                <span
                  style={{ backgroundColor: "rgba(63,163,77,0.15)", color: "#3FA34D" }}
                  className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                >
                  {lowStock ? `In Stock — only ${stock} left` : "In Stock"}
                </span>
              )}
            </div>

            {/* DESCRIPTION — Read More */}
            {product.description && (
              <div className="mt-3">
                <p
                  style={{ color: "var(--astro-mauve)" }}
                  className={`text-[15px] leading-7 ${descExpanded ? "" : "line-clamp-3"}`}
                >
                  {product.description}
                </p>
                {longDescription && (
                  <button
                    type="button"
                    onClick={() => setDescExpanded((v) => !v)}
                    style={{ color: "var(--astro-primary)" }}
                    className="mt-1 text-sm font-semibold underline underline-offset-2"
                  >
                    {descExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            )}

            {/* QUANTITY + WISHLIST */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <div
                style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
                className={`flex h-12 items-center rounded-[10px] border ${outOfStock ? "opacity-50" : ""}`}
              >
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={outOfStock || safeQty <= 1}
                  onClick={() => setQty(Math.max(1, safeQty - 1))}
                  style={{ color: "var(--astro-primary)" }}
                  className="flex h-12 w-12 items-center justify-center text-xl disabled:opacity-40"
                >
                  −
                </button>
                <span
                  style={{ color: "var(--astro-text)" }}
                  className="w-8 text-center text-[15px] font-semibold"
                  aria-live="polite"
                >
                  {outOfStock ? 0 : safeQty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={outOfStock || safeQty >= stock}
                  onClick={() => setQty(Math.min(stock, safeQty + 1))}
                  style={{ color: "var(--astro-primary)" }}
                  className="flex h-12 w-12 items-center justify-center text-xl disabled:opacity-40"
                >
                  +
                </button>
              </div>

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

            {/* ACTIONS */}
            <button
              type="button"
              disabled={outOfStock}
              onClick={addSelectedToCart}
              style={
                outOfStock
                  ? { backgroundColor: "var(--astro-border)", color: "var(--astro-mauve)" }
                  : { backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }
              }
              className={`mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] text-[15px] font-semibold transition duration-150 ${
                outOfStock ? "cursor-not-allowed" : "hover:opacity-90 active:scale-[0.99]"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={CART_ICON_PATH_1} />
                <path d={CART_ICON_PATH_2} />
              </svg>
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            {!outOfStock && (
              <button
                type="button"
                onClick={handleBuyNow}
                style={{ backgroundColor: "var(--astro-buy-bg, #E8B23F)", color: "var(--astro-buy-text, #160828)" }}
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] text-[15px] font-semibold transition duration-150 hover:opacity-90 active:scale-[0.99]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                  <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
                </svg>
                Buy Now
              </button>
            )}

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

            {/* TRUST STRIP */}
            <div
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="mt-5 grid grid-cols-4 rounded-2xl border py-3"
            >
              {TRUST_STRIP.map((item, i) => (
                <div
                  key={item.label}
                  style={{ borderColor: "var(--astro-border)" }}
                  className={`flex flex-col items-center gap-1.5 px-1 text-center ${i > 0 ? "border-l" : ""}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke={GOLD}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </svg>
                  <span style={{ color: "var(--astro-text)" }} className="text-[10.5px] leading-[1.3] sm:text-xs">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* SPECIFICATIONS ACCORDION (moves into Product Details in the next batch) */}
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
                        className={`flex justify-between gap-4 py-2.5 text-sm ${i > 0 ? "border-t" : ""}`}
                      >
                        <dt style={{ color: "var(--astro-mauve)" }}>{spec.key}</dt>
                        <dd style={{ color: "var(--astro-text)" }} className="text-right font-medium">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* REVIEWS */}
        <section
          id="reviews"
          style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)", scrollMarginTop: "90px" }}
          className="mt-10 rounded-2xl border p-6 sm:p-8"
        >
          <h2 style={{ color: "var(--astro-text)" }} className="astro-serif text-2xl">
            Customer Reviews
          </h2>

          {reviewsLoading ? (
            <p style={{ color: "var(--astro-mauve)" }} className="mt-3 text-sm">
              Loading reviews...
            </p>
          ) : liveCount > 0 ? (
            <>
              <div className="mt-4 flex items-center gap-4">
                <span style={{ color: "var(--astro-primary)" }} className="text-4xl font-bold">
                  {liveAverage.toFixed(1)}
                </span>
                <div>
                  <p className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} filled={n <= liveStars} className="h-4 w-4" />
                    ))}
                  </p>
                  <p style={{ color: "var(--astro-mauve)" }} className="text-xs">
                    Based on {liveCount} review{liveCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div style={{ borderColor: "var(--astro-border)" }} className="mt-6 divide-y">
                {reviews.map((r) => (
                  <div key={r.id} className="py-4 first:pt-0">
                    <div className="flex items-center justify-between gap-3">
                      <p style={{ color: "var(--astro-text)" }} className="astro-serif text-sm">
                        {r.customer_name}
                      </p>
                      <p style={{ color: "var(--astro-mauve)" }} className="text-[11px]">
                        {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <p className="mt-1 flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} filled={n <= r.rating} className="h-3.5 w-3.5" />
                      ))}
                    </p>
                    {r.review_text && (
                      <p style={{ color: "var(--astro-mauve)" }} className="mt-1.5 text-sm leading-6">
                        {r.review_text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{ color: "var(--astro-mauve)" }} className="mt-3 text-sm">
              No reviews yet. Be the first to review this product.
            </p>
          )}

          {/* WRITE A REVIEW */}
          <form
            onSubmit={handleSubmitReview}
            style={{ borderColor: "var(--astro-border)" }}
            className="mt-8 border-t pt-6"
          >
            <h3 style={{ color: "var(--astro-text)" }} className="astro-serif text-lg">
              Write a Review
            </h3>

            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`Rate ${n} star${n === 1 ? "" : "s"}`}
                  onClick={() => setReviewRating(n)}
                >
                  <Star filled={n <= reviewRating} className="h-7 w-7" />
                </button>
              ))}
            </div>

            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Your name"
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-bg)", color: "var(--astro-text)" }}
              className="mt-3 h-11 w-full rounded-lg border px-3 text-sm outline-none"
            />

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this product (optional)"
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-bg)", color: "var(--astro-text)" }}
              className="mt-3 min-h-[80px] w-full rounded-lg border p-3 text-sm outline-none"
            />

            {reviewMsg && (
              <p
                style={{ color: reviewMsg.startsWith("Thank") ? "var(--astro-accent)" : "#B00020" }}
                className="mt-2 text-xs font-semibold"
              >
                {reviewMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={submittingReview}
              style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
              className="mt-4 h-11 rounded-full px-6 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </section>
      </div>

      {/* LIGHTBOX — full-screen viewer with swipe + tap-to-zoom */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} images`}
          style={{ backgroundColor: "rgba(12,4,24,0.96)" }}
          className="fixed inset-0 z-[95] flex flex-col"
        >
          <div
            className="flex items-center justify-between px-4 pb-2"
            style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
          >
            <span className="text-xs text-white/80">
              {activeIndex + 1} / {imageCount}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomed((z) => !z)}
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d={zoomed ? "M16 16l4.5 4.5M8.5 11h5" : "M16 16l4.5 4.5M11 8.5v5M8.5 11h5"} />
                </svg>
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>

          <div
            ref={zoomBoxRef}
            className={`relative min-h-0 flex-1 ${zoomed ? "overflow-auto" : "flex items-center justify-center overflow-hidden px-3"}`}
            onTouchStart={zoomed ? undefined : handleTouchStart}
            onTouchEnd={zoomed ? undefined : handleTouchEnd}
          >
            <img
              src={galleryImages[activeIndex]}
              alt={`${product.name} - image ${activeIndex + 1}`}
              onClick={() => setZoomed((z) => !z)}
              style={zoomed ? { width: "250%", maxWidth: "none" } : undefined}
              className={zoomed ? "block cursor-zoom-out" : "max-h-full max-w-full cursor-zoom-in object-contain"}
            />

            {imageCount > 1 && !zoomed && (
              <>
                <button
                  type="button"
                  onClick={() => showImage(activeIndex - 1)}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white"
                >
                  <ChevronIcon direction="left" className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => showImage(activeIndex + 1)}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white"
                >
                  <ChevronIcon direction="right" className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          <p
            className="px-4 pt-2 text-center text-[11px] text-white/60"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            {zoomed ? "Drag to move around · tap image to zoom out" : "Tap image to zoom · swipe for more"}
          </p>
        </div>
      )}
    </main>
  );
}.
