"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { mockProducts, mockCategories } from "@/lib/mock-data";
import { ProductCard } from "@/components/product";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  Check,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Static price ranges
const PRICE_RANGES = [
  { label: "All Prices", value: "all", min: 0, max: Infinity },
  { label: "Under $100", value: "under-100", min: 0, max: 100 },
  { label: "$100 to $250", value: "100-250", min: 100, max: 250 },
  { label: "$250 to $500", value: "250-500", min: 250, max: 500 },
  { label: "$500 and above", value: "above-500", min: 500, max: Infinity },
];

// Static rating options
const RATING_OPTIONS = [
  { label: "Any Rating", value: 0 },
  { label: "4.8 & above", value: 4.8 },
  { label: "4.5 & above", value: 4.5 },
  { label: "4.0 & above", value: 4.0 },
];

interface FilterSidebarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedPriceRange: string;
  onPriceRangeChange: (r: string) => void;
  minRating: number;
  onRatingChange: (r: number) => void;
  inStockOnly: boolean;
  onStockChange: (s: boolean) => void;
  activeFiltersCount: number;
  onClearAll: () => void;
}

function FilterSidebarPanel({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceRangeChange,
  minRating,
  onRatingChange,
  inStockOnly,
  onStockChange,
  activeFiltersCount,
  onClearAll,
}: FilterSidebarProps) {
  return (
    <div className="space-y-7">
      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1C1C]">
          Search Collection
        </label>
        <Input
          placeholder="Search by name, category..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-[#737373]" />}
        />
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1C1C]">
            Department
          </label>
          {selectedCategory !== "all" && (
            <button
              onClick={() => onCategoryChange("all")}
              className="text-[11px] text-[#8B3A4A] hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors",
              selectedCategory === "all"
                ? "bg-[#1C1C1C] text-white"
                : "text-[#242424] hover:bg-[#F1ECE6]"
            )}
          >
            <span>All Departments</span>
            <span className="font-mono text-[11px] opacity-75">{mockProducts.length}</span>
          </button>
          {mockCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.slug)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors",
                  isSelected
                    ? "bg-[#1C1C1C] text-white"
                    : "text-[#242424] hover:bg-[#F1ECE6]"
                )}
              >
                <span>{cat.name}</span>
                <span className="font-mono text-[11px] opacity-75">{cat.productCount}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-2 border-t border-[#E5E1DC]">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1C1C]">
          Price Range
        </label>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const isSelected = selectedPriceRange === range.value;
            return (
              <button
                key={range.value}
                type="button"
                onClick={() => onPriceRangeChange(range.value)}
                className={cn(
                  "w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors",
                  isSelected
                    ? "bg-[#8B3A4A]/10 text-[#8B3A4A] font-semibold"
                    : "text-[#737373] hover:text-[#242424] hover:bg-[#FAF8F5]"
                )}
              >
                <span>{range.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#8B3A4A]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer Rating */}
      <div className="space-y-3 pt-2 border-t border-[#E5E1DC]">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1C1C]">
          Customer Rating
        </label>
        <div className="space-y-1.5">
          {RATING_OPTIONS.map((opt) => {
            const isSelected = minRating === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onRatingChange(opt.value)}
                className={cn(
                  "w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors",
                  isSelected
                    ? "bg-[#8B3A4A]/10 text-[#8B3A4A] font-semibold"
                    : "text-[#737373] hover:text-[#242424] hover:bg-[#FAF8F5]"
                )}
              >
                <div className="flex items-center gap-1.5">
                  {opt.value > 0 ? (
                    <>
                      <Star className="w-3.5 h-3.5 fill-[#8B3A4A] text-[#8B3A4A]" />
                      <span>{opt.label}</span>
                    </>
                  ) : (
                    <span>{opt.label}</span>
                  )}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#8B3A4A]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-3 pt-2 border-t border-[#E5E1DC]">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#1C1C1C]">
          Availability
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#242424] select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onStockChange(e.target.checked)}
            className="w-4 h-4 rounded border-[#E5E1DC] text-[#8B3A4A] focus:ring-[#8B3A4A]"
          />
          <span>In Stock Only ({mockProducts.filter((p) => p.stock > 0).length})</span>
        </label>
      </div>

      {/* Reset Filters CTA */}
      {activeFiltersCount > 0 && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="w-full text-xs"
          >
            Clear All Filters ({activeFiltersCount})
          </Button>
        </div>
      )}
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();

  // Initialize state directly from query parameters without needing cascading effects
  const initialCategory = searchParams.get("category")?.toLowerCase() || "all";
  const initialSearch = searchParams.get("search") || "";
  const initialBadge = searchParams.get("filter")?.toLowerCase() || "all";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [badgeFilter, setBadgeFilter] = useState(initialBadge);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const itemsPerPage = 8;

  // Filter setters that reset page to 1
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };
  const handlePriceRangeChange = (r: string) => {
    setSelectedPriceRange(r);
    setCurrentPage(1);
  };
  const handleRatingChange = (r: number) => {
    setMinRating(r);
    setCurrentPage(1);
  };
  const handleStockChange = (s: boolean) => {
    setInStockOnly(s);
    setCurrentPage(1);
  };
  const handleSortChange = (s: string) => {
    setSortBy(s);
    setCurrentPage(1);
  };
  const handleBadgeFilterChange = (b: string) => {
    setBadgeFilter(b);
    setCurrentPage(1);
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedPriceRange !== "all") count++;
    if (minRating > 0) count++;
    if (inStockOnly) count++;
    if (badgeFilter !== "all") count++;
    if (searchQuery.trim().length > 0) count++;
    return count;
  }, [selectedCategory, selectedPriceRange, minRating, inStockOnly, badgeFilter, searchQuery]);

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setMinRating(0);
    setInStockOnly(false);
    setBadgeFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return mockProducts
      .filter((product) => {
        // Search by Product name or Category
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.title.toLowerCase().includes(q);
          const matchCategory = product.category.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchTags = product.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchCategory && !matchBrand && !matchTags) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== "all") {
          const cat = mockCategories.find((c) => c.slug.toLowerCase() === selectedCategory.toLowerCase());
          const catName = cat ? cat.name.toLowerCase() : selectedCategory.toLowerCase();
          const matchCat =
            product.category.toLowerCase() === catName ||
            product.tags.includes(selectedCategory.toLowerCase()) ||
            product.tags.includes(catName);
          if (!matchCat) return false;
        }

        // Price range filter
        if (selectedPriceRange !== "all") {
          const range = PRICE_RANGES.find((r) => r.value === selectedPriceRange);
          if (range) {
            if (product.price < range.min || product.price > range.max) {
              return false;
            }
          }
        }

        // Rating filter
        if (minRating > 0 && product.rating < minRating) {
          return false;
        }

        // Availability filter
        if (inStockOnly && product.stock <= 0) {
          return false;
        }

        // Badge filter (new, sale, trending, limited)
        if (badgeFilter !== "all") {
          if (badgeFilter === "new" && !product.isNewArrival) return false;
          if (badgeFilter === "sale" && product.badge !== "sale") return false;
          if (badgeFilter === "trending" && !product.isTrending) return false;
          if (badgeFilter === "limited" && product.badge !== "limited") return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "price-low") {
          return a.price - b.price;
        }
        if (sortBy === "price-high") {
          return b.price - a.price;
        }
        if (sortBy === "rating") {
          return b.rating - a.rating;
        }
        if (sortBy === "popular") {
          return b.reviewCount - a.reviewCount;
        }
        return 0;
      });
  }, [searchQuery, selectedCategory, selectedPriceRange, minRating, inStockOnly, badgeFilter, sortBy]);

  // Paginated slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Catalog Title Banner */}
      <div className="border-b border-[#E5E1DC] pb-6">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8B3A4A]">
          Online Boutique
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl text-[#1C1C1C] mt-1 font-normal">
          The Marketplace Catalog
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-2 max-w-2xl font-light leading-relaxed">
          Discover artisanal clothing, leather goods, luxury timepieces, and botanical skincare curated from independent design ateliers.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white border border-[#E5E1DC] rounded-xl p-3 sm:p-4 shadow-xs">
        {/* Left: Mobile Filter Button & Active Filter Tags */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#1C1C1C] text-white text-xs font-medium cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-[#8B3A4A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <span className="text-xs text-[#737373]">
            Showing <strong className="text-[#1C1C1C]">{filteredProducts.length}</strong> items
          </span>

          {/* Active filter pill badges */}
          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-[#FAF8F5] border border-[#E5E1DC] text-[#242424]">
              <span>Department: {selectedCategory}</span>
              <button onClick={() => handleCategoryChange("all")}>
                <X className="w-3 h-3 text-[#737373] hover:text-[#1C1C1C]" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-[#FAF8F5] border border-[#E5E1DC] text-[#242424]">
              <span>Search: &ldquo;{searchQuery}&rdquo;</span>
              <button onClick={() => handleSearchChange("")}>
                <X className="w-3 h-3 text-[#737373] hover:text-[#1C1C1C]" />
              </button>
            </span>
          )}

          {badgeFilter !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-[#8B3A4A]/10 text-[#8B3A4A]">
              <span className="capitalize">{badgeFilter}</span>
              <button onClick={() => handleBadgeFilterChange("all")}>
                <X className="w-3 h-3 text-[#8B3A4A]" />
              </button>
            </span>
          )}

          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearAllFilters}
              className="text-xs text-[#8B3A4A] hover:underline font-medium ml-2 cursor-pointer"
            >
              Reset all
            </button>
          )}
        </div>

        {/* Right: Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#737373] whitespace-nowrap hidden sm:inline">
            Sort by:
          </span>
          <div className="w-48">
            <Select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              options={[
                { label: "Newest", value: "newest" },
                { label: "Price low to high", value: "price-low" },
                { label: "Price high to low", value: "price-high" },
                { label: "Highest rated", value: "rating" },
                { label: "Popular", value: "popular" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Main Grid & Desktop Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white border border-[#E5E1DC] rounded-2xl p-6 shadow-xs sticky top-24">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E1DC]">
            <h3 className="text-sm font-semibold tracking-tight text-[#1C1C1C] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#8B3A4A]" />
              <span>Filters</span>
            </h3>
            {activeFiltersCount > 0 && (
              <span className="text-[11px] font-mono text-[#8B3A4A] font-semibold bg-[#8B3A4A]/10 px-2 py-0.5 rounded-full">
                {activeFiltersCount} active
              </span>
            )}
          </div>
          <FilterSidebarPanel
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            selectedPriceRange={selectedPriceRange}
            onPriceRangeChange={handlePriceRangeChange}
            minRating={minRating}
            onRatingChange={handleRatingChange}
            inStockOnly={inStockOnly}
            onStockChange={handleStockChange}
            activeFiltersCount={activeFiltersCount}
            onClearAll={handleClearAllFilters}
          />
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9 space-y-8">
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No garments match your filters"
              description="Try broadening your price range, clearing your search query, or selecting another department."
              actionLabel="Reset All Filters"
              onAction={handleClearAllFilters}
            />
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    priority={index < 4}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pt-8 border-t border-[#E5E1DC] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-[#737373]">
                    Showing <strong className="text-[#1C1C1C]">{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
                    <strong className="text-[#1C1C1C]">
                      {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                    </strong>{" "}
                    of <strong className="text-[#1C1C1C]">{filteredProducts.length}</strong> garments
                  </p>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
                      className="text-xs"
                    >
                      Previous
                    </Button>

                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "w-8 h-8 rounded-lg text-xs font-medium font-mono transition-colors cursor-pointer",
                            isCurrent
                              ? "bg-[#1C1C1C] text-white font-semibold"
                              : "bg-white border border-[#E5E1DC] text-[#242424] hover:bg-[#F1ECE6]"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                      className="text-xs"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl z-10 flex flex-col">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-[#E5E1DC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#8B3A4A]" />
                <h3 className="text-sm font-semibold text-[#1C1C1C]">Filters & Refinements</h3>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-[#737373] hover:text-[#1C1C1C] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 p-6 overflow-y-auto">
              <FilterSidebarPanel
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                selectedPriceRange={selectedPriceRange}
                onPriceRangeChange={handlePriceRangeChange}
                minRating={minRating}
                onRatingChange={handleRatingChange}
                inStockOnly={inStockOnly}
                onStockChange={handleStockChange}
                activeFiltersCount={activeFiltersCount}
                onClearAll={handleClearAllFilters}
              />
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#E5E1DC] bg-[#FAF8F5] flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={handleClearAllFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                variant="default"
                size="md"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1"
              >
                Apply ({filteredProducts.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#737373]">Loading boutique catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
