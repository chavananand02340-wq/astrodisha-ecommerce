"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { createClient } from "@/utils/supabase/client";

type Stats = {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  activeCoupons: number;
};

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}

function DashboardContent() {
  const supabase = createClient();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function loadStats() {
      const [products, orders, pending, coupons] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("order_status", "Pending Payment"),
        supabase
          .from("coupons")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
      ]);

      setStats({
        totalProducts: products.count || 0,
        totalOrders: orders.count || 0,
        pendingOrders: pending.count || 0,
        activeCoupons: coupons.count || 0,
      });
    }

    loadStats();
  }, []);

  const sections = [
    {
      title: "Products",
      description: "Add, edit, manage stock and images",
      href: "/admin/products",
      icon: "🛍️",
    },
    {
      title: "Orders & Clients",
      description: "View orders, update status, customer details",
      href: "/admin/orders",
      icon: "📦",
    },
    {
      title: "Coupons",
      description: "Create and manage discount codes",
      href: "/admin/coupons",
      icon: "🏷️",
    },
    {
      title: "Banners",
      description: "Switch homepage festival/seasonal banners",
      href: "/admin/banners",
      icon: "🎉",
    },
    {
      title: "Testimonials",
      description: "Add customer reviews with photos",
      href: "/admin/testimonials",
      icon: "💬",
    },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", color: "#3E2237", marginBottom: "0.25rem" }}>
        Admin Dashboard
      </h1>
      <p style={{ color: "#8A607A", marginBottom: "2rem" }}>
        Welcome back. Here's a quick overview of ASTRODISHA.
      </p>

      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <StatCard label="Total Products" value={stats.totalProducts} />
          <StatCard label="Total Orders" value={stats.totalOrders} />
          <StatCard label="Pending Orders" value={stats.pendingOrders} highlight={stats.pendingOrders > 0} />
          <StatCard label="Active Coupons" value={stats.activeCoupons} />
        </div>
      )}

      <h2 style={{ fontSize: "1.1rem", color: "#3E2237", marginBottom: "1rem" }}>
        Manage
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            style={{
              display: "block",
              backgroundColor: "#FBF8F2",
              border: "1px solid #D9CEC1",
              borderRadius: "10px",
              padding: "1.5rem",
              textDecoration: "none",
              transition: "border-color 0.2s",
            }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{section.icon}</div>
            <div style={{ fontWeight: "bold", color: "#3E2237", fontSize: "1.05rem" }}>
              {section.title}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#8A607A", marginTop: "0.3rem" }}>
              {section.description}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: highlight ? "#F7E9C6" : "#FBF8F2",
        border: `1px solid ${highlight ? "#C6A15B" : "#D9CEC1"}`,
        borderRadius: "10px",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#3E2237" }}>{value}</div>
      <div style={{ fontSize: "0.75rem", color: "#8A607A", marginTop: "0.2rem" }}>{label}</div>
    </div>
  );
}
