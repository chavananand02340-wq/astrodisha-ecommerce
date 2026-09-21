"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { createClient } from "@/utils/supabase/client";

type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  button_text: string | null;
  button_link: string | null;
  is_active: boolean;
};

export default function AdminBannersPage() {
  return (
    <AdminGuard>
      <BannersContent />
    </AdminGuard>
  );
}

function BannersContent() {
  const supabase = createClient();

  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [uploading, setUploading] = useState(false);

  async function loadBanners() {
    setLoading(true);
    const { data, error } = await supabase
      .from("banners")
      .select("id, title, subtitle, image_url, button_text, button_link, is_active")
      .order("created_at", { ascending: false });

    if (error) {
      setStatusMsg("Failed to load banners: " + error.message);
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadBanners();
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
        const maxWidth = 1600;
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

  async function handleAddBanner(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg("");

    const fileInput = (e.target as HTMLFormElement).elements.namedItem(
      "bannerImage"
    ) as HTMLInputElement;

    if (!title || !fileInput.files || fileInput.files.length === 0) {
      setStatusMsg("Title and image are required.");
      return;
    }

    setUploading(true);

    try {
      const file = fileInput.files[0];
      const compressed = await compressImage(file);
      const fileName = `${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("banner-images")
        .upload(fileName, compressed, { contentType: "image/jpeg" });

      if (uploadError) {
        setStatusMsg("Image upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("banner-images")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("banners").insert({
        title,
        subtitle: subtitle || null,
        image_url: publicUrlData.publicUrl,
        button_text: buttonText || null,
        button_link: buttonLink || null,
        is_active: false,
      });

      if (insertError) {
        setStatusMsg("Failed to save banner: " + insertError.message);
        setUploading(false);
        return;
      }

      setTitle("");
      setSubtitle("");
      setButtonText("");
      setButtonLink("");
      fileInput.value = "";
      setStatusMsg("Banner added successfully.");
      loadBanners();
    } catch (err) {
      setStatusMsg("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    }

    setUploading(false);
  }

  async function activateBanner(banner: Banner) {
    await supabase.from("banners").update({ is_active: false }).eq("is_active", true);

    const { error } = await supabase
      .from("banners")
      .update({ is_active: true })
      .eq("id", banner.id);

    if (error) {
      setStatusMsg("Failed to activate: " + error.message);
      return;
    }

    loadBanners();
  }

  async function deactivateBanner(banner: Banner) {
    const { error } = await supabase
      .from("banners")
      .update({ is_active: false })
      .eq("id", banner.id);

    if (error) {
      setStatusMsg("Failed to deactivate: " + error.message);
      return;
    }

    loadBanners();
  }

  async function deleteBanner(banner: Banner) {
    const { error } = await supabase.from("banners").delete().eq("id", banner.id);

    if (error) {
      setStatusMsg("Failed to delete: " + error.message);
      return;
    }

    loadBanners();
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", color: "#3E2237" }}>
        Manage Homepage Banners
      </h1>
      <p style={{ color: "#8A607A", fontSize: "0.85rem" }}>
        Only one banner can be active at a time. Activating a new one automatically deactivates the previous.
      </p>

      <div
        style={{
          backgroundColor: "#FBF8F2",
          border: "1px solid #D9CEC1",
          borderRadius: "8px",
          padding: "1.5rem",
          marginTop: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", color: "#3E2237", marginBottom: "1rem" }}>Add Banner</h2>
        <form onSubmit={handleAddBanner}>
          <input
            type="text"
            placeholder="Title (e.g. Diwali Special Collection)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Subtitle (optional)"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Button text (optional, e.g. Shop Now)"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Button link (optional, e.g. /gemstones)"
            value={buttonLink}
            onChange={(e) => setButtonLink(e.target.value)}
            style={inputStyle}
          />
          <input type="file" name="bannerImage" accept="image/*" style={{ marginBottom: "0.75rem" }} />

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
            {uploading ? "Uploading..." : "Add Banner"}
          </button>
        </form>

        {statusMsg && (
          <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#3E2237" }}>{statusMsg}</p>
        )}
      </div>

      <h2 style={{ fontSize: "1.1rem", color: "#3E2237", marginTop: "2rem", marginBottom: "1rem" }}>
        All Banners
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : banners.length === 0 ? (
        <p>No banners yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {banners.map((b) => (
            <div
              key={b.id}
              style={{
                border: b.is_active ? "2px solid #C6A15B" : "1px solid #D9CEC1",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: "#FBF8F2",
              }}
            >
              <img
                src={b.image_url}
                alt={b.title}
                style={{ width: "100%", maxHeight: "150px", objectFit: "cover", borderRadius: "6px" }}
              />
              <div style={{ marginTop: "0.5rem" }}>
                <div style={{ fontWeight: "bold", color: "#3E2237" }}>
                  {b.title} {b.is_active && <span style={{ color: "#C6A15B" }}>(Active)</span>}
                </div>
                {b.subtitle && (
                  <div style={{ fontSize: "0.85rem", color: "#8A607A" }}>{b.subtitle}</div>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                {b.is_active ? (
                  <button
                    onClick={() => deactivateBanner(b)}
                    style={{
                      backgroundColor: "#B00020",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => activateBanner(b)}
                    style={{
                      backgroundColor: "#5A3150",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    Activate
                  </button>
                )}
                <button
                  onClick={() => deleteBanner(b)}
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
