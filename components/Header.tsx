"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStore } from "./StoreProvider";
import { createClient } from "@/utils/supabase/client";
import { useTheme } from "./ThemeProvider";

// Must match the free-shipping threshold in Supabase site_settings
const FREE_SHIPPING_THRESHOLD = 999;

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop All", href: "/shop" },
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

/* ---------- Line icons ---------- */

const ICON_PATHS: Record<string, React.ReactNode> = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.4-9.2-8.6C1.2 8.2 3 4.8 6.4 4.5c2-.2 3.8.9 5.6 3 1.8-2.1 3.6-3.2 5.6-3 3.4.3 5.2 3.7 3.6 6.9C19 15.6 12 20 12 20z" />
  ),
  bag: (
    <>
      <path d="M6 7h12l-1 13H7L6 7z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  truck: (
    <>
      <path d="M3 6h11v9H3z" />
      <path d="M14 9h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17" cy="17.5" r="1.6" />
    </>
  ),
  gem: (
    <>
      <path d="M6.5 4h11L21 9l-9 11L3 9l3.5-5z" />
      <path d="M3 9h18M9.5 4L8 9l4 11M14.5 4L16 9l-4 11" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </>
  ),
  lotus: (
    <>
      <path d="M12 4c-1.8 2-2.7 4.2-2.7 6.5S10.2 15 12 17c1.8-2 2.7-4.2 2.7-6.5S13.8 6 12 4z" />
      <path d="M12 17c-2.5-.3-4.6-1.5-6-3.5.3-2.3 1.5-4 3.4-5" />
      <path d="M12 17c2.5-.3 4.6-1.5 6-3.5-.3-2.3-1.5-4-3.4-5" />
      <path d="M12 17c-3.3.6-6.3-.1-9-2 1.2-1.3 2.6-2.1 4.2-2.4" />
      <path d="M12 17c3.3.6 6.3-.1 9-2-1.2-1.3-2.6-2.1-4.2-2.4" />
      <path d="M8 20h8" />
    </>
  ),
};

function Icon({
  name,
  className = "h-5 w-5",
  color = "currentColor",
}: {
  name: keyof typeof ICON_PATHS;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span
      style={{ backgroundColor: "var(--astro-accent)", color: "#160828" }}
      className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold"
    >
      {count}
    </span>
  );
}

