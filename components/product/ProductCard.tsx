import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductBadge } from "./ProductBadge";
import { RatingStars } from "./RatingStars";
import { PriceDisplay } from "./PriceDisplay";
import { WishlistButton } from "./WishlistButton";
import { AddToCartButton } from "./AddToCartButton";

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority = false, className }: ProductCardProps) {
  const primaryImage = product.images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop";

  return (
    <div
      className={cn(
        "group relative bg-white border border-[#E5E1DC] rounded-xl overflow-hidden flex flex-col",
        "transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#D6D2CC]",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full bg-[#F1ECE6] overflow-hidden">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          {/* Product image */}
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover object-center"
          />
        </Link>

        {/* Top Badges & Actions */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none z-10">
          <div>
            {product.badge && <ProductBadge type={product.badge} />}
          </div>
          <div className="pointer-events-auto">
            <WishlistButton
              productId={product.id}
              product={product}
              productTitle={product.title}
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-[#737373] uppercase tracking-wider mb-1">
            <span>{product.brand}</span>
            <span>{product.category}</span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} className="block group-hover:text-[#8B3A4A] transition-colors">
            <h3 className="text-sm font-medium text-[#242424] line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="mt-1.5">
            <RatingStars
              rating={product.rating}
              reviewCount={product.reviewCount}
              showNumber={false}
              size="sm"
            />
          </div>
        </div>

        {/* Price & Add To Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E5E1DC]/50">
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="sm"
          />

          <div>
            <AddToCartButton product={product} variant="icon" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
