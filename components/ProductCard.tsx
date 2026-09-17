"use client";

import Link from "next/link";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  reviewCount?: number;
};

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card group overflow-hidden rounded-sm border border-[#d9cec1] bg-[#fbf8f2]">

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[#eee5db]">

        <Link href={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            className="product-image h-full w-full object-cover"
          />
        </Link>

        {/* Wishlist */}
        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl text-[#5a3150] shadow-sm transition hover:bg-white"
        >
          ♡
        </button>
      </div>

      {/* Product Information */}
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

        {/* Price + Rating */}
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

        {/* Add to Cart */}
        <button
          type="button"
          className="mt-3 w-full rounded-sm bg-[#5a3150] py-3 text-[10px] font-semibold tracking-wide text-white transition hover:bg-[#3e2237] sm:text-xs"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}
