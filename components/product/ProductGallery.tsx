"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { ProductBadge } from "./ProductBadge";
import { ProductBadgeType } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ProductGalleryProps {
  images: string[];
  title: string;
  badge?: ProductBadgeType;
  className?: string;
}

export function ProductGallery({
  images,
  title,
  badge,
  className,
}: ProductGalleryProps) {
  // Fallback if images array is empty
  const displayImages = images.length > 0
    ? images
    : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000&auto=format&fit=crop"];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const activeImage = displayImages[currentIndex] || displayImages[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main Image Container */}
      <div
        className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#F1ECE6] border border-[#E5E1DC] shadow-xs group select-none cursor-crosshair"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Main Image */}
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={activeImage}
            alt={`${title} - view ${currentIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={cn(
              "object-cover object-center transition-transform duration-200 ease-out",
              isZoomed && "scale-150 origin-[var(--x)_var(--y)]"
            )}
            style={
              isZoomed
                ? ({
                    "--x": `${mousePosition.x}%`,
                    "--y": `${mousePosition.y}%`,
                  } as React.CSSProperties)
                : undefined
            }
          />
        </div>

        {/* Product Badge */}
        {badge && (
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            <ProductBadge type={badge} />
          </div>
        )}

        {/* Image index counter indicator */}
        <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
          <span className="bg-white/85 backdrop-blur-md border border-[#E5E1DC] text-[#242424] text-[11px] font-mono px-2.5 py-1 rounded-full shadow-xs">
            {currentIndex + 1} / {displayImages.length}
          </span>
        </div>

        {/* Prev / Next Navigation Arrows (when multiple images) */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-[#E5E1DC] text-[#242424] hover:text-[#8B3A4A] hover:bg-white flex items-center justify-center shadow-xs transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-[#E5E1DC] text-[#242424] hover:text-[#8B3A4A] hover:bg-white flex items-center justify-center shadow-xs transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Hover zoom tip indicator */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="inline-flex items-center gap-1 bg-white/85 backdrop-blur-md border border-[#E5E1DC] text-[#737373] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">
            <Maximize2 className="w-2.5 h-2.5 text-[#8B3A4A]" /> Hover to zoom
          </span>
        </div>
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {displayImages.map((img, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View image ${idx + 1}`}
                className={cn(
                  "relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#F1ECE6] border-2 transition-all duration-150 shrink-0 cursor-pointer",
                  isSelected
                    ? "border-[#1C1C1C] ring-2 ring-[#1C1C1C]/10 shadow-xs"
                    : "border-[#E5E1DC] opacity-75 hover:opacity-100 hover:border-[#737373]"
                )}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
