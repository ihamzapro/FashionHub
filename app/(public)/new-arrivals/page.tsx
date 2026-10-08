"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { getNewArrivals, mockCategories } from "@/lib/mock-data";
import { ProductGrid } from "@/components/product";
import { Select } from "@/components/ui/Select";
import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewArrivalsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const newProducts = useMemo(() => getNewArrivals(), []);

  const categories = [
    { label: "All New", value: "all" },
    ...mockCategories.map((c) => ({ label: c.name, value: c.slug })),
  ];

  const filteredProducts = useMemo(() => {
    return newProducts
      .filter((p) => {
        if (selectedCategory === "all") return true;
        const cat = mockCategories.find((c) => c.slug === selectedCategory);
        if (!cat) return true;
        return (
          p.category.toLowerCase() === cat.name.toLowerCase() ||
          p.tags.includes(cat.slug) ||
          p.tags.includes(cat.name.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [newProducts, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-[#737373]">
        <Link href="/" className="hover:text-[#242424] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#242424] font-medium">New Arrivals</span>
      </nav>

      {/* Title Banner */}
      <div className="border-b border-[#E5E1DC] pb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B3A4A]/10 text-[#8B3A4A] text-xs uppercase tracking-widest font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fresh Atelier Releases</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl text-[#1C1C1C] font-normal">
          New Season Arrivals
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] max-w-2xl font-light leading-relaxed">
          The newest garments, artisanal footwear, sculptural leather goods, and restorative skincare freshly released for Autumn / Winter.
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer",
                  isSelected
                    ? "bg-[#1C1C1C] text-white shadow-xs font-semibold"
                    : "bg-[#F1ECE6] text-[#242424] hover:bg-[#E5E1DC]"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-[#737373] hidden sm:inline">Sort:</span>
          <div className="w-48">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { label: "Newest First", value: "newest" },
                { label: "Price: Low to High", value: "price-asc" },
                { label: "Price: High to Low", value: "price-desc" },
                { label: "Highest Rated", value: "rating" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        emptyTitle="No recent arrivals in this department"
        emptyDescription="Check back soon as workshops drop new capsule items weekly."
        columns={4}
      />
    </div>
  );
}
