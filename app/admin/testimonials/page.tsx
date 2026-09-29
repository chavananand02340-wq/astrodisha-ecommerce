"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { createClient } from "@/utils/supabase/client";

type MediaType = "image" | "video" | "audio";

type Testimonial = {
  id: string;
  customer_name: string;
  testimonial_text: string;
  image_url: string | null;
  rating: number | null;
  is_active: boolean;
  media_type: MediaType | null;
  media_url: string | null;
  media_path: string | null;
};

const MAX_VIDEO_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_AUDIO_BYTES = 3 * 1024 * 1024; // 3MB
const MAX_MEDIA_IMAGE_BYTES = 8 * 1024 * 1024; // before compression

const MEDIA_ACCEPT: Record<MediaType, string> = {
  image: "image/jpeg,image/png,image/webp",
  video: "video/mp4,video/webm",
  audio: "audio/mpeg,audio/mp4,audio/webm,audio/ogg",
};

const BUCKET = "testimonial-images";

export default function AdminTestimonialsPage() {
  return (
    <AdminGuard>
      <TestimonialsContent />
    </AdminGuard>
  );
}

function pathFromPublicUrl(url: string | null): string | null {
  if (!url) return null;
  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

function extFromFile(file: File, fallback: string): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return fallback;
}

function compressAvatarImage(file: File): Promise<Blob> {
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

function compressMediaImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const maxWidth = 1000;
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
        0.82
      );
    };

    img.onerror = () => reject(new Error("Failed to read image"));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function TestimonialsContent() {
  const supabase = createClient();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [testimonialText, setTestimonialText] = useState("");
  const [rating, setRating] = useState("5");
  const [mediaType, setMediaType] = useState<"none" | MediaType>("none");
  const [uploading, setUploading] = useState(false);

  // Per-row replace-media busy state
  const [replacingId, setReplacingId] = useState<string | null>(null);

  async function loadTestimonials() {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, customer_name, testimonial_text, image_url, rating, is_active, media_type, media_url, media_path")
      .order("created_at", { ascending: false });

    if (error) {
      setStatusMsg("Failed to load testimonials: " + error.message);
    } else {
      setTestimonials((data as Testimonial[]) || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function uploadMediaFile(file: File, type: MediaType): Promise<{ url: string; path: string }> {
    let blob: Blob = file;
    let ext = extFromFile(file, type === "image" ? "jpg" : type === "video" ? "mp4" : "mp3");
    let contentType = file.type || "application/octet-stream";

    if (type === "image") {
      blob = await compressMediaImage(file);
      ext = "jpg";
      contentType = "image/jpeg";
    }

    const path = `media/${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, { contentType });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, path };
  }

  function validateMediaFile(file: File, type: MediaType): string | null {
    if (type === "video" && file.size > MAX_VIDEO_BYTES) {
      return `Video is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max is 15MB.`;
    }
    if (type === "audio" && file.size > MAX_AUDIO_BYTES) {
      return `Audio is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max is 3MB.`;
    }
    if (type === "image" && file.size > MAX_MEDIA_IMAGE_BYTES) {
      return "Image is too large. Please choose a smaller file.";
    }
    return null;
  }

  async function handleAddTestimonial(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg("");

    if (!customerName || !testimonialText) {
      setStatusMsg("Customer name and testimonial text are required.");
      return;
    }

    const form = e.target as HTMLFormElement;
    const avatarInput = form.elements.namedItem("testimonialImage") as HTMLInputElement;
    const mediaInput = form.elements.namedItem("testimonialMedia") as HTMLInputElement | null;

    if (mediaType !== "none") {
      if (!mediaInput?.files || mediaInput.files.length === 0) {
        setStatusMsg(`Please choose a ${mediaType} file, or set Testimonial Media back to None.`);
        return;
      }
      const err = validateMediaFile(mediaInput.files[0], mediaType);
      if (err) {
        setStatusMsg(err);
        return;
      }
    }

    setUploading(true);

    try {
      let avatarUrl: string | null = null;

      if (avatarInput.files && avatarInput.files.length > 0) {
        const compressed = await compressAvatarImage(avatarInput.files[0]);
        const fileName = `${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(fileName, compressed, { contentType: "image/jpeg" });

        if (uploadError) {
          setStatusMsg("Avatar upload failed: " + uploadError.message);
          setUploading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
        avatarUrl = publicUrlData.publicUrl;
      }

      let mediaUrl: string | null = null;
      let mediaPath: string | null = null;

      if (mediaType !== "none" && mediaInput?.files?.[0]) {
        const uploaded = await uploadMediaFile(mediaInput.files[0], mediaType);
        mediaUrl = uploaded.url;
        mediaPath = uploaded.path;
      }

      const { error: insertError } = await supabase.from("testimonials").insert({
        customer_name: customerName,
        testimonial_text: testimonialText,
        image_url: avatarUrl,
        rating: rating ? parseInt(rating, 10) : null,
        is_active: true,
        media_type: mediaType === "none" ? null : mediaType,
        media_url: mediaUrl,
        media_path: mediaPath,
      });

      if (insertError) {
        setStatusMsg("Failed to save testimonial: " + insertError.message);
        setUploading(false);
        return;
      }

      setCustomerName("");
      setTestimonialText("");
      setRating("5");
      setMediaType("none");
      form.reset();
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
    if (!confirm(`Delete the testimonial from "${t.customer_name}"? This cannot be undone.`)) return;

    const pathsToRemove = [t.media_path, pathFromPublicUrl(t.image_url)].filter(
      (p): p is string => Boolean(p)
    );

    if (pathsToRemove.length > 0) {
      await supabase.storage.from(BUCKET).remove(pathsToRemove); // best-effort cleanup
    }

    const { error } = await supabase.from("testimonials").delete().eq("id", t.id);

    if (error) {
      setStatusMsg("Failed to delete: " + error.message);
      return;
    }
    loadTestimonials();
  }

  async function handleReplaceMedia(t: Testimonial, file: File, type: MediaType) {
    const err = validateMediaFile(file, type);
    if (err) {
      setStatusMsg(err);
      return;
    }

    setReplacingId(t.id);
    setStatusMsg("");

    try {
      const uploaded = await uploadMediaFile(file, type);

      const { error } = await supabase
        .from("testimonials")
        .update({ media_type: type, media_url: uploaded.url, media_path: uploaded.path })
        .eq("id", t.id);

      if (error) {
        setStatusMsg("Failed to save new media: " + error.message);
        setReplacingId(null);
        return;
      }

      if (t.media_path) {
        await supabase.storage.from(BUCKET).remove([t.media_path]); // best-effort, old file
      }

      setStatusMsg("Media replaced successfully.");
      loadTestimonials();
    } catch (e) {
      setStatusMsg("Error: " + (e instanceof Error ? e.message : "Unknown error"));
    }

    setReplacingId(null);
  }

  async function handleRemoveMedia(t: Testimonial) {
    if (!t.media_url) return;
    if (!confirm("Remove this testimonial's media?")) return;

    setReplacingId(t.id);

    const { error } = await supabase
      .from("testimonials")
      .update({ media_type: null, media_url: null, media_path: null })
      .eq("id", t.id);

    if (error) {
      setStatusMsg("Failed to remove media: " + error.message);
      setReplacingId(null);
      return;
    }

    if (t.media_path) {
      await supabase.storage.from(BUCKET).remove([t.media_path]); // best-effort
    }

    setStatusMsg("Media removed.");
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

          <label style={{ fontSize: "0.8rem", color: "#8A607A" }}>Customer photo (optional, small avatar)</label>
          <input
            type="file"
            name="testimonialImage"
            accept="image/*"
            style={{ marginBottom: "1rem", marginTop: "0.3rem" }}
          />

          <div
            style={{
              marginTop: "0.25rem",
              marginBottom: "1rem",
              padding: "0.9rem",
              border: "1px solid #D9CEC1",
              borderRadius: "6px",
              backgroundColor: "#fff",
            }}
          >
            <p style={{ fontWeight: "bold", color: "#3E2237", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              Testimonial Media (optional)
            </p>
            <p style={{ color: "#8A607A", fontSize: "0.75rem", marginBottom: "0.6rem" }}>
              Let the customer's testimonial include a photo, a short video (max 15MB) or a voice note (max 3MB).
            </p>

            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              {(["none", "image", "video", "audio"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setMediaType(opt)}
                  style={{
                    backgroundColor: mediaType === opt ? "#5A3150" : "#FBF8F2",
                    color: mediaType === opt ? "#fff" : "#3E2237",
                    border: "1px solid #D9CEC1",
                    borderRadius: "999px",
                    padding: "0.35rem 0.9rem",
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {mediaType !== "none" && (
              <input
                key={mediaType}
                type="file"
                name="testimonialMedia"
                accept={MEDIA_ACCEPT[mediaType]}
                style={{ fontSize: "0.85rem" }}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="transition hover:opacity-85 active:scale-95"
            style={{
              display: "block",
              backgroundColor: "#5A3150",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
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
                flexWrap: "wrap",
              }}
            >
              {t.image_url && (
                <img
                  src={t.image_url}
                  alt={t.customer_name}
                  style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }}
                />
              )}
              <div style={{ flex: 1, minWidth: "220px" }}>
                <div style={{ fontWeight: "bold", color: "#3E2237" }}>
                  {t.customer_name} {t.rating && "★".repeat(t.rating)}
                </div>
                <p style={{ fontSize: "0.85rem", color: "#5E4A58", marginTop: "0.3rem" }}>
                  {t.testimonial_text}
                </p>

                {t.media_type === "video" && t.media_url && (
                  <video src={t.media_url} controls className="mt-2 max-h-[220px] rounded-md bg-black" style={{ maxWidth: "260px" }} />
                )}
                {t.media_type === "audio" && t.media_url && (
                  <audio src={t.media_url} controls className="mt-2" style={{ maxWidth: "260px" }} />
                )}
                {t.media_type === "image" && t.media_url && (
                  <img src={t.media_url} alt="" style={{ marginTop: "0.5rem", maxWidth: "220px", borderRadius: "8px" }} />
                )}

                <div style={{ fontSize: "0.75rem", color: "#8A607A", marginTop: "0.4rem" }}>
                  {t.is_active ? "Active" : "Inactive"}
                  {t.media_type ? ` • Media: ${t.media_type}` : ""}
                </div>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => toggleActive(t)}
                    className="transition hover:opacity-85 active:scale-95"
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
                    className="transition hover:opacity-85 active:scale-95"
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

                  {t.media_url && (
                    <button
                      onClick={() => handleRemoveMedia(t)}
                      disabled={replacingId === t.id}
                      className="transition hover:opacity-85 active:scale-95"
                      style={{
                        backgroundColor: "transparent",
                        color: "#B00020",
                        border: "1px solid #B00020",
                        borderRadius: "4px",
                        padding: "0.35rem 0.7rem",
                        fontSize: "0.75rem",
                        cursor: replacingId === t.id ? "not-allowed" : "pointer",
                      }}
                    >
                      Remove Media
                    </button>
                  )}
                </div>

                <div style={{ marginTop: "0.6rem" }}>
                  <label style={{ fontSize: "0.72rem", color: "#8A607A", display: "block", marginBottom: "0.25rem" }}>
                    {t.media_url ? "Replace media with:" : "Add media:"}
                  </label>
                  <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                    {(["image", "video", "audio"] as const).map((opt) => (
                      <label
                        key={opt}
                        style={{
                          fontSize: "0.72rem",
                          border: "1px solid #D9CEC1",
                          borderRadius: "999px",
                          padding: "0.2rem 0.6rem",
                          cursor: replacingId === t.id ? "not-allowed" : "pointer",
                          color: "#3E2237",
                          textTransform: "capitalize",
                        }}
                      >
                        {opt}
                        <input
                          type="file"
                          accept={MEDIA_ACCEPT[opt]}
                          disabled={replacingId === t.id}
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleReplaceMedia(t, file, opt);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    ))}
                  </div>
                  {replacingId === t.id && (
                    <p style={{ fontSize: "0.72rem", color: "#8A607A" }}>Uploading...</p>
                  )}
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
