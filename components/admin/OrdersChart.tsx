"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type ViewMode = "day" | "week" | "month";
type Bucket = { label: string; count: number };

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d: Date) {
  const x = startOfDay(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
}

export default function OrdersChart() {
  const [rawDates, setRawDates] = useState<Date[] | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("created_at")
        .order("created_at", { ascending: true });

      if (cancelled) return;

      if (error) {
        setError("Failed to load orders: " + error.message);
        return;
      }

      setRawDates((data || []).map((row: { created_at: string }) => new Date(row.created_at)));
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const buckets: Bucket[] = useMemo(() => {
    if (!rawDates) return [];

    if (viewMode === "day") {
      const days = 14;
      const today = startOfDay(new Date());
      const slots: Bucket[] = [];
      const map = new Map<string, number>();

      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        map.set(d.toISOString().slice(0, 10), 0);
        slots.push({ label: `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`, count: 0 });
      }

      rawDates.forEach((d) => {
        const key = startOfDay(d).toISOString().slice(0, 10);
        if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
      });

      let i = 0;
      for (const val of map.values()) {
        slots[i].count = val;
        i++;
      }
      return slots;
    }

    if (viewMode === "week") {
      const weeks = 8;
      const thisWeekStart = startOfWeek(new Date());
      const slots: Bucket[] = [];
      const map = new Map<string, number>();

      for (let i = weeks - 1; i >= 0; i--) {
        const d = new Date(thisWeekStart);
        d.setDate(d.getDate() - i * 7);
        map.set(d.toISOString().slice(0, 10), 0);
        slots.push({ label: `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`, count: 0 });
      }

      rawDates.forEach((d) => {
        const key = startOfWeek(d).toISOString().slice(0, 10);
        if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
      });

      let i = 0;
      for (const val of map.values()) {
        slots[i].count = val;
        i++;
      }
      return slots;
    }

    // month
    const months = 6;
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const slots: Bucket[] = [];
    const map = new Map<string, number>();

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(thisMonthStart.getFullYear(), thisMonthStart.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      map.set(key, 0);
      slots.push({ label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`, count: 0 });
    }

    rawDates.forEach((d) => {
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
    });

    let i = 0;
    for (const val of map.values()) {
      slots[i].count = val;
      i++;
    }
    return slots;
  }, [rawDates, viewMode]);

  const maxCount = Math.max(1, ...buckets.map((b) => b.count));
  const chartHeight = 160;

  return (
    <div
      style={{
        backgroundColor: "#FBF8F2",
        border: "1px solid #D9CEC1",
        borderRadius: "12px",
        padding: "1.25rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.05rem", color: "#3E2237", fontWeight: "bold", margin: 0, fontFamily: "Playfair Display, serif" }}>
          Orders Tracking
        </h2>

        <div style={{ display: "flex", gap: "0.4rem" }}>
          {(["day", "week", "month"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                backgroundColor: viewMode === mode ? "#5A3150" : "#fff",
                color: viewMode === mode ? "#fff" : "#3E2237",
                border: "1px solid " + (viewMode === mode ? "#5A3150" : "#D9CEC1"),
                borderRadius: "999px",
                padding: "0.35rem 0.9rem",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p style={{ color: "#B00020", fontSize: "0.85rem" }}>{error}</p>
      ) : !rawDates ? (
        <p style={{ color: "#8A607A", fontSize: "0.85rem" }}>Loading chart...</p>
      ) : buckets.every((b) => b.count === 0) ? (
        <p style={{ color: "#8A607A", fontSize: "0.85rem" }}>No orders in this period yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "8px",
              height: `${chartHeight}px`,
              minWidth: buckets.length * 34,
            }}
          >
            {buckets.map((b) => {
              const barHeight = Math.max(2, (b.count / maxCount) * (chartHeight - 24));
              return (
                <div
                  key={b.label}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "26px", flexShrink: 0 }}
                  title={`${b.label}: ${b.count} order${b.count === 1 ? "" : "s"}`}
                >
                  <div style={{ fontSize: "0.65rem", color: "#3E2237", marginBottom: "2px" }}>
                    {b.count > 0 ? b.count : ""}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: `${barHeight}px`,
                      backgroundColor: "#C6A15B",
                      borderRadius: "4px 4px 0 0",
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              minWidth: buckets.length * 34,
              marginTop: "6px",
              borderTop: "1px solid #D9CEC1",
              paddingTop: "6px",
            }}
          >
            {buckets.map((b) => (
              <div
                key={b.label}
                style={{ width: "26px", flexShrink: 0, fontSize: "0.6rem", color: "#8A607A", textAlign: "center", whiteSpace: "nowrap" }}
              >
                {b.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
                                    }
