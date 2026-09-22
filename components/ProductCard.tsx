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
  image: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
};

type ProductCardProps = {
  product: Product;
};

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

  return (
    <article
      style={{ backgroundColor: "var(--astro-card)", borderColor: "var(--astro-border)" }}
      className="product-card group overflow-hidden rounded-sm border"
    >
      <div className="relative aspect-square overflow-hidden bg-[#eee5db]">

        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-[#e8ddd2]" />
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
        </Link>

        <button
          type="button"
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          onClick={() => toggleWishlist(product)}
          style={{ color: wishlisted ? "var(--astro-primary)" : "var(--astro-mauve)" }}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl shadow-sm transition active:scale-90"
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>

      <div className="p-3.5">
        <p style={{ color: "var(--astro-mauve)" }} className="mb-1 text-[9px] uppercase tracking-[0.08em]">
          {product.category}
        </p>

        <Link href={`/product/${product.slug}`}>
          <h3
            style={{ color: "var(--astro-text)" }}
            className="astro-serif line-clamp-2 min-h-[38px] text-[15px] leading-5 transition hover:opacity-80"
          >
            {product.name}
          </h3>
        </Link>

        <p style={{ color: "var(--astro-mauve)" }} className="mt-1.5 line-clamp-1 text-[10px] leading-4">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span style={{ color: "var(--astro-primary)" }} className="text-[15px] font-bold">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {product.rating && (
            <span style={{ color: "var(--astro-mauve)" }} className="text-[9px]">
              ★★★★★
              {product.reviewCount
                ? ` (${product.reviewCount})`
                : ""}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
          className="mt-3 w-full rounded-sm py-3 text-[10px] font-semibold tracking-wide transition hover:opacity-90 active:scale-[0.98] sm:text-xs"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
            }
