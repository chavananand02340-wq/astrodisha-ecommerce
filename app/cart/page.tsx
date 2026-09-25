"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import SafeImage from "@/components/SafeImage";
import { useStore } from "@/components/StoreProvider";

// Keep same as Header.tsx and ProductDetails.tsx
const FREE_SHIPPING_THRESHOLD = 999;

const BAG_ICON = (
  <>
    <path d="M6 7h12l-1 13H7L6 7z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
  </>
);

function stockLimitOf(entity: { stock?: number }): number {
  return typeof entity.stock === "number" ? entity.stock : Infinity;
}

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    updateQuantity,
    removeFromCart
  } = useStore();

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <>
      <Header />

      <main style={{ backgroundColor: "var(--astro-bg)" }} className="min-h-screen px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p style={{ color: "var(--astro-accent)" }} className="text-[10px] font-semibold uppercase tracking-[0.2em]">
            Your Bag
          </p>

          <h1 style={{ color: "var(--astro-text)" }} className="astro-serif mt-2 text-4xl">
            Shopping Cart
          </h1>

          {cart.length === 0 ? (
            <div
              style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
              className="mt-10 rounded-2xl border px-6 py-16 text-center"
            >
              <svg
                viewBox="0 0 24 24"
                className="mx-auto h-10 w-10"
                fill="none"
                stroke="var(--astro-accent)"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {BAG_ICON}
              </svg>

              <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mt-5 text-2xl">
                Your cart is empty
              </h2>

              <p style={{ color: "var(--astro-mauve)" }} className="mt-2 text-sm">
                Discover something meaningful for your journey.
              </p>

              <Link
                href="/shop"
                style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                className="mt-6 inline-flex h-12 items-center rounded-full px-7 text-sm font-semibold transition hover:opacity-90"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="space-y-3">
                {cart.map((item) => {
                  const limit = stockLimitOf(item);
                  const atMax = item.quantity >= limit;

                  return (
                    <div
                      key={item.id}
                      style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
                      className="flex gap-4 rounded-2xl border p-3"
                    >
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                        <SafeImage
                          src={item.image}
                          alt={item.name}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p style={{ color: "var(--astro-mauve)" }} className="text-[9px] font-medium uppercase tracking-wider">
                          {item.category}
                        </p>

                        <h2 style={{ color: "var(--astro-text)" }} className="astro-serif mt-1 text-base">
                          {item.name}
                        </h2>

                        <p style={{ color: "var(--astro-primary)" }} className="mt-1 text-sm font-semibold">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>

                        {isFinite(limit) && atMax && (
                          <p style={{ color: "var(--astro-accent)" }} className="mt-1 text-[10px] font-medium">
                            Only {limit} in stock
                          </p>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <div
                            style={{ borderColor: "var(--astro-border)" }}
                            className="flex items-center rounded-full border"
                          >
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                              style={{ color: "var(--astro-primary)" }}
                              className="flex h-8 w-8 items-center justify-center text-base"
                            >
                              −
                            </button>

                            <span style={{ color: "var(--astro-text)" }} className="w-8 text-center text-xs">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              disabled={atMax}
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                              style={{ color: atMax ? "var(--astro-border)" : "var(--astro-primary)" }}
                              className={`flex h-8 w-8 items-center justify-center text-base ${atMax ? "cursor-not-allowed" : ""}`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            style={{ color: "var(--astro-mauve)" }}
                            className="text-[10px] underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <aside
                style={{ borderColor: "var(--astro-border)", backgroundColor: "var(--astro-card)" }}
                className="h-fit rounded-2xl border p-5"
              >
                <h2 style={{ color: "var(--astro-text)" }} className="astro-serif text-2xl">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: "var(--astro-mauve)" }}>
                      Subtotal
                    </span>

                    <span style={{ color: "var(--astro-text)" }} className="font-semibold">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {remainingForFreeShipping > 0 ? (
                    <div>
                      <p style={{ color: "var(--astro-mauve)" }} className="text-[11px]">
                        Add ₹{remainingForFreeShipping.toLocaleString("en-IN")} more for free shipping
                      </p>
                      <div style={{ backgroundColor: "var(--astro-border)" }} className="mt-2 h-1.5 w-full overflow-hidden rounded-full">
                        <div
                          style={{ backgroundColor: "var(--astro-accent)", width: `${shippingProgress}%` }}
                          className="h-full rounded-full transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: "var(--astro-accent)" }} className="text-[11px] font-semibold">
                      ✓ You've unlocked free shipping
                    </p>
                  )}

                  <p style={{ color: "var(--astro-mauve)" }} className="text-[11px]">
                    Final total, including any delivery charge, is calculated at checkout.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/checkout")}
                  style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
                  className="mt-6 h-12 w-full rounded-full text-sm font-semibold transition hover:opacity-90"
                >
                  Proceed to Checkout
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
                }
