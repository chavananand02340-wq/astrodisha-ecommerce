import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase-admin";
import { WHATSAPP_NUMBER, WHATSAPP_ICON_PATH } from "@/lib/site";

// Always fresh, never cached, never in Google
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Confirmed | ASTRODISHA",
  robots: { index: false, follow: false },
};

type Line = { name: string; price: number; quantity: number };

type OrderDetails = {
  orderDate: string | null;
  customerName: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  isCod: boolean;
  advancePaid: number;
  couponCode: string | null;
  lines: Line[];
  totals: {
    subtotal: number;
    discount: number;
    delivery: number;
    total: number;
  } | null;
};

function inr(value: number) {
  return Number(value || 0).toLocaleString("en-IN");
}

// Details are shown only when BOTH the order number and the secret Razorpay
// order reference (?ref=...) match — so nobody can see someone else's order
// just by changing the number in the URL.
async function loadOrderDetails(orderNumber: number, ref: string): Promise<OrderDetails | null> {
  if (!ref || !Number.isFinite(orderNumber)) return null;

  try {
    const supabase = createAdminClient();

    const { data: checkout } = await supabase
      .from("pending_checkouts")
      .select(
        "order_id, customer_name, shipping_address, shipping_city, shipping_state, shipping_pin_code, payment_method, advance_paid, coupon_code, completed_at, items"
      )
      .eq("razorpay_order_id", ref)
      .eq("order_number", orderNumber)
      .eq("status", "completed")
      .maybeSingle();

    if (!checkout || !checkout.order_id) return null;

    const [orderResult, itemsResult] = await Promise.all([
      supabase
        .from("orders")
        .select("subtotal, discount_amount, delivery_charge, total_amount")
        .eq("id", checkout.order_id)
        .maybeSingle(),
      supabase
        .from("order_items")
        .select("product_name, product_price, quantity")
        .eq("order_id", checkout.order_id),
    ]);

    if (orderResult.error) console.error("Confirmation: could not read order:", orderResult.error);
    if (itemsResult.error) console.error("Confirmation: could not read order_items:", itemsResult.error);

    let lines: Line[] = (itemsResult.data || []).map((row) => ({
      name: row.product_name,
      price: Number(row.product_price),
      quantity: Number(row.quantity),
    }));

    // Fallback: the cart saved at checkout
    if (lines.length === 0 && Array.isArray(checkout.items)) {
      lines = (checkout.items as { name?: string; price?: number; quantity?: number }[]).map((item) => ({
        name: String(item.name || "Product"),
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      }));
    }

    const order = orderResult.data;

    return {
      orderDate: checkout.completed_at
        ? new Date(checkout.completed_at).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : null,
      customerName: checkout.customer_name,
      address: checkout.shipping_address,
      city: checkout.shipping_city,
      state: checkout.shipping_state,
      pinCode: checkout.shipping_pin_code,
      isCod: checkout.payment_method === "cod",
      advancePaid: Number(checkout.advance_paid) || 0,
      couponCode: checkout.coupon_code,
      lines,
      totals: order
        ? {
            subtotal: Number(order.subtotal),
            discount: Number(order.discount_amount),
            delivery: Number(order.delivery_charge),
            total: Number(order.total_amount),
          }
        : null,
    };
  } catch (error) {
    console.error("Confirmation: failed to load order details:", error);
    return null;
  }
}

