"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Check,
  Plus,
  Minus,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Product, Review } from "@/lib/types";
import {
  ProductGallery,
  RatingStars,
  PriceDisplay,
  WishlistButton,
  AddToCartButton,
  ProductReviews,
  ProductGrid,
} from "@/components/product";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context";

export interface ProductDetailsClientProps {
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
}

export function ProductDetailsClient({
  product,
  reviews,
  relatedProducts,
}: ProductDetailsClientProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes?.[0] || "Standard"
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.availableColors?.[0] || "Standard"
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isBuyingNow, setIsBuyingNow] = useState<boolean>(false);

  const maxStock = Math.max(1, product.stock);

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, maxStock));
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const handleBuyNow = () => {
    setIsBuyingNow(true);
    addItem(product, quantity, selectedSize, selectedColor);
    router.push("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#737373] overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-[#242424] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/products" className="hover:text-[#242424] transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link
          href={`/products?category=${product.category.toLowerCase()}`}
          className="hover:text-[#242424] transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[#242424] font-medium truncate max-w-[240px]">
          {product.title}
        </span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: Interactive Image Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={product.images}
            title={product.title}
            badge={product.badge}
          />
        </div>

        {/* Right: Product Details & Controls */}
        <div className="lg:col-span-5 space-y-7 sticky top-24">
          {/* Header & Meta */}
          <div className="space-y-3 border-b border-[#E5E1DC] pb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#737373] font-medium">
                {product.brand} • {product.subcategory || product.category}
              </span>
              <span className="text-[11px] font-mono text-[#737373] bg-[#FAF8F5] border border-[#E5E1DC] px-2 py-0.5 rounded">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-[#1C1C1C] font-normal leading-tight">
              {product.title}
            </h1>

            {/* Ratings anchor */}
            <div className="flex items-center gap-3 pt-1">
              <RatingStars
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="md"
              />
              <a
                href="#reviews-section"
                className="text-xs text-[#8B3A4A] hover:underline"
              >
                Read reviews
              </a>
            </div>

            {/* Price & Stock Status */}
            <div className="pt-3 flex items-center justify-between">
              <PriceDisplay
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                size="lg"
              />

              {/* Stock Indicator */}
              <div className="text-right">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#4F7A61] font-medium bg-[#4F7A61]/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F7A61] animate-pulse" />
                    {product.stock < 10
                      ? `Only ${product.stock} left in atelier`
                      : "In Stock - Ready to Ship"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#B84A4A] font-medium bg-[#B84A4A]/10 px-2.5 py-1 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#242424]">
              Artisan Notes & Silhouette
            </h3>
            <p className="text-sm text-[#737373] leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Available Sizes Picker */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#242424]">
                  Size: <span className="font-normal text-[#737373]">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  className="text-xs text-[#8B3A4A] underline hover:text-[#722F3D] cursor-pointer"
                >
                  Size & Fit Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 min-w-10 px-3.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#1C1C1C] bg-[#1C1C1C] text-white shadow-xs"
                          : "border-[#E5E1DC] bg-white text-[#242424] hover:border-[#737373]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Colors Picker */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#242424]">
                Shade: <span className="font-normal text-[#737373]">{selectedColor}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.availableColors.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#8B3A4A] bg-[#8B3A4A]/10 text-[#8B3A4A] font-medium ring-1 ring-[#8B3A4A]"
                          : "border-[#E5E1DC] bg-white text-[#242424] hover:border-[#737373]"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-[#8B3A4A]" />}
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#242424]">
              Quantity
            </span>
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center border border-[#E5E1DC] rounded-lg bg-white shadow-xs">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || product.stock <= 0}
                  className="p-2 text-[#737373] hover:text-[#1C1C1C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-mono font-medium text-[#1C1C1C] select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= maxStock || product.stock <= 0}
                  className="p-2 text-[#737373] hover:text-[#1C1C1C] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-[#737373]">
                Maximum {maxStock} per order
              </span>
            </div>
          </div>

          {/* Primary Action Buttons: Add to Cart, Buy Now, Wishlist */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <AddToCartButton
                  product={product}
                  quantity={quantity}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  size="lg"
                  variant="accent"
                  className="w-full shadow-md"
                />
              </div>

              <WishlistButton
                productId={product.id}
                product={product}
                productTitle={product.title}
                size="md"
                className="h-12 w-12 border-[#E5E1DC]"
              />
            </div>

            {/* Instant "Buy Now" button */}
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleBuyNow}
              disabled={product.stock <= 0 || isBuyingNow}
              className="w-full border-[#1C1C1C] text-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-white transition-all gap-2"
            >
              <Zap className="w-4 h-4 text-[#8B3A4A]" />
              <span>Instant Checkout / Buy Now</span>
            </Button>
          </div>

          {/* Supplier Info Atelier Card */}
          <div className="p-4 bg-white border border-[#E5E1DC] rounded-xl flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#737373]">
                Atelier Fulfillment Partner
              </p>
              <p className="text-xs font-semibold text-[#1C1C1C] mt-0.5">
                {product.supplierName}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#4F7A61] font-medium bg-[#4F7A61]/10 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Atelier
            </span>
          </div>

          {/* Assurances Checklist */}
          <div className="pt-2 space-y-2.5 text-xs text-[#737373] border-t border-[#E5E1DC]">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#8B3A4A] shrink-0" />
              <span>Complimentary insured express delivery on orders over PKR 5,000</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#8B3A4A] shrink-0" />
              <span>Complimentary 30-day doorstep return pickup and exchange</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#8B3A4A] shrink-0" />
              <span>Handcrafted in limited batches with provenance authenticity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="pt-8 border-t border-[#E5E1DC]">
        <ProductReviews
          productId={product.id}
          initialReviews={reviews}
          productRating={product.rating}
          productReviewCount={product.reviewCount}
        />
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-[#E5E1DC] space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8B3A4A]">
                You May Also Admire
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#1C1C1C] font-normal mt-1">
                Complementary Pieces
              </h2>
            </div>
            <Link
              href={`/products?category=${product.category.toLowerCase()}`}
              className="text-xs font-semibold uppercase tracking-wider text-[#242424] hover:text-[#8B3A4A] transition-colors inline-flex items-center gap-1"
            >
              <span>Explore More {product.category}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <ProductGrid products={relatedProducts} columns={4} />
        </section>
      )}
    </div>
  );
}
