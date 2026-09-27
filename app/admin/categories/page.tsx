"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { createClient } from "@/utils/supabase/client";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
};

// Existing static routes on the site — a category can never use these slugs,
// its page would never be reachable (the static page always wins).
const RESERVED_SLUGS = [
  "about", "contact", "cart", "checkout", "wishlist", "shop", "product",
  "why", "consult", "admin", "api", "order-confirmation", "faq",
  "privacy-policy", "terms", "disclaimer", "cancellation-refund",
  "shipping-delivery",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const maxDimension = 1200;
      let { width, height } = img;

      if (width > height && width > maxDimension) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else if (height > maxDimension) {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
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

export default function AdminCategoriesPage() {
  return (
    <AdminGuard>
      <CategoriesContent />
    </AdminGuard>
  );
}

function CategoriesContent() {
  const supabase = createClient();

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  // Add form
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  async function loadCategories() {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, image_url, display_order, is_active")
      .order("display_order", { ascending: true });

    if (error) {
      setStatusMsg("Failed to load categories: " + error.message);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function uploadCategoryImage(file: File): Promise<string> {
    const compressed = await compressImage(file);
    const fileName = `categories/${Date.now()}-${Math.round(Math.random() * 1e6)}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, compressed, { contentType: "image/jpeg" });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg("");

    if (!name.trim() || !description.trim()) {
      setStatusMsg("Name and description are required.");
      return;
    }

    if (!imageFile) {
      setStatusMsg("Please choose a photo for this category.");
      return;
    }

    const slug = slugify(name);

    if (!slug) {
      setStatusMsg("Please enter a valid name.");
      return;
    }

    if (RESERVED_SLUGS.includes(slug)) {
      setStatusMsg(`"${name}" clashes with an existing site page. Please choose a different name.`);
      return;
    }

    if (categories.some((c) => c.slug === slug)) {
      setStatusMsg(`A category with a similar name already exists ("${slug}"). Please choose a different name.`);
      return;
    }

    setSubmitting(true);

    try {
      const imageUrl = await uploadCategoryImage(imageFile);
      const nextOrder =
        categories.length > 0 ? Math.max(...categories.map((c) => c.display_order)) + 1 : 1;

      const { error } = await supabase.from("categories").insert({
        name: name.trim(),
        slug,
        description: description.trim(),
        image_url: imageUrl,
        display_order: nextOrder,
        is_active: true,
      });

      if (error) {
        setStatusMsg("Failed to add category: " + error.message);
        setSubmitting(false);
        return;
      }

      setName("");
      setDescription("");
      setImageFile(null);
      setStatusMsg(`Category added. It's live at /${slug}`);
      await loadCategories();
    } catch (err) {
      setStatusMsg("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    }

    setSubmitting(false);
  }

  function startEdit(cat: CategoryRow) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDescription(cat.description || "");
    setEditImageFile(null);
    setStatusMsg("");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(cat: CategoryRow) {
    if (!editName.trim() || !editDescription.trim()) {
      setStatusMsg("Name and description are required.");
      return;
    }

    setSavingEdit(true);

    try {
      let imageUrl = cat.image_url;
      if (editImageFile) {
        imageUrl = await uploadCategoryImage(editImageFile);
        // Note: the old photo stays in storage (not auto-deleted) to keep this safe and simple.
      }

      const { error } = await supabase
        .from("categories")
        .update({
          name: editName.trim(),
          description: editDescription.trim(),
          image_url: imageUrl,
        })
        .eq("id", cat.id);

      if (error) {
        setStatusMsg("Failed to save changes: " + error.message);
        setSavingEdit(false);
        return;
      }

      setStatusMsg("Category updated.");
      setEditingId(null);
      await loadCategories();
    } catch (err) {
      setStatusMsg("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    }

    setSavingEdit(false);
  }

  async function toggleActive(cat: CategoryRow) {
    const { error } = await supabase
      .from("categories")
      .update({ is_active: !cat.is_active })
      .eq("id", cat.id);

    if (error) {
      setStatusMsg("Failed to update status: " + error.message);
      return;
    }
    loadCategories();
  }

  async function handleDelete(cat: CategoryRow) {
    if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;

    const { error } = await supabase.from("categories").delete().eq("id", cat.id);

    if (error) {
      setStatusMsg(
        `Couldn't delete "${cat.name}": ${error.message}. If products still use this category, move or delete them first, or just deactivate this category instead.`
      );
      return;
    }

    setStatusMsg(`"${cat.name}" deleted.`);
    loadCategories();
  }

  async function move(cat: CategoryRow, direction: "up" | "down") {
    const sorted = [...categories].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex((c) => c.id === cat.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    const other = sorted[swapIndex];

    const [r1, r2] = await Promise.all([
      supabase.from("categories").update({ display_order: other.display_order }).eq("id", cat.id),
      supabase.from("categories").update({ display_order: cat.display_order }).eq("id", other.id),
    ]);

    if (r1.error || r2.error) {
      setStatusMsg("Failed to reorder: " + (r1.error?.message || r2.error?.message));
      return;
    }

    loadCategories();
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", color: "#3E2237" }}>
        Manage Categories
      </h1>
      <p style={{ color: "#8A607A", fontSize: "0.85rem", marginTop: "0.25rem" }}>
        Add a category here and its page goes live automatically at /its-name — no code changes needed.
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
        <h2 style={{ fontSize: "1.1rem", color: "#3E2237", marginBottom: "1rem" }}>Add Category</h2>
        <form onSubmit={handleAddCategory}>
          <input
            type="text"
            placeholder="Category name (e.g. Divine Products)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          {name.trim() && (
            <p style={{ fontSize: "0.75rem", color: "#8A607A", marginTop: "-0.5rem", marginBottom: "0.75rem" }}>
              Page will be: /{slugify(name)}
            </p>
          )}

          <textarea
            placeholder="Short description (shown on the category page and homepage)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, minHeight: "60px" }}
          />

          <label style={{ display: "block", fontSize: "0.85rem", color: "#3E2237", marginBottom: "0.4rem" }}>
            Category photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            style={{ marginBottom: "1rem" }}
          />

          <button
            type="submit"
            disabled={submitting}
            className="transition hover:opacity-85 active:scale-95"
            style={{
              backgroundColor: "#5A3150",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.6rem 1.2rem",
              fontWeight: "bold",
              cursor: submitting ? "not-allowed" : "pointer",
              display: "block",
            }}
          >
            {submitting ? "Adding..." : "Add Category"}
          </button>
        </form>

        {statusMsg && (
          <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#3E2237", fontSize: "0.9rem" }}>{statusMsg}</p>
        )}
      </div>

      <h2 style={{ fontSize: "1.1rem", color: "#3E2237", marginTop: "2rem", marginBottom: "1rem" }}>
        All Categories (in display order)
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              style={{
                border: cat.is_active ? "1px solid #D9CEC1" : "1px solid #B00020",
                borderRadius: "10px",
                padding: "1rem",
                backgroundColor: "#FBF8F2",
              }}
            >
              {editingId === cat.id ? (
                <div>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={inputStyle}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{ ...inputStyle, minHeight: "60px" }}
                  />
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#3E2237", marginBottom: "0.4rem" }}>
                    Replace photo (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                    style={{ marginBottom: "0.75rem" }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => saveEdit(cat)}
                      disabled={savingEdit}
                      style={{ backgroundColor: "#5A3150", color: "#fff", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer" }}
                    >
                      {savingEdit ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{ backgroundColor: "#D9CEC1", color: "#3E2237", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "0.9rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                  {cat.image_url && (
                    <img
                      src={cat.image_url}
                      alt=""
                      style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: "180px" }}>
                    <div style={{ fontWeight: "bold", color: "#3E2237", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      {cat.name}
                      {!cat.is_active && (
                        <span style={{ backgroundColor: "#B00020", color: "#fff", fontSize: "0.65rem", fontWeight: "bold", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>
                          Inactive
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#8A607A" }}>/{cat.slug}</div>
                    <div style={{ fontSize: "0.85rem", color: "#5A3150", marginTop: "0.25rem" }}>{cat.description}</div>

                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.7rem" }}>
                      <button
                        onClick={() => move(cat, "up")}
                        disabled={i === 0}
                        style={{ backgroundColor: "#8A607A", color: "#fff", border: "none", borderRadius: "6px", padding: "0.4rem 0.7rem", fontSize: "0.8rem", cursor: i === 0 ? "not-allowed" : "pointer", opacity: i === 0 ? 0.5 : 1 }}
                      >
                        ↑ Move Up
                      </button>
                      <button
                        onClick={() => move(cat, "down")}
                        disabled={i === categories.length - 1}
                        style={{ backgroundColor: "#8A607A", color: "#fff", border: "none", borderRadius: "6px", padding: "0.4rem 0.7rem", fontSize: "0.8rem", cursor: i === categories.length - 1 ? "not-allowed" : "pointer", opacity: i === categories.length - 1 ? 0.5 : 1 }}
                      >
                        ↓ Move Down
                      </button>
                      <button
                        onClick={() => startEdit(cat)}
                        style={{ backgroundColor: "#5A3150", color: "#fff", border: "none", borderRadius: "6px", padding: "0.4rem 0.7rem", fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(cat)}
                        style={{ backgroundColor: cat.is_active ? "#B00020" : "#5A3150", color: "#fff", border: "none", borderRadius: "6px", padding: "0.4rem 0.7rem", fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        {cat.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        style={{ backgroundColor: "transparent", color: "#B00020", border: "1px solid #B00020", borderRadius: "6px", padding: "0.4rem 0.7rem", fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
