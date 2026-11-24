"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

/* Line icons for the admin sidebar (24×24, stroke = currentColor) */
const NAV_ICONS: Record<string, React.ReactNode> = {
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="8" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="5" rx="1.5" />
      <rect x="13.5" y="11.5" width="7" height="9" rx="1.5" />
      <rect x="3.5" y="14.5" width="7" height="6" rx="1.5" />
    </>
  ),
  products: (
    <>
      <path d="M6.5 4h11L21 9l-9 11L3 9l3.5-5z" />
      <path d="M3 9h18M9.5 4L8 9l4 11M14.5 4L16 9l-4 11" />
    </>
  ),
  categories: (
    <>
      <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
    </>
  ),
  orders: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  coupons: (
    <>
      <path d="M3.5 12.5V5.5a2 2 0 0 1 2-2h7l8 8-9 9-8-8z" />
      <circle cx="8" cy="8" r="1.5" />
    </>
  ),
  banners: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 15l5-4 4 3 3-2 6 4" />
      <circle cx="15.5" cy="9" r="1.5" />
    </>
  ),
  testimonials: (
    <>
      <path d="M4 5.5h16v10H9l-5 4v-14z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  reviews: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5z" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </>
  ),
  logout: (
    <>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 16l-4-4 4-4M6 12h10" />
    </>
  ),
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
};

function NavIcon({ name, className = "h-[18px] w-[18px]" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {NAV_ICONS[name]}
    </svg>
  );
}

const ADMIN_NAV = [
  { name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
  { name: "Products", href: "/admin/products", icon: "products" },
  { name: "Categories", href: "/admin/categories", icon: "categories" },
  { name: "Orders & Clients", href: "/admin/orders", icon: "orders" },
  { name: "Coupons", href: "/admin/coupons", icon: "coupons" },
  { name: "Banners", href: "/admin/banners", icon: "banners" },
  { name: "Testimonials", href: "/admin/testimonials", icon: "testimonials" },
  { name: "Reviews", href: "/admin/reviews", icon: "reviews" },
  { name: "Settings", href: "/admin/settings", icon: "settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";
  const current = ADMIN_NAV.find((item) => pathname?.startsWith(item.href));

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileMenuOpen]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#F9F6F1] text-[#241046]">{children}</div>;
  }

  const nav = (onNavigate?: () => void) => (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Admin">
      {ADMIN_NAV.map((item) => {
        const active = pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition ${
              active ? "bg-white/10 font-semibold text-white" : "text-[#d9d0e6]/80 hover:bg-white/5 hover:text-white"
            }`}
          >
            {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[#d7b46a]" aria-hidden="true" />}
            <span className={active ? "text-[#e3c27e]" : "text-[#d9d0e6]/60 group-hover:text-[#e3c27e]"}>
              <NavIcon name={item.icon} />
            </span>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-[#d9d0e6]/80 transition hover:bg-white/5 hover:text-white"
      >
        <NavIcon name="external" />
        View website
      </a>
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] text-[#d9d0e6]/80 transition hover:bg-white/5 hover:text-white"
      >
        <NavIcon name="logout" />
        Logout
      </button>
    </div>
  );

  const brand = (
    <div>
      <div className="astro-serif text-[22px] leading-none tracking-wide text-white">ASTRODISHA</div>
      <div className="mt-1.5 text-[10px] font-semibold tracking-[0.24em] text-[#d7b46a]">ADMIN PANEL</div>
    </div>
  );

  return (
    <div className="astro-admin flex min-h-screen flex-col bg-[#F9F6F1] text-[#241046] md:flex-row">
      {/* DESKTOP SIDEBAR */}
      <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col bg-[#160828] px-4 py-6 md:flex">
        <div className="mb-8 px-3">{brand}</div>
        <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto">
          {nav()}
          {footer}
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-[56px] items-center justify-between bg-[#160828] px-4 text-white shadow-[0_4px_20px_rgba(22,8,40,0.25)] md:hidden">
        <div className="flex items-center gap-2">
          <span className="astro-serif text-[19px]">ASTRODISHA</span>
          {current && <span className="text-[12px] text-[#d9d0e6]/70">· {current.name}</span>}
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
        >
          <NavIcon name={mobileMenuOpen ? "close" : "menu"} className="h-5 w-5" />
        </button>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="astro-backdrop absolute inset-0 bg-[rgba(22,8,40,0.5)]"
          />
          <div className="absolute inset-y-0 left-0 flex w-[80%] max-w-[300px] flex-col bg-[#160828] px-4 py-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between px-3">
              {brand}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
              >
                <NavIcon name="close" className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
              {nav(() => setMobileMenuOpen(false))}
              {footer}
            </div>
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="w-full min-w-0 flex-1 pt-[56px] md:pt-0">{children}</main>
    </div>
  );
}
