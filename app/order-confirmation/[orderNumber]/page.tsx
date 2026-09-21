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
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✓</div>
      <h1 style={{ fontFamily: "Playfair Display, serif", color: "#3E2237", marginBottom: "0.5rem" }}>
        Thank You for Your Order
      </h1>
      <p style={{ color: "#8A607A", marginBottom: "1.5rem" }}>
        Guidance • Healing • Divine Alignment
      </p>

      <div
        style={{
          backgroundColor: "#FBF8F2",
          border: "1px solid #D9CEC1",
          borderRadius: "8px",
          padding: "1.5rem 2rem",
          marginBottom: "2rem",
        }}
      >
        <p style={{ color: "#3E2237", fontSize: "0.9rem", marginBottom: "0.3rem" }}>
          Your Order ID
        </p>
        <p style={{ color: "#5A3150", fontSize: "1.5rem", fontWeight: "bold" }}>
          {displayId || "..."}
        </p>
      </div>

      <p style={{ color: "#3E2237", maxWidth: "400px", marginBottom: "2rem" }}>
        We've received your order and will begin processing it shortly. You'll be
        contacted with updates on your order status.
      </p>

      <Link
        href="/"
        style={{
          backgroundColor: "#5A3150",
          color: "#fff",
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