function Row({ label, value, strong = false, color }: { label: string; value: string; strong?: boolean; color?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <span style={{ color: color || "var(--astro-mauve)" }} className={`text-[13.5px] ${strong ? "font-semibold" : ""}`}>
        {label}
      </span>
      <span
        style={{ color: color || (strong ? "var(--astro-primary)" : "var(--astro-text)") }}
        className={`text-right ${strong ? "text-[17px] font-bold" : "text-[13.5px]"}`}
      >
        {value}
      </span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: "var(--astro-accent)" }} className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
      {children}
    </p>
  );
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { orderNumber } = await params;
  const { ref } = await searchParams;

  const orderNum = Number(String(orderNumber || "").replace(/\D/g, ""));
  const displayId = orderNum ? "AD" + orderNum : "";

  const details = displayId ? await loadOrderDetails(orderNum, String(ref || "")) : null;

  const whatsappUrl = displayId
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi AstroDisha, I have a question about my order ${displayId}.`)}`
    : `https://wa.me/${WHATSAPP_NUMBER}`;

  const dueOnDelivery =
    details?.totals && details.isCod ? Math.max(details.totals.total - details.advancePaid, 0) : 0;

  return (
    <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-lg flex-col items-center text-center">
        <span
          style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
          className="flex h-16 w-16 items-center justify-center rounded-full"
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>

        <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-5 text-[30px] leading-tight sm:text-4xl">
          Thank You for Your Order
        </h1>
        <p style={{ color: "var(--astro-accent)" }} className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
          Guidance • Healing • Divine Alignment
        </p>

        <div
          style={{ backgroundColor: "var(--astro-card)", borderColor: "var(--astro-border)" }}
          className="mt-6 rounded-2xl border px-10 py-5"
        >
          <p style={{ color: "var(--astro-mauve)" }} className="text-xs">
            Your Order ID
          </p>
          <p style={{ color: "var(--astro-primary)" }} className="astro-serif mt-1 text-[28px] font-bold">
            {displayId || "—"}
          </p>
        </div>

        <p style={{ color: "var(--astro-text)" }} className="mt-6 max-w-md text-[15px] leading-7 opacity-85">
          We&apos;ve received your order and will begin processing it shortly. You&apos;ll be contacted with
          updates on your order status.
        </p>
      </div>

      {details && (
        <div
          style={{ backgroundColor: "var(--astro-card)", borderColor: "var(--astro-border)" }}
          className="mx-auto mt-8 max-w-lg rounded-2xl border p-5 text-left sm:p-6"
        >
          {/* ORDER INFO */}
          <SectionTitle>Order Details</SectionTitle>
          {details.orderDate && <Row label="Order Date" value={details.orderDate} />}
          <Row
            label="Payment Status"
            value={details.isCod ? "Advance Paid" : "Paid"}
            color={undefined}
          />
          <Row label="Payment Method" value={details.isCod ? "Cash on Delivery" : "Online Payment"} />

          {/* PRODUCTS */}
          <div style={{ borderColor: "var(--astro-border)" }} className="mt-5 border-t pt-5">
            <SectionTitle>Products</SectionTitle>
            <div className="space-y-3">
              {details.lines.map((line, i) => (
                <div key={line.name + i} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p style={{ color: "var(--astro-text)" }} className="astro-serif text-[16px] leading-snug">
                      {line.name}
                    </p>
                    <p style={{ color: "var(--astro-mauve)" }} className="mt-0.5 text-[12.5px]">
                      Qty {line.quantity} × ₹{inr(line.price)}
                    </p>
                  </div>
                  <p style={{ color: "var(--astro-text)" }} className="shrink-0 text-[14px] font-semibold">
                    ₹{inr(line.price * line.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TOTALS */}
          {details.totals && (
            <div style={{ borderColor: "var(--astro-border)" }} className="mt-5 border-t pt-4">
              <Row label="Subtotal" value={`₹${inr(details.totals.subtotal)}`} />
              {details.totals.discount > 0 && (
                <Row
                  label={`Discount${details.couponCode ? ` (${details.couponCode})` : ""}`}
                  value={`−₹${inr(details.totals.discount)}`}
                  color="var(--astro-accent)"
                />
              )}
              <Row
                label="Shipping / Delivery"
                value={details.totals.delivery > 0 ? `₹${inr(details.totals.delivery)}` : "FREE"}
              />
              {details.isCod ? (
                <>
                  <Row label="Order Total" value={`₹${inr(details.totals.total)}`} />
                  <Row label="Paid Now (advance)" value={`₹${inr(details.advancePaid)}`} strong />
                  <Row label="Balance on Delivery" value={`₹${inr(dueOnDelivery)}`} />
                </>
              ) : (
                <Row label="Total Paid" value={`₹${inr(details.totals.total)}`} strong />
              )}
            </div>
          )}

          {/* ADDRESS */}
          <div style={{ borderColor: "var(--astro-border)" }} className="mt-5 border-t pt-5">
            <SectionTitle>Delivery Address</SectionTitle>
            <p style={{ color: "var(--astro-text)" }} className="whitespace-pre-line text-[14px] leading-6">
              <strong>{details.customerName}</strong>
              {"\n"}
              {details.address}
              {"\n"}
              {details.city}, {details.state} - {details.pinCode}
              {"\n"}
              India
            </p>
          </div>

          <p style={{ color: "var(--astro-mauve)" }} className="mt-5 text-center text-[12px]">
            A confirmation has been sent to your email (if provided).
          </p>
        </div>
      )}

      <div className="mx-auto mt-8 flex w-full max-w-xs flex-col gap-3">
        <Link
          href="/"
          style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
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
    </main>
  );
        }
