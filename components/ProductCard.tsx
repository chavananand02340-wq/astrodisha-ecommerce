"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useStore } from "./StoreProvider";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  specifications?: { key: string; value: string }[];
};

type ProductCardProps = {
  product: Product;
};

const HEART_PATH =
  "M12 20s-7-4.4-9.2-8.6C1.2 8.2 3 4.8 6.4 4.5c2-.2 3.8.9 5.6 3 1.8-2.1 3.6-3.2 5.6-3 3.4.3 5.2 3.7 3.6 6.9C19 15.6 12 20 12 20z";

export default function ProductCard({
  product
}: ProductCardProps) {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted
  } = useStore();

  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, []);

  const wishlisted = isWishlisted(product.id);
  const stars = product.rating ? Math.round(Math.min(Math.max(product.rating, 0), 5)) : 0;

  const stock = product.stock ?? 0;
  const outOfStock = stock <= 0;
  const lowStock = !outOfStock && stock <= 5;

  return (
    <article
      style={{ backgroundColor: "var(--astro-card)", borderColor: "var(--astro-border)" }}
      className="product-card group flex flex-col overflow-hidden rounded-2xl border shadow-[0_4px_20px_rgba(36,16,70,0.05)]"
    >
      <div
        style={{ backgroundColor: "var(--astro-border)" }}
        className="relative aspect-[4/3] overflow-hidden"
      >
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse opacity-60" style={{ backgroundColor: "var(--astro-border)" }} />
        )}

        <Link
          href={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
        >
          <img
            ref={imgRef}
            src={product.image}
            alt={`${product.name} - ${product.category}`}
            className={`product-image h-full w-full object-cover transition-opacity duration-300 ${
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
        </Link>

        {outOfStock && (
          <div
            style={{ backgroundColor: "rgba(22,8,40,0.5)" }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span
              style={{ backgroundColor: "var(--astro-card)", color: "var(--astro-text)" }}
              className="rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide"
            >
              Out of Stock
            </span>
          </div>
        )}

        <button
          type="button"
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          onClick={() => toggleWishlist(product)}
          style={{
            backgroundColor: "var(--astro-card)",
            color: wishlisted ? "var(--astro-accent)" : "var(--astro-primary)",
            borderColor: wishlisted ? "var(--astro-accent)" : "transparent",
          }}
          className="absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full border shadow-[0_2px_8px_rgba(36,16,70,0.12)] transition active:scale-90"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[18px] w-[18px]"
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

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p style={{ color: "var(--astro-mauve)" }} className="text-[10px] font-medium uppercase tracking-[0.12em]">
          {product.category}
        </p>

        <Link href={`/product/${product.slug}`}>
          <h3
            style={{ color: "var(--astro-text)" }}
            className="astro-serif mt-1 line-clamp-2 text-[16px] leading-[1.25] transition hover:opacity-80 sm:text-[18px]"
          >
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p style={{ color: "var(--astro-mauve)" }} className="mt-1.5 line-clamp-2 text-[12px] leading-[1.45] sm:text-[13px]">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between gap-2">
            <span style={{ color: "var(--astro-primary)" }} className="text-[17px] font-bold sm:text-[19px]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            {stars > 0 && (
              <span
                style={{ color: "var(--astro-accent)" }}
                className="text-[10px]"
                aria-label={`Rated ${product.rating} out of 5`}
              >
                {"★".repeat(stars)}
                <span style={{ color: "var(--astro-border)" }}>{"★".repeat(5 - stars)}</span>
                {product.reviewCount ? (
                  <span style={{ color: "var(--astro-mauve)" }}> ({product.reviewCount})</span>
                ) : null}
              </span>
            )}
          </div>

          {lowStock && (
            <p style={{ color: "var(--astro-accent)" }} className="mt-1 text-[11px] font-medium">
              Only {stock} left
            </p>
          )}

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
            className={`mt-3 h-12 w-full rounded-[10px] text-[14px] font-semibold transition duration-150 ease-in-out ${
              outOfStock ? "cursor-not-allowed" : "hover:opacity-90 active:scale-[0.98]"
            }`}
          >
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
