"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "./StoreProvider";
import { createClient } from "@/utils/supabase/client";
import { useTheme } from "./ThemeProvider";

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

type SearchResult = {
  id: string;
  slug: string;
  name: string;
  price: number;
  categories: { name: string } | null;
};

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const {
    cartCount,
    wishlistCount
  } = useStore();

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      setResults([]);
      return;
    }

    setSearching(true);

    const timer = setTimeout(async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select("id, slug, name, price, categories(name)")
        .eq("is_active", true)
        .or(`name.ilike.%${query}%,short_description.ilike.%${query}%`)
        .limit(5);

      if (!error && data) {
        setResults(data as unknown as SearchResult[]);
      } else {
        setResults([]);
      }

      setSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <div
        style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
        className="px-4 py-2 text-center text-[9px] tracking-[0.08em] sm:text-xs"
      >
        Authentic Products&nbsp; | &nbsp;Secure Payments&nbsp; | &nbsp;Expert
        Guidance
      </div>

      <header
        style={{
          backgroundColor: "var(--astro-bg)",
          borderColor: "var(--astro-border)",
        }}
        className="sticky top-0 z-50 border-b backdrop-blur-md"
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6">

          <Link href="/" className="flex items-center gap-2">
            <div
              style={{ borderColor: "var(--astro-primary)", color: "var(--astro-primary)" }}
              className="flex h-10 w-10 items-center justify-center rounded-full border"
            >
              ✦
            </div>

            <div>
              <div
                style={{ color: "var(--astro-text)" }}
                className="astro-serif text-[19px] leading-none sm:text-[21px]"
              >
                ASTRODISHA
              </div>

              <div
                style={{ color: "var(--astro-accent)" }}
                className="mt-1 text-[6px] tracking-[0.14em] sm:text-[7px]"
              >
                GUIDANCE · HEALING · DIVINE ALIGNMENT
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                style={{ color: "var(--astro-text)" }}
                className="text-[12px] opacity-80 transition hover:opacity-100"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">

            <button
              type="button"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              onClick={toggleTheme}
              style={{ color: "var(--astro-text)" }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition hover:opacity-70"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <button
              type="button"
              aria-label="Open search"
              onClick={() => setSearchOpen((value) => !value)}
              style={{ color: "var(--astro-text)" }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg transition hover:opacity-70"
            >
              ⌕
            </button>

            <Link
              href="/wishlist"
              aria-label={`Wishlist with ${wishlistCount} items`}
              style={{ color: "var(--astro-text)" }}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-lg transition hover:opacity-70"
            >
              ♡
              {wishlistCount > 0 && (
                <span
                  style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                  className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-[8px]"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label={`Cart with ${cartCount} items`}
              style={{ color: "var(--astro-text)" }}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-lg transition hover:opacity-70"
            >
              🛒

              <span
                style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-[8px]"
              >
                {cartCount}
              </span>
            </Link>

            <Link
              href="/consult"
              style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
              className="ml-2 rounded-sm px-4 py-2.5 text-[11px] font-semibold transition hover:opacity-90"
            >
              Consult an Expert
            </Link>
          </div>

          <div className="flex items-center gap-1 lg:hidden">

            <button
              type="button"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              onClick={toggleTheme}
              style={{ color: "var(--astro-text)" }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <button
              type="button"
              aria-label="Open search"
              onClick={() => setSearchOpen((value) => !value)}
              style={{ color: "var(--astro-text)" }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
            >
              ⌕
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              style={{ color: "var(--astro-text)" }}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-lg"
            >
              ♡
              {wishlistCount > 0 && (
                <span
                  style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                  className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-[8px]"
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              style={{ color: "var(--astro-text)" }}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-lg"
            >
              🛒

              <span
                style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full text-[8px]"
              >
                {cartCount}
              </span>
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              style={{ color: "var(--astro-text)" }}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-xl"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div
            style={{ backgroundColor: "var(--astro-card)", borderColor: "var(--astro-border)" }}
            className="border-t px-4 py-4"
          >
            <div className="mx-auto max-w-3xl">
              <div
                style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-bg)" }}
                className="flex items-center gap-3 rounded-sm border px-4"
              >
                <span style={{ color: "var(--astro-mauve)" }} className="text-lg">⌕</span>

                <input
                  autoFocus
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search gemstones, crystals, Rudraksha..."
                  style={{ color: "var(--astro-text)" }}
                  className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:opacity-50"
                />
              </div>

              {search.trim() && (
                <div
                  style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-bg)" }}
                  className="mt-3 overflow-hidden rounded-sm border"
                >
                  {searching ? (
                    <p style={{ color: "var(--astro-mauve)" }} className="px-4 py-5 text-center text-sm">
                      Searching...
                    </p>
                  ) : results.length === 0 ? (
                    <p style={{ color: "var(--astro-mauve)" }} className="px-4 py-5 text-center text-sm">
                      No products found.
                    </p>
                  ) : (
                    results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => {
                          setSearch("");
                          setSearchOpen(false);
                        }}
                        style={{ borderColor: "var(--astro-border)" }}
                        className="flex items-center justify-between border-b px-4 py-3 last:border-b-0"
                      >
                        <div>
                          <p style={{ color: "var(--astro-text)" }} className="text-sm font-medium">
                            {product.name}
                          </p>
                          <p style={{ color: "var(--astro-mauve)" }} className="text-[10px]">
                            {product.categories?.name || ""}
                          </p>
                        </div>

                        <span style={{ color: "var(--astro-primary)" }} className="text-xs font-semibold">
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
          <div
            style={{ backgroundColor: "var(--astro-card)", borderColor: "var(--astro-border)" }}
            className="border-t px-5 py-5 lg:hidden"
          >
            <nav className="flex flex-col">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  style={{ borderColor: "var(--astro-border)", color: "var(--astro-text)" }}
                  className="border-b py-4 text-sm"
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href="/consult"
                onClick={() => setMenuOpen(false)}
                style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                className="mt-5 rounded-sm px-5 py-3.5 text-center text-sm font-semibold"
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
