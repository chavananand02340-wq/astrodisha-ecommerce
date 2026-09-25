"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import type { Product } from "./ProductCard";

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

        setToast(`${product.name} added to cart`);
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
      }
    };
  }, [cart, wishlist]);

  return (
    <StoreContext.Provider value={value}>
      {children}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{ backgroundColor: "var(--astro-primary)", color: "var(--astro-primary-text)" }}
          className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-full px-5 py-3 text-xs font-medium shadow-xl"
        >
          {toast}
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
