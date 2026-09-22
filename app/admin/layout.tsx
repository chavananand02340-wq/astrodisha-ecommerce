"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { name: "Products", href: "/admin/products", icon: "🛍️" },
  { name: "Orders & Clients", href: "/admin/orders", icon: "📦" },
  { name: "Coupons", href: "/admin/coupons", icon: "🏷️" },
  { name: "Banners", href: "/admin/banners", icon: "🎉" },
  { name: "Testimonials", href: "/admin/testimonials", icon: "💬" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (isLoginPage) {
    return (
      <div style={{ backgroundColor: "#F7F3EC", minHeight: "100vh", color: "#3E2237" }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F7F3EC", minHeight: "100vh", color: "#3E2237", display: "flex" }}>
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: "230px",
          backgroundColor: "#3E2237",
          color: "#fff",
          padding: "1.5rem 1rem",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
        className="hidden md:flex"
      >
        <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem" }}>
          <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.3rem" }}>
            ASTRODISHA
          </div>
          <div style={{ fontSize: "0.7rem", color: "#C6A15B", letterSpacing: "0.05em" }}>
            ADMIN PANEL
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.65rem 0.75rem",
                  borderRadius: "6px",
                  backgroundColor: active ? "#5A3150" : "transparent",
                  color: active ? "#fff" : "#D9CEC1",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "1rem",
            backgroundColor: "transparent",
            border: "1px solid #8A607A",
            color: "#D9CEC1",
            borderRadius: "6px",
            padding: "0.6rem",
            fontSize: "0.8rem",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </aside>

      {/* Mobile Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: "#3E2237",
          color: "#fff",
          padding: "0.85rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className="flex md:hidden"
      >
        <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.1rem" }}>
          ASTRODISHA Admin
        </div>
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          style={{ background: "none", border: "none", color: "#fff", fontSize: "1.4rem" }}
        >
          {mobileMenuOpen ? "×" : "☰"}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "52px",
            left: 0,
            right: 0,
            zIndex: 49,
            backgroundColor: "#3E2237",
            padding: "1rem",
          }}
          className="md:hidden"
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.65rem 0.75rem",
                    borderRadius: "6px",
                    backgroundColor: active ? "#5A3150" : "transparent",
                    color: active ? "#fff" : "#D9CEC1",
                    fontSize: "0.85rem",
                    textDecoration: "none",
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              style={{
                marginTop: "0.5rem",
                backgroundColor: "transparent",
                border: "1px solid #8A607A",
                color: "#D9CEC1",
                borderRadius: "6px",
                padding: "0.6rem",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0 }} className="pt-[52px] md:pt-0">
        {children}
      </main>
    </div>
  );
              }
