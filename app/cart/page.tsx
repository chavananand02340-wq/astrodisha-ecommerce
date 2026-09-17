"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { useStore } from "@/components/StoreProvider";

export default function CartPage() {
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

  const delivery = subtotal >= 999 || subtotal === 0
    ? 0
    : 99;

  const total = subtotal + delivery;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f3ec] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#c6a15b]">
            YOUR BAG
          </p>

          <h1 className="astro-serif mt-2 text-4xl text-[#3e2237]">
            Shopping Cart
          </h1>

          {cart.length === 0 ? (
            <div className="mt-10 rounded-sm border border-[#d9cec1] bg-[#fbf8f2] px-6 py-16 text-center">
              <div className="text-4xl">🛒</div>

              <h2 className="astro-serif mt-5 text-2xl text-[#3e2237]">
                Your cart is empty
              </h2>

              <p className="mt-2 text-sm text-[#8a607a]">
                Discover something meaningful for your journey.
              </p>

              <Link
                href="/"
                className="mt-6 inline-block rounded-sm bg-[#5a3150] px-7 py-3 text-xs font-semibold text-white"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-sm border border-[#d9cec1] bg-[#fbf8f2] p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-sm object-cover"
                      onError={(event) => {
                        event.currentTarget.src =
                          "/images/placeholder-product.svg";
                      }}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-[9px] uppercase tracking-wider text-[#8a607a]">
                        {item.category}
                      </p>

                      <h2 className="astro-serif mt-1 text-base text-[#3e2237]">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-sm font-semibold text-[#5a3150]">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-[#d9cec1]">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            className="h-8 w-8"
                          >
                            −
                          </button>

                          <span className="w-8 text-center text-xs">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            className="h-8 w-8"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          className="text-[10px] text-[#8a607a] underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="h-fit rounded-sm border border-[#d9cec1] bg-[#fbf8f2] p-5">
                <h2 className="astro-serif text-2xl text-[#3e2237]">
                  Order Summary
                </h2>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#8a607a]">
                      Subtotal
                    </span>

                    <span>
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#8a607a]">
                      Delivery
                    </span>

                    <span>
                      {delivery === 0
                        ? "FREE"
                        : `₹${delivery}`}
                    </span>
                  </div>

                  <div className="border-t border-[#d9cec1] pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>

                      <span className="text-[#5a3150]">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full rounded-sm bg-[#5a3150] py-3.5 text-xs font-semibold text-white"
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
