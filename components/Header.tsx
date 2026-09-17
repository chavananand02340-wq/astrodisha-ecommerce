"use client";

import { useState } from "react";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Gemstones", href: "/gemstones" },
  { name: "Crystals", href: "/crystals" },
  { name: "Rudraksha", href: "/rudraksha" },
  { name: "Puja", href: "/puja" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" }
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#5a3150] px-4 py-2 text-center text-[9px] tracking-[0.08em] text-white sm:text-xs">
        Authentic Products&nbsp; | &nbsp;Secure Payments&nbsp; | &nbsp;Expert
        Guidance
      </div>

      <header className="sticky top-0 z-50 border-b border-[#d9cec1]/70 bg-[#f7f3ec]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
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

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <button
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237] hover:bg-[#fbf8f2]"
            >
              ⌕
            </button>

            <button
              aria-label="Account"
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm text-[#3e2237] hover:bg-[#fbf8f2]"
            >
              ♙
            </button>

            <button
              aria-label="Wishlist"
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237] hover:bg-[#fbf8f2]"
            >
              ♡
            </button>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237] hover:bg-[#fbf8f2]"
            >
              🛒

              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#5a3150] text-[8px] text-white">
                0
              </span>
            </Link>

            <Link
              href="#consult"
              className="ml-2 rounded-sm bg-[#5a3150] px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-[#3e2237]"
            >
              Consult an Expert
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237]"
            >
              ⌕
            </button>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237]"
            >
              ♡
            </Link>

            <Link
              href="/cart"
              aria-label="Cart"
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-lg text-[#3e2237]"
            >
              🛒

              <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#5a3150] text-[8px] text-white">
                0
              </span>
            </Link>

            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#3e2237]"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
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
                href="#consult"
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
