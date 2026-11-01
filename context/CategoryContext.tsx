"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import { Category } from "@/lib/types";
import { mockCategories } from "@/lib/mock-data/categories";

interface CategoryContextType {
  categories: Category[];
  addCategory: (input: Omit<Category, "id">) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => Category | undefined;
  deleteCategory: (id: string) => boolean;
  getCategoryById: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  isHydrated: boolean;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const CATEGORY_STORAGE_KEY = "fashionhub_categories";
const INITIAL_CATEGORIES: Category[] = mockCategories;

let categoryMemoryState: Category[] = INITIAL_CATEGORIES;
let hasLoadedCategoriesFromStorage = false;
const categoryListeners = new Set<() => void>();

function notifyCategoryListeners() {
  categoryListeners.forEach((listener) => listener());
}

function loadInitialCategories(): Category[] {
  if (typeof window === "undefined") return INITIAL_CATEGORIES;
  if (!hasLoadedCategoriesFromStorage) {
    try {
      const stored = window.localStorage.getItem(CATEGORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          categoryMemoryState = parsed;
        } else {
          window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
        }
      } else {
        window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
      }
    } catch {
      categoryMemoryState = INITIAL_CATEGORIES;
    }
    hasLoadedCategoriesFromStorage = true;
  }
  return categoryMemoryState;
}

function saveCategories(newCategories: Category[]) {
  categoryMemoryState = newCategories;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(newCategories));
    } catch (e) {
      console.error("Failed to persist categories", e);
    }
  }
  notifyCategoryListeners();
}

const SERVER_CATEGORY_SNAPSHOT: Category[] = INITIAL_CATEGORIES;

const categoryStore = {
  subscribe(listener: () => void) {
    categoryListeners.add(listener);
    return () => categoryListeners.delete(listener);
  },
  getSnapshot(): Category[] {
    if (typeof window !== "undefined" && !hasLoadedCategoriesFromStorage) {
      return loadInitialCategories();
    }
    return categoryMemoryState;
  },
  getServerSnapshot(): Category[] {
    return SERVER_CATEGORY_SNAPSHOT;
  },
};

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const categories = useSyncExternalStore(
    categoryStore.subscribe,
    categoryStore.getSnapshot,
    categoryStore.getServerSnapshot
  );

  const addCategory = (input: Omit<Category, "id">): Category => {
    const newCategory: Category = {
      ...input,
      id: `cat-${input.slug || Date.now().toString(36)}`,
      productCount: input.productCount || 0,
    };
    saveCategories([...categories, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>): Category | undefined => {
    const existing = categories.find((c) => c.id === id);
    if (!existing) return undefined;
    const updatedCategory: Category = { ...existing, ...updates };
    const nextCategories = categories.map((c) => (c.id === id ? updatedCategory : c));
    saveCategories(nextCategories);
    return updatedCategory;
  };

  const deleteCategory = (id: string): boolean => {
    const exists = categories.some((c) => c.id === id);
    if (!exists) return false;
    const nextCategories = categories.filter((c) => c.id !== id);
    saveCategories(nextCategories);
    return true;
  };

  const getCategoryById = (id: string) => categories.find((c) => c.id === id);
  const getCategoryBySlug = (slug: string) =>
    categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        getCategoryBySlug,
        isHydrated: hasLoadedCategoriesFromStorage,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
