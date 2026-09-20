"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

type Category = {
  id: string;
  name: string;
};

export default function TestAdminPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  async function handleLogin() {
    setStatusMsg("Logging in...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatusMsg("Login failed: " + error.message);
      return;
    }

    setLoggedIn(true);
    setStatusMsg("Logged in as: " + data.user?.email + " | UID: " + data.user?.id);

    const { data: cats, error: catError } = await supabase
      .from("categories")
      .select("id, name");

    if (catError) {
      setStatusMsg("Login OK, but failed to load categories: " + catError.message);
      return;
    }

    setCategories(cats || []);
    if (cats && cats.length > 0) {
      setSelectedCategory(cats[0].id);
    }
  }

  async function handleCreateTestProduct() {
    if (!selectedCategory) {
      setStatusMsg("Please select a category first.");
      return;
    }

    setStatusMsg("Attempting to create test product...");

    const testSlug = "admin-rls-test-" + Date.now();

    const { data, error } = await supabase
      .from("products")
      .insert({
        category_id: selectedCategory,
        name: "RLS Test Product",
        slug: testSlug,
        price: 1,
        stock: 1,
        short_description: "Temporary test product to verify admin RLS.",
        is_active: false,
      })
      .select()
      .single();

    if (error) {
      setStatusMsg("Create FAILED: " + error.message);
      return;
    }

    setCreatedProductId(data.id);
    setStatusMsg("Create SUCCESS. Product ID: " + data.id);
  }

  async function handleDeleteTestProduct() {
    if (!createdProductId) return;

    setStatusMsg("Deleting test product...");

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", createdProductId);

    if (error) {
      setStatusMsg("Delete FAILED: " + error.message);
      return;
    }

    setStatusMsg("Delete SUCCESS. Test product removed.");
    setCreatedProductId(null);
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "0 auto" }}>
      <h1>Admin RLS Test Page</h1>
      <p style={{ fontSize: "0.85rem", color: "#666" }}>
        Temporary page. Not part of the real site. Safe to delete later.
      </p>

      {!loggedIn && (
        <div style={{ marginTop: "1.5rem" }}>
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: "block", marginBottom: "0.5rem", width: "100%", padding: "0.5rem" }}
          />
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", marginBottom: "0.5rem", width: "100%", padding: "0.5rem" }}
          />
          <button onClick={handleLogin} style={{ padding: "0.5rem 1rem" }}>
            Log In
          </button>
        </div>
      )}

      {loggedIn && (
        <div style={{ marginTop: "1.5rem" }}>
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ display: "block", marginBottom: "1rem", width: "100%", padding: "0.5rem" }}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button onClick={handleCreateTestProduct} style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}>
            Try Create Test Product
          </button>

          {createdProductId && (
            <button onClick={handleDeleteTestProduct} style={{ padding: "0.5rem 1rem" }}>
              Delete Test Product
            </button>
          )}
        </div>
      )}

      {statusMsg && (
        <p style={{ marginTop: "1.5rem", fontWeight: "bold", wordBreak: "break-all" }}>{statusMsg}</p>
      )}
    </div>
  );
}
