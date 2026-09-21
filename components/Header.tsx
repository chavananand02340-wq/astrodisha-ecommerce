"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "./StoreProvider";
import { products } from "@/data/products";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Gemstones", href: "/gemstones" },
  { name: "Crystals", href: "/crystals" },
  { name: "Crystal Jewellery", href: "/crystal-jewellery" },
  { name: "Rudraksha", href: "/rudraksha" },
  { name: "Puja", href: "/puja" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" }
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {
    cartCount,
    wishlistCount
  } = useStore();

  const results = products.filter((product) => {
    const query = search.toLowerCase().trim();

    if (!query) return false;

    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <div className="bg-[#5a3150] px-4 py-2 text-center text-[9px] tracking-[0.08em] text-white sm:text-xs">
        Authentic Products&nbsp; | &nbsp;Secure Payments&nbsp; | &nbsp;Expert
        Guidance
      </div>

      <header className="sticky top-0 z-50 border-b border-[#d9cec1]/70 bg-[#f7f3ec]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6">

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c6a15b] text-[#c6a15b]">
              ✦
            </div>

            <div>
              <div className="astro-serif text-[19px] leading-none text-[#3e2237] sm:text-[21px]">
                ASTRODISHA
              </div>

              <div className="mt-1 text-[6px] tracking-[0.14em] text-[#8a607a] sm:text-[7px]">
                GUIDANCE · HEALING · DIVINE ALIGNMENT
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[12px] text-[#5e4a58] transition hover:text-[#5a3150]"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">

            <button
              type="button"
              aria-label="Open search"
              onClick={() => setSearchOpen((value) => !value)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237] transition hover:bg-[#fbf8f2]"
            >
              ⌕
            </button>

            <Link
              href="/wishlist"
              aria-label={`Wishlist with ${wishlistCount} items`}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237] transition hover:bg-[#fbf8f2]"
            >
              ♡
              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#5a3150] text-[8px] text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label={`Cart with ${cartCount} items`}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237] transition hover:bg-[#fbf8f2]"
            >
              🛒

              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#5a3150] text-[8px] text-white">
                {cartCount}
              </span>
            </Link>

            <Link
              href="/consult"
              className="ml-2 rounded-sm bg-[#5a3150] px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#3e2237]"
            >
              Consult an Expert
            </Link>
          </div>

          <div className="flex items-center gap-1 lg:hidden">

            <button
              type="button"
              aria-label="Open search"
              onClick={() => setSearchOpen((value) => !value)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237]"
            >
              ⌕
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237]"
            >
              ♡
              {wishlistCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#5a3150] text-[8px] text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237]"
            >
              🛒

              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#5a3150] text-[8px] text-white">
                {cartCount}
              </span>
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#3e2237]"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-[#d9cec1] bg-[#fbf8f2] px-4 py-4">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3 rounded-sm border border-[#d9cec1] bg-white px-4">
                <span className="text-lg text-[#8a607a]">⌕</span>

                <input
                  autoFocus
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search gemstones, crystals, Rudraksha..."
                  className="h-12 flex-1 bg-transparent text-sm text-[#3e2237] outline-none placeholder:text-[#a28f9b]"
                />
              </div>

              {search.trim() && (
                <div className="mt-3 overflow-hidden rounded-sm border border-[#d9cec1] bg-white">
                  {results.length === 0 ? (
                    <p className="px-4 py-5 text-center text-sm text-[#8a607a]">
                      No products found.
                    </p>
                  ) : (
                    results.slice(0, 5).map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => {
                          setSearch("");
                          setSearchOpen(false);
                        }}
                        className="flex items-center justify-between border-b border-[#eee5db] px-4 py-3 last:border-b-0 hover:bg-[#f7f3ec]"
                      >
                        <div>
                          <p className="text-sm font-medium text-[#3e2237]">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-[#8a607a]">
                            {product.category}
                          </p>
                        </div>

                        <span className="text-xs font-semibold text-[#5a3150]">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {menuOpen && (
          <div className="border-t border-[#d9cec1] bg-[#fbf8f2] px-5 py-5 lg:hidden">
            <nav className="flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-[#d9cec1]/60 py-4 text-sm text-[#3e2237]"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href="/consult"
                onClick={() => setMenuOpen(false)}
                className="mt-5 rounded-sm bg-[#5a3150] px-5 py-3.5 text-center text-sm font-semibold text-white"
              >
                Consult an Expert
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
              }