const iconButtonClass =
  "relative flex h-9 w-9 items-center justify-center rounded-full transition hover:opacity-70";

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

  // Lock background scroll while the mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const themeLabel = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  const themeIcon = theme === "dark" ? "sun" : "moon";

  return (
    <>
      {/* ANNOUNCEMENT BAR — always dark cosmos */}
      <div
        style={{ backgroundColor: "#160828", color: "#f4effb" }}
        className="no-scrollbar overflow-x-auto px-4 py-2"
      >
        <div className="mx-auto flex w-max items-center gap-3 whitespace-nowrap text-[10px] tracking-[0.04em] sm:gap-5 sm:text-xs">
          <span className="flex items-center gap-1.5">
            <Icon name="truck" className="h-3.5 w-3.5" color="#c6a15b" />
            Free Shipping on Orders Above ₹{FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}
          </span>
          <span className="opacity-40">|</span>
          <span className="flex items-center gap-1.5">
            <Icon name="gem" className="h-3.5 w-3.5" color="#c6a15b" />
            Authentic Products
          </span>
          <span className="opacity-40">|</span>
          <span className="flex items-center gap-1.5">
            <Icon name="pin" className="h-3.5 w-3.5" color="#c6a15b" />
            Pan India Delivery
          </span>
        </div>
      </div>

      <header
        style={{
          backgroundColor: "var(--astro-bg)",
          borderColor: "var(--astro-border)",
        }}
        className="sticky top-0 z-50 border-b backdrop-blur-md"
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6">

          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
              style={{ color: "var(--astro-primary)" }}
              className={`${iconButtonClass} shrink-0 lg:hidden`}
            >
              <Icon name="menu" className="h-6 w-6" />
            </button>

            <Link href="/" className="flex min-w-0 items-center gap-2">
              <Icon name="lotus" className="h-8 w-8 shrink-0" color="var(--astro-accent)" />

              <div className="min-w-0">
                <div
                  style={{ color: "var(--astro-primary)" }}
                  className="astro-serif truncate text-[19px] leading-none sm:text-[21px]"
                >
                  ASTRODISHA
                </div>

                <div
                  style={{ color: "var(--astro-accent)" }}
                  className="mt-1 truncate text-[6px] tracking-[0.12em] sm:text-[7px]"
                >
                  GUIDANCE · HEALING · DIVINE ALIGNMENT
                </div>
              </div>
            </Link>
          </div>

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

          {/* DESKTOP ICONS */}
          <div style={{ color: "var(--astro-primary)" }} className="hidden items-center gap-2 lg:flex">

            <button
              type="button"
              aria-label={themeLabel}
              onClick={toggleTheme}
              className={iconButtonClass}
            >
              <Icon name={themeIcon} />
            </button>

            <button
              type="button"
              aria-label="Open search"
              onClick={() => setSearchOpen((value) => !value)}
              className={iconButtonClass}
            >
              <Icon name="search" />
            </button>

            <Link
              href="/wishlist"
              aria-label={`Wishlist with ${wishlistCount} items`}
              className={iconButtonClass}
            >
              <Icon name="heart" />
              {wishlistCount > 0 && <CountBadge count={wishlistCount} />}
            </Link>

            <Link
              href="/cart"
              aria-label={`Cart with ${cartCount} items`}
              className={iconButtonClass}
            >
              <Icon name="bag" />
              <CountBadge count={cartCount} />
            </Link>

            <Link
              href="/consult"
              style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
              className="ml-2 rounded-full px-5 py-2.5 text-[11px] font-semibold transition hover:opacity-90"
            >
              Consult an Expert
            </Link>
          </div>

          {/* MOBILE ICONS (hamburger moved to the left, these stay on the right) */}
          <div style={{ color: "var(--astro-primary)" }} className="flex shrink-0 items-center gap-0.5 lg:hidden">

            <button
              type="button"
              aria-label={themeLabel}
              onClick={toggleTheme}
              className={iconButtonClass}
            >
              <Icon name={themeIcon} />
            </button>

            <button
              type="button"
              aria-label="Open search"
              onClick={() => setSearchOpen((value) => !value)}
              className={iconButtonClass}
            >
              <Icon name="search" />
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={iconButtonClass}
            >
              <Icon name="heart" />
              {wishlistCount > 0 && <CountBadge count={wishlistCount} />}
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className={iconButtonClass}
            >
              <Icon name="bag" />
              <CountBadge count={cartCount} />
            </Link>
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
                className="flex items-center gap-3 rounded-full border px-4"
              >
                <span style={{ color: "var(--astro-mauve)" }}>
                  <Icon name="search" className="h-4 w-4" />
                </span>

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
                  className="mt-3 overflow-hidden rounded-xl border"
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
      </header>

      {/* MOBILE DRAWER — slides in from the left */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        style={{ backgroundColor: "var(--astro-bg)" }}
        className={`fixed inset-y-0 left-0 z-50 w-[82%] max-w-xs transform overflow-y-auto shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          style={{ borderColor: "var(--astro-border)" }}
          className="flex items-center justify-between border-b px-5 py-5"
        >
          <Icon name="lotus" className="h-7 w-7" color="var(--astro-accent)" />

          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            style={{ color: "var(--astro-primary)" }}
            className={iconButtonClass}
          >
            <Icon name="close" className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col px-5 py-3">
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
            className="mt-5 rounded-full px-5 py-3.5 text-center text-sm font-semibold"
          >
            Consult an Expert
          </Link>
        </nav>
      </div>
    </>
  );
    }
