import React from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  emptyTitle = "No products found",
  emptyDescription = "There are no fashion items matching your current selection.",
  columns = 4,
  className,
}: ProductGridProps) {
  if (isLoading) {
    const colClasses = {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    };

    return (
      <div className={cn("grid gap-6", colClasses[columns], className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E5E1DC] rounded-xl overflow-hidden p-3 space-y-3">
            <Skeleton className="aspect-[4/5] w-full rounded-lg" />
            <div className="space-y-2 pt-1">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-5 w-1/2 pt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        className="my-8"
      />
    );
  }

  const colClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", colClasses[columns], className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
