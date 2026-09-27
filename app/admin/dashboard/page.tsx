"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { createClient } from "@/utils/supabase/client";
import OrdersChart from "@/components/admin/OrdersChart";

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
    {
      title: "Reviews",
      description: "See and delete customer product reviews",
      href: "/admin/reviews",
      icon: "⭐",
    },
  ];

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", color: "#3E2237", marginBottom: "0.25rem", fontSize: "1.6rem" }}>
        Admin Dashboard
      </h1>
      <p style={{ color: "#8A607A", marginBottom: "1.75rem", fontSize: "0.9rem" }}>
        Welcome back. Here&rsquo;s a quick overview of ASTRODISHA.
      </p>

      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
            marginBottom: "1.75rem",
          }}
        >
          <StatCard label="Total Products" value={stats.totalProducts} icon="🛍️" />
          <StatCard label="Total Orders" value={stats.totalOrders} icon="📦" />
          <StatCard label="Pending Orders" value={stats.pendingOrders} icon="⏳" highlight={stats.pendingOrders > 0} />
          <StatCard label="Active Coupons" value={stats.activeCoupons} icon="🏷️" />
        </div>
      )}

      <div style={{ marginBottom: "1.75rem" }}>
        <OrdersChart />
      </div>

      <h2 style={{ fontSize: "1.05rem", color: "#3E2237", marginBottom: "1rem", fontWeight: "bold" }}>
        Manage
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "1rem",
        }}
      >
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="transition hover:-translate-y-0.5 hover:border-[#C6A15B] hover:shadow-md"
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "150px",
              backgroundColor: "#FBF8F2",
              border: "1px solid #D9CEC1",
              borderRadius: "12px",
              padding: "1.4rem",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "44px",
                height: "44px",
                borderRadius: "999px",
                backgroundColor: "#F4EFFB",
                fontSize: "1.3rem",
                marginBottom: "0.75rem",
              }}
            >
              {section.icon}
            </span>
            <div style={{ fontWeight: "bold", color: "#3E2237", fontSize: "1.02rem" }}>
              {section.title}
            </div>
            <div style={{ fontSize: "0.82rem", color: "#8A607A", marginTop: "0.3rem", lineHeight: 1.4 }}>
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
  icon,
  highlight = false,
}: {
  label: string;
  value: number;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: highlight ? "#F7E9C6" : "#FBF8F2",
        border: `1px solid ${highlight ? "#C6A15B" : "#D9CEC1"}`,
        borderRadius: "12px",
        padding: "1.1rem 1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        boxShadow: "0 2px 8px rgba(62,34,55,0.05)",
      }}
    >
      <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{icon}</span>
      <div>
        <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#3E2237", lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: "0.72rem", color: "#8A607A", marginTop: "0.15rem" }}>{label}</div>
      </div>
    </div>
  );
}
