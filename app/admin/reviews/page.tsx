"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { createClient } from "@/utils/supabase/client";

type ReviewRow = {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  products?: { name: string } | null;
};

export default function AdminReviewsPage() {
  return (
    <AdminGuard>
      <ReviewsContent />
    </AdminGuard>
  );
}

function ReviewsContent() {
  const supabase = createClient();

  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  async function loadReviews() {
    setLoading(true);

    const { data, error } = await supabase
      .from("reviews")
      .select("id, customer_name, rating, review_text, created_at, products(name)")
      .order("created_at", { ascending: false });

    if (error) {
      setStatusMsg("Failed to load reviews: " + error.message);
    } else {
      setReviews((data as unknown as ReviewRow[]) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this review permanently?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      setStatusMsg("Failed to delete: " + error.message);
      return;
    }
    loadReviews();
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", color: "#3E2237" }}>
        Customer Reviews
      </h1>

      <p style={{ color: "#8A607A", fontSize: "0.85rem", marginTop: "0.5rem" }}>
        All reviews go live on the site immediately. Use Delete to remove any review.
      </p>

      {statusMsg && (
        <p style={{ color: "#B00020", fontWeight: "bold", marginTop: "1rem" }}>{statusMsg}</p>
      )}

      {loading ? (
        <p style={{ marginTop: "1rem" }}>Loading...</p>
      ) : reviews.length === 0 ? (
        <p style={{ color: "#8A607A", marginTop: "1rem" }}>No reviews yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
          {reviews.map((r) => (
            <div
              key={r.id}
              style={{
                border: "1px solid #D9CEC1",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: "#FBF8F2",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <p style={{ fontWeight: "bold", color: "#3E2237", margin: 0 }}>
                    {r.customer_name}{" "}
                    <span style={{ fontWeight: "normal", color: "#8A607A", fontSize: "0.85rem" }}>
                      on {r.products?.name || "Unknown product"}
                    </span>
                  </p>
                  <p style={{ color: "#C6A15B", margin: "0.25rem 0" }}>
                    {"★".repeat(r.rating)}
                    <span style={{ color: "#D9CEC1" }}>{"★".repeat(5 - r.rating)}</span>
                  </p>
                  {r.review_text && (
                    <p style={{ color: "#3E2237", fontSize: "0.9rem", margin: "0.25rem 0" }}>
                      {r.review_text}
                    </p>
                  )}
                  <p style={{ color: "#8A607A", fontSize: "0.75rem", margin: 0 }}>
                    {new Date(r.created_at).toLocaleString("en-IN")}
                  </p>
                </div>

                <button
                  onClick={() => remove(r.id)}
                  style={{ backgroundColor: "#B00020", color: "#fff", border: "none", borderRadius: "4px", padding: "0.4rem 0.8rem", fontSize: "0.8rem", cursor: "pointer", height: "fit-content" }}
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
