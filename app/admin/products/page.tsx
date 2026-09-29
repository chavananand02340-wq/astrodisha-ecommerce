"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/components/AdminGuard";
import { createClient } from "@/utils/supabase/client";

type Category = {
  id: string;
  name: string;
};

type SpecRow = { key: string; value: string };

// ---- PDP (product page) content types ----
type BenefitRow = { title: string; description: string };
type WearStep = { title: string; description: string; icon: string };
type DetailRow = { label: string; value: string; icon: string };
type Certificate = {
  lab_name?: string;
  report_number?: string;
  weight?: string;
  shape?: string;
  dimensions?: string;
  colour?: string;
  species?: string;
  variety?: string;
  treatment?: string;
  comments?: string;
};
type PdpData = {
  benefits: BenefitRow[];
  how_to_wear: WearStep[];
  product_details: DetailRow[];
  certificate: Certificate;
  certificate_image_url: string | null;
  certificate_image_path: string | null;
};

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  is_active: boolean;
  is_featured: boolean | null;
  category_id: string;
  short_description: string | null;
  specifications: SpecRow[] | null;
  benefits: BenefitRow[] | null;
  how_to_wear: WearStep[] | null;
  product_details: DetailRow[] | null;
  certificate: Certificate | null;
  certificate_image_url: string | null;
  certificate_image_path: string | null;
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

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [specs, setSpecs] = useState<SpecRow[]>([]);
  const [pdp, setPdp] = useState<PdpData>(emptyPdp());
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [editSpecs, setEditSpecs] = useState<SpecRow[]>([]);
  const [editPdp, setEditPdp] = useState<PdpData>(emptyPdp());
  const [editOrigCertPath, setEditOrigCertPath] = useState<string | null>(null);
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

    let query = supabase
      .from("products")
      .select("id, name, price, stock, is_active, is_featured, category_id, short_description, specifications, benefits, how_to_wear, product_details, certificate, certificate_image_url, certificate_image_path, categories(name)");

    if (filterStatus === "active") {
      query = query.eq("is_active", true);
    } else if (filterStatus === "inactive") {
      query = query.eq("is_active", false);
    } else if (filterStatus === "featured") {
      query = query.eq("is_featured", true);
    }

    if (filterCategory !== "all") {
      query = query.eq("category_id", filterCategory);
    }

    if (sortBy === "newest") {
      query = query.order("created_at", { ascending: false });
    } else if (sortBy === "oldest") {
      query = query.order("created_at", { ascending: true });
    } else if (sortBy === "price_high") {
      query = query.order("price", { ascending: false });
    } else if (sortBy === "price_low") {
      query = query.order("price", { ascending: true });
    }

    const { data: prods, error } = await query;

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
  }, [filterStatus, filterCategory, sortBy]);

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

  function cleanSpecs(rows: SpecRow[]) {
    return rows
      .map((r) => ({ key: r.key.trim(), value: r.value.trim() }))
      .filter((r) => r.key && r.value);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg("");

    if (!name || !categoryId || !price) {
      setStatusMsg("Name, category, and price are required.");
      return;
    }

    setSubmitting(true);

    const { data: newProduct, error } = await supabase
      .from("products")
      .insert({
        name,
        slug: slugify(name),
        category_id: categoryId,
        price: parseFloat(price),
        stock: stock ? parseInt(stock, 10) : 0,
        short_description: shortDescription || null,
        is_active: true,
        is_featured: isFeatured,
        specifications: cleanSpecs(specs),
        ...cleanPdp(pdp),
      })
      .select()
      .single();

    setSubmitting(false);

    if (error) {
      setStatusMsg("Failed to add product: " + error.message);
      return;
    }

    setName("");
    setPrice("");
    setStock("");
    setShortDescription("");
    setIsFeatured(false);
    setSpecs([]);
    setPdp(emptyPdp());
    setStatusMsg("Product added successfully. Add images below.");
    await loadData();

    if (newProduct?.id) {
      toggleExpand(newProduct.id);
    }
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
    setEditFeatured(Boolean(product.is_featured));
    setEditSpecs(product.specifications && product.specifications.length > 0 ? product.specifications : []);
    setEditPdp(pdpFromProduct(product));
    setEditOrigCertPath(product.certificate_image_path || null);
    setStatusMsg("");
  }

  function cancelEdit() {
    // Remove a certificate uploaded during this edit but never saved
    if (editPdp.certificate_image_path && editPdp.certificate_image_path !== editOrigCertPath) {
      supabase.storage.from("product-images").remove([editPdp.certificate_image_path]);
    }
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
        is_featured: editFeatured,
        specifications: cleanSpecs(editSpecs),
        ...cleanPdp(editPdp),
      })
      .eq("id", productId);

    setSavingEdit(false);

    if (error) {
      setStatusMsg("Failed to save changes: " + error.message);
      return;
    }

    // Old certificate image was replaced/removed and the change is now saved — delete the old file
    if (editOrigCertPath && editOrigCertPath !== editPdp.certificate_image_path) {
      await supabase.storage.from("product-images").remove([editOrigCertPath]);
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

  async function toggleExpand(productId: string) {
    if (imagesForProduct === productId) {
      closeImages();
      return;
    }
    await loadImages(productId);
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

  async function handleUploadImages(e: React.ChangeEvent<HTMLInputElement>) {
    if (!imagesForProduct || !e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files).slice(0, 10); // safety cap per batch
    setUploading(true);

    let currentCount = images.length;
    let uploadedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < files.length; i++) {
      setImageMsg(`Uploading ${i + 1} of ${files.length}...`);

      try {
        const compressed = await compressImage(files[i]);
        const fileName = `${imagesForProduct}/${Date.now()}-${i}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, compressed, { contentType: "image/jpeg" });

        if (uploadError) {
          failedCount++;
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        const { error: insertError } = await supabase.from("product_images").insert({
          product_id: imagesForProduct,
          image_url: publicUrlData.publicUrl,
          is_primary: currentCount === 0,
          sort_order: currentCount,
        });

        if (insertError) {
          failedCount++;
          continue;
        }

        currentCount++;
        uploadedCount++;
      } catch {
        failedCount++;
      }
    }

    setImageMsg(
      failedCount > 0
        ? `Uploaded ${uploadedCount} image(s), ${failedCount} failed.`
        : `Uploaded ${uploadedCount} image(s) successfully.`
    );

    setUploading(false);
    e.target.value = "";
    loadImages(imagesForProduct);
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

          <FeaturedCheckbox checked={isFeatured} onChange={setIsFeatured} />

          <SpecsEditor specs={specs} onChange={setSpecs} />

          <PdpEditor
            value={pdp}
            onChange={setPdp}
            products={products}
            currentProductId={null}
            originalCertPath={null}
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
              marginTop: "0.5rem",
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

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ ...inputStyle, width: "auto", marginBottom: 0, minWidth: "140px" }}
        >
          <option value="all">All Status</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
          <option value="featured">Featured Only</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ ...inputStyle, width: "auto", marginBottom: 0, minWidth: "160px" }}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ ...inputStyle, width: "auto", marginBottom: 0, minWidth: "160px" }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_high">Price: High to Low</option>
          <option value="price_low">Price: Low to High</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {products.map((p) => (
            <div
              key={p.id}
              className="transition hover:border-[#5A3150]"
              style={{
                border: p.is_featured ? "1px solid #C6A15B" : "1px solid #D9CEC1",
                borderRadius: "10px",
                padding: "1.15rem",
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

                  <FeaturedCheckbox checked={editFeatured} onChange={setEditFeatured} />

                  <SpecsEditor specs={editSpecs} onChange={setEditSpecs} />

                  <PdpEditor
                    value={editPdp}
                    onChange={setEditPdp}
                    products={products}
                    currentProductId={p.id}
                    originalCertPath={editOrigCertPath}
                  />

                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button
                      onClick={() => saveEdit(p.id)}
                      disabled={savingEdit}
                      className="transition hover:opacity-85 active:scale-95"
                      style={{
                        backgroundColor: "#5A3150",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.5rem 1rem",
                        cursor: savingEdit ? "not-allowed" : "pointer",
                      }}
                    >
                      {savingEdit ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="transition hover:opacity-85 active:scale-95"
                      style={{
                        backgroundColor: "#D9CEC1",
                        color: "#3E2237",
                        border: "none",
                        borderRadius: "6px",
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
                    <div style={{ fontWeight: "bold", color: "#3E2237", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      {p.name}
                      {p.is_featured && (
                        <span
                          style={{
                            backgroundColor: "#C6A15B",
                            color: "#160828",
                            fontSize: "0.65rem",
                            fontWeight: "bold",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "999px",
                          }}
                        >
                          ★ Featured
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#8A607A" }}>
                      {p.categories?.name || "-"} • ₹{p.price} • Stock: {p.stock} •{" "}
                      {p.is_active ? "Active" : "Inactive"}
                      {p.specifications && p.specifications.length > 0
                        ? ` • ${p.specifications.length} spec${p.specifications.length === 1 ? "" : "s"}`
                        : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button
                      onClick={() => startEdit(p)}
                      className="transition hover:opacity-85 active:scale-95"
                      style={{
                        backgroundColor: "#5A3150",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.45rem 0.9rem",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleExpand(p.id)}
                      className="transition hover:opacity-85 active:scale-95"
                      style={{
                        backgroundColor: "#8A607A",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.45rem 0.9rem",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      Images
                    </button>
                    <button
                      onClick={() => handleToggleActive(p)}
                      className="transition hover:opacity-85 active:scale-95"
                      style={{
                        backgroundColor: p.is_active ? "#B00020" : "#5A3150",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.45rem 0.9rem",
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
                      multiple
                      onChange={handleUploadImages}
                      disabled={uploading}
                    />
                    <p style={{ fontSize: "0.75rem", color: "#8A607A", marginTop: "0.3rem" }}>
                      Tip: tap and select up to 10 photos at once (Ctrl/Cmd or long-press to multi-select).
                    </p>
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

function FeaturedCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.6rem",
        marginBottom: "1rem",
        padding: "0.75rem",
        border: checked ? "1px solid #C6A15B" : "1px solid #D9CEC1",
        borderRadius: "6px",
        backgroundColor: "#fff",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ marginTop: "0.2rem", width: "18px", height: "18px", accentColor: "#5A3150" }}
      />
      <span>
        <span style={{ display: "block", fontWeight: "bold", color: "#3E2237", fontSize: "0.9rem" }}>
          ★ Show in homepage Featured Collection
        </span>
        <span style={{ display: "block", color: "#8A607A", fontSize: "0.75rem", marginTop: "0.15rem" }}>
          Featured products appear first on the homepage (8 products shown in total).
        </span>
      </span>
    </label>
  );
}

function SpecsEditor({
  specs,
  onChange,
}: {
  specs: SpecRow[];
  onChange: (rows: SpecRow[]) => void;
}) {
  function updateRow(index: number, field: "key" | "value", value: string) {
    const next = specs.map((row, i) => (i === index ? { ...row, [field]: value } : row));
    onChange(next);
  }

  function addRow() {
    onChange([...specs, { key: "", value: "" }]);
  }

  function removeRow(index: number) {
    onChange(specs.filter((_, i) => i !== index));
  }

  return (
    <div
      style={{
        marginBottom: "1rem",
        padding: "0.75rem",
        border: "1px solid #D9CEC1",
        borderRadius: "6px",
        backgroundColor: "#fff",
      }}
    >
      <p style={{ fontWeight: "bold", color: "#3E2237", fontSize: "0.9rem", marginBottom: "0.6rem" }}>
        Product Specifications
      </p>
      <p style={{ color: "#8A607A", fontSize: "0.75rem", marginBottom: "0.75rem" }}>
        Shown on the product page as an expandable list (e.g. Origin, Planet, Colour, Shape, Cut).
      </p>

      {specs.map((row, i) => (
        <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <input
            type="text"
            placeholder="Label (e.g. Origin)"
            value={row.key}
            onChange={(e) => updateRow(i, "key", e.target.value)}
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
          />
          <input
            type="text"
            placeholder="Value (e.g. Brazil)"
            value={row.value}
            onChange={(e) => updateRow(i, "value", e.target.value)}
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
          />
          <button
            type="button"
            onClick={() => removeRow(i)}
            style={{
              background: "none",
              border: "1px solid #D9CEC1",
              borderRadius: "4px",
              color: "#B00020",
              padding: "0 0.7rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="transition hover:opacity-85"
        style={{
          marginTop: "0.25rem",
          backgroundColor: "#8A607A",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          padding: "0.4rem 0.9rem",
          fontSize: "0.8rem",
          cursor: "pointer",
        }}
      >
        + Add Specification
      </button>
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

// =====================================================================
// PDP CONTENT EDITOR — Benefits, How to Wear, Product Details, Certificate
// =====================================================================

const ICON_OPTIONS: { key: string; label: string }[] = [
  { key: "ring", label: "Ring" },
  { key: "calendar", label: "Calendar" },
  { key: "puja", label: "Puja / Thali" },
  { key: "om", label: "Om" },
  { key: "hand", label: "Hand / Finger" },
  { key: "sun", label: "Sun / Morning" },
  { key: "moon", label: "Moon" },
  { key: "water", label: "Water / Purify" },
  { key: "tag", label: "Tag / Name" },
  { key: "globe", label: "Globe / Origin" },
  { key: "diamond", label: "Diamond / Cut" },
  { key: "quality", label: "Quality Badge" },
  { key: "weight", label: "Weight Scale" },
  { key: "ruler", label: "Ruler / Size" },
  { key: "palette", label: "Colour" },
  { key: "shield", label: "Shield / Trust" },
  { key: "star", label: "Star / Planet" },
  { key: "note", label: "Note / Other" },
];

const CERT_FIELDS: { key: keyof Certificate; label: string; placeholder: string }[] = [
  { key: "lab_name", label: "Laboratory name", placeholder: "e.g. IGI, GIA, GII" },
  { key: "report_number", label: "Report / Certificate No.", placeholder: "As printed on certificate" },
  { key: "weight", label: "Weight", placeholder: "e.g. 5.25 Carat" },
  { key: "shape", label: "Shape & Cut", placeholder: "e.g. Oval Mixed Cut" },
  { key: "dimensions", label: "Dimensions", placeholder: "e.g. 10.18 x 8.12 x 5.01 mm" },
  { key: "colour", label: "Colour", placeholder: "e.g. Yellow" },
  { key: "species", label: "Species", placeholder: "e.g. Natural Corundum" },
  { key: "variety", label: "Variety", placeholder: "e.g. Yellow Sapphire (Pukhraj)" },
  { key: "treatment", label: "Treatment", placeholder: "Exactly as on certificate, e.g. No indications of heating" },
  { key: "comments", label: "Comments", placeholder: "Optional" },
];

function emptyPdp(): PdpData {
  return {
    benefits: [],
    how_to_wear: [],
    product_details: [],
    certificate: {},
    certificate_image_url: null,
    certificate_image_path: null,
  };
}

function pdpFromProduct(p: Product): PdpData {
  return {
    benefits: Array.isArray(p.benefits) ? p.benefits.map((r) => ({ ...r })) : [],
    how_to_wear: Array.isArray(p.how_to_wear) ? p.how_to_wear.map((r) => ({ ...r })) : [],
    product_details: Array.isArray(p.product_details) ? p.product_details.map((r) => ({ ...r })) : [],
    certificate: p.certificate && typeof p.certificate === "object" ? { ...p.certificate } : {},
    certificate_image_url: p.certificate_image_url || null,
    certificate_image_path: p.certificate_image_path || null,
  };
}

// Trims text, drops empty rows/fields — so the product page never shows blank cards.
function cleanPdp(p: PdpData) {
  const cert: Certificate = {};
  CERT_FIELDS.forEach(({ key }) => {
    const v = (p.certificate[key] || "").trim();
    if (v) cert[key] = v;
  });

  return {
    benefits: p.benefits
      .map((r) => ({ title: r.title.trim(), description: r.description.trim() }))
      .filter((r) => r.title),
    how_to_wear: p.how_to_wear
      .map((r) => ({ title: r.title.trim(), description: r.description.trim(), icon: r.icon || "note" }))
      .filter((r) => r.title),
    product_details: p.product_details
      .map((r) => ({ label: r.label.trim(), value: r.value.trim(), icon: r.icon || "note" }))
      .filter((r) => r.label && r.value),
    certificate: cert,
    certificate_image_url: p.certificate_image_url,
    certificate_image_path: p.certificate_image_path,
  };
}

function moveItem<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

// Certificates need to stay readable after zoom, so they get a bigger size/quality than normal photos.
function compressCertificateImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const maxDimension = 2000;
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
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      }

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        },
        "image/jpeg",
        0.85
      );
    };

    img.onerror = () => reject(new Error("Failed to read image"));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function PdpEditor({
  value,
  onChange,
  products,
  currentProductId,
  originalCertPath,
}: {
  value: PdpData;
  onChange: (next: PdpData) => void;
  products: Product[];
  currentProductId: string | null;
  originalCertPath: string | null;
}) {
  const supabase = createClient();
  const [copyFromId, setCopyFromId] = useState("");
  const [certUploading, setCertUploading] = useState(false);
  const [certMsg, setCertMsg] = useState("");

  const copyOptions = products.filter((p) => p.id !== currentProductId);

  function handleCopy() {
    const source = products.find((p) => p.id === copyFromId);
    if (!source) return;

    const hasContent =
      value.benefits.length > 0 || value.how_to_wear.length > 0 || value.product_details.length > 0;
    if (hasContent && !window.confirm("This will replace the Benefits, How to Wear and Product Details already filled here. Continue?")) {
      return;
    }

    const copied = pdpFromProduct(source);
    onChange({
      ...value,
      benefits: copied.benefits,
      how_to_wear: copied.how_to_wear,
      product_details: copied.product_details,
    });
  }

  // Deletes a certificate file only if it was uploaded in this form session (not the saved one).
  async function removeUnsavedCert(path: string | null) {
    if (path && path !== originalCertPath) {
      await supabase.storage.from("product-images").remove([path]);
    }
  }

  async function handleCertUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCertUploading(true);
    setCertMsg("Uploading certificate...");

    try {
      const compressed = await compressCertificateImage(file);
      const path = `certificates/${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, compressed, { contentType: "image/jpeg" });

      if (uploadError) {
        setCertMsg("Upload failed: " + uploadError.message);
      } else {
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        await removeUnsavedCert(value.certificate_image_path);
        onChange({ ...value, certificate_image_url: data.publicUrl, certificate_image_path: path });
        setCertMsg("Certificate uploaded. Remember to press Save / Add Product.");
      }
    } catch {
      setCertMsg("Could not read this image. Try a JPG or PNG.");
    }

    setCertUploading(false);
    e.target.value = "";
  }

  async function handleCertRemove() {
    await removeUnsavedCert(value.certificate_image_path);
    onChange({ ...value, certificate_image_url: null, certificate_image_path: null });
    setCertMsg("Certificate removed. Press Save to confirm.");
  }

  const certCount = CERT_FIELDS.filter(({ key }) => (value.certificate[key] || "").trim()).length;

  return (
    <div style={pdpBoxStyle}>
      <p style={{ fontWeight: "bold", color: "#3E2237", fontSize: "0.95rem", marginBottom: "0.25rem" }}>
        Product Page Content
      </p>
      <p style={{ color: "#8A607A", fontSize: "0.75rem", marginBottom: "0.75rem" }}>
        Shown on the product page as expandable sections. Leave a section empty to hide it on the page.
      </p>

      {/* Copy from another product */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        <select
          value={copyFromId}
          onChange={(e) => setCopyFromId(e.target.value)}
          style={{ ...inputStyle, marginBottom: 0, flex: "1 1 200px" }}
        >
          <option value="">Copy content from another product…</option>
          {copyOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleCopy} disabled={!copyFromId} style={smallBtnStyle(!copyFromId)}>
          Copy
        </button>
      </div>
      <p style={{ color: "#8A607A", fontSize: "0.7rem", marginTop: "-0.4rem", marginBottom: "0.75rem" }}>
        Copies Benefits, How to Wear and Product Details (not the certificate). Edit after copying if needed.
      </p>

      {/* Benefits */}
      <details style={sectionStyle}>
        <summary style={summaryStyle}>Benefits ({value.benefits.length})</summary>
        <p style={hintStyle}>
          Use careful wording, e.g. &quot;Traditionally associated with…&quot;. Avoid guarantees or medical claims.
        </p>
        {value.benefits.map((row, i) => (
          <div key={i} style={rowCardStyle}>
            <input
              type="text"
              placeholder="Title (e.g. Attracts Wealth & Prosperity)"
              value={row.title}
              onChange={(e) =>
                onChange({
                  ...value,
                  benefits: value.benefits.map((r, j) => (j === i ? { ...r, title: e.target.value } : r)),
                })
              }
              style={inputStyle}
            />
            <textarea
              placeholder="Description"
              value={row.description}
              onChange={(e) =>
                onChange({
                  ...value,
                  benefits: value.benefits.map((r, j) => (j === i ? { ...r, description: e.target.value } : r)),
                })
              }
              style={{ ...inputStyle, minHeight: "55px" }}
            />
            <RowActions
              onUp={() => onChange({ ...value, benefits: moveItem(value.benefits, i, -1) })}
              onDown={() => onChange({ ...value, benefits: moveItem(value.benefits, i, 1) })}
              onRemove={() => onChange({ ...value, benefits: value.benefits.filter((_, j) => j !== i) })}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange({ ...value, benefits: [...value.benefits, { title: "", description: "" }] })}
          style={smallBtnStyle(false)}
        >
          + Add Benefit
        </button>
      </details>

      {/* How to Wear */}
      <details style={sectionStyle}>
        <summary style={summaryStyle}>How to Wear ({value.how_to_wear.length} steps)</summary>
        <p style={hintStyle}>Steps are numbered on the product page in this order.</p>
        {value.how_to_wear.map((row, i) => (
          <div key={i} style={rowCardStyle}>
            <p style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#8A607A", margin: "0 0 0.4rem" }}>
              Step {i + 1}
            </p>
            <input
              type="text"
              placeholder="Title (e.g. Choose the Right Metal)"
              value={row.title}
              onChange={(e) =>
                onChange({
                  ...value,
                  how_to_wear: value.how_to_wear.map((r, j) => (j === i ? { ...r, title: e.target.value } : r)),
                })
              }
              style={inputStyle}
            />
            <textarea
              placeholder="Description"
              value={row.description}
              onChange={(e) =>
                onChange({
                  ...value,
                  how_to_wear: value.how_to_wear.map((r, j) => (j === i ? { ...r, description: e.target.value } : r)),
                })
              }
              style={{ ...inputStyle, minHeight: "55px" }}
            />
            <IconSelect
              value={row.icon}
              onChange={(icon) =>
                onChange({
                  ...value,
                  how_to_wear: value.how_to_wear.map((r, j) => (j === i ? { ...r, icon } : r)),
                })
              }
            />
            <RowActions
              onUp={() => onChange({ ...value, how_to_wear: moveItem(value.how_to_wear, i, -1) })}
              onDown={() => onChange({ ...value, how_to_wear: moveItem(value.how_to_wear, i, 1) })}
              onRemove={() => onChange({ ...value, how_to_wear: value.how_to_wear.filter((_, j) => j !== i) })}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({ ...value, how_to_wear: [...value.how_to_wear, { title: "", description: "", icon: "note" }] })
          }
          style={smallBtnStyle(false)}
        >
          + Add Step
        </button>
      </details>

      {/* Product Details */}
      <details style={sectionStyle}>
        <summary style={summaryStyle}>Product Details ({value.product_details.length})</summary>
        <p style={hintStyle}>
          e.g. Origin, Shape &amp; Cut, Quality, Weight, Metal Recommendation. Only add facts you can confirm.
        </p>
        {value.product_details.map((row, i) => (
          <div key={i} style={rowCardStyle}>
            <input
              type="text"
              placeholder="Label (e.g. Origin)"
              value={row.label}
              onChange={(e) =>
                onChange({
                  ...value,
                  product_details: value.product_details.map((r, j) =>
                    j === i ? { ...r, label: e.target.value } : r
                  ),
                })
              }
              style={inputStyle}
            />
            <textarea
              placeholder="Value (e.g. Sri Lanka)"
              value={row.value}
              onChange={(e) =>
                onChange({
                  ...value,
                  product_details: value.product_details.map((r, j) =>
                    j === i ? { ...r, value: e.target.value } : r
                  ),
                })
              }
              style={{ ...inputStyle, minHeight: "45px" }}
            />
            <IconSelect
              value={row.icon}
              onChange={(icon) =>
                onChange({
                  ...value,
                  product_details: value.product_details.map((r, j) => (j === i ? { ...r, icon } : r)),
                })
              }
            />
            <RowActions
              onUp={() => onChange({ ...value, product_details: moveItem(value.product_details, i, -1) })}
              onDown={() => onChange({ ...value, product_details: moveItem(value.product_details, i, 1) })}
              onRemove={() =>
                onChange({ ...value, product_details: value.product_details.filter((_, j) => j !== i) })
              }
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...value,
              product_details: [...value.product_details, { label: "", value: "", icon: "note" }],
            })
          }
          style={smallBtnStyle(false)}
        >
          + Add Detail
        </button>
      </details>

      {/* Certificate */}
      <details style={{ ...sectionStyle, marginBottom: 0 }}>
        <summary style={summaryStyle}>
          Certificate ({certCount} fields{value.certificate_image_url ? " + image" : ""})
        </summary>
        <p style={hintStyle}>
          Fill only what is printed on this product&apos;s real certificate. Leave blank fields empty.
        </p>

        {CERT_FIELDS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label style={{ fontSize: "0.75rem", color: "#3E2237", fontWeight: "bold" }}>{label}</label>
            <input
              type="text"
              placeholder={placeholder}
              value={value.certificate[key] || ""}
              onChange={(e) => onChange({ ...value, certificate: { ...value.certificate, [key]: e.target.value } })}
              style={{ ...inputStyle, marginTop: "0.2rem" }}
            />
          </div>
        ))}

        <label style={{ fontSize: "0.75rem", color: "#3E2237", fontWeight: "bold" }}>Certificate image</label>
        {value.certificate_image_url ? (
          <div style={{ margin: "0.4rem 0 0.6rem" }}>
            <img
              src={value.certificate_image_url}
              alt="Certificate preview"
              style={{
                width: "100%",
                maxWidth: "320px",
                borderRadius: "6px",
                border: "1px solid #D9CEC1",
                display: "block",
              }}
            />
            <button
              type="button"
              onClick={handleCertRemove}
              style={{
                marginTop: "0.4rem",
                background: "none",
                border: "1px solid #D9CEC1",
                borderRadius: "4px",
                color: "#B00020",
                padding: "0.3rem 0.7rem",
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              Remove certificate image
            </button>
          </div>
        ) : null}
        <input
          type="file"
          accept="image/*"
          onChange={handleCertUpload}
          disabled={certUploading}
          style={{ display: "block", marginTop: "0.4rem" }}
        />
        <p style={{ ...hintStyle, marginTop: "0.3rem" }}>
          {value.certificate_image_url ? "Choose a file to replace the current image." : "Upload a clear photo/scan of the real certificate."}
        </p>
        {certMsg && <p style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#3E2237" }}>{certMsg}</p>}
      </details>
    </div>
  );
}

function IconSelect({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
  return (
    <select value={value || "note"} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
      {ICON_OPTIONS.map((opt) => (
        <option key={opt.key} value={opt.key}>
          Icon: {opt.label}
        </option>
      ))}
    </select>
  );
}

function RowActions({
  onUp,
  onDown,
  onRemove,
}: {
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}) {
  const btn: React.CSSProperties = {
    background: "none",
    border: "1px solid #D9CEC1",
    borderRadius: "4px",
    padding: "0.25rem 0.6rem",
    fontSize: "0.75rem",
    cursor: "pointer",
    color: "#3E2237",
  };
  return (
    <div style={{ display: "flex", gap: "0.4rem" }}>
      <button type="button" onClick={onUp} style={btn} aria-label="Move up">
        ↑
      </button>
      <button type="button" onClick={onDown} style={btn} aria-label="Move down">
        ↓
      </button>
      <button type="button" onClick={onRemove} style={{ ...btn, color: "#B00020" }}>
        Remove
      </button>
    </div>
  );
}

function smallBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    backgroundColor: "#8A607A",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "0.45rem 0.9rem",
    fontSize: "0.8rem",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
  };
}

const pdpBoxStyle: React.CSSProperties = {
  marginBottom: "1rem",
  padding: "0.75rem",
  border: "1px solid #C6A15B",
  borderRadius: "6px",
  backgroundColor: "#fff",
};

const sectionStyle: React.CSSProperties = {
  border: "1px solid #D9CEC1",
  borderRadius: "6px",
  padding: "0.6rem 0.75rem",
  marginBottom: "0.6rem",
  backgroundColor: "#FBF8F2",
};

const summaryStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "#3E2237",
  fontSize: "0.9rem",
  cursor: "pointer",
};

const hintStyle: React.CSSProperties = {
  color: "#8A607A",
  fontSize: "0.72rem",
  margin: "0.5rem 0 0.6rem",
};

const rowCardStyle: React.CSSProperties = {
  border: "1px solid #E1D7CC",
  borderRadius: "6px",
  padding: "0.6rem",
  marginBottom: "0.6rem",
  backgroundColor: "#fff",
};
