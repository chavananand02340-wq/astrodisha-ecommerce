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
        setCart((current) => {
          const existing = current.find(
            (item) => item.id === product.id
          );

          if (existing) {
            return current.map((item) =>
              item.id === product.id
                ? {
                    ...item,
                    quantity: item.quantity + 1
                  }
                : item
            );
          }

          return [
            ...current,
            {
              ...product,
              quantity: 1
            }
          ];
        });

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
          current.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity
                }
              : item
          )
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
          className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-[#3e2237] px-5 py-3 text-xs font-medium text-white shadow-xl"
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
