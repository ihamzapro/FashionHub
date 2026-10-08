"use client";

import React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/lib/types";
import { mockProducts } from "@/lib/mock-data";

export interface WishlistButtonProps {
  productId: string;
  product?: Product;
  productTitle?: string;
  initialInWishlist?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function WishlistButton({
  productId,
  product,
  productTitle = "Product",
  size = "md",
  className,
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isHydrated } = useWishlist();
  const { toast } = useToast();

  const inWishlist = isHydrated ? isInWishlist(productId) : false;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Resolve product object
    const targetProduct =
      product ||
      mockProducts.find((p) => p.id === productId) ||
      ({
        id: productId,
        title: productTitle,
        slug: productId,
        description: "",
        price: 0,
        images: [],
        category: "Fashion",
        brand: "FashionHub",
        supplierId: "sup-1",
        supplierName: "Atelier",
        stock: 10,
        sku: productId,
        rating: 5,
        reviewCount: 0,
        tags: [],
        createdAt: new Date().toISOString(),
      } as Product);

    const nowInWishlist = toggleWishlist(targetProduct);

    if (nowInWishlist) {
      toast({
        title: "Added to Wishlist",
        message: `${targetProduct.title || productTitle} has been saved to your personal collection.`,
        type: "success",
      });
    } else {
      toast({
        title: "Removed from Wishlist",
        message: `${targetProduct.title || productTitle} removed from your wishlist.`,
        type: "info",
      });
    }
  };

  const buttonSizes = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-4.5 h-4.5",
  };

  return (
    <button
      type="button"
      data-product-id={productId}
      onClick={handleToggle}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs",
        "bg-white/90 backdrop-blur-xs hover:bg-white text-[#737373] hover:text-[#8B3A4A] border border-[#E5E1DC]/80",
        inWishlist && "text-[#8B3A4A] border-[#8B3A4A]/30 bg-white shadow-xs",
        buttonSizes[size],
        className
      )}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-all duration-200 active:scale-75",
          inWishlist && "fill-[#8B3A4A] text-[#8B3A4A] scale-105"
        )}
      />
    </button>
  );
}
