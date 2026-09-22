"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber;
  const [displayId, setDisplayId] = useState("");

  useEffect(() => {
    if (orderNumber) {
      setDisplayId("AD" + orderNumber);
    }
  }, [orderNumber]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--astro-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--astro-primary)" }}>✓</div>
      <h1 style={{ fontFamily: "Playfair Display, serif", color: "var(--astro-text)", marginBottom: "0.5rem" }}>
        Thank You for Your Order
      </h1>
      <p style={{ color: "var(--astro-accent)", marginBottom: "1.5rem" }}>
        Guidance • Healing • Divine Alignment
      </p>

      <div
        style={{
          backgroundColor: "var(--astro-card)",
          border: "1px solid var(--astro-border)",
          borderRadius: "8px",
          padding: "1.5rem 2rem",
          marginBottom: "2rem",
        }}
      >
        <p style={{ color: "var(--astro-text)", fontSize: "0.9rem", marginBottom: "0.3rem" }}>
          Your Order ID
        </p>
        <p style={{ color: "var(--astro-primary)", fontSize: "1.5rem", fontWeight: "bold" }}>
          {displayId || "..."}
        </p>
      </div>

      <p style={{ color: "var(--astro-text)", opacity: 0.85, maxWidth: "400px", marginBottom: "2rem" }}>
        We've received your order and will begin processing it shortly. You'll be
        contacted with updates on your order status.
      </p>

      <Link
        href="/"
        style={{
          backgroundColor: "var(--astro-primary)",
          color: "var(--astro-primary-text)",
          padding: "0.7rem 1.5rem",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Continue Shopping
      </Link>
    </div>
  );
}
