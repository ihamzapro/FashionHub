import React from "react";
import { ProductBadgeType } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ProductBadgeProps {
  type?: ProductBadgeType;
  label?: string;
  className?: string;
}

export function ProductBadge({ type = "new", label, className }: ProductBadgeProps) {
  const configs: Record<
    ProductBadgeType,
    { text: string; bg: string; color: string }
  > = {
    new: {
      text: "New Season",
      bg: "bg-[#1C1C1C]",
      color: "text-white",
    },
    sale: {
      text: "Sale",
      bg: "bg-[#8B3A4A]",
      color: "text-white",
    },
    limited: {
      text: "Limited Edition",
      bg: "bg-[#FAF8F5]",
      color: "text-[#8B3A4A] border border-[#8B3A4A]/30",
    },
    trending: {
      text: "Trending",
      bg: "bg-[#FAF8F5]",
      color: "text-[#242424] border border-[#E5E1DC]",
    },
    exclusive: {
      text: "Exclusive",
      bg: "bg-[#1C1C1C]",
      color: "text-white",
    },
    "out-of-stock": {
      text: "Sold Out",
      bg: "bg-[#737373]",
      color: "text-white",
    },
  };

  const config = configs[type] || configs.new;
  const displayText = label || config.text;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase rounded shadow-xs select-none",
        config.bg,
        config.color,
        className
      )}
    >
      {displayText}
    </span>
  );
}
