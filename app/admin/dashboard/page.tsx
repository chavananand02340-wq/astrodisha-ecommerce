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
    { title: "Products", description: "Add, edit, manage stock and images", href: "/admin/products", icon: "gem" },
    { title: "Orders & Clients", description: "View orders, update status, customer details", href: "/admin/orders", icon: "box" },
    { title: "Categories", description: "Collections, banners and homepage photos", href: "/admin/categories", icon: "folder" },
    { title: "Coupons", description: "Create and manage discount codes", href: "/admin/coupons", icon: "tag" },
    { title: "Banners", description: "Switch homepage festival / seasonal banners", href: "/admin/banners", icon: "image" },
    { title: "Testimonials", description: "Add customer stories with photos or video", href: "/admin/testimonials", icon: "chat" },
    { title: "Reviews", description: "See and delete customer product reviews", href: "/admin/reviews", icon: "star" },
    { title: "Settings", description: "Store settings and preferences", href: "/admin/settings", icon: "cog" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-8 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a9843f]">{greeting}</p>
          <h1 className="astro-serif mt-1 text-[34px] leading-tight text-[#241046] sm:text-[42px]">Dashboard</h1>
          <p className="mt-1 text-[14px] text-[#6a5d70]">Here&rsquo;s a quick overview of ASTRODISHA.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2d1155] px-5 text-[13.5px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(45,17,85,0.6)] transition hover:bg-[#3e1f6e]"
          >
            + Add product
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex h-11 items-center rounded-full border border-[#E7DDCF] bg-white px-5 text-[13.5px] font-semibold text-[#241046] transition hover:border-[#c6a15b]"
          >
            View orders
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Total Products" value={stats?.totalProducts} icon="gem" href="/admin/products" />
        <StatCard label="Total Orders" value={stats?.totalOrders} icon="box" href="/admin/orders" />
        <StatCard
          label="Pending Orders"
          value={stats?.pendingOrders}
          icon="clock"
          href="/admin/orders"
          highlight={!!stats && stats.pendingOrders > 0}
        />
        <StatCard label="Active Coupons" value={stats?.activeCoupons} icon="tag" href="/admin/coupons" />
      </div>

      <div className="mt-6">
        <OrdersChart />
      </div>

      <h2 className="astro-serif mt-10 text-[26px] text-[#241046]">Manage</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex items-start gap-4 rounded-[20px] border border-[#E7DDCF] bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#c6a15b] hover:shadow-[0_14px_34px_-14px_rgba(36,16,70,0.2)] lg:flex-col lg:gap-3"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efe4cc] text-[#a9843f] transition group-hover:bg-[#2d1155] group-hover:text-[#e3c27e]">
              <DashIcon name={section.icon} />
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-semibold text-[#241046]">{section.title}</span>
              <span className="mt-1 block text-[12.5px] leading-snug text-[#6a5d70]">{section.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const DASH_ICONS: Record<string, React.ReactNode> = {
  gem: (
    <>
      <path d="M6.5 4h11L21 9l-9 11L3 9l3.5-5z" />
      <path d="M3 9h18M9.5 4L8 9l4 11M14.5 4L16 9l-4 11" />
    </>
  ),
  box: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.5V5.5a2 2 0 0 1 2-2h7l8 8-9 9-8-8z" />
      <circle cx="8" cy="8" r="1.5" />
    </>
  ),
  folder: <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />,
  image: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 15l5-4 4 3 3-2 6 4" />
    </>
  ),
  chat: (
    <>
      <path d="M4 5.5h16v10H9l-5 4v-14z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5z" />,
  cog: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" />
    </>
  ),
};

function DashIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {DASH_ICONS[name]}
    </svg>
  );
}

function StatCard({
  label,
  value,
  icon,
  href,
  highlight = false,
}: {
  label: string;
  value: number | undefined;
  icon: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-[22px] border p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-14px_rgba(36,16,70,0.25)] sm:p-5 ${
        highlight ? "border-[#c6a15b] bg-[#fbf3df]" : "border-[#E7DDCF] bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-[#6a5d70]">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${highlight ? "bg-[#c6a15b] text-white" : "bg-[#f3ede4] text-[#a9843f]"}`}>
          <DashIcon name={icon} />
        </span>
      </div>
      {value === undefined ? (
        <div className="astro-skeleton mt-4 h-8 w-16 rounded-lg" aria-hidden="true" />
      ) : (
        <div className="astro-serif mt-3 text-[36px] leading-none text-[#241046]">{value.toLocaleString("en-IN")}</div>
      )}
      {highlight && <p className="mt-2 text-[11.5px] font-semibold text-[#a9843f]">Needs attention →</p>}
    </Link>
  );
}
