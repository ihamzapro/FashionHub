import React from "react";
import { formatCurrency, cn } from "@/lib/utils";

export interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
  className,
}: PriceDisplayProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const fontSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      <span className={cn("font-medium tracking-tight text-[#242424]", fontSizes[size])}>
        {formatCurrency(price)}
      </span>

      {hasDiscount && (
        <>
          <span className="text-xs text-[#737373] line-through">
            {formatCurrency(compareAtPrice)}
          </span>
          <span className="text-[10px] font-semibold text-[#8B3A4A] bg-[#8B3A4A]/10 px-1.5 py-0.5 rounded">
            -{discountPercent}%
          </span>
        </>
      )}
    </div>
  );
}
