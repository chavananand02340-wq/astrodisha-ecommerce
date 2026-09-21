"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { createClient } from "@/utils/supabase/client";

type Testimonial = {
  id: string;
  customer_name: string;
  testimonial_text: string;
  image_url: string | null;
  rating: number | null;
  is_active: boolean;
};

export default function AdminTestimonialsPage() {
  return (
    <AdminGuard>
      <TestimonialsContent />
    </AdminGuard>
  );
}

function TestimonialsContent() {
  const supabase = createClient();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [testimonialText, setTestimonialText] = useState("");
  const [rating, setRating] = useState("5");
  const [uploading, setUploading] = useState(false);

  async function loadTestimonials() {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, customer_name, testimonial_text, image_url, rating, is_active")
      .order("created_at", { ascending: false });

    if (error) {
      setStatusMsg("Failed to load testimonials: " + error.message);
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const maxWidth = 600;
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Compression failed"));
          },
          "image/jpeg",
          0.8
        );
      };

      img.onerror = () => reject(new Error("Failed to read image"));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  async function handleAddTestimonial(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg("");

    if (!customerName || !testimonialText) {
      setStatusMsg("Customer name and testimonial text are required.");
      return;
    }

    setUploading(true);

    try {
      const fileInput = (e.target as HTMLFormElement).elements.namedItem(
        "testimonialImage"
      ) as HTMLInputElement;

      let imageUrl: string | null = null;

      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const compressed = await compressImage(file);
        const fileName = `${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("testimonial-images")
          .upload(fileName, compressed, { contentType: "image/jpeg" });

        if (uploadError) {
          setStatusMsg("Image upload failed: " + uploadError.message);
          setUploading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("testimonial-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("testimonials").insert({
        customer_name: customerName,
        testimonial_text: testimonialText,
        image_url: imageUrl,
        rating: rating ? parseInt(rating, 10) : null,
        is_active: true,
      });

      if (insertError) {
        setStatusMsg("Failed to save testimonial: " + insertError.message);
        setUploading(false);
        return;
      }

      setCustomerName("");
      setTestimonialText("");
      setRating("5");
      fileInput.value = "";
      setStatusMsg("Testimonial added successfully.");
      loadTestimonials();
    } catch (err) {
      setStatusMsg("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    }

    setUploading(false);
  }

  async function toggleActive(t: Testimonial) {
    const { error } = await supabase
      .from("testimonials")
      .update({ is_active: !t.is_active })
      .eq("id", t.id);

    if (error) {
      setStatusMsg("Failed to update: " + error.message);
      return;
    }
    loadTestimonials();
  }

  async function deleteTestimonial(t: Testimonial) {
    const { error } = await supabase.from("testimonials").delete().eq("id", t.id);

    if (error) {
      setStatusMsg("Failed to delete: " + error.message);
      return;
    }
    loadTestimonials();
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", color: "#3E2237" }}>
        Manage Testimonials
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
        <h2 style={{ fontSize: "1.1rem", color: "#3E2237", marginBottom: "1rem" }}>
          Add Testimonial
        </h2>
        <form onSubmit={handleAddTestimonial}>
          <input
            type="text"
            placeholder="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={inputStyle}
          />
          <textarea
            placeholder="Testimonial text"
            value={testimonialText}
            onChange={(e) => setTestimonialText(e.target.value)}
            style={{ ...inputStyle, minHeight: "80px" }}
          />
          <select value={rating} onChange={(e) => setRating(e.target.value)} style={inputStyle}>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </select>
          <label style={{ fontSize: "0.8rem", color: "#8A607A" }}>Customer photo (optional)</label>
          <input type="file" name="testimonialImage" accept="image/*" style={{ marginBottom: "0.75rem", marginTop: "0.3rem" }} />

          <button
            type="submit"
            disabled={uploading}
            style={{
              display: "block",
              backgroundColor: "#5A3150",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "0.6rem 1.2rem",
              fontWeight: "bold",
              cursor: uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Saving..." : "Add Testimonial"}
          </button>
        </form>

        {statusMsg && (
          <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#3E2237" }}>{statusMsg}</p>
        )}
      </div>

      <h2 style={{ fontSize: "1.1rem", color: "#3E2237", marginTop: "2rem", marginBottom: "1rem" }}>
        All Testimonials
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : testimonials.length === 0 ? (
        <p>No testimonials yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {testimonials.map((t) => (
            <div
              key={t.id}
              style={{
                border: "1px solid #D9CEC1",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: "#FBF8F2",
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
              }}
            >
              {t.image_url && (
                <img
                  src={t.image_url}
                  alt={t.customer_name}
                  style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold", color: "#3E2237" }}>
                  {t.customer_name} {t.rating && "★".repeat(t.rating)}
                </div>
                <p style={{ fontSize: "0.85rem", color: "#5E4A58", marginTop: "0.3rem" }}>
                  {t.testimonial_text}
                </p>
                <div style={{ fontSize: "0.75rem", color: "#8A607A", marginTop: "0.3rem" }}>
                  {t.is_active ? "Active" : "Inactive"}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button
                    onClick={() => toggleActive(t)}
                    style={{
                      backgroundColor: t.is_active ? "#B00020" : "#5A3150",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.35rem 0.7rem",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    {t.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteTestimonial(t)}
                    style={{
                      backgroundColor: "#8A607A",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.35rem 0.7rem",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
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
