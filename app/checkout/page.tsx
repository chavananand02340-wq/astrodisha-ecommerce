"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/StoreProvider";
import { createClient } from "@/utils/supabase/client";

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("India");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const advanceAmount = 100;

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
    });

    setSubmitting(false);

    if (error) {
      setErrorMsg("Failed to place order: " + error.message);
      return;
    }

    const result = Array.isArray(data) ? data[0] : data;

    if (!result?.order_number) {
      setErrorMsg("Order was placed but confirmation details are missing.");
      return;
    }

    clearCart();
    router.push(`/order-confirmation/${result.order_number}`);
  }

  if (cart.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#3E2237" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif" }}>Your cart is empty</h1>
        <p style={{ color: "#8A607A" }}>Add some products before checking out.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontFamily: "Playfair Display, serif", color: "#3E2237", marginBottom: "1.5rem" }}>
        Checkout
      </h1>

      <div
        style={{
          backgroundColor: "#FBF8F2",
          border: "1px solid #D9CEC1",
          borderRadius: "8px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.05rem", color: "#3E2237", marginBottom: "1rem" }}>Order Summary</h2>
        {cart.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.9rem",
              color: "#3E2237",
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
            borderTop: "1px solid #D9CEC1",
            marginTop: "0.75rem",
            paddingTop: "0.75rem",
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            color: "#3E2237",
          }}
        >
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <p style={{ fontSize: "0.75rem", color: "#8A607A", marginTop: "0.5rem" }}>
          Delivery charge and final total will be confirmed on the next screen.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div
          style={{
            backgroundColor: "#FBF8F2",
            border: "1px solid #D9CEC1",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.05rem", color: "#3E2237", marginBottom: "1rem" }}>
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
            placeholder="PIN Code *"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
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
            backgroundColor: "#FBF8F2",
            border: "1px solid #D9CEC1",
            borderRadius: "8px",
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ fontSize: "1.05rem", color: "#3E2237", marginBottom: "1rem" }}>
            Payment Method
          </h2>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "online"}
              onChange={() => setPaymentMethod("online")}
            />
            <span style={{ color: "#3E2237" }}>Pay Full Amount Online</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />
            <span style={{ color: "#3E2237" }}>
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
            backgroundColor: "#5A3150",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting
            ? "Placing Order..."
            : paymentMethod === "cod"
            ? `Pay ₹${advanceAmount} & Place Order`
            : "Place Order"}
        </button>
      </form>
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
