"use client";

import React, { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { Product, WishlistItem } from "@/lib/types";
import { mockProducts } from "@/lib/mock-data";
import { useCart } from "./CartContext";

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => boolean;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (product: Product, selectedSize?: string, selectedColor?: string) => void;
  clearWishlist: () => void;
  totalItems: number;
  isHydrated: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "fashionhub_wishlist";

const INITIAL_WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: "wish-prod-3",
    userId: "usr-customer-1",
    productId: "prod-3",
    product: mockProducts[2] || mockProducts[0],
    addedAt: "2026-08-15T14:40:00Z",
  },
  {
    id: "wish-prod-8",
    userId: "usr-customer-1",
    productId: "prod-8",
    product: mockProducts[7] || mockProducts[1],
    addedAt: "2026-09-01T12:00:00Z",
  },
];

let wishlistMemoryState: WishlistItem[] = INITIAL_WISHLIST_ITEMS;
let hasLoadedWishlistFromStorage = false;
const wishlistListeners = new Set<() => void>();

function notifyWishlist() {
  wishlistListeners.forEach((listener) => listener());
}

function loadInitialWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return INITIAL_WISHLIST_ITEMS;
  if (!hasLoadedWishlistFromStorage) {
    try {
      const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          wishlistMemoryState = parsed;
        } else {
          window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(INITIAL_WISHLIST_ITEMS));
        }
      } else {
        window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(INITIAL_WISHLIST_ITEMS));
      }
    } catch {
      wishlistMemoryState = INITIAL_WISHLIST_ITEMS;
    }
    hasLoadedWishlistFromStorage = true;
  }
  return wishlistMemoryState;
}

function saveWishlist(newItems: WishlistItem[]) {
  wishlistMemoryState = newItems;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.warn("Failed to save wishlist to localStorage", e);
    }
  }
  notifyWishlist();
}

function subscribeWishlist(listener: () => void) {
  wishlistListeners.add(listener);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === WISHLIST_STORAGE_KEY && e.newValue) {
      try {
        wishlistMemoryState = JSON.parse(e.newValue);
        notifyWishlist();
      } catch {
        // ignore malformed storage
      }
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    wishlistListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

const emptySubscribe = () => () => {};

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { addItem: addCartItem } = useCart();

  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const items = useSyncExternalStore(
    subscribeWishlist,
    loadInitialWishlist,
    () => INITIAL_WISHLIST_ITEMS
  );

  const isInWishlist = (productId: string): boolean => {
    return wishlistMemoryState.some((item) => item.productId === productId || item.product.id === productId);
  };

  const addToWishlist = (product: Product) => {
    if (isInWishlist(product.id)) return;

    const newItem: WishlistItem = {
      id: `wish-${product.id}`,
      userId: "usr-customer-1",
      productId: product.id,
      product,
      addedAt: new Date().toISOString(),
    };

    saveWishlist([newItem, ...wishlistMemoryState]);
  };

  const removeFromWishlist = (productId: string) => {
    const updated = wishlistMemoryState.filter((item) => item.productId !== productId && item.product.id !== productId);
    saveWishlist(updated);
  };

  const toggleWishlist = (product: Product): boolean => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      return false;
    } else {
      addToWishlist(product);
      return true;
    }
  };

  const moveToCart = (product: Product, selectedSize?: string, selectedColor?: string) => {
    addCartItem(product, 1, selectedSize, selectedColor);
    removeFromWishlist(product.id);
  };

  const clearWishlist = () => {
    saveWishlist([]);
  };

  const totalItems = useMemo(() => items.length, [items]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        moveToCart,
        clearWishlist,
        totalItems,
        isHydrated,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
