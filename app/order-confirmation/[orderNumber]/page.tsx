"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { WHATSAPP_NUMBER, WHATSAPP_ICON_PATH } from "@/lib/site";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params?.orderNumber;
  const [displayId, setDisplayId] = useState("");

  useEffect(() => {
    if (orderNumber) {
      setDisplayId("AD" + orderNumber);
    }
  }, [orderNumber]);

  const whatsappUrl = displayId
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi AstroDisha, I have a question about my order ${displayId}.`)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;

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
        padding: "2rem 1.5rem",
      }}
    >
      <span
        style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
        className="flex h-16 w-16 items-center justify-center rounded-full"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>

      <h1 className="astro-serif" style={{ color: "var(--astro-text)", fontSize: "2rem", marginTop: "1.25rem", marginBottom: "0.4rem" }}>
        Thank You for Your Order
      </h1>
      <p style={{ color: "var(--astro-accent)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.75rem" }}>
        Guidance • Healing • Divine Alignment
      </p>

      <div
        style={{
          backgroundColor: "var(--astro-card)",
          border: "1px solid var(--astro-border)",
          borderRadius: "16px",
          padding: "1.5rem 2.5rem",
          marginBottom: "2rem",
        }}
      >
        <p style={{ color: "var(--astro-mauve)", fontSize: "0.8rem", marginBottom: "0.3rem" }}>
          Your Order ID
        </p>
        <p className="astro-serif" style={{ color: "var(--astro-primary)", fontSize: "1.75rem", fontWeight: 700 }}>
          {displayId || "..."}
        </p>
      </div>

      <p style={{ color: "var(--astro-text)", opacity: 0.85, maxWidth: "420px", marginBottom: "2rem", fontSize: "0.95rem", lineHeight: 1.7 }}>
        We've received your order and will begin processing it shortly. You'll be
        contacted with updates on your order status.
      </p>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/"
          style={{
            backgroundColor: "var(--astro-primary)",
            color: "var(--astro-primary-text)",
          }}
          className="flex h-12 items-center justify-center rounded-full text-sm font-semibold transition hover:opacity-90"
        >
          Continue Shopping
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ borderColor: "var(--astro-primary)", color: "var(--astro-primary)" }}
          className="flex h-12 items-center justify-center gap-2 rounded-full border text-sm font-semibold transition hover:opacity-80"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d={WHATSAPP_ICON_PATH} />
          </svg>
          Ask About This Order
        </a>
      </div>
    </div>
  );
}
