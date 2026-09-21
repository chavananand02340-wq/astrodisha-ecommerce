"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { createClient } from "@/utils/supabase/client";

type Coupon = {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  valid_until: string | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
};

export default function AdminCouponsPage() {
  return (
    <AdminGuard>
      <CouponsContent />
    </AdminGuard>
  );
}

function CouponsContent() {
  const supabase = createClient();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderValue, setMinOrderValue] = useState("0");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadCoupons() {
    setLoading(true);
    const { data, error } = await supabase
      .from("coupons")
      .select("id, code, discount_type, discount_value, min_order_value, max_discount, valid_until, usage_limit, used_count, is_active")
      .order("created_at", { ascending: false });

    if (error) {
      setStatusMsg("Failed to load coupons: " + error.message);
    } else {
      setCoupons(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddCoupon(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg("");

    if (!code || !discountValue) {
      setStatusMsg("Coupon code and discount value are required.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("coupons").insert({
      code: code.toUpperCase().trim(),
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      min_order_value: minOrderValue ? parseFloat(minOrderValue) : 0,
      max_discount: maxDiscount ? parseFloat(maxDiscount) : null,
      valid_until: validUntil ? new Date(validUntil).toISOString() : null,
      usage_limit: usageLimit ? parseInt(usageLimit, 10) : null,
      is_active: true,
    });

    setSubmitting(false);

    if (error) {
      setStatusMsg("Failed to add coupon: " + error.message);
      return;
    }

    setCode("");
    setDiscountValue("");
    setMinOrderValue("0");
    setMaxDiscount("");
    setValidUntil("");
    setUsageLimit("");
    setStatusMsg("Coupon added successfully.");
    loadCoupons();
  }

  async function toggleActive(coupon: Coupon) {
    const { error } = await supabase
      .from("coupons")
      .update({ is_active: !coupon.is_active })
      .eq("id", coupon.id);

    if (error) {
      setStatusMsg("Failed to update: " + error.message);
      return;
    }
    loadCoupons();
  }

  async function deleteCoupon(coupon: Coupon) {
    const { error } = await supabase.from("coupons").delete().eq("id", coupon.id);

    if (error) {
      setStatusMsg("Failed to delete: " + error.message);
      return;
    }
    loadCoupons();
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", color: "#3E2237" }}>
        Manage Coupons
      </h1>

      <div
        style={{
          backgroundColor: "#FBF8F2",
          border: "1px solid #D9CEC1",
          borderRadius: "8px",
          padding: "1.5rem",
          marginTop: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", color: "#3E2237", marginBottom: "1rem" }}>Add Coupon</h2>
        <form onSubmit={handleAddCoupon}>
          <input
            type="text"
            placeholder="Coupon Code (e.g. WELCOME10)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={inputStyle}
          />

          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            style={inputStyle}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="flat">Flat Amount (₹)</option>
          </select>

          <input
            type="number"
            placeholder={discountType === "percentage" ? "Discount % (e.g. 10)" : "Discount amount (₹)"}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Minimum order value (₹, optional)"
            value={minOrderValue}
            onChange={(e) => setMinOrderValue(e.target.value)}
            style={inputStyle}
          />

          {discountType === "percentage" && (
            <input
              type="number"
              placeholder="Max discount cap (₹, optional)"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              style={inputStyle}
            />
          )}

          <label style={{ fontSize: "0.8rem", color: "#8A607A" }}>Valid Until (optional)</label>
          <input
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Usage limit (optional, e.g. 100 total uses)"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={submitting}
            style={{
              backgroundColor: "#5A3150",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.6rem 1.2rem",
              fontWeight: "bold",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Adding..." : "Add Coupon"}
          </button>
        </form>

        {statusMsg && (
          <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#3E2237" }}>{statusMsg}</p>
        )}
      </div>

      <h2 style={{ fontSize: "1.1rem", color: "#3E2237", marginTop: "2rem", marginBottom: "1rem" }}>
        All Coupons
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : coupons.length === 0 ? (
        <p>No coupons yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {coupons.map((c) => (
            <div
              key={c.id}
              style={{
                border: "1px solid #D9CEC1",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: "#FBF8F2",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <div>
                <div style={{ fontWeight: "bold", color: "#3E2237" }}>
                  {c.code} — {c.discount_type === "percentage" ? `${c.discount_value}%` : `₹${c.discount_value}`}
                  {c.max_discount ? ` (max ₹${c.max_discount})` : ""}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#8A607A" }}>
                  Min order: ₹{c.min_order_value} • Used: {c.used_count}
                  {c.usage_limit ? `/${c.usage_limit}` : ""} •{" "}
                  {c.valid_until
                    ? `Expires: ${new Date(c.valid_until).toLocaleDateString("en-IN")}`
                    : "No expiry"}{" "}
                  • {c.is_active ? "Active" : "Inactive"}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => toggleActive(c)}
                  style={{
                    backgroundColor: c.is_active ? "#B00020" : "#5A3150",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  {c.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => deleteCoupon(c)}
                  style={{
                    backgroundColor: "#8A607A",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.4rem 0.8rem",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.6rem",
  marginBottom: "0.75rem",
  border: "1px solid #D9CEC1",
  borderRadius: "4px",
  backgroundColor: "#fff",
};
