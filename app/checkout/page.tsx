"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/StoreProvider";
import { createClient } from "@/utils/supabase/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("India");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [couponCode, setCouponCode] = useState("");

  const [pinLookupMsg, setPinLookupMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const advanceAmount = 100;

  async function handlePinCodeChange(value: string) {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
    setPinCode(digitsOnly);
    setPinLookupMsg("");

    if (digitsOnly.length === 6) {
      setPinLookupMsg("Looking up city/state...");
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${digitsOnly}`);
        const data = await res.json();

        if (data?.[0]?.Status === "Success" && data[0].PostOffice?.length > 0) {
          const office = data[0].PostOffice[0];
          setCity(office.District || "");
          setState(office.State || "");
          setPinLookupMsg("City and State auto-filled — please verify.");
        } else {
          setPinLookupMsg("Couldn't find this PIN code. Please enter city/state manually.");
        }
      } catch {
        setPinLookupMsg("Couldn't look up PIN code. Please enter city/state manually.");
      }
    }
  }

  async function createOrderInDatabase(
    paymentStatus: string,
    razorpayPaymentId: string | null,
    razorpayOrderId: string | null
  ) {
    const items = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const { data, error } = await supabase.rpc("place_order", {
      p_customer_name: name,
      p_customer_mobile: mobile,
      p_customer_email: email || null,
      p_shipping_address: address,
      p_shipping_city: city,
      p_shipping_state: state,
      p_shipping_pin_code: pinCode,
      p_shipping_country: country,
      p_payment_method: paymentMethod,
      p_advance_paid: paymentMethod === "cod" ? advanceAmount : 0,
      p_items: items,
      p_coupon_code: couponCode || null,
      p_payment_status: paymentStatus,
      p_razorpay_payment_id: razorpayPaymentId,
      p_razorpay_order_id: razorpayOrderId,
    });

    if (error) {
      throw new Error(error.message);
    }

    const result = Array.isArray(data) ? data[0] : data;

    if (!result?.out_order_number) {
      throw new Error("Order was placed but confirmation details are missing.");
    }

    fetch("/api/send-order-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: result.out_order_number,
        customerName: name,
        customerEmail: email || null,
        customerMobile: mobile,
        shippingAddress: address,
        shippingCity: city,
        shippingState: state,
        shippingPinCode: pinCode,
        subtotal: result.out_subtotal,
        discountAmount: result.out_discount_amount,
        deliveryCharge: result.out_delivery_charge,
        totalAmount: result.out_total_amount,
        paymentMethod,
        advancePaid: paymentMethod === "cod" ? advanceAmount : 0,
        items,
      }),
    }).catch(() => {});

    clearCart();
    router.push(`/order-confirmation/${result.out_order_number}`);
  }

  async function startRazorpayPayment(amountToCharge: number, isAdvanceForCod: boolean) {
    const res = await fetch("/api/create-razorpay-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountToCharge }),
    });

    const data = await res.json();

    if (!data.order) {
      setErrorMsg("Failed to start payment. Please try again.");
      setSubmitting(false);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: "INR",
      name: "ASTRODISHA",
      description: isAdvanceForCod ? "Booking Advance (COD Order)" : "Order Payment",
      order_id: data.order.id,
      handler: async function (response: any) {
        try {
          const verifyRes = await fetch("/api/verify-razorpay-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (!verifyData.verified) {
            setErrorMsg("Payment verification failed. Please contact support if amount was deducted.");
            setSubmitting(false);
            return;
          }

          await createOrderInDatabase("Paid", response.razorpay_payment_id, response.razorpay_order_id);
        } catch (err) {
          setErrorMsg("Something went wrong after payment. Please contact support with your payment ID: " + response.razorpay_payment_id);
          setSubmitting(false);
        }
      },
      modal: {
        ondismiss: function () {
          setSubmitting(false);
          setErrorMsg("Payment was cancelled.");
        },
      },
      prefill: {
        name: name,
        contact: mobile,
        email: email || undefined,
      },
      theme: {
        color: "#5A3150",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (cart.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    if (!name || !mobile || !address || !city || !state || !pinCode) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      if (paymentMethod === "cod") {
        await startRazorpayPayment(advanceAmount, true);
      } else {
        await startRazorpayPayment(subtotal, false);
      }
    } catch (err) {
      setErrorMsg("Failed to start payment: " + (err instanceof Error ? err.message : "Unknown error"));
      setSubmitting(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div style={{ backgroundColor: "var(--astro-bg)", minHeight: "100vh", padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", color: "var(--astro-text)" }}>Your cart is empty</h1>
        <p style={{ color: "var(--astro-mauve)" }}>Add some products before checking out.</p>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div style={{ backgroundColor: "var(--astro-bg)", minHeight: "100vh" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem", fontFamily: "Inter, sans-serif" }}>
          <h1 style={{ fontFamily: "Playfair Display, serif", color: "var(--astro-text)", marginBottom: "1.5rem" }}>
            Checkout
          </h1>

          <div
            style={{
              backgroundColor: "var(--astro-card)",
              border: "1px solid var(--astro-border)",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ fontSize: "1.05rem", color: "var(--astro-text)", marginBottom: "1rem" }}>Order Summary</h2>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9rem",
                  color: "var(--astro-text)",
                  marginBottom: "0.4rem",
                }}
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
            <div
              style={{
                borderTop: "1px solid var(--astro-border)",
                marginTop: "0.75rem",
                paddingTop: "0.75rem",
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                color: "var(--astro-text)",
              }}
            >
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--astro-text)", fontWeight: "bold" }}>
                Have a coupon code?
              </label>
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                style={{ ...inputStyle, marginTop: "0.5rem", marginBottom: 0 }}
              />
            </div>

            <p style={{ fontSize: "0.75rem", color: "var(--astro-mauve)", marginTop: "0.75rem" }}>
              Discount (if applicable) is verified securely when payment is processed.
            </p>
          </div>

          <form onSubmit={handlePlaceOrder}>
            <div
              style={{
                backgroundColor: "var(--astro-card)",
                border: "1px solid var(--astro-border)",
                borderRadius: "8px",
                padding: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.05rem", color: "var(--astro-text)", marginBottom: "1rem" }}>
                Delivery Details
              </h2>

              <input
                type="text"
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Mobile Number *"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <textarea
                placeholder="House / Flat No., Street / Area *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ ...inputStyle, minHeight: "60px" }}
              />

              <input
                type="text"
                inputMode="numeric"
                placeholder="PIN Code * (auto-fills city/state)"
                value={pinCode}
                onChange={(e) => handlePinCodeChange(e.target.value)}
                style={inputStyle}
              />
              {pinLookupMsg && (
                <p style={{ fontSize: "0.75rem", color: "var(--astro-accent)", marginTop: "-0.5rem", marginBottom: "0.75rem" }}>
                  {pinLookupMsg}
                </p>
              )}

              <input
                type="text"
                placeholder="City *"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="State *"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div
              style={{
                backgroundColor: "var(--astro-card)",
                border: "1px solid var(--astro-border)",
                borderRadius: "8px",
                padding: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.05rem", color: "var(--astro-text)", marginBottom: "1rem" }}>
                Payment Method
              </h2>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                <span style={{ color: "var(--astro-text)" }}>Pay Full Amount Online</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span style={{ color: "var(--astro-text)" }}>
                  Cash on Delivery — Pay ₹{advanceAmount} now, rest on delivery
                </span>
              </label>
            </div>

            {errorMsg && (
              <p style={{ color: "#B00020", marginBottom: "1rem", fontWeight: "bold" }}>{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "0.9rem",
                backgroundColor: "var(--astro-primary)",
                color: "var(--astro-primary-text)",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting
                ? "Processing..."
                : paymentMethod === "cod"
                ? `Pay ₹${advanceAmount} & Place Order`
                : `Pay ₹${subtotal.toLocaleString("en-IN")} & Place Order`}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.6rem",
  marginBottom: "0.75rem",
  border: "1px solid var(--astro-border)",
  borderRadius: "4px",
  backgroundColor: "#fff",
  color: "#241046",
};
