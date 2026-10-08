"use client";

import React, { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { Product, CartItem } from "@/lib/types";
import { mockProducts } from "@/lib/mock-data";

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity?: number,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  total: number;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "fashionhub_cart";
const FREE_SHIPPING_THRESHOLD = 250;
const STANDARD_SHIPPING_FEE = 25;

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: "prod-7-std-Burgundy Noir",
    productId: "prod-7",
    product: mockProducts[6] || mockProducts[0],
    quantity: 1,
    selectedSize: "One Size",
    selectedColor: "Burgundy Noir",
  },
  {
    id: "prod-11-std-Oatmeal Melange",
    productId: "prod-11",
    product: mockProducts[10] || mockProducts[1],
    quantity: 1,
    selectedSize: "One Size",
    selectedColor: "Oatmeal Melange",
  },
];

// External store for Cart
let cartMemoryState: CartItem[] = INITIAL_CART_ITEMS;
let hasLoadedFromStorage = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function loadInitialCart(): CartItem[] {
  if (typeof window === "undefined") return INITIAL_CART_ITEMS;
  if (!hasLoadedFromStorage) {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          cartMemoryState = parsed;
        } else {
          window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(INITIAL_CART_ITEMS));
        }
      } else {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(INITIAL_CART_ITEMS));
      }
    } catch {
      cartMemoryState = INITIAL_CART_ITEMS;
    }
    hasLoadedFromStorage = true;
  }
  return cartMemoryState;
}

function saveCart(newItems: CartItem[]) {
  cartMemoryState = newItems;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  }
  notify();
}

function subscribeCart(listener: () => void) {
  listeners.add(listener);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY && e.newValue) {
      try {
        cartMemoryState = JSON.parse(e.newValue);
        notify();
      } catch {
        // ignore malformed storage
      }
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

const emptySubscribe = () => () => {};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const items = useSyncExternalStore(
    subscribeCart,
    loadInitialCart,
    () => INITIAL_CART_ITEMS
  );

  const addItem = (
    product: Product,
    quantity = 1,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    const sizeKey = selectedSize || product.availableSizes?.[0] || "Standard";
    const colorKey = selectedColor || product.availableColors?.[0] || "Standard";
    const itemId = `${product.id}-${sizeKey}-${colorKey}`;

    const existingIndex = cartMemoryState.findIndex((item) => item.id === itemId);

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = cartMemoryState.map((item, idx) => {
        if (idx === existingIndex) {
          const newQty = Math.min(item.quantity + quantity, product.stock || 99);
          return { ...item, quantity: newQty };
        }
        return item;
      });
    } else {
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        product,
        quantity: Math.min(Math.max(quantity, 1), product.stock || 99),
        selectedSize: sizeKey,
        selectedColor: colorKey,
      };
      updated = [newItem, ...cartMemoryState];
    }

    saveCart(updated);
  };

  const removeItem = (cartItemId: string) => {
    const updated = cartMemoryState.filter((item) => item.id !== cartItemId);
    saveCart(updated);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    const updated = cartMemoryState.map((item) => {
      if (item.id === cartItemId) {
        const maxStock = item.product.stock || 99;
        const cappedQty = Math.min(Math.max(quantity, 1), maxStock);
        return { ...item, quantity: cappedQty };
      }
      return item;
    });

    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + shippingFee;
  }, [subtotal, shippingFee]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        total,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
