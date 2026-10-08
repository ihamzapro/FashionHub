"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RatingStars, PriceDisplay, ProductBadge } from "@/components/product";
import { useWishlist, useCart } from "@/context";
import { useToast } from "@/components/ui/Toast";
import { ProtectedRoute } from "@/components/auth";

export default function WishlistPage() {
  const { items, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleMoveAllToBag = () => {
    if (items.length === 0) return;

    items.forEach((item) => {
      addItem(item.product, 1);
    });
    clearWishlist();

    toast({
      title: "All Items Moved",
      message: `${items.length} pieces transferred to your shopping bag.`,
      type: "success",
    });
  };

  const handleMoveItem = (item: (typeof items)[0]) => {
    moveToCart(item.product);
    toast({
      title: "Moved to Bag",
      message: `${item.product.title} has been transferred to your bag.`,
      type: "success",
    });
  };

  const handleRemove = (productId: string, title: string) => {
    removeFromWishlist(productId);
    toast({
      title: "Removed from Wishlist",
      message: `${title} removed from your collection.`,
      type: "info",
    });
  };

  return (
    <ProtectedRoute allowedRoles={["customer", "supplier", "admin"]}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E1DC] pb-6">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8B3A4A]">
            Curated Wardrobe
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1C1C1C] mt-1 font-normal">
            Personal Collection ({items.length})
          </h1>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs text-[#737373] hover:text-[#B84A4A] underline cursor-pointer transition-colors"
            >
              Clear All
            </button>
            <Button
              variant="default"
              size="sm"
              onClick={handleMoveAllToBag}
              className="gap-2 cursor-pointer shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Move All to Bag</span>
            </Button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="text-center py-20 bg-white border border-[#E5E1DC] rounded-2xl max-w-lg mx-auto p-8 space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5E1DC] flex items-center justify-center mx-auto text-[#737373]">
            <Heart className="w-8 h-8 text-[#8B3A4A]" />
          </div>
          <div>
            <h3 className="text-lg font-editorial text-[#1C1C1C]">
              Your personal collection is empty
            </h3>
            <p className="text-xs text-[#737373] mt-1 max-w-sm mx-auto leading-relaxed">
              Curate your private wardrobe by saving archival pieces, seasonal staples, and artisanal leather goods as you explore our boutiques.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/products">
              <Button variant="accent" size="md">
                Explore The Collections
              </Button>
            </Link>
            <Link href="/new-arrivals">
              <Button variant="outline" size="md" className="border-[#1C1C1C]">
                Discover New Arrivals
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-[#E5E1DC] rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#D6D2CC]"
            >
              {/* Product Image & Badges */}
              <div className="relative aspect-[4/5] w-full bg-[#F1ECE6] overflow-hidden">
                <Link href={`/products/${item.product.id}`} className="block w-full h-full">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {/* Badge & Remove */}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
                  <div>
                    {item.product.badge && <ProductBadge type={item.product.badge} />}
                  </div>
                  <div className="pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => handleRemove(item.product.id, item.product.title)}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-[#E5E1DC] text-[#737373] hover:text-[#B84A4A] hover:bg-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                      title="Remove from collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Stock Tag */}
                <div className="absolute bottom-3 left-3">
                  {item.product.stock > 0 ? (
                    <span className="text-[10px] font-medium bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[#4F7A61] border border-[#E5E1DC]/80">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[#B84A4A] border border-[#E5E1DC]/80">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>

              {/* Content & Actions */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#737373] uppercase tracking-wider">
                    <span>{item.product.brand}</span>
                    <span>{item.product.category}</span>
                  </div>

                  <Link
                    href={`/products/${item.product.id}`}
                    className="block font-medium text-sm text-[#242424] hover:text-[#8B3A4A] transition-colors line-clamp-1"
                  >
                    {item.product.title}
                  </Link>

                  <RatingStars
                    rating={item.product.rating}
                    reviewCount={item.product.reviewCount}
                    size="sm"
                    showNumber={false}
                  />

                  <div className="pt-1">
                    <PriceDisplay
                      price={item.product.price}
                      compareAtPrice={item.product.compareAtPrice}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-[#E5E1DC]/60 flex items-center gap-2">
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => handleMoveItem(item)}
                    disabled={item.product.stock <= 0}
                    className="flex-1 gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </Button>

                  <Link href={`/products/${item.product.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-2.5 hover:border-[#1C1C1C]"
                      title="View Details"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}
