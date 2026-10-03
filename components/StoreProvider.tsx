"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import Link from "next/link";

import type { Product } from "./ProductCard";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/site";

export type CartItem = Product & {
  quantity: number;
};

type StoreContextValue = {
  cart: CartItem[];
  wishlist: Product[];
  cartCount: number;
  wishlistCount: number;

  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;

  showToast: (message: string) => void;
  showShippingNudge: () => void;
};

type ShippingNudge = {
  title: string;
  showCartLink: boolean;
  key: number;
};

const StoreContext =
  createContext<StoreContextValue | null>(null);

// Cart items saved in the browser before this update won't have a `stock`
// field. Treat missing/invalid stock as "unknown, don't block" so we never
// break someone's existing cart — freshly added items always have real stock.
function stockLimitOf(entity: { stock?: number }): number {
  return typeof entity.stock === "number" ? entity.stock : Infinity;
}

export function StoreProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [toast, setToast] = useState("");
  const [nudge, setNudge] = useState<ShippingNudge | null>(null);

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem("astrodisha-cart");

      const savedWishlist =
        localStorage.getItem("astrodisha-wishlist");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch {
      setCart([]);
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "astrodisha-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(
      "astrodisha-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast("");
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  // Free-delivery popup hides itself after a few seconds
  useEffect(() => {
    if (!nudge) return;

    const timer = window.setTimeout(() => {
      setNudge(null);
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [nudge]);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const remainingForFree = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const freeProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const value = useMemo<StoreContextValue>(() => {
    const cartCount = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    return {
      cart,
      wishlist,

      cartCount,
      wishlistCount: wishlist.length,

      addToCart: (product) => {
        const limit = product.stock ?? 0;

        if (limit <= 0) {
          setToast(`${product.name} is out of stock`);
          return;
        }

        const existing = cart.find((item) => item.id === product.id);

        if (existing) {
          if (existing.quantity >= limit) {
            setToast(`Only ${limit} of ${product.name} available`);
            return;
          }

          setCart((current) =>
            current.map((item) =>
              item.id === product.id
                ? { ...item, stock: product.stock, quantity: item.quantity + 1 }
                : item
            )
          );
        } else {
          setCart((current) => [
            ...current,
            {
              ...product,
              quantity: 1
            }
          ]);
        }

        // Added: show the free-delivery popup instead of the plain toast
        setToast("");
        setNudge({
          title: `${product.name} added to cart`,
          showCartLink: true,
          key: Date.now(),
        });
      },

      removeFromCart: (productId) => {
        setCart((current) =>
          current.filter(
            (item) => item.id !== productId
          )
        );
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          setCart((current) =>
            current.filter(
              (item) => item.id !== productId
            )
          );

          return;
        }

        setCart((current) =>
          current.map((item) => {
            if (item.id !== productId) return item;

            const limit = stockLimitOf(item);

            if (quantity >= limit) {
              if (quantity > limit) {
                setToast(`Only ${limit} of ${item.name} available`);
              }
              return { ...item, quantity: limit };
            }

            return { ...item, quantity };
          })
        );
      },

      clearCart: () => {
        setCart([]);
        setNudge(null);
      },

      toggleWishlist: (product) => {
        setWishlist((current) => {
          const exists = current.some(
            (item) => item.id === product.id
          );

          if (exists) {
            setToast(
              `${product.name} removed from wishlist`
            );

            return current.filter(
              (item) => item.id !== product.id
            );
          }

          setToast(
            `${product.name} saved to wishlist`
          );

          return [...current, product];
        });
      },

      isWishlisted: (productId) => {
        return wishlist.some(
          (item) => item.id === productId
        );
      },

      showToast: (message) => {
        setToast(message);
      },

      showShippingNudge: () => {
        setToast("");
        setNudge({
          title: "Your bag",
          showCartLink: false,
          key: Date.now(),
        });
      }
    };
  }, [cart, wishlist]);

  const showNudge = nudge !== null && cart.length > 0;

  return (
    <StoreContext.Provider value={value}>
      {children}

      {toast && !showNudge && (
        <div
          role="status"
          aria-live="polite"
          style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
          className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-full px-5 py-3 text-xs font-medium shadow-xl"
        >
          {toast}
        </div>
      )}

      {showNudge && nudge && (
        <div
          key={nudge.key}
          role="status"
          aria-live="polite"
          style={{
            backgroundColor: "var(--astro-card)",
            borderColor: "var(--astro-border)",
          }}
          className="astro-fade-up fixed bottom-5 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border p-4 shadow-[0_12px_40px_rgba(36,16,70,0.22)]"
        >
          <div className="flex items-start gap-3">
            <span
              style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h11v9H3z" />
                <path d="M14 9h4l3 3v3h-7" />
                <circle cx="7" cy="17.5" r="1.6" />
                <circle cx="17" cy="17.5" r="1.6" />
              </svg>
            </span>

            <div className="min-w-0 flex-1">
              <p style={{ color: "var(--astro-text)" }} className="truncate text-[13px] font-semibold">
                {nudge.showCartLink ? "✓ " : ""}
                {nudge.title}
              </p>

              {remainingForFree > 0 ? (
                <p style={{ color: "var(--astro-mauve)" }} className="mt-0.5 text-[12px] leading-snug">
                  Add{" "}
                  <span style={{ color: "var(--astro-primary)" }} className="font-bold">
                    ₹{remainingForFree.toLocaleString("en-IN")}
                  </span>{" "}
                  more for <span style={{ color: "var(--astro-accent)" }} className="font-semibold">FREE delivery</span>
                </p>
              ) : (
                <p style={{ color: "var(--astro-accent)" }} className="mt-0.5 text-[12px] font-semibold">
                  🎉 You&apos;ve unlocked FREE delivery!
                </p>
              )}

              <div style={{ backgroundColor: "var(--astro-border)" }} className="mt-2 h-1.5 w-full overflow-hidden rounded-full">
                <div
                  style={{ backgroundColor: "var(--astro-accent)", width: `${freeProgress}%` }}
                  className="h-full rounded-full transition-all duration-500"
                />
              </div>

              {nudge.showCartLink && (
                <Link
                  href="/cart"
                  onClick={() => setNudge(null)}
                  style={{ color: "var(--astro-primary)" }}
                  className="mt-2 inline-block text-[11px] font-semibold uppercase tracking-[0.1em]"
                >
                  View cart →
                </Link>
              )}
            </div>

            <button
              type="button"
              aria-label="Close"
              onClick={() => setNudge(null)}
              style={{ color: "var(--astro-mauve)" }}
              className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm transition hover:opacity-70"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error(
      "useStore must be used inside StoreProvider"
    );
  }

  return context;
}
