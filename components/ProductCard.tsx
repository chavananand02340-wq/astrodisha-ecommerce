"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useStore } from "./StoreProvider";
import Icon from "./ui/Icon";

export type PdpBenefit = { title: string; description: string };
export type PdpStep = { title: string; description: string; icon: string };
export type PdpDetail = { label: string; value: string; icon: string };
export type PdpCertificate = {
  lab_name?: string;
  report_number?: string;
  weight?: string;
  shape?: string;
  dimensions?: string;
  colour?: string;
  species?: string;
  variety?: string;
  treatment?: string;
  comments?: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug?: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  specifications?: { key: string; value: string }[];
  // Product page only (loaded by getProductBySlug)
  benefits?: PdpBenefit[];
  howToWear?: PdpStep[];
  productDetails?: PdpDetail[];
  certificate?: PdpCertificate;
  certificateImageUrl?: string;
  // Listing pages only (shop + category) — used for the "Newest" sort
  createdAt?: string;
};

type ProductCardProps = {
  product: Product;
  /** Load the image eagerly (use for the first row above the fold) */
  priority?: boolean;
};

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!justAdded) return;
    const t = window.setTimeout(() => setJustAdded(false), 1600);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  const wishlisted = isWishlisted(product.id);
  const rating = product.rating ? Math.min(Math.max(product.rating, 0), 5) : 0;

  const stock = product.stock ?? 0;
  const outOfStock = stock <= 0;
  const lowStock = !outOfStock && stock <= 5;

  // Second photo cross-fades in on hover (desktop) when the product has one
  const hoverImage = product.images && product.images.length > 1 ? product.images[1] : undefined;

  // Short benefit line: first admin "Benefit" title, else the short description
  const benefitLine = product.benefits?.find((b) => b?.title?.trim())?.title?.trim();
  const href = `/product/${product.slug}`;

  function handleAdd() {
    if (outOfStock) return;
    addToCart(product);
    setJustAdded(true);
  }

  return (
    <article className="product-card group relative flex flex-col overflow-hidden rounded-[22px] border border-astro-border bg-astro-card shadow-astro-sm transition-[box-shadow,transform,border-color] duration-500 ease-[var(--ease-astro)] hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--astro-gold)_45%,var(--astro-border))] hover:shadow-astro-md">
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden bg-astro-surface">
        {!imageLoaded && <div className="astro-skeleton absolute inset-0" aria-hidden="true" />}

        <Link href={href} aria-label={`View ${product.name}`} className="block h-full w-full">
          <img
            ref={imgRef}
            src={product.image}
            alt={`${product.name} - ${product.category}`}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : undefined}
            decoding="async"
            className={`product-image h-full w-full object-cover ${imageLoaded ? "opacity-100" : "opacity-0"} ${
              outOfStock ? "grayscale-[35%]" : ""
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
          {hoverImage && !outOfStock && (
            <img
              src={hoverImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="product-image pointer-events-none absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 md:block"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </Link>

        {/* soft vignette so badges stay legible on light photos */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/10 to-transparent"
        />

        {lowStock && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-astro-card/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-astro-terracotta shadow-astro-sm backdrop-blur">
            Only {stock} left
          </span>
        )}

        {outOfStock && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[rgba(22,8,40,0.35)]">
            <span className="rounded-full bg-astro-card px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-astro-text">
              Out of Stock
            </span>
          </div>
        )}

        <button
          type="button"
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          onClick={() => toggleWishlist(product)}
          className={`absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-astro-card/90 shadow-astro-sm backdrop-blur transition duration-300 hover:scale-110 active:scale-90 ${
            wishlisted ? "text-astro-terracotta" : "text-astro-primary"
          }`}
        >
          <Icon name="heart" filled={wishlisted} className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </button>
      </div>

      {/* DETAILS */}
      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4 sm:pt-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-astro-accent">{product.category}</p>

        <Link href={href} className="mt-1">
          <h3 className="astro-serif line-clamp-2 text-[17px] leading-[1.2] text-astro-text transition-colors group-hover:text-astro-primary sm:text-[19px]">
            {product.name}
          </h3>
        </Link>

        {benefitLine ? (
          <p className="mt-1.5 flex items-start gap-1.5 text-[12px] leading-[1.45] text-astro-body sm:text-[13px]">
            <Icon name="sparkle" className="mt-[2px] h-3.5 w-3.5 shrink-0 text-astro-gold" />
            <span className="line-clamp-1">{benefitLine}</span>
          </p>
        ) : (
          product.description && (
            <p className="mt-1.5 line-clamp-2 text-[12px] leading-[1.45] text-astro-mauve sm:text-[13px]">
              {product.description}
            </p>
          )
        )}

        {rating > 0 && (
          <div
            className="mt-2 flex items-center gap-1 text-[11px] text-astro-mauve"
            aria-label={`Rated ${rating.toFixed(1)} out of 5`}
          >
            <Icon name="star" filled className="h-3.5 w-3.5 text-astro-gold" strokeWidth={1.2} />
            <span className="font-semibold text-astro-text">{rating.toFixed(1)}</span>
            {product.reviewCount ? <span>({product.reviewCount})</span> : null}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span className="text-[17px] font-semibold tracking-tight text-astro-text sm:text-[19px]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          <button
            type="button"
            disabled={outOfStock}
            onClick={handleAdd}
            aria-label={outOfStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
            className={`inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold transition-[background-color,transform,box-shadow] duration-300 ease-[var(--ease-astro)] active:scale-95 w-10 sm:w-auto sm:px-4 ${
              outOfStock
                ? "cursor-not-allowed bg-astro-border text-astro-mauve"
                : justAdded
                  ? "bg-astro-emerald text-white"
                  : "bg-astro-primary text-astro-on-primary hover:bg-astro-primary-hover hover:shadow-astro-md"
            }`}
          >
            <Icon name={justAdded ? "check" : outOfStock ? "close" : "bag"} className="h-[17px] w-[17px]" strokeWidth={1.9} />
            <span className="hidden sm:inline">{outOfStock ? "Sold out" : justAdded ? "Added" : "Add"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
