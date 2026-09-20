"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { createClient } from "@/utils/supabase/client";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  is_active: boolean;
  category_id: string;
  short_description: string | null;
  categories?: { name: string } | null;
};

type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
};

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <ProductsContent />
    </AdminGuard>
  );
}

function ProductsContent() {
  const supabase = createClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [imagesForProduct, setImagesForProduct] = useState<string | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageMsg, setImageMsg] = useState("");

  async function loadData() {
    setLoading(true);

    const { data: cats } = await supabase.from("categories").select("id, name");
    setCategories(cats || []);
    if (cats && cats.length > 0 && !categoryId) {
      setCategoryId(cats[0].id);
    }

    const { data: prods, error } = await supabase
      .from("products")
      .select("id, name, price, stock, is_active, category_id, short_description, categories(name)")
      .order("created_at", { ascending: false });

    if (error) {
      setStatusMsg("Failed to load products: " + error.message);
    } else {
      setProducts((prods as unknown as Product[]) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function slugify(text: string) {
    return (
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Date.now()
    );
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg("");

    if (!name || !categoryId || !price) {
      setStatusMsg("Name, category, and price are required.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("products").insert({
      name,
      slug: slugify(name),
      category_id: categoryId,
      price: parseFloat(price),
      stock: stock ? parseInt(stock, 10) : 0,
      short_description: shortDescription || null,
      is_active: true,
    });

    setSubmitting(false);

    if (error) {
      setStatusMsg("Failed to add product: " + error.message);
      return;
    }

    setName("");
    setPrice("");
    setStock("");
    setShortDescription("");
    setStatusMsg("Product added successfully.");
    loadData();
  }

  async function handleToggleActive(product: Product) {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);

    if (error) {
      setStatusMsg("Failed to update status: " + error.message);
      return;
    }

    loadData();
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setEditName(product.name);
    setEditCategoryId(product.category_id);
    setEditPrice(String(product.price));
    setEditStock(String(product.stock));
    setEditDescription(product.short_description || "");
    setStatusMsg("");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(productId: string) {
    if (!editName || !editCategoryId || !editPrice) {
      setStatusMsg("Name, category, and price are required.");
      return;
    }

    setSavingEdit(true);

    const { error } = await supabase
      .from("products")
      .update({
        name: editName,
        category_id: editCategoryId,
        price: parseFloat(editPrice),
        stock: editStock ? parseInt(editStock, 10) : 0,
        short_description: editDescription || null,
      })
      .eq("id", productId);

    setSavingEdit(false);

    if (error) {
      setStatusMsg("Failed to save changes: " + error.message);
      return;
    }

    setStatusMsg("Product updated successfully.");
    setEditingId(null);
    loadData();
  }

  async function loadImages(productId: string) {
    setImagesForProduct(productId);
    setImageMsg("");
    const { data, error } = await supabase
      .from("product_images")
      .select("id, product_id, image_url, is_primary, sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });

    if (error) {
      setImageMsg("Failed to load images: " + error.message);
      return;
    }
    setImages(data || []);
  }

  function closeImages() {
    setImagesForProduct(null);
    setImages([]);
  }

  function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const maxDimension = 1000;
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
          0.75
        );
      };

      img.onerror = () => reject(new Error("Failed to read image"));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  async function handleUploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (!imagesForProduct || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);
    setImageMsg("Compressing and uploading...");

    try {
      const compressed = await compressImage(file);
      const fileName = `${imagesForProduct}/${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, compressed, { contentType: "image/jpeg" });

      if (uploadError) {
        setImageMsg("Upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      const isFirstImage = images.length === 0;

      const { error: insertError } = await supabase.from("product_images").insert({
        product_id: imagesForProduct,
        image_url: publicUrlData.publicUrl,
        is_primary: isFirstImage,
        sort_order: images.length,
      });

      if (insertError) {
        setImageMsg("Saved to storage but failed to save record: " + insertError.message);
        setUploading(false);
        return;
      }

      setImageMsg("Image uploaded successfully.");
      loadImages(imagesForProduct);
    } catch (err) {
      setImageMsg("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    }

    setUploading(false);
    e.target.value = "";
  }

  async function handleDeleteImage(image: ProductImage) {
    const { error } = await supabase.from("product_images").delete().eq("id", image.id);

    if (error) {
      setImageMsg("Failed to delete: " + error.message);
      return;
    }

    if (imagesForProduct) loadImages(imagesForProduct);
  }

  async function handleSetPrimary(image: ProductImage) {
    if (!imagesForProduct) return;

    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", imagesForProduct);

    const { error } = await supabase
      .from("product_images")
      .update({ is_primary: true })
      .eq("id", image.id);

    if (error) {
      setImageMsg("Failed to set primary: " + error.message);
      return;
    }

    loadImages(imagesForProduct);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", color: "#3E2237" }}>
        Manage Products
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
        <h2 style={{ fontSize: "1.1rem", color: "#3E2237", marginBottom: "1rem" }}>Add Product</h2>
        <form onSubmit={handleAddProduct}>
          <input
            type="text"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={inputStyle}>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Stock quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Short description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            style={{ ...inputStyle, minHeight: "60px" }}
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
            {submitting ? "Adding..." : "Add Product"}
          </button>
        </form>

        {statusMsg && (
          <p style={{ marginTop: "1rem", fontWeight: "bold", color: "#3E2237" }}>{statusMsg}</p>
        )}
      </div>

      <h2 style={{ fontSize: "1.1rem", color: "#3E2237", marginTop: "2rem", marginBottom: "1rem" }}>
        All Products
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #D9CEC1",
                borderRadius: "8px",
                padding: "1rem",
                backgroundColor: "#FBF8F2",
              }}
            >
              {editingId === p.id ? (
                <div>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={inputStyle}
                  />
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    style={inputStyle}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Price"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    style={inputStyle}
                  />
                  <textarea
                    placeholder="Short description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    style={{ ...inputStyle, minHeight: "60px" }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => saveEdit(p.id)}
                      disabled={savingEdit}
                      style={{
                        backgroundColor: "#5A3150",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.5rem 1rem",
                        cursor: savingEdit ? "not-allowed" : "pointer",
                      }}
                    >
                      {savingEdit ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        backgroundColor: "#D9CEC1",
                        color: "#3E2237",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <div style={{ fontWeight: "bold", color: "#3E2237" }}>{p.name}</div>
                    <div style={{ fontSize: "0.85rem", color: "#8A607A" }}>
                      {p.categories?.name || "-"} • ₹{p.price} • Stock: {p.stock} •{" "}
                      {p.is_active ? "Active" : "Inactive"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => startEdit(p)}
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
                      Edit
                    </button>
                    <button
                      onClick={() => loadImages(p.id)}
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
                      Images
                    </button>
                    <button
                      onClick={() => handleToggleActive(p)}
                      style={{
                        backgroundColor: p.is_active ? "#B00020" : "#5A3150",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        padding: "0.4rem 0.8rem",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      {p.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              )}

              {imagesForProduct === p.id && (
                <div
                  style={{
                    marginTop: "1rem",
                    borderTop: "1px solid #D9CEC1",
                    paddingTop: "1rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "0.95rem", color: "#3E2237", margin: 0 }}>
                      Product Images ({images.length})
                    </h3>
                    <button
                      onClick={closeImages}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#8A607A",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                      }}
                    >
                      Close
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.75rem",
                      marginTop: "0.75rem",
                    }}
                  >
                    {images.map((img) => (
                      <div
                        key={img.id}
                        style={{
                          border: img.is_primary ? "2px solid #C6A15B" : "1px solid #D9CEC1",
                          borderRadius: "6px",
                          padding: "0.3rem",
                          width: "100px",
                        }}
                      >
                        <img
                          src={img.image_url}
                          alt=""
                          style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "4px" }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
                          <button
                            onClick={() => handleSetPrimary(img)}
                            title="Set as primary"
                            style={{
                              fontSize: "0.65rem",
                              background: "none",
                              border: "none",
                              color: img.is_primary ? "#C6A15B" : "#8A607A",
                              cursor: "pointer",
                            }}
                          >
                            {img.is_primary ? "★ Primary" : "☆ Set"}
                          </button>
                          <button
                            onClick={() => handleDeleteImage(img)}
                            title="Delete"
                            style={{
                              fontSize: "0.65rem",
                              background: "none",
                              border: "none",
                              color: "#B00020",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "1rem" }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      disabled={uploading}
                    />
                    {uploading && <p style={{ fontSize: "0.85rem" }}>Uploading...</p>}
                    {imageMsg && (
                      <p style={{ fontSize: "0.85rem", fontWeight: "bold", color: "#3E2237" }}>
                        {imageMsg}
                      </p>
                    )}
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
