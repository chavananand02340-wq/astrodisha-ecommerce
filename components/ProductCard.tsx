"use client";

import { useState } from "react";
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

  const wishlisted = isWishlisted(product.id);

  return (
    <article className="product-card group overflow-hidden rounded-sm border border-[#d9cec1] bg-[#fbf8f2]">
      <div className="relative aspect-square overflow-hidden bg-[#eee5db]">

        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-[#e8ddd2]" />
        )}

        <Link
          href={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
        >
          <img
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
          className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-xl shadow-sm transition active:scale-90 ${
            wishlisted
              ? "text-[#5a3150]"
              : "text-[#8a607a]"
          }`}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>

      <div className="p-3.5">
        <p className="mb-1 text-[9px] uppercase tracking-[0.08em] text-[#8a607a]">
          {product.category}
        </p>

        <Link href={`/product/${product.slug}`}>
          <h3 className="astro-serif line-clamp-2 min-h-[38px] text-[15px] leading-5 text-[#3e2237] transition hover:text-[#5a3150]">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1.5 line-clamp-1 text-[10px] leading-4 text-[#8a607a]">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[15px] font-bold text-[#5a3150]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {product.rating && (
            <span className="text-[9px] text-[#8a607a]">
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
          className="mt-3 w-full rounded-sm bg-[#5a3150] py-3 text-[10px] font-semibold tracking-wide text-white transition hover:bg-[#3e2237] active:scale-[0.98] sm:text-xs"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
