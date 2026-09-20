"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { checkIsAdmin } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setErrorMsg("Login failed: " + loginError.message);
      setLoading(false);
      return;
    }

    const isAdmin = await checkIsAdmin();

    if (!isAdmin) {
      await supabase.auth.signOut();
      setErrorMsg("This account does not have admin access.");
      setLoading(false);
      return;
    }

    const redirectTo = searchParams.get("redirect") || "/admin/dashboard";
    router.push(redirectTo);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F7F3EC",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          backgroundColor: "#FBF8F2",
          border: "1px solid #D9CEC1",
          borderRadius: "8px",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "380px",
        }}
      >
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            color: "#3E2237",
            fontSize: "1.5rem",
            marginBottom: "0.25rem",
          }}
        >
          ASTRODISHA Admin
        </h1>
        <p style={{ color: "#8A607A", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
          Guidance • Healing • Divine Alignment
        </p>

        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "0.6rem",
            marginBottom: "0.75rem",
            border: "1px solid #D9CEC1",
            borderRadius: "4px",
            backgroundColor: "#fff",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            display: "block",
            width: "100%",
            padding: "0.6rem",
            marginBottom: "1rem",
            border: "1px solid #D9CEC1",
            borderRadius: "4px",
            backgroundColor: "#fff",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.7rem",
            backgroundColor: "#5A3150",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        {errorMsg && (
          <p style={{ color: "#B00020", marginTop: "1rem", fontSize: "0.85rem" }}>
            {errorMsg}
          </p>
        )}
      </form>
    </div>
  );
          }
