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
  categories?: { name: string } | null;
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

  async function loadData() {
    setLoading(true);

    const { data: cats } = await supabase.from("categories").select("id, name");
    setCategories(cats || []);
    if (cats && cats.length > 0 && !categoryId) {
      setCategoryId(cats[0].id);
    }

    const { data: prods, error } = await supabase
      .from("products")
      .select("id, name, price, stock, is_active, category_id, categories(name)")
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

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
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
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#3E2237", color: "#fff" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #D9CEC1" }}>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.categories?.name || "-"}</td>
                <td style={tdStyle}>₹{p.price}</td>
                <td style={tdStyle}>{p.stock}</td>
                <td style={tdStyle}>{p.is_active ? "Active" : "Inactive"}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleToggleActive(p)}
                    style={{
                      backgroundColor: p.is_active ? "#B00020" : "#5A3150",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.3rem 0.7rem",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                    }}
                  >
                    {p.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

const thStyle: React.CSSProperties = {
  padding: "0.6rem",
  textAlign: "left",
  fontSize: "0.85rem",
};

const tdStyle: React.CSSProperties = {
  padding: "0.6rem",
  fontSize: "0.9rem",
  color: "#3E2237",
};
