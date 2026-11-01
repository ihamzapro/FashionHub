"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import { Product } from "@/lib/types";
import { mockProducts } from "@/lib/mock-data";

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  subcategory?: string;
  stock: number;
  images: string[];
  sku?: string;
  brand?: string;
  supplierId?: string;
  supplierName?: string;
  availableSizes?: string[];
  availableColors?: string[];
  tags?: string[];
  badge?: Product["badge"];
}

interface ProductContextType {
  products: Product[];
  addProduct: (input: CreateProductInput) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => Product | undefined;
  deleteProduct: (id: string) => boolean;
  getProductById: (id: string) => Product | undefined;
  getSupplierProducts: (supplierId?: string) => Product[];
  isHydrated: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCT_STORAGE_KEY = "fashionhub_products";

const INITIAL_PRODUCTS: Product[] = mockProducts;

let productMemoryState: Product[] = INITIAL_PRODUCTS;
let hasLoadedProductsFromStorage = false;
const productListeners = new Set<() => void>();

function notifyProductListeners() {
  productListeners.forEach((listener) => listener());
}

function loadInitialProducts(): Product[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  if (!hasLoadedProductsFromStorage) {
    try {
      const stored = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          productMemoryState = parsed;
        } else {
          window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
        }
      } else {
        window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      }
    } catch {
      productMemoryState = INITIAL_PRODUCTS;
    }
    hasLoadedProductsFromStorage = true;
  }
  return productMemoryState;
}

function saveProducts(newProducts: Product[]) {
  productMemoryState = newProducts;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(newProducts));
    } catch (e) {
      console.warn("Failed to save products to localStorage", e);
    }
  }
  notifyProductListeners();
}

function subscribeProducts(listener: () => void) {
  productListeners.add(listener);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === PRODUCT_STORAGE_KEY && e.newValue) {
      try {
        productMemoryState = JSON.parse(e.newValue);
        notifyProductListeners();
      } catch {
        // ignore malformed storage
      }
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    productListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

const emptySubscribe = () => () => {};

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const products = useSyncExternalStore(
    subscribeProducts,
    loadInitialProducts,
    () => INITIAL_PRODUCTS
  );

  const getProductById = (id: string): Product | undefined => {
    const cleanId = id.toLowerCase().trim();
    return products.find(
      (p) => p.id.toLowerCase() === cleanId || p.slug.toLowerCase() === cleanId
    );
  };

  const getSupplierProducts = (supplierId: string = "sup-1"): Product[] => {
    return products.filter((p) => p.supplierId === supplierId);
  };

  const addProduct = (input: CreateProductInput): Product => {
    const slug = input.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const uniqueSuffix = Date.now().toString(36).substring(4);
    const sku = input.sku || `SKU-${Date.now().toString().slice(-6)}`;
    const id = `prod-${Date.now()}`;

    const newProduct: Product = {
      id,
      title: input.title,
      slug: `${slug}-${uniqueSuffix}`,
      description: input.description,
      price: Number(input.price),
      compareAtPrice: input.compareAtPrice ? Number(input.compareAtPrice) : undefined,
      costPrice: Math.round(Number(input.price) * 0.4),
      images: input.images && input.images.length > 0 ? input.images : [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
      ],
      category: input.category,
      subcategory: input.subcategory || "General",
      brand: input.brand || "Atelier V",
      supplierId: input.supplierId || "sup-1",
      supplierName: input.supplierName || "Atelier V Studios",
      stock: Number(input.stock),
      sku,
      rating: 5.0,
      reviewCount: 0,
      badge: input.badge || "new",
      tags: input.tags && input.tags.length > 0 ? input.tags : [input.category.toLowerCase(), "new"],
      availableSizes: input.availableSizes || ["S", "M", "L"],
      availableColors: input.availableColors || ["Natural", "Black"],
      isFeatured: false,
      isNewArrival: true,
      isTrending: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newProduct, ...productMemoryState];
    saveProducts(updated);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>): Product | undefined => {
    const index = productMemoryState.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    const existing = productMemoryState[index];
    const updatedProduct: Product = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [...productMemoryState];
    updatedList[index] = updatedProduct;
    saveProducts(updatedList);
    return updatedProduct;
  };

  const deleteProduct = (id: string): boolean => {
    const existing = productMemoryState.find((p) => p.id === id);
    if (!existing) return false;

    const updated = productMemoryState.filter((p) => p.id !== id);
    saveProducts(updated);
    return true;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getSupplierProducts,
        isHydrated,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts(): ProductContextType {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
