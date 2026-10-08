import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingStarsProps {
  rating: number; // 0 to 5
  reviewCount?: number;
  showNumber?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({
  rating,
  reviewCount,
  showNumber = true,
  size = "sm",
  className,
}: RatingStarsProps) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center text-[#8B3A4A]">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = rating >= starIndex;
          const isHalf = !isFilled && rating >= starIndex - 0.5;

          return (
            <div key={starIndex} className="relative inline-block">
              <Star
                className={cn(
                  iconSize,
                  isFilled
                    ? "fill-[#8B3A4A] text-[#8B3A4A]"
                    : "text-[#E5E1DC] fill-transparent"
                )}
              />
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star className={cn(iconSize, "fill-[#8B3A4A] text-[#8B3A4A]")} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showNumber && (
        <span className="text-xs font-medium text-[#242424] ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}

      {reviewCount !== undefined && (
        <span className="text-xs text-[#737373]">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
