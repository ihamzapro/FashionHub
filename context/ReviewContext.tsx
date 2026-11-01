"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";
import { Review } from "@/lib/types";
import { mockReviews } from "@/lib/mock-data/reviews";

interface ReviewContextType {
  reviews: Review[];
  getApprovedReviews: (productId?: string) => Review[];
  getPendingReviews: () => Review[];
  approveReview: (id: string) => boolean;
  rejectReview: (id: string) => boolean;
  deleteReview: (id: string) => boolean;
  addReview: (review: Omit<Review, "id" | "createdAt" | "status">) => Review;
  isHydrated: boolean;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const REVIEW_STORAGE_KEY = "fashionhub_reviews";
const INITIAL_REVIEWS: Review[] = mockReviews;

let reviewMemoryState: Review[] = INITIAL_REVIEWS;
let hasLoadedReviewsFromStorage = false;
const reviewListeners = new Set<() => void>();

function notifyReviewListeners() {
  reviewListeners.forEach((listener) => listener());
}

function loadInitialReviews(): Review[] {
  if (typeof window === "undefined") return INITIAL_REVIEWS;
  if (!hasLoadedReviewsFromStorage) {
    try {
      const stored = window.localStorage.getItem(REVIEW_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          reviewMemoryState = parsed;
        } else {
          window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
        }
      } else {
        window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      }
    } catch {
      reviewMemoryState = INITIAL_REVIEWS;
    }
    hasLoadedReviewsFromStorage = true;
  }
  return reviewMemoryState;
}

function saveReviews(newReviews: Review[]) {
  reviewMemoryState = newReviews;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(newReviews));
    } catch (e) {
      console.error("Failed to persist reviews", e);
    }
  }
  notifyReviewListeners();
}

const SERVER_REVIEW_SNAPSHOT: Review[] = INITIAL_REVIEWS;

const reviewStore = {
  subscribe(listener: () => void) {
    reviewListeners.add(listener);
    return () => reviewListeners.delete(listener);
  },
  getSnapshot(): Review[] {
    if (typeof window !== "undefined" && !hasLoadedReviewsFromStorage) {
      return loadInitialReviews();
    }
    return reviewMemoryState;
  },
  getServerSnapshot(): Review[] {
    return SERVER_REVIEW_SNAPSHOT;
  },
};

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const reviews = useSyncExternalStore(
    reviewStore.subscribe,
    reviewStore.getSnapshot,
    reviewStore.getServerSnapshot
  );

  const getApprovedReviews = (productId?: string) => {
    return reviews.filter((r) => {
      const isApproved = r.status === "approved" || !r.status;
      if (!isApproved) return false;
      if (productId) return r.productId === productId;
      return true;
    });
  };

  const getPendingReviews = () => {
    return reviews.filter((r) => r.status === "pending");
  };

  const approveReview = (id: string): boolean => {
    const existing = reviews.find((r) => r.id === id);
    if (!existing) return false;
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, status: "approved" as const } : r
    );
    saveReviews(updated);
    return true;
  };

  const rejectReview = (id: string): boolean => {
    const existing = reviews.find((r) => r.id === id);
    if (!existing) return false;
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, status: "rejected" as const } : r
    );
    saveReviews(updated);
    return true;
  };

  const deleteReview = (id: string): boolean => {
    const existing = reviews.find((r) => r.id === id);
    if (!existing) return false;
    const updated = reviews.filter((r) => r.id !== id);
    saveReviews(updated);
    return true;
  };

  const addReview = (input: Omit<Review, "id" | "createdAt" | "status">): Review => {
    const newReview: Review = {
      ...input,
      id: `rev-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      // New reviews start in pending status for admin moderation
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    saveReviews([newReview, ...reviews]);
    return newReview;
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        getApprovedReviews,
        getPendingReviews,
        approveReview,
        rejectReview,
        deleteReview,
        addReview,
        isHydrated: hasLoadedReviewsFromStorage,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewProvider");
  }
  return context;
}
